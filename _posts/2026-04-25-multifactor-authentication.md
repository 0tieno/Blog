---
type: post
title: "Multi-Factor Authentication: Passkeys, TOTP, Authenticator Apps, and Two-Step Verification"
date: 2026-04-25 10:00:00 +0300
categories:
  - backend
  - security
  - interviews
---

Passwords alone are not enough. They get phished, leaked in breaches, reused across sites, and brute-forced. Multi-factor authentication (MFA) adds layers beyond the password so that stealing one credential is not enough to compromise an account. This post covers every modern MFA method, how they work under the hood, and the tradeoffs that determine which ones you should implement.

## The Three Authentication Factors

Every authentication method falls into one of three categories:

**Something you know:** Passwords, PINs, security questions. The weakest factor because knowledge can be shared, guessed, or stolen.

**Something you have:** A phone, a hardware key, an authenticator app. Stronger because the attacker needs physical access to the device.

**Something you are:** Fingerprint, face scan, iris scan. Biometrics are convenient but raise privacy concerns and cannot be changed if compromised (you cannot get a new fingerprint).

Single-factor authentication uses one of these. Multi-factor authentication combines two or more. The most common combination is password (something you know) plus a code from your phone (something you have).

## SMS-Based OTP: The Weakest Second Factor

When you log in and receive a 6-digit code via text message, that is SMS OTP (One-Time Password).

**How it works:**

```
1. User enters email + password → Server validates credentials
2. Server generates a random 6-digit code
3. Server sends the code via SMS to the user's registered phone number
4. Server stores the code temporarily (Redis with 60 to 300 second TTL)
5. User enters the code → Server compares it to the stored value
6. Match → Access granted. Mismatch or expired → Access denied.
```

**Why it still exists:** It is the most accessible second factor. Everyone has a phone that can receive texts. No app installation required. No hardware to buy.

**Why it is the weakest second factor:**

**SIM swapping.** An attacker calls your carrier, impersonates you, and transfers your phone number to their SIM card. Now they receive your SMS codes. This has been used to drain cryptocurrency wallets and take over high-profile accounts. The FBI has issued warnings about SIM swap attacks specifically because they bypass SMS-based MFA.

**SS7 vulnerabilities.** The SS7 protocol (Signaling System 7) that routes SMS messages between carriers has known security flaws. Attackers with access to the telecom network can intercept SMS messages without touching your phone. This is not theoretical; it has been demonstrated by security researchers and exploited in the wild.

**Phishing.** An attacker creates a fake login page that looks identical to the real one. You enter your password and your SMS code. The attacker captures both and replays them against the real site in real time. SMS OTP does nothing to prevent this because the code is not bound to the legitimate site.

**Delivery failures.** SMS is not guaranteed delivery. Messages can be delayed minutes or fail entirely, especially internationally. Users get frustrated and either disable MFA or contact support, both of which create cost and friction.

**Bottom line:** SMS OTP is better than no second factor, but it should be treated as a fallback, not a primary MFA method. NIST (National Institute of Standards and Technology) has deprecated SMS as a standalone second factor in their Digital Identity Guidelines since 2016.

## TOTP: Time-Based One-Time Passwords (Authenticator Apps)

TOTP is what happens when you open Google Authenticator, Microsoft Authenticator, Authy, or 1Password and see a 6-digit code that changes every 30 seconds.

**How TOTP works under the hood:**

```
Setup (one-time):
1. Server generates a random secret key (base32 encoded, e.g., JBSWY3DPEHPK3PXP)
2. Server encodes the secret into a QR code (otpauth:// URI format)
3. User scans the QR code with their authenticator app
4. The app stores the secret locally on the device
5. Both server and app now share the same secret

Verification (every login):
1. App takes the shared secret + current Unix timestamp
2. Divides timestamp by 30 (the time step)
3. Feeds both into HMAC-SHA1 to produce a hash
4. Extracts a 6-digit code from the hash
5. Displays the code (valid for 30 seconds)

6. User enters the code on the login page
7. Server performs the same calculation with the same secret + current time
8. If the codes match → access granted
```

The algorithm is defined in RFC 6238. The key insight: both the server and the app independently generate the same code at the same time because they share the same secret and use the same clock. No network communication is needed to generate the code.

**The math (simplified):**

