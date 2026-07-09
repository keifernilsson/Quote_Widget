export const COMPANY = {
  name: "Terra Verde Lawn Company",
  phone: "(403) 635-7460",
  email: "terraverdelethbridge@gmail.com",
  serviceArea: "Lethbridge",
};

export const SERVICE_OPTIONS = [
  {
  value: "mowing",
  label: "Weekly Lawn Maintenance",
  description: "Weekly mowing, edging and blowing throughout the growing season.",
},
{
  value: "one-time",
  label: "One-Time Services",
  description: "Property cleanups and lawn services.",
},
{
  value: "projects",
  label: "Landscape Projects",
  description: "Installations and property improvements.",
},
{
  value: "other",
  label: "Other",
  description: "Tell us what you need help with.",
},
];

export const QUOTE_RULES = {
  services: {
    mowing: { label: "Mowing and edging", low: 44, high: 68, unit: "per visit" },
    "spring-cleanup": { label: "Spring cleanup", low: 165, high: 260, unit: "project range" },
    "garden-care": { label: "Garden bed care", low: 135, high: 230, unit: "project range" },
    "seasonal-plan": { label: "Seasonal lawn plan", low: 185, high: 315, unit: "per month" },
    "fertilization": { label: "Fertilization", low: 120, high: 200, unit: "per application" },
  },
  propertySizes: {
    small: { label: "Townhome or small yard", low: 0, high: 0 },
    medium: { label: "Standard suburban yard", low: 18, high: 34 },
    large: { label: "Large yard", low: 42, high: 78 },
    estate: { label: "Estate or oversized lot", low: 85, high: 150 },
  },
  conditions: {
    maintained: { label: "Already maintained", low: 0, high: 0 },
    overgrown: { label: "A little overgrown", low: 18, high: 44 },
    rescue: { label: "Needs a reset", low: 55, high: 115 },
  },
  frequencies: {
    "one-time": { label: "One-time", multiplier: 1 },
    weekly: { label: "Weekly", multiplier: 0.9 },
    biweekly: { label: "Every 2 weeks", multiplier: 0.96 },
    monthly: { label: "Monthly", multiplier: 1.06 },
  },
  addOns: {
    deepEdging: { label: "Deep edging", low: 12, high: 28 },
    weedControl: { label: "Weed control", low: 24, high: 48 },
    aeration: { label: "Aeration", low: 65, high: 120 },
    leafHaul: { label: "Leaf or debris haul-away", low: 45, high: 110 },
  },
  rangeBuffer: 0.08,
};

