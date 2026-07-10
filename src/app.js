import { SCREENS, COMPANY, QUOTE_RULES } from "./config.js";
import { createStateMachine } from "./state-machine.js";
import { validateScreen } from "./validation.js";
import { calculateEstimate } from "./quote-engine.js";
import { clear, h } from "./dom.js";
import {
  Actions,
  ErrorSummary,
  EstimatePanel,
  FieldRenderer,
  ReviewPanel,
  ScreenIntro,
  Shell,
  SummaryPanel,
  WelcomePanel,
} from "./components.js";

const DEFAULTS = {
  screens: SCREENS,
  company: COMPANY,
  quoteRules: QUOTE_RULES,
  assetBaseUrl: new URL("../", import.meta.url).toString(),
};

export class QuoteAssistant {
  constructor(mount, options = {}) {
    this.mount = mount;
    this.options = { ...DEFAULTS, ...options };
    this.machine = createStateMachine({
      screens: this.options.screens,
      initialData: {
        addOns: [],
        preferredContact: "phone",
        ...options.initialData,
      },
    });
    this.errors = {};
    this.unsubscribe = this.machine.subscribe((state) => this.render(state));
  }

  destroy() {
    this.unsubscribe?.();
    clear(this.mount);
    this.mount.removeAttribute("data-tvqa-ready");
  }

  render(state) {
    const screen = this.options.screens[state.index];
    const previousFocus = this.captureFocus();
    const screenChanged = this.lastScreenId !== screen.id;
    const estimate = calculateEstimate(state.data, this.options.quoteRules);
    const PROGRESS_STEPS = {
  service: 1,
  "mowing-details": 2,
  "one-time-details": 2,
  "project-details": 2,
  "other-details": 2,
  address: 3,
  photos: 4,
  contact: 5,
  summary: 6,
};
    const progressTotal = 6;
const progressIndex = (PROGRESS_STEPS[screen.id] ?? 1) - 1;
    const hideProgress = screen.id === "welcome" || screen.id === "success";

    clear(this.mount);
    this.mount.dataset.tvqaReady = "true";
    this.mount.append(
      Shell({
        company: this.options.company,
        progress: {
          current: progressIndex,
          total: progressTotal,
          label: hideProgress ? "Quote assistant" : screen.eyebrow,
          hidden: hideProgress,
        },
        children: [
          this.renderScreen(screen, state, estimate),
          Actions({
            canGoBack: state.index > 0 && screen.id !== "success",
            nextLabel: screen.nextLabel,
            isSuccess: screen.id === "success",
            onBack: () => this.goBack(),
            onNext: () => this.goNext(screen, state, estimate),
          }),
        ],
      })
    );

    if (screenChanged) {
      this.focusTitle();
    } else {
      this.restoreFocus(previousFocus);
    }
    this.lastScreenId = screen.id;
  }

  renderScreen(screen, state, estimate) {
    if (screen.type === "welcome") {
      return WelcomePanel({
        screen,
        company: this.options.company,
        imageUrl: `${this.options.assetBaseUrl}assets/terra-verde-lawn.webp`,
      });
    }
if (screen.type === "summary") {
  const previewSubmission = createSubmissionPayload(
    state.data,
    estimate,
    this.options
  );

  return h(
    "div",
    { class: "tvqa-screen" },
    ScreenIntro({ screen }),
    EstimatePanel({ estimate }),
    ReviewPanel({
      submission: previewSubmission,
    })
  );
}

    if (screen.type === "success") {
      return h(
        "div",
        { class: "tvqa-screen" },
        ScreenIntro({ screen }),
        SummaryPanel({ submission: state.submission, estimate })
      );
    }

    return h(
      "form",
      {
        class: "tvqa-screen",
        novalidate: true,
        onSubmit: (event) => {
          event.preventDefault();
          this.goNext(screen, state, estimate);
        },
      },
      ScreenIntro({ screen }),
      ErrorSummary({ errors: this.errors }),
      h(
        "div",
        { class: "tvqa-fields" },
        (screen.fields || []).map((field) =>
          FieldRenderer({
            field,
            value: state.data[field.name],
            data: state.data,
            error: this.errors[field.name],
            onChange: (name, value) => this.updateField(name, value),
          })
        )
      )
    );
  }

  updateField(name, value) {
    if (this.errors[name]) {
      this.errors = { ...this.errors, [name]: undefined };
      delete this.errors[name];
    }
    this.machine.send({ type: "UPDATE_FIELD", name, value });
  }

  goBack() {
    this.errors = {};
    this.machine.send({ type: "BACK" });
  }

  goNext(screen, state, estimate) {
    if (screen.type === "form") {
      const result = validateScreen(screen, state.data);
      this.errors = result.errors;

      if (!result.valid) {
        this.render(state);
        this.focusFirstError();
        return;
      }
    }

    if (screen.id === "summary") {
      const payload = createSubmissionPayload(state.data, estimate, this.options);
      this.options.onSubmit?.(payload);
      this.mount.dispatchEvent(
        new CustomEvent("terra-verde:quote-submitted", {
          bubbles: true,
          detail: payload,
        })
      );
      this.errors = {};
      this.machine.send({ type: "SUBMIT", payload });
      return;
    }

    if (screen.id === "success") {
      this.errors = {};
      this.machine.send({ type: "RESET" });
      return;
    }

    this.errors = {};
    this.machine.send({ type: "NEXT" });
  }

  focusTitle() {
    window.requestAnimationFrame(() => {
      this.mount.querySelector(".tvqa-title")?.focus({ preventScroll: true });
    });
  }

  focusFirstError() {
    window.requestAnimationFrame(() => {
      const target = this.mount.querySelector(".has-error input, .has-error textarea, .has-error button");
      target?.focus();
    });
  }

  captureFocus() {
    const active = document.activeElement;
    if (!active || !this.mount.contains(active)) {
      return null;
    }

    return {
      id: active.id,
      selectionStart: typeof active.selectionStart === "number" ? active.selectionStart : null,
      selectionEnd: typeof active.selectionEnd === "number" ? active.selectionEnd : null,
    };
  }

  restoreFocus(previousFocus) {
    if (!previousFocus?.id) {
      return;
    }

    window.requestAnimationFrame(() => {
      const target = this.mount.querySelector(`#${previousFocus.id}`);
      if (!target) {
        return;
      }

      target.focus({ preventScroll: true });
      if (
        previousFocus.selectionStart !== null &&
        typeof target.setSelectionRange === "function"
      ) {
        target.setSelectionRange(previousFocus.selectionStart, previousFocus.selectionEnd);
      }
    });
  }
}

function createSubmissionPayload(data, estimate, options) {
  const reference = `TV-${Date.now().toString(36).toUpperCase()}`;
  const service = options.quoteRules.services[data.service]?.label || data.service;

  return {
    reference,
    createdAt: new Date().toISOString(),
    company: options.company.name,
    data: { ...data },
    labels: { service },
    estimate,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}
