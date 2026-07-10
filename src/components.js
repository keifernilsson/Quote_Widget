import { h, visuallyHidden } from "./dom.js";
import { formatCurrency } from "./quote-engine.js";

export function Shell({ company, progress, children }) {
  return h(
    "section",
    {
      class: "tvqa",
      "aria-label": `${company.name} quote assistant`,
    },
    h(
      "header",
      { class: "tvqa-topbar" },
      h("div", { class: "tvqa-mark", "aria-hidden": "true" }, "TV"),
      h(
        "div",
        { class: "tvqa-brand" },
        h("p", { class: "tvqa-brand-name" }, company.name),
        h("p", { class: "tvqa-brand-meta" }, "Fast lawn care estimates")
      )
    ),
    Progress(progress),
    h("div", { class: "tvqa-body" }, children)
  );
}

export function Progress({ current, total, label, hidden = false }) {
  const width = total > 1 ? `${Math.round(((current + 1) / total) * 100)}%` : "100%";
  return h(
    "div",
    { class: ["tvqa-progress-wrap", hidden && "tvqa-progress-wrap--hidden"] },
    h(
      "div",
      { class: "tvqa-progress-label" },
      h("span", {}, label),
      h("span", {}, `${Math.min(current + 1, total)} / ${total}`)
    ),
    h(
      "div",
      { class: "tvqa-progress", role: "progressbar", "aria-valuenow": current + 1, "aria-valuemin": 1, "aria-valuemax": total },
      h("span", { class: "tvqa-progress-fill", style: { width } })
    )
  );
}

export function ScreenIntro({ screen }) {
  return h(
    "div",
    { class: "tvqa-intro" },
    h("p", { class: "tvqa-eyebrow" }, screen.eyebrow),
    h("h2", { class: "tvqa-title", tabindex: "-1" }, screen.title),
    screen.description ? h("p", { class: "tvqa-description" }, screen.description) : null
  );
}

export function WelcomePanel({ screen, imageUrl, company }) {
  return h(
    "div",
    { class: "tvqa-welcome" },
    h("img", {
      class: "tvqa-welcome-image",
      src: imageUrl,
      alt: "Freshly cut lawn with a neat walkway",
      loading: "lazy",
    }),
    h(
      "div",
      { class: "tvqa-welcome-copy" },
      ScreenIntro({ screen }),
      h(
        "dl",
        { class: "tvqa-proof" },
        proofItem("Typical time", "2 minutes"),
        proofItem("Service area", company.serviceArea)
      )
    )
  );
}

export function FieldRenderer({ field, value, error, data, onChange }) {
  const shared = { field, value, error, onChange, data };

  switch (field.type) {
    case "choice":
      return ChoiceGroup(shared);
    case "checkboxGroup":
      return CheckboxGroup(shared);
    case "checkbox":
      return Checkbox(shared);
    case "textarea":
      return Textarea(shared);
    case "file":
      return FileInput(shared);
    default:
      return TextInput(shared);
  }
}

export function ChoiceGroup({ field, value, error, onChange }) {
  return h(
    "fieldset",
    { class: fieldClass(field, error), "aria-describedby": errorId(field) },
    h("legend", { class: "tvqa-field-label" }, field.label),
    h(
      "div",
      { class: ["tvqa-choice-grid", field.variant && `tvqa-choice-grid--${field.variant}`] },
      field.options.map((option) =>
        h(
          "button",
          {
            type: "button",
            class: ["tvqa-choice", value === option.value && "is-selected"],
            dataset: { tvqaField: field.name, tvqaValue: option.value },
            "aria-pressed": String(value === option.value),
            onClick: () => onChange(field.name, option.value),
          },
          h("span", { class: "tvqa-choice-label" }, option.label),
          option.description ? h("span", { class: "tvqa-choice-description" }, option.description) : null
        )
      )
    ),
    FieldError({ field, error })
  );
}

