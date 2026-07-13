export const COMPANY = {
  name: "Terra Verde Lawn Company",
  phone: "(403) 635-7460",
  email: "terraverdelethbridge@gmail.com",
  serviceArea: "Lethbridge, AB",
};

export const SERVICE_OPTIONS = [
  {
  value: "mowing",
  label: "Lawn Maintenance",
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
    description: "Tell us about the property so we can estimate your weekly mowing price.",
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
          { value: "maintained", label: "Maintained", description: "Currently being mowed on a routine schedule" },
          { value: "overgrown", label: "Overgrown", description: "Longer than normal, but still mowable" },
          { value: "initial-cleanup", label: "Reset", description: "Significant growth/requires a full cleanup" },
        ],
        rules: [{ type: "required", message: "Choose the current condition." }],
      },
      {
  name: "addOns",
  type: "checkboxGroup",
  label: "Optional add-ons",
  options: [
    {
      value: "bedWeeding",
      label: "Weekly garden bed weeding",
      description: "Keep your flower beds neat with routine weed removal.",
    },
    {
      value: "dogWasteRemoval",
      label: "Weekly dog waste removal",
      description: "We'll remove pet waste every week before mowing.",
    },
  ],
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
  name: "oneTimeServices",
  type: "checkboxGroup",
  label: "Which services are you interested in? Select all that apply.",
  options: [
  {
    value: "debrisRemoval",
    group: "Cleanup & Restoration",
    label: "Debris Removal",
    description:
      "Remove leaves, branches, yard waste, and other outdoor debris from the property.",
  },
  {
    value: "bedWeeding",
    group: "Cleanup & Restoration",
    label: "Garden Bed Weeding",
    description:
      "Remove weeds from existing garden and landscape beds to restore a tidy appearance.",
  },
  {
    value: "overgrowthRemoval",
    group: "Cleanup & Restoration",
    label: "Overgrowth Removal",
    description:
      "Cut back tall grass, weeds, and overgrown vegetation to restore neglected areas.",
  },
  {
    value: "edgeRestoration",
    group: "Cleanup & Restoration",
    label: "Edge Restoration",
    description:
      "Re-establish clean, defined edges around lawns, garden beds, and walkways.",
  },
  {
    value: "cleanup",
    group: "Cleanup & Restoration",
    featured: true,
    label: "Full Property Cleanup",
    description:
      "Restore the entire property with debris removal, overgrowth removal, bed weeding, and edge restoration as needed.",
  },
  {
    value: "fertilization",
    group: "Lawn Services",
    label: "Fertilization",
    description:
      "Apply premium slow-release fertilizer to promote a greener, healthier lawn.",
  },
  {
    value: "overseeding",
    group: "Lawn Services",
    label: "Overseeding",
    description:
      "Apply grass seed to thin or bare areas to encourage thicker, more even turf.",
  },
  {
    value: "topdressing",
    group: "Lawn Services",
    label: "Topdressing",
    description:
      "Apply a thin layer of soil to improve lawn smoothness, soil quality, and seed establishment.",
  },
  {
    value: "mulchInstallation",
    group: "Garden & Landscape",
    label: "Mulch Installation",
    description:
      "Supply and install fresh mulch to improve the appearance and health of landscape beds.",
  },
],
  rules: [
    {
      type: "required",
      message: "Choose at least one service.",
    },
  ],
},
  {
    name: "cleanupLevel",
    type: "choice",
    variant: "compact",
    label: "What is the scale of cleanup required?",
    description:
      "We'll review your photos and confirm before providing your final quote.",
    showWhen: {
  oneTimeServices: [
    "debrisRemoval",
    "bedWeeding",
    "overgrowthRemoval",
    "edgeRestoration",
    "cleanup",
  ],
},
    options: [
      {
        value: "minor",
        label: "Minor",
        description:
          "The property is generally maintained and only needs a light cleanup.",
      },
      {
        value: "moderate",
        label: "Moderate",
        description:
  "The property has fallen behind and requires a thorough cleanup.",
      },
      {
        value: "extensive",
        label: "Extensive",
        description:
          "Significant overgrowth, heavy debris, or areas that haven't been maintained for some time.",
      },
    ],
    rules: [
      {
        type: "required",
        message: "Choose a cleanup level.",
      },
    ],
  },
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
    nextLabel: "Continue",
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
    id: "photos",
    type: "form",
    title: "Add helpful photos",
    eyebrow: "Step 4 of 6",
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
    eyebrow: "Step 5 of 6",
    description: "Share your contact details so we can follow up with a firm quote.",
    nextLabel: "Review request",
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
  id: "summary",
  type: "summary",
  title: "Review your request",
  eyebrow: "Step 6 of 6",
  description:
    "Review your estimated price before requesting your final quote.",
  nextLabel: "Submit request",
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
