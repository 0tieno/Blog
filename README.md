# Blog

> backend software engineering & security - java, system design and little philosophy

https://0tieno.github.io/Blog

## Diagrams and section links

Posts can use fenced code blocks with the `mermaid` language. The post layout
loads the pinned Mermaid renderer from jsDelivr only when a diagram is present;
no custom Jekyll plugin is required for GitHub Pages. If rendering fails, the
source remains visible with an error message.

Wrap diagrams containing Liquid delimiters (such as Mermaid's hexagonal
`node{{"label"}}` syntax) in `{% raw %}` and `{% endraw %}` tags, outside the
code fence, so Jekyll preserves the diagram source.

For contents lists and in-text section references, give the target heading an
explicit Kramdown ID immediately below it:

```markdown
## 02 Architecture
{: #architecture }

[Architecture](#architecture)
```

Use the same ID in every link to that section. This keeps links stable when
heading titles or numbering change.
