const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const PRICING = {
  revenuePerLabourHour: 100,
  minimumServiceCharge: 80,
};

/*
 * Recurring lawn-maintenance pricing
 *
 * These remain visit-based internally so the engine can calculate
 * an equivalent monthly price using 52 visits per year.
 */
const RECURRING_SERVICES = {
  mowing: {
    label: "Weekly Lawn Maintenance",
    weeklyPrice: 50,
  },

  addOns: {
    bedWeeding: {
      label: "Weekly Bed Weeding",
      weeklyPrice: 10,
    },

    dogWasteRemoval: {
      label: "Dog Waste Removal",
      weeklyPrice: 10,
    },
  },
};

const PROPERTY_MULTIPLIERS = {
  standard: 1,
  large: 1.25,
};

const LAWN_CONDITION_PRICES = {
  maintained: 0,
  overgrown: 20,
  "initial-cleanup": 50,
};

/*
 * Cleanup services included within Full Property Cleanup.
 *
 * When Full Property Cleanup is selected, these individual services
 * are removed from the billable list to prevent double charging.
 */
const FULL_CLEANUP_COMPONENTS = new Set([
  "debrisRemoval",
  "bedWeeding",
  "overgrowthRemoval",
  "edgeRestoration",
]);

/*
 * One-time service catalogue
 *
 * Labour is stored in budgeted hours.
 *
 * Variable services use:
 * labour[cleanupLevel][propertySize]
 *
 * Fixed services use:
 * labour[propertySize]
 *
 * Material allowances are currently kept consistent across Standard
 * and Large properties. They can be made property-size-specific later
 * without changing the calculation pipeline.
 */
