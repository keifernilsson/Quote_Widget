const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function calculateEstimate(data, rules) {
  const service = rules.services[data.service] || rules.services.mowing;
  const propertySize = rules.propertySizes[data.propertySize] || rules.propertySizes.medium;
  const condition = rules.conditions[data.lawnCondition] || rules.conditions.maintained;
  const frequency = rules.frequencies[data.frequency] || rules.frequencies["one-time"];
  const addOns = Array.isArray(data.addOns) ? data.addOns : [];

  const lineItems = [
    {
      label: service.label,
      amount: formatRange(service.low, service.high),
    },
    {
      label: propertySize.label,
      amount: formatModifier(propertySize.low, propertySize.high),
    },
    {
      label: condition.label,
      amount: formatModifier(condition.low, condition.high),
    },
  ];

  let low = service.low + propertySize.low + condition.low;
  let high = service.high + propertySize.high + condition.high;

  for (const addOnKey of addOns) {
    const addOn = rules.addOns[addOnKey];
    if (!addOn) {
      continue;
    }

    low += addOn.low;
    high += addOn.high;
    lineItems.push({
      label: addOn.label,
      amount: formatModifier(addOn.low, addOn.high),
    });
  }

  if (service.unit === "per visit") {
    low *= frequency.multiplier;
    high *= frequency.multiplier;
    lineItems.push({
      label: `${frequency.label} schedule`,
      amount: frequency.multiplier === 1 ? "Standard rate" : "Adjusted rate",
    });
  }

  const buffer = rules.rangeBuffer || 0;
  const bufferedLow = Math.max(0, Math.round(low * (1 - buffer)));
  const bufferedHigh = Math.max(bufferedLow, Math.round(high * (1 + buffer)));

  return {
    low: bufferedLow,
    high: bufferedHigh,
    unit: service.unit,
    summary: `${formatCurrency(bufferedLow)} - ${formatCurrency(bufferedHigh)} ${service.unit}`,
    lineItems,
    disclaimer:
      "Final pricing may change after Terra Verde reviews access, turf condition, disposal needs, and exact lot size.",
  };
}

export function formatCurrency(value) {
  return currency.format(value);
}

function formatRange(low, high) {
  return `${formatCurrency(low)} - ${formatCurrency(high)}`;
}

function formatModifier(low, high) {
  if (low === 0 && high === 0) {
    return "Included";
  }
  return `+${formatRange(low, high)}`;
}