export function CheckboxGroup({ field, value = [], error, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  return h(
    "fieldset",
    { class: fieldClass(field, error), "aria-describedby": errorId(field) },
    h("legend", { class: "tvqa-field-label" }, field.label),
    h(
      "div",
      { class: "tvqa-check-list" },
      field.options.map((option) => {
        const checked = selected.includes(option.value);
        return h(
          "label",
          {
            class: ["tvqa-check", checked && "is-selected"],
            dataset: { tvqaField: field.name, tvqaValue: option.value },
          },
          h("input", {
            type: "checkbox",
            checked,
            onChange: () => {
              const next = checked
                ? selected.filter((item) => item !== option.value)
                : [...selected, option.value];
              onChange(field.name, next);
            },
          }),
          h("span", { class: "tvqa-check-box", "aria-hidden": "true" }),
h(
  "span",
  {},
  h("span", { class: "tvqa-check-label" }, option.label),
  option.description
    ? h("span", { class: "tvqa-choice-description" }, option.description)
    : null
)
        );
      })
    ),
    FieldError({ field, error })
  );
}

export function Checkbox({ field, value, error, onChange }) {
  return h(
    "div",
    { class: fieldClass(field, error), "aria-describedby": errorId(field) },
    h(
      "label",
      {
        class: ["tvqa-check", value && "is-selected"],
        dataset: { tvqaField: field.name },
      },
      h("input", {
        type: "checkbox",
        dataset: { tvqaField: field.name },
        checked: value === true,
        onChange: (event) => onChange(field.name, event.target.checked),
      }),
      h("span", { class: "tvqa-check-box", "aria-hidden": "true" }),
      h("span", { class: "tvqa-check-label" }, field.label)
    ),
    FieldError({ field, error })
  );
}

export function TextInput({ field, value = "", error, onChange }) {
  const id = fieldId(field);
  return h(
    "div",
    { class: fieldClass(field, error) },
    h("label", { class: "tvqa-field-label", for: id }, field.label),
    h("input", {
      id,
      class: "tvqa-input",
      dataset: { tvqaField: field.name },
      type: field.type || "text",
      value,
      placeholder: field.placeholder || "",
      autocomplete: field.autocomplete || "off",
      "aria-invalid": error ? "true" : "false",
      "aria-describedby": errorId(field),
      onInput: (event) => onChange(field.name, event.target.value),
    }),
    FieldError({ field, error })
  );
}

export function Textarea({ field, value = "", error, onChange }) {
  const id = fieldId(field);
  return h(
    "div",
    { class: fieldClass(field, error) },
    h("label", { class: "tvqa-field-label", for: id }, field.label),
    h("textarea", {
      id,
      class: "tvqa-input tvqa-textarea",
      dataset: { tvqaField: field.name },
      value,
      placeholder: field.placeholder || "",
      rows: 4,
      "aria-invalid": error ? "true" : "false",
      "aria-describedby": errorId(field),
      onInput: (event) => onChange(field.name, event.target.value),
    }),
    FieldError({ field, error })
  );
}

export function FileInput({ field, value = [], error, onChange }) {
  const id = fieldId(field);
  const files = Array.isArray(value) ? value : [];

  return h(
    "div",
    { class: fieldClass(field, error) },
    h("label", { class: "tvqa-field-label", for: id }, field.label),
    h(
      "label",
      { class: "tvqa-upload", for: id },
      h("span", { class: "tvqa-upload-title" }, "Choose photos"),
      h("span", { class: "tvqa-upload-note" }, "JPG, PNG, or HEIC from your phone")
    ),
    h("input", {
      id,
      class: "tvqa-file-input",
      dataset: { tvqaField: field.name },
      type: "file",
      accept: field.accept || "",
      multiple: field.multiple === true,
      onChange: (event) => {
        const next = Array.from(event.target.files || []).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }));
        onChange(field.name, next);
      },
    }),
    files.length
      ? h(
          "ul",
          { class: "tvqa-file-list" },
          files.map((file) => h("li", {}, file.name))
        )
      : h("p", { class: "tvqa-help" }, "You can skip this step if photos are not handy."),
    FieldError({ field, error })
  );
}

