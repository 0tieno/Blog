---
type: post
title: Installing Apache Maven on Windows
date: 2026-03-07 09:00:00 +0300
categories:
      - Java - Tools
---

When working with Java backend projects, one tool you will encounter very quickly is Apache Maven. Maven is a build automation and dependency management tool that helps developers compile code, manage libraries, run tests, and package applications.

If you try running a Maven command like:

```
mvn clean install
```

and get this error:

`bash: mvn: command not found`

it means Maven is either not installed or not added to your system PATH.

This short guide walks you through installing it on Windows.

1. Ensure Java is Installed

Maven runs on Java, so you must have the Java Development Kit (JDK) installed first.

Check by running:

```
java -version
javac -version
```

If Java is installed, you will see the version displayed. If not, install OpenJDK or another JDK distribution before continuing.

2. Download Apache Maven

Visit the official Maven website:

[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

Download the Binary zip archive (something like apache-maven-3.x.x-bin.zip).

3. Extract Maven

Extract the downloaded file to a directory such as:

C:\tools\apache-maven-3.9.x

You can place it anywhere, but keeping developer tools in a folder like C:\tools helps keep things organized.

4. Configure Environment Variables

To use Maven from the terminal, you need to add it to your system environment variables.

Step 1: Create `MAVEN_HOME`

Open Environment Variables

Under System Variables, click New

Add:

```
Variable Name: MAVEN_HOME
Variable Value: C:\tools\apache-maven-3.9.x
```

Step 2: Update PATH

Edit the Path variable and add:

`C:\tools\apache-maven-3.9.x\bin`

This allows the system to recognize the mvn command.

5. Verify Installation

Close your terminal and open a new one, then run:

`mvn -version`

You should see something similar to:

```
Apache Maven 3.9.x
Java version: 17
```

This confirms Maven is installed correctly.

6. Run Your First Maven Build

Navigate to your Java project directory and run:

`mvn clean install`

This command will:

1. Clean previous builds
2. Download dependencies
3. Compile your code
4. Run tests
5. Package the application

If everything is set up correctly, you should see a BUILD SUCCESS message.


Installing Maven is one of the first steps when working with Java backend applications, microservices, or Spring-based systems. Once set up, it greatly simplifies dependency management and build automation, letting you focus on writing code instead of managing libraries manually.

Happy coding!