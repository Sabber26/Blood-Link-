// Shared validation utility
const ValidationUtils = {
  isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  isValidPhone(value) {
    return /^\+?[\d\s-]{10,}$/.test(value);
  },

  isStrongPassword(value) {
    return (
      value.length >= 8 &&
      /[a-z]/.test(value) &&
      /[A-Z]/.test(value) &&
      /\d/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    );
  },

  getPasswordStrength(password) {
    if (!password) {
      return { score: 0, label: "Not set", percent: 0, color: "#e5e7eb" };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2)
      return { score, label: "Weak", percent: 25, color: "#ef4444" };
    if (score <= 4)
      return { score, label: "Fair", percent: 50, color: "#f59e0b" };
    if (score <= 5)
      return { score, label: "Good", percent: 75, color: "#3b82f6" };
    return { score, label: "Strong", percent: 100, color: "#10b981" };
  },
};

window.ValidationUtils = ValidationUtils;
