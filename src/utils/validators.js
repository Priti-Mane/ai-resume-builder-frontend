// Shared form validation helpers.

export const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};