```
time_step = floor(unix_timestamp / 30)
hash = HMAC-SHA1(secret_key, time_step)
offset = last_nibble_of_hash
code = extract_4_bytes_from_hash_at_offset % 1000000
```

The server typically accepts codes from the current time step plus one step before and after (a 90-second window) to account for clock drift between the server and the user's device.

**Why TOTP is better than SMS:**

**No network dependency.** The code is generated locally on the device. No SMS to intercept, no carrier to compromise, no delivery delay.

**Phishing-resistant (partially).** The code is time-bound (30 seconds), so a phished code has a very short window of usefulness. However, a sophisticated real-time phishing proxy (tools like Evilginx) can still capture and replay TOTP codes within that window. TOTP is not fully phishing-proof.

**No SIM swap risk.** The secret lives on the device, not tied to a phone number.

**How to implement TOTP in your system:**

```
Database schema addition:
  users table:
    totp_secret: encrypted string (AES-256)
    totp_enabled: boolean
    totp_backup_codes: encrypted string array

Setup flow:
  1. Generate secret: random 20 bytes, base32 encode
  2. Build otpauth URI: otpauth://totp/YourApp:user@email.com?secret=BASE32SECRET&issuer=YourApp
  3. Encode URI as QR code, display to user
  4. User scans with authenticator app
  5. User enters the current code to verify setup works
  6. Store encrypted secret in database, set totp_enabled = true
  7. Generate 8 to 10 backup codes (random, one-time use), show to user ONCE

Login flow:
  1. User enters email + password → validate
  2. If totp_enabled → prompt for TOTP code
  3. User enters 6-digit code from app
  4. Server generates expected code from stored secret + current time
  5. Compare → match = access granted
  6. If code does not match, check backup codes (single use, delete after use)
```

**Backup codes are critical.** If a user loses their phone, they lose access to their authenticator app. Backup codes (8 to 10 random strings generated at setup time) are the recovery path. Store them hashed in the database. Each code can only be used once.

**Authenticator app landscape:**

| App | Key Feature |
| --- | --- |
| Google Authenticator | Simple, widely used, recently added cloud backup |
| Microsoft Authenticator | Push notifications for Microsoft accounts, passwordless support |
| Authy | Multi-device sync, encrypted cloud backups |
| 1Password / Bitwarden | Integrated with password manager, single app for everything |

**Tradeoff with cloud-synced authenticators:** Authy and Google Authenticator (with backup enabled) sync TOTP secrets to the cloud. This is convenient (you do not lose access if you lose your phone) but reduces security slightly (your secrets now exist on a server, not just your device). For most users, the convenience is worth it. For high-security scenarios, a device-only authenticator or hardware key is better.

## HOTP: The Counter-Based Predecessor

Before TOTP, there was HOTP (HMAC-Based One-Time Password, RFC 4226). Instead of using the current time, HOTP uses a counter that increments with each use.

```
HOTP: code = HMAC-SHA1(secret, counter) → extract 6 digits
TOTP: code = HMAC-SHA1(secret, floor(time / 30)) → extract 6 digits
```

HOTP codes do not expire (they are valid until used), which is a security weakness. If an attacker captures an unused HOTP code, they can use it later. TOTP solved this by making codes time-bound. HOTP is rarely used today except in some hardware tokens.

## Passkeys: The Password Replacement

Passkeys are the most significant change in authentication in decades. They are designed to replace passwords entirely, not supplement them. Built on the FIDO2/WebAuthn standard, passkeys use public-key cryptography to authenticate without any shared secret ever crossing the network.

**The fundamental shift:** With passwords, both you and the server know the secret (your password). If the server is breached, your password is exposed. With passkeys, the server only has your public key. Even if the server is completely compromised, the attacker gets nothing useful.

**How passkeys work:**

```
Registration (one-time):
1. User clicks "Create Passkey" on the website
2. Server sends a challenge (random bytes) to the browser
3. Browser calls the WebAuthn API
4. The device (phone, laptop, hardware key) generates a key pair:
   - Private key: stored securely on the device (in the TPM, Secure Enclave, or cloud keychain)
   - Public key: sent to the server
5. The device signs the challenge with the private key
6. Server stores the public key + credential ID associated with the user
7. The private key NEVER leaves the device

Authentication (every login):
1. User clicks "Sign in with Passkey"
2. Server sends a new challenge
3. Browser calls the WebAuthn API
4. Device prompts for biometric verification (fingerprint, face) or device PIN
5. Device signs the challenge with the private key
6. Browser sends the signed response to the server
7. Server verifies the signature using the stored public key
8. Signature valid → access granted
```