export const SCREENS = [
  {
    id: "welcome",
    type: "welcome",
    title: "Get a fast lawn care quote",
    eyebrow: "Terra Verde Lawn Company",
    description:
      "Answer a few quick questions and we will prepare a practical starting estimate for your property.",
    nextLabel: "Start quote",
  },
  {
    id: "service",
    type: "form",
    title: "What service do you need?",
    eyebrow: "Step 1 of 6",
    description: "Pick the option that best matches the work you want done.",
    nextLabel: "Continue",
    nextByService: {
  mowing: "mowing-details",
  "one-time": "one-time-details",
  projects: "project-details",
  other: "other-details",
},
    fields: [
      {
        name: "service",
        type: "choice",
        label: "Service",
        options: SERVICE_OPTIONS,
        rules: [{ type: "required", message: "Choose a service to continue." }],
      },
    ],
  }, 
   {
    id: "mowing-details",
    type: "form",
    next: "address",
    title: "Tell us about the property",
    eyebrow: "Step 2 of 6",
    description: "These details help us estimate the scope before an on-site visit.",
    nextLabel: "Continue",
    fields: [
      {
        name: "propertySize",
        type: "choice",
        variant: "compact",
        label: "Property size",
        options: [
          { value: "standard", label: "Standard", description: "Typical suburban property", info: "Lots up to 7,000 sq ft." },
          { value: "large", label: "Large", description: "Large lot or corner property",  info: "Lots from 7,001 - 10,890 sq ft (1/4 acre)" },
          { value: "custom", label: "Custom", description: "Extra large or unique property", info: "Lots over 10,890 sq ft (1/4 acre) require a custom quote" },
        ],
        rules: [{ type: "required", message: "Choose a property size." }],
      },
      {
        name: "lawnCondition",
        type: "choice",
        variant: "compact",
        label: "Current condition",
        options: [
          { value: "maintained", label: "Maintained", description: "Needs routine care" },
          { value: "overgrown", label: "Overgrown", description: "Needs extra attention" },
          { value: "rescue", label: "Reset", description: "Needs a full cleanup" },
        ],
        rules: [{ type: "required", message: "Choose the current condition." }],
      },
    ],
  },
   {
    id: "one-time-details",
    type: "form",
     next: "address",
    title: "Tell us about the property",
    eyebrow: "Step 2 of 6",
    description: "These details help us estimate the scope before an on-site visit.",
    nextLabel: "Continue",
    fields: [
      {
        name: "propertySize",
        type: "choice",
        variant: "compact",
        label: "Property size",
        options: [
          { value: "standard", label: "Standard", description: "Typical suburban property", info: "Lots up to 7,000 sq ft." },
          { value: "large", label: "Large", description: "Large lot or corner property",  info: "Lots from 7,001 - 10,890 sq ft (1/4 acre)" },
          { value: "custom", label: "Custom", description: "Extra large or unique property", info: "Lots over 10,890 sq ft (1/4 acre) require a custom quote" },
        ],
        rules: [{ type: "required", message: "Choose a property size." }],
      },
      {
        name: "lawnCondition",
        type: "choice",
        variant: "compact",
        label: "Current condition",
        options: [
          { value: "maintained", label: "Maintained", description: "Needs routine care" },
          { value: "overgrown", label: "Overgrown", description: "Needs extra attention" },
          { value: "rescue", label: "Reset", description: "Needs a full cleanup" },
        ],
        rules: [{ type: "required", message: "Choose the current condition." }],
      },
    ],
  },
  {
    id: "project-details",
    type: "form",
    next: "address",
    title: "Tell us about the property",
    eyebrow: "Step 2 of 6",
    description: "These details help us estimate the scope before an on-site visit.",
    nextLabel: "Continue",
    fields: [
      {
        name: "addOns",
        type: "checkboxGroup",
        label: "Optional add-ons",
        options: [
          { value: "deepEdging", label: "Deep edging" },
          { value: "weedControl", label: "Weed control" },
          { value: "aeration", label: "Aeration" },
          { value: "leafHaul", label: "Leaf haul-away" },
        ],
      },
    ],
  },
   {
    id: "other-details",
    type: "form",
     next: "address",
    title: "Tell us about the property",
    eyebrow: "Step 2 of 6",
    description: "These details help us estimate the scope before an on-site visit.",
    nextLabel: "Continue",
    fields: [
      {
        name: "addOns",
        type: "checkboxGroup",
        label: "Optional add-ons",
        options: [
          { value: "deepEdging", label: "Deep edging" },
          { value: "weedControl", label: "Weed control" },
          { value: "aeration", label: "Aeration" },
          { value: "leafHaul", label: "Leaf haul-away" },
        ],
      },
    ],
  },
  {
    id: "address",
    type: "form",
    title: "Where is the property?",
    eyebrow: "Step 3 of 6",
    description: "We use the address to confirm routing and service availability.",
    nextLabel: "Calculate estimate",
    fields: [
      {
        name: "street",
        type: "text",
        label: "Street address",
        autocomplete: "street-address",
        rules: [{ type: "required", message: "Enter the street address." }],
      },
      {
        name: "city",
        type: "text",
        label: "City",
        autocomplete: "address-level2",
        rules: [{ type: "required", message: "Enter the city." }],
      },
      {
        name: "postalCode",
        type: "text",
        label: "ZIP or postal code",
        autocomplete: "postal-code",
        rules: [
          { type: "required", message: "Enter the ZIP or postal code." },
          { type: "postalCode", message: "Use a valid ZIP or postal code." },
        ],
      },
      {
        name: "accessNotes",
        type: "textarea",
        label: "Access notes",
        placeholder: "Gate code, parking note, pets, or anything we should know.",
      },
    ],
  },
  {
    id: "estimate",
    type: "estimate",
    title: "Your starting estimate",
    eyebrow: "Step 4 of 6",
    description:
      "This range is based on your answers. Final pricing is confirmed after Terra Verde reviews the property.",
    nextLabel: "Add photos",
  },
  {
    id: "photos",
    type: "form",
    title: "Add helpful photos",
    eyebrow: "Step 5 of 6",
    description:
      "Photos are optional, but they help us confirm the estimate faster.",
    nextLabel: "Continue",
    fields: [
      {
        name: "photoFiles",
        type: "file",
        label: "Upload lawn or yard photos",
        accept: "image/*",
        multiple: true,
      },
      {
        name: "photoNotes",
        type: "textarea",
        label: "Photo notes",
        placeholder: "Tell us what the photos show or what matters most.",
      },
    ],
  },
  {
    id: "contact",
    type: "form",
    title: "How should we reach you?",
    eyebrow: "Step 6 of 6",
    description: "Share your contact details so we can follow up with a firm quote.",
    nextLabel: "Send request",
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First name",
        autocomplete: "given-name",
        rules: [{ type: "required", message: "Enter your first name." }],
      },
      {
        name: "lastName",
        type: "text",
        label: "Last name",
        autocomplete: "family-name",
        rules: [{ type: "required", message: "Enter your last name." }],
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        autocomplete: "email",
        rules: [
          { type: "required", message: "Enter your email address." },
          { type: "email", message: "Use a valid email address." },
        ],
      },
      {
        name: "phone",
        type: "tel",
        label: "Phone",
        autocomplete: "tel",
        rules: [
          { type: "required", message: "Enter your phone number." },
          { type: "phone", message: "Use a valid phone number." },
        ],
      },
      {
        name: "preferredContact",
        type: "choice",
        variant: "segmented",
        label: "Preferred contact",
        options: [
          { value: "phone", label: "Phone" },
          { value: "text", label: "Text" },
          { value: "email", label: "Email" },
        ],
        rules: [{ type: "required", message: "Choose a contact preference." }],
      },
      {
        name: "consent",
        type: "checkbox",
        label: "I agree that Terra Verde may contact me about this quote request.",
        rules: [{ type: "checked", message: "Confirm we can contact you." }],
      },
    ],
  },
  {
    id: "success",
    type: "success",
    title: "Your request is ready",
    eyebrow: "Success",
    description:
      "Thanks. Terra Verde will review the details and follow up with the next available estimate window.",
    nextLabel: "Start another quote",
  },
];