const ONE_TIME_SERVICES = {
  debrisRemoval: {
    label: "Debris Removal",
    labourModel: "variable",
    disposalPossible: true,

    labour: {
      minor: {
        standard: range(0.25, 0.5),
        large: range(0.5, 0.75),
      },

      moderate: {
        standard: range(0.75, 1.25),
        large: range(1.25, 2),
      },

      extensive: {
        standard: range(2, 3),
        large: range(3, 5),
      },
    },

    materials: noCost(),
  },

  bedWeeding: {
    label: "Garden Bed Weeding",
    labourModel: "variable",
    disposalPossible: true,

    labour: {
      minor: {
        standard: range(0.5, 1),
        large: range(1, 1.5),
      },

      moderate: {
        standard: range(1.5, 2.5),
        large: range(2.5, 4),
      },

      extensive: {
        standard: range(3, 5),
        large: range(5, 8),
      },
    },

    materials: noCost(),
  },

  overgrowthRemoval: {
    label: "Overgrowth Removal",
    labourModel: "variable",
    disposalPossible: true,

    labour: {
      minor: {
        standard: range(0.5, 1),
        large: range(1, 1.5),
      },

      moderate: {
        standard: range(1.5, 3),
        large: range(3, 5),
      },

      extensive: {
        standard: range(4, 6),
        large: range(6, 10),
      },
    },

    materials: noCost(),
  },

  edgeRestoration: {
    label: "Edge Restoration",
    labourModel: "variable",
    disposalPossible: true,

    labour: {
      minor: {
        standard: range(0.5, 1),
        large: range(1, 1.5),
      },

      moderate: {
        standard: range(1, 2),
        large: range(2, 3),
      },

      extensive: {
        standard: range(2.5, 4),
        large: range(4, 6),
      },
    },

    materials: noCost(),
  },

  cleanup: {
    label: "Full Property Cleanup",
    labourModel: "variable",
    disposalPossible: true,

    labour: {
      minor: {
        standard: range(1.5, 2.25),
        large: range(2, 3),
      },

      moderate: {
        standard: range(2.25, 3.5),
        large: range(3, 4.75),
      },

      extensive: {
        standard: range(3.5, 5.5),
        large: range(4.75, 7),
      },
    },

    materials: noCost(),
  },

  fertilization: {
    label: "Fertilization",
    labourModel: "fixed",
    disposalPossible: false,

    labour: {
      standard: range(0.5, 0.5),
      large: range(0.75, 0.75),
    },

    materials: range(25, 35),
  },

  overseeding: {
    label: "Overseeding",
    labourModel: "fixed",
    disposalPossible: false,

    labour: {
      standard: range(1, 1),
      large: range(1.5, 1.5),
    },

    materials: range(40, 60),
  },

  topdressing: {
    label: "Topdressing",
    labourModel: "fixed",
    disposalPossible: false,

    labour: {
      standard: range(2, 3),
      large: range(3, 5),
    },

    materials: range(100, 175),
  },

  /*
   * Mulch quantity is not reliably determined by total property size.
   * Until the widget collects Small / Medium / Large mulch area,
   * mulch installation should receive a manual quote.
   */
  mulchInstallation: {
    label: "Mulch Installation",
    labourModel: "custom",
    disposalPossible: true,
    requiresCustomQuote: true,
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
  if (!isSupportedPropertySize(data.propertySize)) {
    return customQuoteEstimate();
  }

  const multiplier = PROPERTY_MULTIPLIERS[data.propertySize];

  const selectedAddOns = Array.isArray(data.addOns)
    ? data.addOns
    : [];

  const weeklyLineItems = [
    {
      label: RECURRING_SERVICES.mowing.label,
      amount:
        RECURRING_SERVICES.mowing.weeklyPrice *
        multiplier,
    },
  ];

  let weeklyTotal =
    RECURRING_SERVICES.mowing.weeklyPrice *
    multiplier;

  for (const addOnKey of selectedAddOns) {
    const addOn =
      RECURRING_SERVICES.addOns[addOnKey];

    if (!addOn) {
      continue;
    }

    const addOnAmount =
      addOn.weeklyPrice * multiplier;

    weeklyTotal += addOnAmount;

    weeklyLineItems.push({
      label: addOn.label,
      amount: addOnAmount,
    });
  }

  weeklyTotal = roundCurrency(weeklyTotal);

  const monthlyTotal = weeklyToMonthly(
    weeklyTotal
  );

  const conditionPrice =
    LAWN_CONDITION_PRICES[data.lawnCondition] ??
    0;

  const restorationTotal = roundCurrency(
    conditionPrice * multiplier
  );

  const restorationLineItems =
    restorationTotal > 0
      ? [
          {
            label: "Initial Lawn Restoration",
            amount: restorationTotal,
          },
        ]
      : [];

  const firstMonthTotal = roundCurrency(
    monthlyTotal + restorationTotal
  );

  return createEstimate({
    customQuoteRequired: false,

    low: monthlyTotal,
    high: monthlyTotal,
    unit: "per month",

    weeklyTotal,
    monthlyTotal,
    restorationTotal,
    firstMonthTotal,

    weeklyLineItems,
    restorationLineItems,

    lineItems: [
      ...weeklyLineItems.map((item) => ({
        label: item.label,
        amount: `${formatCurrency(
          weeklyToMonthly(item.amount)
        )}/month`,
      })),

      ...restorationLineItems.map((item) => ({
        label: item.label,
        amount: `${formatCurrency(
          item.amount
        )} one-time`,
      })),
    ],

    summary: `${formatCurrency(
      monthlyTotal
    )}/month`,

    disclaimer:
      "This is an instant estimate. Final pricing is confirmed after Terra Verde reviews the property.",
  });
}

function calculateOneTimeEstimate(data) {
  if (!isSupportedPropertySize(data.propertySize)) {
    return customQuoteEstimate();
  }

  const selectedServices = Array.isArray(
    data.oneTimeServices
  )
    ? data.oneTimeServices
    : [];

  if (selectedServices.length === 0) {
    return customQuoteEstimate();
  }

  const billableServices =
    removeFullCleanupOverlaps(selectedServices);

  const resolvedServices = [];

  for (const serviceKey of billableServices) {
    const service =
      ONE_TIME_SERVICES[serviceKey];

    if (!service) {
      return customQuoteEstimate();
    }

    if (
      service.requiresCustomQuote ||
      service.labourModel === "custom"
    ) {
      return customQuoteEstimate(
        `${service.label} requires a custom quote so Terra Verde can confirm the project area, labour, and material quantities.`
      );
    }

    const resolved = resolveOneTimeService({
      service,
      serviceKey,
      propertySize: data.propertySize,
      cleanupLevel: data.cleanupLevel,
    });

    if (!resolved) {
      return customQuoteEstimate();
    }

    resolvedServices.push(resolved);
  }

  if (resolvedServices.length === 0) {
    return customQuoteEstimate();
  }

  const totalLabourHours =
    sumRanges(
      resolvedServices.map(
        (item) => item.labourHours
      )
    );

  const totalLabourCost =
    sumRanges(
      resolvedServices.map(
        (item) => item.labourCost
      )
    );

  const totalMaterialCost =
    sumRanges(
      resolvedServices.map(
        (item) => item.materialCost
      )
    );

  const total =
    addRanges(
      totalLabourCost,
      totalMaterialCost
    );

  const low = roundCurrency(total.low);
  const high = roundCurrency(total.high);

  const minimumChargeApplies =
    high < PRICING.minimumServiceCharge;

  const disposalMayApply =
    resolvedServices.some(
      (item) => item.disposalPossible
    );

  const lineItems = resolvedServices.map(
    (item) => ({
      label: item.label,
      amount: formatOneTimeRange(
        item.total.low,
        item.total.high
      ),
    })
  );

  return createEstimate({
    customQuoteRequired: false,

    low,
    high,
    unit: "one-time",

    minimumChargeApplies,
    minimumServiceCharge:
      PRICING.minimumServiceCharge,

    disposalMayApply,

    budgetedLabourHours: {
      low: roundHours(totalLabourHours.low),
      high: roundHours(totalLabourHours.high),
    },

    labourCost: {
      low: roundCurrency(totalLabourCost.low),
      high: roundCurrency(totalLabourCost.high),
    },

    materialCost: {
      low: roundCurrency(
        totalMaterialCost.low
      ),
      high: roundCurrency(
        totalMaterialCost.high
      ),
    },

    lineItems,

    summary: formatOneTimeRange(low, high),

    disclaimer:
      "This is an instant estimate. Final pricing is confirmed after Terra Verde reviews the property and submitted photos.",
  });
}

function resolveOneTimeService({
  service,
  serviceKey,
  propertySize,
  cleanupLevel,
}) {
  const labourHours = resolveLabourHours({
    service,
    propertySize,
    cleanupLevel,
  });

  if (!labourHours) {
    return null;
  }

  const labourCost = {
    low:
      labourHours.low *
      PRICING.revenuePerLabourHour,

    high:
      labourHours.high *
      PRICING.revenuePerLabourHour,
  };

  const materialCost =
    service.materials ?? noCost();

  const total = addRanges(
    labourCost,
    materialCost
  );

  return {
    serviceKey,
    label: service.label,

    labourHours: {
      low: roundHours(labourHours.low),
      high: roundHours(labourHours.high),
    },

    labourCost: {
      low: roundCurrency(labourCost.low),
      high: roundCurrency(labourCost.high),
    },

    materialCost: {
      low: roundCurrency(materialCost.low),
      high: roundCurrency(materialCost.high),
    },

    total: {
      low: roundCurrency(total.low),
      high: roundCurrency(total.high),
    },

    disposalPossible:
      service.disposalPossible === true,
  };
}

function resolveLabourHours({
  service,
  propertySize,
  cleanupLevel,
}) {
  if (service.labourModel === "fixed") {
    return service.labour?.[propertySize] ?? null;
  }

  if (service.labourModel === "variable") {
    if (!cleanupLevel) {
      return null;
    }

    return (
      service.labour?.[cleanupLevel]?.[
        propertySize
      ] ?? null
    );
  }

  return null;
}

function removeFullCleanupOverlaps(
  selectedServices
) {
  const uniqueServices = [
    ...new Set(selectedServices),
  ];

  if (!uniqueServices.includes("cleanup")) {
    return uniqueServices;
  }

  return uniqueServices.filter(
    (serviceKey) =>
      serviceKey === "cleanup" ||
      !FULL_CLEANUP_COMPONENTS.has(serviceKey)
  );
}

function createEstimate(overrides = {}) {
  return {
    customQuoteRequired: false,

    low: null,
    high: null,
    unit: null,

    minimumChargeApplies: false,
    minimumServiceCharge:
      PRICING.minimumServiceCharge,

    disposalMayApply: false,

    budgetedLabourHours: null,
    labourCost: null,
    materialCost: null,

    weeklyTotal: null,
    monthlyTotal: null,
    restorationTotal: null,
    firstMonthTotal: null,

    weeklyLineItems: [],
    restorationLineItems: [],

    summary: "",
    lineItems: [],

    disclaimer:
      "This is an instant estimate. Final pricing is confirmed after Terra Verde reviews the property.",

    ...overrides,
  };
}

function customQuoteEstimate(
  message = "Terra Verde will review the property details and prepare a custom quote."
) {
  return createEstimate({
    customQuoteRequired: true,

    summary: "Custom quote required",

    lineItems: [
      {
        label: "Estimate",
        amount: "Custom quote required",
      },
    ],

    disclaimer: message,
  });
}

function isSupportedPropertySize(
  propertySize
) {
  return (
    propertySize === "standard" ||
    propertySize === "large"
  );
}

function weeklyToMonthly(weeklyAmount) {
  return roundCurrency(
    (weeklyAmount * 52) / 12
  );
}

function range(low, high) {
  return { low, high };
}

function noCost() {
  return range(0, 0);
}

function addRanges(first, second) {
  return {
    low: first.low + second.low,
    high: first.high + second.high,
  };
}

function sumRanges(ranges) {
  return ranges.reduce(
    (total, current) =>
      addRanges(total, current),
    noCost()
  );
}

function roundCurrency(value) {
  return Math.round(value);
}

function roundHours(value) {
  return Math.round(value * 100) / 100;
}

function formatOneTimeRange(low, high) {
  if (low === high) {
    return `${formatCurrency(low)} one-time`;
  }

  return `${formatCurrency(
    low
  )}–${formatCurrency(high)} one-time`;
}

export function formatCurrency(value) {
  return currency.format(value);
}
