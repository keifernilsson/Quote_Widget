export function h(tagName, attrs = {}, ...children) {
  const node = document.createElement(tagName);

  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === undefined || value === null || value === false) {
      continue;
    }

    if (key === "class") {
      node.className = Array.isArray(value) ? value.filter(Boolean).join(" ") : value;
      continue;
    }

    if (key === "dataset") {
      Object.assign(node.dataset, value);
      continue;
    }

    if (key === "style") {
      Object.assign(node.style, value);
      continue;
    }

    if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
      continue;
    }

    if (key === "for") {
      node.setAttribute("for", value);
      continue;
    }

    if (key in node && key !== "list") {
      node[key] = value;
      continue;
    }

    node.setAttribute(key, value === true ? "" : String(value));
  }

  appendChildren(node, children);
  return node;
}

export function clear(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function visuallyHidden(text) {
  return h("span", { class: "tvqa-sr-only" }, text);
}

function appendChildren(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === undefined || child === null || child === false) {
      continue;
    }

    if (child instanceof Node) {
      parent.appendChild(child);
      continue;
    }

    parent.appendChild(document.createTextNode(String(child)));
  }
}
