// Blood Compatibility Checker Module
const CompatibilityChecker = {
  compatibilityChart: {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  },

  init() {
    const checkButton = document.getElementById("check-compatibility");
    checkButton.addEventListener("click", () => this.check());
  },

  check() {
    const recipient = document.getElementById("recipient-blood").value;
    const donor = document.getElementById("donor-blood").value;
    const resultDiv = document.getElementById("compatibility-result");

    if (!recipient || !donor) {
      App.showToast("Please select both blood groups", "error");
      return;
    }

    const translationKey = isCompatible
      ? "compat_compatible"
      : "compat_not_compatible";

    const compatibleDonors = this.compatibilityChart[recipient];
    const isCompatible = compatibleDonors.includes(donor);

    resultDiv.classList.remove("hidden");

    if (isCompatible) {
      resultDiv.className =
        "mt-6 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      resultDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    <span class="font-semibold">${Language && Language.translate ? Language.translate("compat_compatible") : "Compatible!"}</span>
                </div>
                <p class="mt-2">Donor blood group <strong>${donor}</strong> can safely donate to recipient with <strong>${recipient}</strong> blood group.</p>
            `;
    } else {
      resultDiv.className =
        "mt-6 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      resultDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span class="font-semibold">${Language && Language.translate ? Language.translate("compat_not_compatible") : "Not Compatible"}</span>
                </div>
                <p class="mt-2">Donor blood group <strong>${donor}</strong> cannot donate to recipient with <strong>${recipient}</strong> blood group.</p>
            `;
    }

    App.showToast(
      isCompatible
        ? "Blood groups are compatible!"
        : "Blood groups are not compatible",
      isCompatible ? "success" : "error",
    );
  },
};
