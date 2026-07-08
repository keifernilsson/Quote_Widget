import { QuoteAssistant } from "./app.js";

const instances = new WeakMap();

export function createTerraVerdeQuoteAssistant(options = {}) {
  const mounts = resolveMounts(options.mount);
  return mounts.map((mount) => mountAssistant(mount, options));
}

function mountAssistant(mount, options = {}) {
  if (instances.has(mount)) {
    instances.get(mount).destroy();
  }

  const instance = new QuoteAssistant(mount, options);
  instances.set(mount, instance);
  return instance;
}

function resolveMounts(mount) {
  if (typeof mount === "string") {
    return Array.from(document.querySelectorAll(mount));
  }

  if (mount instanceof Element) {
    return [mount];
  }

  return Array.from(document.querySelectorAll("[data-terra-verde-quote-assistant]"));
}

function autoMount() {
  createTerraVerdeQuoteAssistant();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoMount, { once: true });
} else {
  autoMount();
}
