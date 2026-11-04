function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(raw: string) {
  try {
    const url = new URL(raw.trim());
    if (url.protocol === "https:" || url.protocol === "http:") return raw.trim();
  } catch {
    return "";
  }
  return "";
}

function inline(value: string) {
  return escapeHtml(value)
    .replace(/!\[video\]\((https?:[^)]+)\)/g, (_, href: string) => {
      const src = safeUrl(href);
      return src
        ? `</p><video class="blog-video" controls preload="metadata" src="${src}"></video><p>`
        : "";
    })
    .replace(/!\[([^\]]*)\]\((.*)\)/g, (_, alt: string, href: string) => {
      const src = safeUrl(href);
      return src ? `<img src="${src}" alt="${escapeHtml(alt)}" />` : "";
    })
    .replace(/\[([^\]]+)\]\((.*)\)/g, (_, label: string, href: string) => {
      const src = safeUrl(href);
      return src ? `<a href="${src}" rel="noopener noreferrer">${label}</a>` : label;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let list: "ul" | "ol" | null = null;

  function closeList() {
    if (list) {
      html.push(`</${list}>`);
      list = null;
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    if (/^[-*] /.test(line)) {
      if (list !== "ul") {
        closeList();
        html.push("<ul>");
        list = "ul";
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      if (list !== "ol") {
        closeList();
        html.push("<ol>");
        list = "ol";
      }
      html.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }
    closeList();
    if (line.startsWith("### ")) {
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      html.push(`<h2>${inline(line.slice(2))}</h2>`);
      continue;
    }
    html.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return html.join("\n");
}

export function excerptFrom(subtitle: string, body: string) {
  const fromSubtitle = subtitle.trim();
  if (fromSubtitle) return fromSubtitle;
  return body.replace(/[#*_`\[\]()]/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
}
