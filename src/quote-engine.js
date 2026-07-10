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

export function calculateEstimate(data, rules) {
  if (data.service !== "mowing") {
    return customQuoteEstimate();
  }

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

  return {
    customQuoteRequired: false,

    low: weeklyTotal,
    high: weeklyTotal,
    unit: "per week",

    weeklyTotal,
    restorationTotal,

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
