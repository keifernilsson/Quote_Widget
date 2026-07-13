const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const MOWING_PRICE = 50;

const PROPERTY_MULTIPLIERS = {
  standard: 1,
  large: 1.25,
};

const CONDITION_PRICES = {
  maintained: 0,
  overgrown: 20,
  "initial-cleanup": 50,
};

const WEEKLY_ADD_ONS = {
  bedWeeding: {
    label: "Weekly Bed Weeding",
    price: 10,
  },
  dogWasteRemoval: {
    label: "Dog Waste Removal",
    price: 10,
  },
};
const ONE_TIME_PRICING = {
  fertilization: {
    label: "Fertilization",
    standard: 75,
    large: 99,
  },
};
const CLEANUP_PRICING = {
  minor: {
    standard: 175,
    large: 250,
  },
  moderate: {
    standard: 275,
    large: 375,
  },
  extensive: {
    standard: 425,
    large: 575,
  },
};
export function calculateEstimate(data) {
  if (data.service === "mowing") {
    return calculateMowingEstimate(data);
  }

  if (data.service === "one-time") {
    return calculateOneTimeEstimate(data);
  }

  return customQuoteEstimate();
}

function calculateMowingEstimate(data) {
  if (data.propertySize === "custom") {
    return customQuoteEstimate();
  }

  const multiplier = PROPERTY_MULTIPLIERS[data.propertySize];

  if (!multiplier) {
    return customQuoteEstimate();
  }

  const selectedAddOns = Array.isArray(data.addOns)
    ? data.addOns
    : [];

  const weeklyLineItems = [
    {
      label: "Weekly Lawn Mowing",
      amount: MOWING_PRICE * multiplier,
    },
  ];

  let weeklySubtotal = MOWING_PRICE;

  for (const addOnKey of selectedAddOns) {
    const addOn = WEEKLY_ADD_ONS[addOnKey];

    if (!addOn) {
      continue;
    }

    weeklySubtotal += addOn.price;

    weeklyLineItems.push({
      label: addOn.label,
      amount: addOn.price * multiplier,
    });
  }

  const weeklyTotal = weeklySubtotal * multiplier;

  const conditionPrice =
    CONDITION_PRICES[data.lawnCondition] ?? 0;

  const restorationTotal = conditionPrice * multiplier;

  const restorationLineItems =
    restorationTotal > 0
      ? [
          {
            label: "Initial Lawn Restoration",
            amount: restorationTotal,
          },
        ]
      : [];

  const firstServiceTotal = weeklyTotal + restorationTotal;
  
  return {
    customQuoteRequired: false,

    low: weeklyTotal,
    high: weeklyTotal,
    unit: "per week",

    weeklyTotal,
    restorationTotal,
    firstServiceTotal,

    weeklyLineItems,
    restorationLineItems,

    summary: `${formatCurrency(weeklyTotal)}/week`,

    // This keeps the current review page working until we
    // update its layout in the next step.
    lineItems: [
      ...weeklyLineItems.map((item) => ({
        label: item.label,
        amount: formatCurrency(item.amount),
      })),
      ...restorationLineItems.map((item) => ({
        label: item.label,
        amount: `${formatCurrency(item.amount)} one-time`,
      })),
    ],

    disclaimer:
      "This is an instant estimate. Final pricing is confirmed after Terra Verde reviews the property.",
  };
}
function calculateOneTimeEstimate(data) {
  const selectedServices = Array.isArray(data.oneTimeServices)
    ? data.oneTimeServices
    : [];

  if (data.propertySize === "custom") {
    return customQuoteEstimate();
  }

  if (selectedServices.length !== 1) {
    return customQuoteEstimate();
  }

  const serviceKey = selectedServices[0];
  const servicePricing = ONE_TIME_PRICING[serviceKey];

  if (!servicePricing) {
    return customQuoteEstimate();
  }

  const total = servicePricing[data.propertySize];

  if (!total) {
    return customQuoteEstimate();
  }

  return {
    customQuoteRequired: false,

    low: total,
    high: total,
    unit: "one-time",

    weeklyTotal: null,
    restorationTotal: null,
    firstServiceTotal: null,

    weeklyLineItems: [],
    restorationLineItems: [],

    summary: `${formatCurrency(total)} one-time`,

    lineItems: [
      {
        label: servicePricing.label,
        amount: formatCurrency(total),
      },
    ],

    disclaimer:
      "This is an instant estimate. Final pricing is confirmed after Terra Verde reviews the property.",
  };
}
export function formatCurrency(value) {
  return currency.format(value);
}

function customQuoteEstimate() {
  return {
    customQuoteRequired: true,

    low: null,
    high: null,
    unit: null,

    weeklyTotal: null,
    restorationTotal: null,

    weeklyLineItems: [],
    restorationLineItems: [],

    summary: "Custom quote required",

    lineItems: [
      {
        label: "Estimate",
        amount: "Custom quote required",
      },
    ],

    disclaimer:
      "Terra Verde will review the property details and prepare a custom quote.",
  };
}
