/**
 * Indian mobile number validation:
 * 1. Must be 10 digits
 * 2. Must start with 6, 7, 8, or 9
 */
export const validateIndianMobile = (mobile: string): boolean => {
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(mobile);
};

/**
 * Name validation:
 * 1. Must not be empty
 * 2. Minimum 2 characters
 * 3. Only letters and spaces allowed
 */
export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2) return false;
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(trimmedName);
};
