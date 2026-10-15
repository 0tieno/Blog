const blocks = document.querySelectorAll(".post-content pre > code.language-mermaid");

function showError(block, error) {
  console.error("Unable to render Mermaid diagram:", error);
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = "This diagram could not be rendered. Its source is shown below.";
  block.parentElement.before(message);
}

if (blocks.length > 0) {
  try {
    const { default: mermaid } = await import(
      "https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs"
    );
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      suppressErrorRendering: true,
    });

    for (const [index, block] of blocks.entries()) {
      try {
        const { svg, bindFunctions } = await mermaid.render(
          `mermaid-diagram-${index}`,
          block.textContent
        );
        const diagram = document.createElement("div");
        diagram.className = "mermaid";
        diagram.style.overflowX = "auto";
        diagram.innerHTML = svg;
        block.parentElement.replaceWith(diagram);
        bindFunctions?.(diagram);
      } catch (error) {
        showError(block, error);
      }
    }
  } catch (error) {
    for (const block of blocks) {
      showError(block, error);
    }
  }
}