**Why passkeys are phishing-proof:**

This is the critical security property. During authentication, the browser binds the credential to the exact origin (domain) of the website. If you are on `bank.com`, the passkey for `bank.com` is used. If an attacker creates a phishing site at `bank-login.com`, the browser will not find a passkey for that domain and will not authenticate. There is no code to type, no secret to enter on a fake page.

```
Real site: https://bank.com → browser finds passkey for bank.com → signs challenge ✅
Fake site: https://bank-login.com → browser finds NO passkey for this domain → nothing to sign ❌
```

The user cannot be tricked into authenticating to the wrong site because the domain binding happens at the cryptographic level, not at the human judgment level.

**Passkey storage and sync:**

| Platform | Where Private Keys Live | Sync Mechanism |
| --- | --- | --- |
| Apple | iCloud Keychain (Secure Enclave on device) | Synced across Apple devices via iCloud |
| Google | Google Password Manager | Synced across Android/Chrome devices |
| Microsoft | Windows Hello | Synced via Microsoft account |
| Hardware keys (YubiKey) | On the physical key itself | No sync (the key IS the authenticator) |

**Synced passkeys vs device-bound passkeys:**

Synced passkeys (Apple, Google, Microsoft) are stored in cloud keychains and available across your devices. If you create a passkey on your iPhone, it is available on your MacBook and iPad too. This solves the "I lost my phone" recovery problem but means your passkey security depends on the security of your cloud account.

Device-bound passkeys (YubiKey, some enterprise deployments) exist only on one physical device. Higher security (no cloud exposure) but if you lose the device, you lose access. You need backup keys or alternative recovery methods.

**Cross-device authentication:**

What if you need to log in on a computer that does not have your passkey? The FIDO2 protocol supports cross-device authentication:

```
1. You visit bank.com on your work laptop (no passkey here)
2. You choose "Sign in with a passkey from another device"
3. The site shows a QR code
4. You scan the QR code with your phone (which has the passkey)
5. Your phone prompts for biometric verification
6. Your phone signs the challenge over Bluetooth (BLE)
7. The laptop receives the signed response and forwards it to the server
8. Access granted on the laptop
```

Bluetooth proximity ensures the phone is physically near the laptop, preventing remote relay attacks.

**Implementing passkeys in your system:**

```
Database schema:
  passkey_credentials table:
    id: primary key
    user_id: foreign key to users
    credential_id: bytes (unique identifier from the authenticator)
    public_key: bytes (COSE-encoded public key)
    sign_count: integer (replay attack protection)
    created_at: timestamp
    last_used_at: timestamp
    device_name: string ("John's iPhone", "YubiKey 5")

Server-side libraries:
  Python: py_webauthn
  Node.js: @simplewebauthn/server
  Go: go-webauthn
  Java: java-webauthn-server (by Yubico)
```

**The sign_count field:** Each time an authenticator signs a challenge, it increments an internal counter and includes it in the response. The server compares it to the stored sign_count. If the received count is lower than or equal to the stored count, the credential may have been cloned. This provides a basic defense against credential duplication on hardware keys. Synced passkeys (cloud-based) do not reliably increment counters, so sign_count is most useful for hardware authenticators.

**Interview insight:** If asked "how would you implement passwordless authentication?" describe the WebAuthn/passkey flow. Mention that the private key never leaves the device, the domain binding prevents phishing, and the biometric check (fingerprint/face) provides the second factor locally. Passkeys combine "something you have" (the device) and "something you are" (biometrics) in a single gesture, which is why they can replace both passwords and traditional MFA.

## Push-Based Authentication

Some authenticator apps offer push notifications instead of (or alongside) TOTP codes.

**How push authentication works:**

```
1. User enters email + password on the website
2. Server validates credentials
3. Server sends a push notification to the user's registered device
4. User's phone shows: "Approve login to YourApp from Chrome on Windows?"
5. User taps "Approve" (optionally after biometric verification)
6. App sends the approval back to the server (signed response)
7. Server grants access
```

