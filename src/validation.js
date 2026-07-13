const VALIDATORS = {
  required(value) {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && String(value).trim() !== "";
  },
  checked(value) {
    return value === true;
  },
  email(value) {
    if (!value) {
      return true;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  },
  phone(value) {
    if (!value) {
      return true;
    }
    return String(value).replace(/\D/g, "").length >= 10;
  },
  postalCode(value) {
    if (!value) {
      return true;
    }
    const normalized = String(value).trim();
    const usZip = /^\d{5}(-\d{4})?$/;
    const caPostal = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return usZip.test(normalized) || caPostal.test(normalized);
  },
};

export function isFieldVisible(field, data) {
  if (!field.showWhen) {
    return true;
  }

  return Object.entries(field.showWhen).every(
    ([controllingField, expectedValue]) => {
      const actualValue = data[controllingField];

      if (Array.isArray(actualValue)) {
        const expectedValues = Array.isArray(expectedValue)
          ? expectedValue
          : [expectedValue];

        return expectedValues.some((value) =>
          actualValue.includes(value)
        );
      }

      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(actualValue);
      }

      return actualValue === expectedValue;
    }
  );
}

export function validateScreen(screen, data) {
  const errors = {};

  for (const field of screen.fields || []) {
  if (!isFieldVisible(field, data)) {
    continue;
  }

  for (const rule of field.rules || []) {
      const validator = VALIDATORS[rule.type];
      if (!validator) {
        continue;
      }

      const isValid = validator(data[field.name], rule, data);
      if (!isValid) {
        errors[field.name] = rule.message || "Please check this field.";
        break;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