export function EstimatePanel({ estimate }) {
  if (estimate.customQuoteRequired) {
    return h(
      "section",
      { class: "tvqa-estimate", "aria-live": "polite" },
      h("p", { class: "tvqa-estimate-label" }, "Estimate"),
      h("p", { class: "tvqa-estimate-value" }, "Custom quote required"),
      h("p", { class: "tvqa-disclaimer" }, estimate.disclaimer)
    );
  }

  const hasRestoration = estimate.restorationTotal > 0;

  const firstVisitItems = [
    ...estimate.weeklyLineItems,
    ...estimate.restorationLineItems,
  ];

  return h(
    "section",
    { class: "tvqa-estimate", "aria-live": "polite" },

    ...(hasRestoration
      ? [
          h("p", { class: "tvqa-estimate-label" }, "First Service Total"),
          h(
            "p",
            { class: "tvqa-estimate-value" },
            formatCurrency(estimate.firstServiceTotal)
          ),

          h(
            "p",
            { class: "tvqa-estimate-label" },
            "Your first visit includes:"
          ),

          h(
            "div",
            { class: "tvqa-line-items" },
            firstVisitItems.map((item) =>
              h(
                "div",
                { class: "tvqa-line-item" },
                h("span", {}, item.label),
                h(
                  "strong",
                  {},
                  item.label === "Initial Lawn Restoration"
                    ? `${formatCurrency(item.amount)} one-time`
                    : formatCurrency(item.amount)
                )
              )
            )
          ),

          h(
            "p",
            { class: "tvqa-estimate-label" },
            "Ongoing Weekly Service"
          ),
          h(
            "p",
            { class: "tvqa-estimate-value" },
            `${formatCurrency(estimate.weeklyTotal)}/week`
          ),
        ]
      : [
          h(
            "p",
            { class: "tvqa-estimate-label" },
            "Estimated Weekly Service"
          ),
          h(
            "p",
            { class: "tvqa-estimate-value" },
            `${formatCurrency(estimate.weeklyTotal)}/week`
          ),

          h("p", { class: "tvqa-estimate-label" }, "Includes:"),

          h(
            "div",
            { class: "tvqa-line-items" },
            estimate.weeklyLineItems.map((item) =>
              h(
                "div",
                { class: "tvqa-line-item" },
                h("span", {}, item.label),
                h("strong", {}, formatCurrency(item.amount))
              )
            )
          ),
        ]),

    h("p", { class: "tvqa-disclaimer" }, estimate.disclaimer)
  );
}
export function ReviewPanel({ submission }) {
  const data = submission.data;

  const address = [data.street, data.city, data.postalCode]
    .filter(Boolean)
    .join(", ");

  const name = [data.firstName, data.lastName]
    .filter(Boolean)
    .join(" ");

  return h(
    "section",
    { class: "tvqa-review-panel" },
    h(
      "dl",
      { class: "tvqa-summary" },
summaryRow("Service", submission.labels.service),

data.oneTimeServices?.length
  ? summaryRow(
      "Requested services",
      data.oneTimeServices
        .map((value) => formatReviewValue(value))
        .join(", ")
    )
  : null,

data.propertySize
  ? summaryRow("Property size", formatReviewValue(data.propertySize))
  : null,
      summaryRow("Property", address),
      summaryRow("Name", name),
      summaryRow("Email", data.email),
      summaryRow("Phone", data.phone),
      summaryRow(
        "Preferred contact",
        formatReviewValue(data.preferredContact)
      )
    )
  );
}
export function SummaryPanel({ submission, estimate }) {
  const reference = submission?.reference || "TV-PENDING";
  return h(
    "div",
    { class: "tvqa-success-panel" },
    h("p", { class: "tvqa-success-code" }, reference),
    h(
      "dl",
      { class: "tvqa-summary" },
      summaryRow("Estimate", estimate.summary),
      summaryRow("Name", `${submission.data.firstName} ${submission.data.lastName}`),
      summaryRow("Service", submission.labels.service),
      summaryRow("Property", `${submission.data.street}, ${submission.data.city}`)
    )
  );
}

export function Actions({ canGoBack, nextLabel, onBack, onNext, isSuccess }) {
  return h(
    "div",
    { class: "tvqa-actions" },
    canGoBack
      ? h(
          "button",
          { type: "button", class: "tvqa-button tvqa-button--secondary", onClick: onBack },
          "Back"
        )
      : h("span", { class: "tvqa-action-spacer", "aria-hidden": "true" }),
    h(
      "button",
      {
        type: "button",
        class: ["tvqa-button", isSuccess && "tvqa-button--secondary"],
        onClick: onNext,
      },
      nextLabel
    )
  );
}

export function ErrorSummary({ errors }) {
  const messages = Object.values(errors);
  if (!messages.length) {
    return null;
  }

  return h(
    "div",
    { class: "tvqa-error-summary", role: "alert" },
    h("strong", {}, "Please fix this before continuing."),
    h("ul", {}, messages.map((message) => h("li", {}, message)))
  );
}

function FieldError({ field, error }) {
  if (!error) {
    return null;
  }

  return h("p", { id: errorId(field), class: "tvqa-field-error" }, error);
}

function proofItem(label, value) {
  return h(
    "div",
    { class: "tvqa-proof-item" },
    h("dt", {}, label),
    h("dd", {}, value)
  );
}
function formatReviewValue(value) {
  if (!value) {
    return "Not provided";
  }

  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function summaryRow(label, value) {
  return h(
    "div",
    { class: "tvqa-summary-row" },
    h("dt", {}, label),
    h("dd", {}, value)
  );
}

function fieldClass(field, error) {
  return ["tvqa-field", `tvqa-field--${field.type}`, error && "has-error"];
}

function fieldId(field) {
  return `tvqa-${field.name}`;
}

function errorId(field) {
  return `tvqa-${field.name}-error`;
}