**Where you see this:** Microsoft Authenticator for Microsoft accounts, Duo Security for enterprise apps, Google prompts for Google accounts.

**Advantages over TOTP:** No code to type. Faster. The push notification shows context (which service, which device, which location), making it easier to spot unauthorized login attempts.

**Vulnerability: MFA fatigue attacks.** An attacker who has the password can trigger repeated push notifications, hoping the user taps "Approve" out of frustration or confusion. This was used in the 2022 Uber breach where an attacker bombarded an employee with push requests until they approved one. Mitigations include number matching (the login page shows a number that the user must enter in the push notification) and rate limiting push requests.

## Email-Based OTP and Magic Links

**Email OTP:** Server sends a 6-digit code to the user's email. The user enters it on the login page. Same concept as SMS OTP but over email.

**Magic links:** Server sends an email containing a unique, time-limited URL. Clicking the link authenticates the user.

```
Email: "Click here to sign in to YourApp"
Link: https://yourapp.com/auth/verify?token=a1b2c3d4e5f6&expires=1713450300
```

**Implementation:**

```
1. User enters email on the login page
2. Server generates a random token, stores it in Redis with 10-minute TTL
3. Server sends email with link containing the token
4. User clicks the link
5. Server validates the token (exists in Redis, not expired)
6. Token valid → create session, delete token from Redis
7. Token invalid or expired → show error
```

**Where you see this:** Slack uses magic links as a primary authentication method. Medium, Notion, and many developer tools offer it as an option.

**Tradeoffs:** Convenient (no password to remember), but security depends entirely on the user's email account security. If someone has access to your email, they can log in as you. Also introduces latency: waiting for an email is slower than typing a password.

## Comparing All MFA Methods

| Method | Phishing Resistant | SIM Swap Proof | Offline Capable | User Friction | Recovery Difficulty |
| --- | --- | --- | --- | --- | --- |
| SMS OTP | No | No | No | Low | Easy (new SIM) |
| Email OTP | No | Yes | No | Low | Easy (email access) |
| TOTP (Authenticator App) | Partial | Yes | Yes | Medium | Hard (need backup codes) |
| Push Notification | Partial | Yes | No | Low | Medium |
| Passkeys | Yes | Yes | Yes | Very Low | Medium (cloud sync helps) |
| Hardware Key (YubiKey) | Yes | Yes | Yes | Low (tap the key) | Hard (need backup key) |

## Designing MFA for Your System

**For consumer apps (social media, e-commerce):**
Offer TOTP as the primary second factor with SMS as a fallback. Begin supporting passkeys as a passwordless option. Most users will not buy a hardware key, so cloud-synced passkeys are the pragmatic choice.

**For enterprise apps (internal tools, admin panels):**
Require TOTP or hardware keys. Consider push-based auth (Duo, Microsoft Authenticator) for convenience. Disable SMS OTP entirely. For admin accounts, mandate hardware keys.

**For financial or healthcare systems:**
Require phishing-resistant methods: passkeys or hardware keys. TOTP as a minimum. SMS is not acceptable for high-value accounts. Implement session re-authentication for sensitive operations (transferring money, changing account settings).

**For developer platforms (API access):**
Use API keys for programmatic access (with scoping and rotation). Require MFA for dashboard access. Support hardware keys for developer accounts.

## The Future: Passwords Are Disappearing

The industry is moving toward passwordless authentication. The trajectory is clear:

**2010s:** Passwords + SMS OTP was the standard for "secure" accounts.

**2020s:** TOTP via authenticator apps became mainstream. Passkeys launched across Apple, Google, and Microsoft platforms. Major services (Google, GitHub, Amazon) began encouraging passkeys.

**What is next:** Passkeys become the default sign-in method. Passwords become a legacy fallback, then eventually disappear for most consumer services. Hardware keys remain the gold standard for high-security environments.

The technical foundation (FIDO2/WebAuthn) is already in every major browser and operating system. The challenge now is adoption and user education. As a system designer, building passkey support today means your authentication is future-proof.

## Related Post

- [Authentication and Authorization: Knowing Who They Are and What They Can Do](/Blog/authentication-and-auhorization/) — How MFA fits into the broader authentication and authorization picture, including API keys, sessions, and JWTs.

Happy hacking!