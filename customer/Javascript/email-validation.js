(function () {
  const emailPattern =
    /^[A-Z0-9.!#$%&'*+/=?^_{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,24}$/i;

  window.CoffeeEmailValidation = Object.freeze({
    isValid(value) {
      const email = String(value || "").trim();
      if (!email || email.length > 254 || !emailPattern.test(email)) {
        return false;
      }

      const [localPart, domain] = email.split("@");
      if (
        !localPart ||
        localPart.length > 64 ||
        localPart.startsWith(".") ||
        localPart.endsWith(".") ||
        localPart.includes("..")
      ) {
        return false;
      }

      // Catch the common .com typo shown in the contact form (.con).
      return !domain.toLowerCase().endsWith(".con");
    },
  });
})();
