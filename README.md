# Terra Verde Lawn Company Quote Assistant

Mobile-first embeddable quote assistant built with vanilla HTML, CSS, and JavaScript ES modules.

## Files

- `index.html`: local demo page.
- `styles.css`: scoped widget and demo styles.
- `src/config.js`: screen flow, field definitions, validation rules, and pricing config.
- `src/state-machine.js`: deterministic assistant transitions.
- `src/validation.js`: reusable validation engine.
- `src/quote-engine.js`: estimate calculator.
- `src/components.js`: reusable UI components.
- `src/app.js`: app controller.
- `src/main.js`: public ES-module entrypoint and auto-mount.
- `embed-snippet.html`: Squarespace code block starter snippet.
- `assets/terra-verde-lawn.webp`: optimized welcome image.

## Screen Flow

Welcome -> Service -> Property -> Address -> Estimate -> Photos -> Contact -> Success

## Squarespace Embed

1. Upload this folder to the same asset host or CDN you use for custom site assets.
2. Replace `https://YOUR-ASSET-HOST/terra-verde-quote-assistant/` in `embed-snippet.html`.
3. Paste the snippet into a Squarespace Code Block.

The widget auto-mounts into every element with `data-terra-verde-quote-assistant`.

## Submission Hook

The assistant dispatches a bubbling browser event when the Contact screen is submitted:

```js
document.addEventListener("terra-verde:quote-submitted", function (event) {
  console.log(event.detail);
});
```

Use that event to send the payload to Squarespace forms, Zapier, Make, a CRM, or a custom endpoint.
