// Donor Page Module
const DonorPage = {
  allDonors: [],
  filteredDonors: [],
  currentPage: 1,
  donorsPerPage: 9,
  currentView: "grid",
  selectedBloodGroups: [],
  lastAppliedFilters: null,
  cache: new Map(),
  performanceLog: [],
  location: null,

  init() {
    this.handleLoading();
    this.initMobileMenu();
    this.initDarkMode();
    this.initFilters();
    this.syncSharedBloodGroup();
    this.initSharedBloodGroupListener();
    this.initModal();
    this.initSorting();
    this.initViewToggle();
    this.initQuickPresets();
    this.renderStats();
    this.loadDonors();
  },

  handleLoading() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
          loadingScreen.classList.add("hidden");
        }
      }, 500);
    });
  },

  initMobileMenu() {
    const menuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  },

  initDarkMode() {
    if (typeof DarkMode !== "undefined") {
      DarkMode.init();
    } else {
      this.fallbackDarkMode();
    }
  },

  fallbackDarkMode() {
    const toggle = document.getElementById("dark-mode-toggle");
    const sunIcon = document.getElementById("sun-icon");
    const moonIcon = document.getElementById("moon-icon");

    if (!toggle) return;

    if (localStorage.getItem("darkMode") === "enabled") {
      document.documentElement.classList.add("dark");
      if (sunIcon) sunIcon.classList.remove("hidden");
      if (moonIcon) moonIcon.classList.add("hidden");
    }

    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
        if (sunIcon) sunIcon.classList.remove("hidden");
        if (moonIcon) moonIcon.classList.add("hidden");
      } else {
        localStorage.setItem("darkMode", null);
        if (sunIcon) sunIcon.classList.add("hidden");
        if (moonIcon) moonIcon.classList.remove("hidden");
      }
    });
  },

  initFilters() {
    const searchInput = document.getElementById("search-input");
    const districtFilter = document.getElementById("district-filter");
    const availabilityFilter = document.getElementById("availability-filter");
    const resetBtn = document.getElementById("reset-filters");
    const clearFiltersBtn = document.getElementById("clear-filters-btn");
    const advancedToggle = document.getElementById("advanced-filters-toggle");
    const advancedPanel = document.getElementById("advanced-filters-panel");
    const useLocationBtn = document.getElementById("use-location-btn");
    const locationInputs = [
      document.getElementById("last-donation-filter"),
      document.getElementById("donation-count-filter"),
      document.getElementById("distance-filter"),
      document.getElementById("compatibility-recipient"),
      document.getElementById("compatibility-only"),
    ];

    let debounceTimer;
    const handleSearch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.applyFilters(), 250);
    };

    searchInput?.addEventListener("input", handleSearch);
    districtFilter?.addEventListener("change", () => this.applyFilters());
    availabilityFilter?.addEventListener("change", () => this.applyFilters());
    resetBtn?.addEventListener("click", () => this.resetFilters());
    clearFiltersBtn?.addEventListener("click", () => this.resetFilters());

    advancedToggle?.addEventListener("click", () => {
      const isHidden = advancedPanel?.classList.contains("hidden");
      advancedPanel?.classList.toggle("hidden", !isHidden);
      advancedToggle.textContent = isHidden
        ? "Hide advanced filters"
        : "Advanced filters";
    });

    locationInputs.forEach((input) => {
      input?.addEventListener("change", () => this.applyFilters());
      input?.addEventListener("input", () => this.applyFilters());
    });

    useLocationBtn?.addEventListener("click", () => this.requestLocation());
    this.renderBloodGroupOptions();
    this.restoreFilters();
  },

  initModal() {
    const modal = document.getElementById("donor-modal");
    const closeBtn = document.getElementById("close-modal");

    closeBtn?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  },

  initSorting() {
    const sortBy = document.getElementById("sort-by");
    sortBy?.addEventListener("change", () => {
      this.sortDonors();
      this.renderDonors();
      this.persistState();
    });
  },

  initViewToggle() {
    document.getElementById("view-grid-btn")?.addEventListener("click", () => {
      this.currentView = "grid";
      document.getElementById("donors-grid")?.classList.remove("space-y-3");
      document
        .getElementById("donors-grid")
        ?.classList.add("grid", "md:grid-cols-2", "lg:grid-cols-3", "gap-6");
      this.renderDonors();
      this.persistState();
    });

    document.getElementById("view-list-btn")?.addEventListener("click", () => {
      this.currentView = "list";
      document
        .getElementById("donors-grid")
        ?.classList.remove("grid", "md:grid-cols-2", "lg:grid-cols-3", "gap-6");
      document.getElementById("donors-grid")?.classList.add("space-y-3");
      this.renderDonors();
      this.persistState();
    });
  },

  initQuickPresets() {
    const presets = [
      { label: "Universal donors", value: "O-" },
      { label: "Universal recipients", value: "AB+" },
      { label: "Available now", value: "available" },
      { label: "High impact", value: "high-impact" },
      { label: "Recent donors", value: "recent" },
      { label: "Nearby", value: "nearby" },
    ];

    const container = document.getElementById("quick-filter-presets");
    if (!container) return;

    container.innerHTML = presets
      .map(
        (preset) => `
      <button data-preset="${preset.value}" type="button" class="inline-flex items-center rounded-full border border-primary-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-50 dark:border-primary-800 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-primary-900/40">
        <span class="mr-2 h-2 w-2 rounded-full bg-primary-500"></span>
        ${preset.label}
      </button>
    `,
      )
      .join("");

    container.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = button.getAttribute("data-preset");
        this.applyPreset(preset);
      });
    });
  },

  async loadDonors() {
    const storedDonors = localStorage.getItem("donorsData");
    if (storedDonors) {
      try {
        this.allDonors = JSON.parse(storedDonors);
      } catch (error) {
        console.error("Invalid donors cache", error);
        this.allDonors = [];
      }
    }

    try {
      const response = await fetch("data/donors.json");
      if (!response.ok) throw new Error("Failed to fetch donors");

      this.allDonors = await response.json();
      localStorage.setItem("donorsData", JSON.stringify(this.allDonors));
      this.populateDistrictFilter();
      this.applyFilters();
      this.renderStats();
    } catch (error) {
      console.error("Error loading donors:", error);
      if (!this.allDonors.length) {
        this.allDonors = this.getSampleDonors();
        localStorage.setItem("donorsData", JSON.stringify(this.allDonors));
      }
      this.populateDistrictFilter();
      this.applyFilters();
      this.renderStats();
      this.showToast("Loaded sample donor data", "success");
    }
  },

  getSampleDonors() {
    return [
      {
        id: 1,
        name: "Rahim Uddin",
        bloodGroup: "O+",
        district: "Chandpur",
        city: "Chandpur",
        available: true,
        phone: "+8801712345678",
        email: "rahim.uddin@email.com",
        lastDonation: "2024-01-15",
        totalDonations: 12,
        country: "Bangladesh",
      },
      {
        id: 2,
        name: "Nabila Akter",
        bloodGroup: "A+",
        district: "Dhaka",
        city: "Dhaka",
        available: true,
        phone: "+8801812345678",
        email: "nabila.akter@email.com",
        lastDonation: "2024-02-20",
        totalDonations: 9,
        country: "Bangladesh",
      },
      {
        id: 3,
        name: "Tarek Rahman",
        bloodGroup: "B+",
        district: "Chattogram",
        city: "Chattogram",
        available: true,
        phone: "+8801912345678",
        email: "tarek.rahman@email.com",
        lastDonation: "2024-03-10",
        totalDonations: 7,
        country: "Bangladesh",
      },
      {
        id: 4,
        name: "Farhana Islam",
        bloodGroup: "AB+",
        district: "Cumilla",
        city: "Cumilla",
        available: true,
        phone: "+8801612345678",
        email: "farhana.islam@email.com",
        lastDonation: "2024-01-28",
        totalDonations: 15,
        country: "Bangladesh",
      },
      {
        id: 5,
        name: "Mahmudul Hasan",
        bloodGroup: "O-",
        district: "Rajshahi",
        city: "Rajshahi",
        available: true,
        phone: "+8801512345678",
        email: "mahmudul.hasan@email.com",
        lastDonation: "2024-04-01",
        totalDonations: 20,
        country: "Bangladesh",
      },
      {
        id: 6,
        name: "Tasnim Jahan",
        bloodGroup: "A-",
        district: "Sylhet",
        city: "Sylhet",
        available: false,
        phone: "+8801412345678",
        email: "tasnim.jahan@email.com",
        lastDonation: "2024-03-15",
        totalDonations: 4,
        country: "Bangladesh",
      },
      {
        id: 7,
        name: "Imran Hossain",
        bloodGroup: "B-",
        district: "Khulna",
        city: "Khulna",
        available: true,
        phone: "+8801312345678",
        email: "imran.hossain@email.com",
        lastDonation: "2024-02-01",
        totalDonations: 10,
        country: "Bangladesh",
      },
      {
        id: 8,
        name: "Nujhat Sultana",
        bloodGroup: "AB-",
        district: "Barishal",
        city: "Barishal",
        available: true,
        phone: "+8801212345678",
        email: "nujhat.sultana@email.com",
        lastDonation: "2024-04-10",
        totalDonations: 11,
        country: "Bangladesh",
      },
      {
        id: 9,
        name: "Arif Chowdhury",
        bloodGroup: "O+",
        district: "Rangpur",
        city: "Rangpur",
        available: true,
        phone: "+8801712345688",
        email: "arif.chowdhury@email.com",
        lastDonation: "2024-01-30",
        totalDonations: 8,
        country: "Bangladesh",
      },
      {
        id: 10,
        name: "Sumaiya Rahman",
        bloodGroup: "A+",
        district: "Mymensingh",
        city: "Mymensingh",
        available: true,
        phone: "+8801812345688",
        email: "sumaiya.rahman@email.com",
        lastDonation: "2024-03-20",
        totalDonations: 6,
        country: "Bangladesh",
      },
      {
        id: 11,
        name: "Hasan Ali",
        bloodGroup: "B+",
        district: "Narayanganj",
        city: "Narayanganj",
        available: false,
        phone: "+8801912345688",
        email: "hasan.ali@email.com",
        lastDonation: "2024-02-11",
        totalDonations: 5,
        country: "Bangladesh",
      },
      {
        id: 12,
        name: "Mitu Akter",
        bloodGroup: "O+",
        district: "Gazipur",
        city: "Gazipur",
        available: true,
        phone: "+8801512345688",
        email: "mitu.akter@email.com",
        lastDonation: "2024-04-05",
        totalDonations: 13,
        country: "Bangladesh",
      },
      {
        id: 13,
        name: "Saifullah Miah",
        bloodGroup: "A+",
        district: "Bogura",
        city: "Bogura",
        available: true,
        phone: "+8801612345688",
        email: "saifullah.miah@email.com",
        lastDonation: "2024-03-02",
        totalDonations: 9,
        country: "Bangladesh",
      },
      {
        id: 14,
        name: "Riya Khan",
        bloodGroup: "AB+",
        district: "Jessore",
        city: "Jessore",
        available: true,
        phone: "+8801712345689",
        email: "riya.khan@email.com",
        lastDonation: "2024-01-08",
        totalDonations: 14,
        country: "Bangladesh",
      },
      {
        id: 15,
        name: "Anika Ferdous",
        bloodGroup: "O-",
        district: "Pabna",
        city: "Pabna",
        available: true,
        phone: "+8801812345689",
        email: "anika.ferdous@email.com",
        lastDonation: "2024-04-12",
        totalDonations: 17,
        country: "Bangladesh",
      },
      {
        id: 16,
        name: "Sajid Hasan",
        bloodGroup: "B+",
        district: "Noakhali",
        city: "Noakhali",
        available: true,
        phone: "+8801912345689",
        email: "sajid.hasan@email.com",
        lastDonation: "2024-03-25",
        totalDonations: 8,
        country: "Bangladesh",
      },
      {
        id: 17,
        name: "Jubaida Begum",
        bloodGroup: "AB+",
        district: "Feni",
        city: "Feni",
        available: false,
        phone: "+8801412345689",
        email: "jubaida.begum@email.com",
        lastDonation: "2024-02-18",
        totalDonations: 6,
        country: "Bangladesh",
      },
      {
        id: 18,
        name: "Rafiq Ahmed",
        bloodGroup: "A-",
        district: "Dinajpur",
        city: "Dinajpur",
        available: true,
        phone: "+8801312345689",
        email: "rafiq.ahmed@email.com",
        lastDonation: "2024-04-09",
        totalDonations: 12,
        country: "Bangladesh",
      },
    ];
  },

  populateDistrictFilter() {
    const districtFilter = document.getElementById("district-filter");
    if (!districtFilter) return;

    const currentValue = districtFilter.value;
    districtFilter.innerHTML = '<option value="">All Districts</option>';
    const districts = [
      ...new Set(this.allDonors.map((d) => d.district)),
    ].sort();

    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtFilter.appendChild(option);
    });

    if (currentValue) districtFilter.value = currentValue;
  },

  renderBloodGroupOptions() {
    const container = document.getElementById("blood-group-options");
    if (!container) return;

    const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    container.innerHTML = groups
      .map(
        (group) => `
      <button type="button" data-group="${group}" class="rounded-full border border-gray-300 bg-white/80 px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-50 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-primary-900/40">
        ${group}
      </button>
    `,
      )
      .join("");

    container.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.getAttribute("data-group");
        if (this.selectedBloodGroups.includes(group)) {
          this.selectedBloodGroups = this.selectedBloodGroups.filter(
            (item) => item !== group,
          );
        } else {
          this.selectedBloodGroups.push(group);
        }
        this.updateBloodGroupButtons();
        this.persistSharedBloodGroup();
        this.applyFilters();
      });
    });

    this.updateBloodGroupButtons();
  },

  updateBloodGroupButtons() {
    document
      .querySelectorAll("#blood-group-options button")
      .forEach((button) => {
        const group = button.getAttribute("data-group");
        const isActive = this.selectedBloodGroups.includes(group);
        button.classList.toggle("bg-primary-600", isActive);
        button.classList.toggle("text-white", isActive);
        button.classList.toggle("border-primary-600", isActive);
        button.classList.toggle("shadow-md", isActive);
        button.classList.toggle("scale-105", isActive);
      });
  },

  applyPreset(preset) {
    this.resetFilters();
    if (preset === "O-") {
      this.selectedBloodGroups = ["O-"];
    } else if (preset === "AB+") {
      this.selectedBloodGroups = ["AB+"];
    } else if (preset === "available") {
      document.getElementById("availability-filter").value = "available";
    } else if (preset === "high-impact") {
      document.getElementById("donation-count-filter").value = "10";
    } else if (preset === "recent") {
      document.getElementById("last-donation-filter").value = "90";
    } else if (preset === "nearby") {
      document.getElementById("distance-filter").value = "25";
      this.requestLocation();
    }

    this.updateBloodGroupButtons();
    this.persistSharedBloodGroup();
    this.applyFilters();
  },

  applyFilters() {
    const searchTerm =
      document.getElementById("search-input")?.value.toLowerCase().trim() || "";
    const district = document.getElementById("district-filter")?.value || "";
    const availability =
      document.getElementById("availability-filter")?.value || "";
    const lastDonationLimit = Number(
      document.getElementById("last-donation-filter")?.value || 0,
    );
    const donationCountLimit = Number(
      document.getElementById("donation-count-filter")?.value || 0,
    );
    const distanceLimit = Number(
      document.getElementById("distance-filter")?.value || 0,
    );
    const recipientGroup =
      document.getElementById("compatibility-recipient")?.value || "";
    const compatibilityOnly =
      document.getElementById("compatibility-only")?.checked || false;

    const cacheKey = JSON.stringify({
      searchTerm,
      district,
      availability,
      lastDonationLimit,
      donationCountLimit,
      distanceLimit,
      recipientGroup,
      compatibilityOnly,
      selectedBloodGroups: this.selectedBloodGroups,
    });

    if (this.cache.has(cacheKey)) {
      this.filteredDonors = this.cache.get(cacheKey);
      this.currentPage = 1;
      this.updateActiveFilters(
        searchTerm,
        district,
        availability,
        lastDonationLimit,
        donationCountLimit,
        distanceLimit,
        recipientGroup,
        compatibilityOnly,
      );
      this.sortDonors();
      this.renderDonors();
      this.persistState();
      return;
    }

    const start = performance.now();
    this.filteredDonors = this.allDonors.filter((donor) => {
      const matchSearch =
        !searchTerm ||
        donor.name.toLowerCase().includes(searchTerm) ||
        donor.city.toLowerCase().includes(searchTerm) ||
        donor.district.toLowerCase().includes(searchTerm);
      const matchDistrict = !district || donor.district === district;
      const matchAvailability =
        !availability ||
        (availability === "available" && donor.available) ||
        (availability === "unavailable" && !donor.available);
      const matchBlood =
        this.selectedBloodGroups.length === 0 ||
        this.selectedBloodGroups.includes(donor.bloodGroup);
      const lastDonationDate = donor.lastDonation
        ? new Date(donor.lastDonation)
        : null;
      const matchLastDonation =
        !lastDonationLimit ||
        (lastDonationDate &&
          (Date.now() - lastDonationDate.getTime()) / 86400000 <=
            lastDonationLimit);
      const matchDonationCount =
        !donationCountLimit || donor.totalDonations >= donationCountLimit;
      const matchDistance =
        !distanceLimit ||
        !this.location ||
        this.calculateDistance(this.location, donor.city) <= distanceLimit;
      const matchCompatibility =
        !recipientGroup || this.isCompatible(donor.bloodGroup, recipientGroup);
      const matchCompatibilityOnly =
        !compatibilityOnly ||
        this.isCompatible(donor.bloodGroup, recipientGroup || "O+");

      return (
        matchSearch &&
        matchDistrict &&
        matchAvailability &&
        matchBlood &&
        matchLastDonation &&
        matchDonationCount &&
        matchDistance &&
        matchCompatibility &&
        matchCompatibilityOnly
      );
    });

    this.cache.set(cacheKey, [...this.filteredDonors]);
    this.lastAppliedFilters = {
      searchTerm,
      district,
      availability,
      lastDonationLimit,
      donationCountLimit,
      distanceLimit,
      recipientGroup,
      compatibilityOnly,
    };
    this.updateActiveFilters(
      searchTerm,
      district,
      availability,
      lastDonationLimit,
      donationCountLimit,
      distanceLimit,
      recipientGroup,
      compatibilityOnly,
    );
    this.sortDonors();
    this.currentPage = 1;
    this.renderDonors();
    this.persistState();

    const duration = Math.round(performance.now() - start);
    this.performanceLog.push({
      duration,
      count: this.filteredDonors.length,
      timestamp: Date.now(),
    });
    if (this.performanceLog.length > 10) this.performanceLog.shift();
    console.debug(
      "Donor filter performance",
      this.performanceLog[this.performanceLog.length - 1],
    );
  },

  updateActiveFilters(
    searchTerm,
    district,
    availability,
    lastDonationLimit,
    donationCountLimit,
    distanceLimit,
    recipientGroup,
    compatibilityOnly,
  ) {
    const activeFiltersDiv = document.getElementById("active-filters");
    const filterCounter = document.getElementById("filter-counter");
    if (!activeFiltersDiv) return;

    const chips = [];
    let activeCount = 0;

    if (searchTerm) {
      chips.push(`Search: “${searchTerm}”`);
      activeCount++;
    }
    if (this.selectedBloodGroups.length) {
      chips.push(`Groups: ${this.selectedBloodGroups.join(", ")}`);
      activeCount++;
    }
    if (district) {
      chips.push(`District: ${district}`);
      activeCount++;
    }
    if (availability) {
      chips.push(`Availability: ${availability}`);
      activeCount++;
    }
    if (lastDonationLimit) {
      chips.push(`Last donation ≤ ${lastDonationLimit}d`);
      activeCount++;
    }
    if (donationCountLimit) {
      chips.push(`Donations ≥ ${donationCountLimit}`);
      activeCount++;
    }
    if (distanceLimit) {
      chips.push(`Within ${distanceLimit} km`);
      activeCount++;
    }
    if (recipientGroup) {
      chips.push(`Compatible with ${recipientGroup}`);
      activeCount++;
    }
    if (compatibilityOnly) {
      chips.push("Compatible only");
      activeCount++;
    }

    activeFiltersDiv.innerHTML = chips.length
      ? chips
          .map(
            (chip) =>
              `<span class="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/40 dark:text-primary-200">${chip}</span>`,
          )
          .join("")
      : '<span class="text-sm text-gray-400">No active filters</span>';

    if (filterCounter) filterCounter.textContent = `${activeCount} active`;
  },

  resetFilters() {
    const searchInput = document.getElementById("search-input");
    const districtFilter = document.getElementById("district-filter");
    const availabilityFilter = document.getElementById("availability-filter");
    const lastDonationFilter = document.getElementById("last-donation-filter");
    const donationCountFilter = document.getElementById(
      "donation-count-filter",
    );
    const distanceFilter = document.getElementById("distance-filter");
    const compatibilityRecipient = document.getElementById(
      "compatibility-recipient",
    );
    const compatibilityOnly = document.getElementById("compatibility-only");

    if (searchInput) searchInput.value = "";
    if (districtFilter) districtFilter.value = "";
    if (availabilityFilter) availabilityFilter.value = "";
    if (lastDonationFilter) lastDonationFilter.value = "";
    if (donationCountFilter) donationCountFilter.value = "";
    if (distanceFilter) distanceFilter.value = "";
    if (compatibilityRecipient) compatibilityRecipient.value = "";
    if (compatibilityOnly) compatibilityOnly.checked = false;
    this.selectedBloodGroups = [];
    this.persistSharedBloodGroup();
    this.updateBloodGroupButtons();
    this.applyFilters();
    this.showToast("Filters have been reset", "success");
  },

  sortDonors() {
    const sortBy = document.getElementById("sort-by")?.value || "name";

    this.filteredDonors.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "bloodGroup":
          return a.bloodGroup.localeCompare(b.bloodGroup);
        case "bloodGroupDesc":
          return b.bloodGroup.localeCompare(a.bloodGroup);
        case "totalDonations":
          return b.totalDonations - a.totalDonations;
        case "totalDonationsAsc":
          return a.totalDonations - b.totalDonations;
        case "lastDonation":
          return new Date(b.lastDonation) - new Date(a.lastDonation);
        case "lastDonationAsc":
          return new Date(a.lastDonation) - new Date(b.lastDonation);
        case "availability":
          return Number(b.available) - Number(a.available);
        case "distance":
          return this.getDistanceScore(a) - this.getDistanceScore(b);
        default:
          return 0;
      }
    });
  },

  renderDonors() {
    const donorsGrid = document.getElementById("donors-grid");
    const loadingState = document.getElementById("loading-state");
    const emptyState = document.getElementById("empty-state");
    const resultsCount = document.getElementById("results-count");
    const resultsSummary = document.getElementById("results-summary");
    const pagination = document.getElementById("pagination");

    if (!donorsGrid) return;

    if (loadingState) loadingState.classList.add("hidden");
    if (resultsCount) resultsCount.textContent = this.filteredDonors.length;
    if (resultsSummary)
      resultsSummary.textContent = this.filteredDonors.length
        ? `Filtered from ${this.allDonors.length}`
        : "Try a different set of filters";

    if (this.filteredDonors.length === 0) {
      donorsGrid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      if (pagination) pagination.innerHTML = "";
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    const totalPages = Math.ceil(
      this.filteredDonors.length / this.donorsPerPage,
    );
    const startIndex = (this.currentPage - 1) * this.donorsPerPage;
    const endIndex = startIndex + this.donorsPerPage;
    const pageDonors = this.filteredDonors.slice(startIndex, endIndex);

    donorsGrid.className =
      this.currentView === "list"
        ? "space-y-3 mb-8"
        : "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8";

    donorsGrid.innerHTML = pageDonors
      .map((donor) => this.createDonorCard(donor))
      .join("");
    this.renderPagination(totalPages);

    document.querySelectorAll(".view-donor-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const donorId = parseInt(
          e.target.closest("button").getAttribute("data-id"),
        );
        const donor = this.allDonors.find((d) => d.id === donorId);
        if (donor) this.showDonorDetails(donor);
      });
    });
  },

  createDonorCard(donor) {
    const bloodColors = {
      "A+": "bg-red-500",
      "A-": "bg-red-600",
      "B+": "bg-blue-500",
      "B-": "bg-blue-600",
      "AB+": "bg-purple-500",
      "AB-": "bg-purple-600",
      "O+": "bg-green-500",
      "O-": "bg-green-600",
    };

    const bloodColor = bloodColors[donor.bloodGroup] || "bg-primary-600";
    const isUniversalDonor = donor.bloodGroup === "O-";
    const isUniversalRecipient = donor.bloodGroup === "AB+";
    const badgeMarkup = `${isUniversalDonor ? '<span class="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Universal donor</span>' : ""}${isUniversalRecipient ? '<span class="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">Universal recipient</span>' : ""}`;

    if (this.currentView === "list") {
      return `
      <div class="donor-card flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="${bloodColor} flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white">${donor.bloodGroup}</div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${this.escapeHtml(donor.name)}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">${this.escapeHtml(donor.city)}, ${this.escapeHtml(donor.district)}</p>
            </div>
          </div>
          <div class="flex flex-wrap justify-end gap-2">
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${donor.available ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}">${donor.available ? "Available" : "Unavailable"}</span>
            ${badgeMarkup}
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Last donation: ${this.formatDate(donor.lastDonation)}</span>
          <span>Donations: ${donor.totalDonations}</span>
          <span>${this.getDistanceLabel(donor)}</span>
        </div>
        <div class="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400">${this.escapeHtml(donor.phone)}</div>
          <button class="view-donor-btn rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700" data-id="${donor.id}">View Details</button>
        </div>
      </div>`;
    }

    return `
      <div class="donor-card overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-2xl dark:bg-gray-800">
        <div class="p-6">
          <div class="mb-4 flex items-center space-x-4">
            <div class="${bloodColor} flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full">
              <span class="text-xl font-bold text-white">${donor.bloodGroup}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${this.escapeHtml(donor.name)}</h3>
                ${badgeMarkup}
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">${this.escapeHtml(donor.city)}, ${this.escapeHtml(donor.district)}</p>
            </div>
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${donor.available ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}">${donor.available ? "Available" : "Unavailable"}</span>
          </div>
          <div class="mb-4 space-y-2">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400"><svg class="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span class="truncate">${this.escapeHtml(donor.phone)}</span></div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400"><svg class="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span class="truncate">${this.escapeHtml(donor.email)}</span></div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400"><svg class="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Last donation: ${this.formatDate(donor.lastDonation)}</span></div>
          </div>
          <div class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div class="text-sm"><span class="text-gray-500 dark:text-gray-400">Donations: </span><span class="font-semibold text-primary-600 dark:text-primary-400">${donor.totalDonations}</span></div>
            <button class="view-donor-btn rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700" data-id="${donor.id}">View Details</button>
          </div>
        </div>
      </div>`;
  },

  renderStats() {
    const container = document.getElementById("stats-cards");
    if (!container) return;

    if (!this.allDonors.length) {
      container.innerHTML = "";
      return;
    }

    const availableDonors = this.allDonors.filter(
      (donor) => donor.available,
    ).length;
    const universalDonors = this.allDonors.filter(
      (donor) => donor.bloodGroup === "O-",
    ).length;
    const universalRecipients = this.allDonors.filter(
      (donor) => donor.bloodGroup === "AB+",
    ).length;
    const averageDonations = Math.round(
      this.allDonors.reduce((sum, donor) => sum + donor.totalDonations, 0) /
        this.allDonors.length,
    );

    container.innerHTML = [
      {
        label: "Available now",
        value: availableDonors,
        tone: "text-emerald-700 dark:text-emerald-300",
      },
      {
        label: "Universal donors",
        value: universalDonors,
        tone: "text-sky-700 dark:text-sky-300",
      },
      {
        label: "Universal recipients",
        value: universalRecipients,
        tone: "text-violet-700 dark:text-violet-300",
      },
      {
        label: "Avg. donations",
        value: averageDonations,
        tone: "text-amber-700 dark:text-amber-300",
      },
    ]
      .map(
        (card) => `
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-semibold ${card.tone}">${card.label}</p>
        <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">${card.value}</p>
      </div>
    `,
      )
      .join("");
  },

  requestLocation() {
    if (!navigator.geolocation) {
      this.showToast("Geolocation is not supported in this browser", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        this.showToast("Location enabled for nearby matching", "success");
        this.applyFilters();
      },
      () => {
        this.showToast("Location access was denied", "error");
      },
    );
  },

  calculateDistance(location, city) {
    if (!location || !city) return Number.MAX_SAFE_INTEGER;
    const cityLookup = {
      "New York": { lat: 40.7128, lon: -74.006 },
      "Los Angeles": { lat: 34.0522, lon: -118.2437 },
      Chicago: { lat: 41.8781, lon: -87.6298 },
      Houston: { lat: 29.7604, lon: -95.3698 },
      Phoenix: { lat: 33.4484, lon: -112.074 },
      Manhattan: { lat: 40.7831, lon: -73.9712 },
      Hollywood: { lat: 34.0983, lon: -118.326 },
      Loop: { lat: 41.885, lon: -87.624 },
      Downtown: { lat: 29.7604, lon: -95.3698 },
      Midtown: { lat: 33.4484, lon: -112.074 },
    };
    const target = cityLookup[city];
    if (!target) return Number.MAX_SAFE_INTEGER;
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(target.lat - location.lat);
    const dLon = toRad(target.lon - location.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(location.lat)) *
        Math.cos(toRad(target.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
  },

  isCompatible(donorGroup, recipientGroup) {
    const compatibilityMap = {
      "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      "O+": ["O+", "A+", "B+", "AB+"],
      "A-": ["A-", "A+", "AB-", "AB+"],
      "A+": ["A+", "AB+"],
      "B-": ["B-", "B+", "AB-", "AB+"],
      "B+": ["B+", "AB+"],
      "AB-": ["AB-", "AB+"],
      "AB+": ["AB+"],
    };
    return (
      !recipientGroup ||
      compatibilityMap[donorGroup]?.includes(recipientGroup) ||
      false
    );
  },

  getDistanceLabel(donor) {
    if (!this.location) return "Location unavailable";
    const distance = this.calculateDistance(this.location, donor.city);
    return distance === Number.MAX_SAFE_INTEGER
      ? "Location unavailable"
      : `${distance.toFixed(0)} km away`;
  },

  getDistanceScore(donor) {
    if (!this.location) return Number.MAX_SAFE_INTEGER;
    return this.calculateDistance(this.location, donor.city);
  },

  persistState() {
    const state = {
      view: this.currentView,
      sortBy: document.getElementById("sort-by")?.value || "name",
      searchTerm: document.getElementById("search-input")?.value || "",
      district: document.getElementById("district-filter")?.value || "",
      availability: document.getElementById("availability-filter")?.value || "",
      selectedBloodGroups: this.selectedBloodGroups,
      lastDonationLimit:
        document.getElementById("last-donation-filter")?.value || "",
      donationCountLimit:
        document.getElementById("donation-count-filter")?.value || "",
      distanceLimit: document.getElementById("distance-filter")?.value || "",
      recipientGroup:
        document.getElementById("compatibility-recipient")?.value || "",
      compatibilityOnly:
        document.getElementById("compatibility-only")?.checked || false,
    };
    localStorage.setItem("donorPageState", JSON.stringify(state));
  },

  getSharedBloodGroup() {
    try {
      return JSON.parse(localStorage.getItem("bloodDonationSelection") || "{}")
        .bloodGroup || "";
    } catch {
      return "";
    }
  },

  syncSharedBloodGroup() {
    const bloodGroup = this.getSharedBloodGroup();
    if (!bloodGroup) return;

    this.selectedBloodGroups = [bloodGroup];
    this.updateBloodGroupButtons();
  },

  persistSharedBloodGroup() {
    if (this.selectedBloodGroups.length === 1) {
      localStorage.setItem(
        "bloodDonationSelection",
        JSON.stringify({ bloodGroup: this.selectedBloodGroups[0] }),
      );
    } else {
      localStorage.removeItem("bloodDonationSelection");
    }
  },

  initSharedBloodGroupListener() {
    window.addEventListener("storage", (event) => {
      if (event.key !== "bloodDonationSelection") return;

      const bloodGroup = this.getSharedBloodGroup();
      this.selectedBloodGroups = bloodGroup ? [bloodGroup] : [];
      this.updateBloodGroupButtons();
      this.applyFilters();
    });
  },

  restoreFilters() {
    try {
      const state = JSON.parse(localStorage.getItem("donorPageState") || "{}");
      if (!state) return;
      if (state.searchTerm)
        document.getElementById("search-input").value = state.searchTerm;
      if (state.district)
        document.getElementById("district-filter").value = state.district;
      if (state.availability)
        document.getElementById("availability-filter").value =
          state.availability;
      if (state.sortBy) document.getElementById("sort-by").value = state.sortBy;
      if (state.lastDonationLimit)
        document.getElementById("last-donation-filter").value =
          state.lastDonationLimit;
      if (state.donationCountLimit)
        document.getElementById("donation-count-filter").value =
          state.donationCountLimit;
      if (state.distanceLimit)
        document.getElementById("distance-filter").value = state.distanceLimit;
      if (state.recipientGroup)
        document.getElementById("compatibility-recipient").value =
          state.recipientGroup;
      if (state.compatibilityOnly)
        document.getElementById("compatibility-only").checked = true;
      this.selectedBloodGroups = state.selectedBloodGroups || [];
      this.currentView = state.view || "grid";
      this.updateBloodGroupButtons();
      const viewGridBtn = document.getElementById("view-grid-btn");
      const viewListBtn = document.getElementById("view-list-btn");
      if (this.currentView === "list") {
        viewListBtn?.classList.add("bg-primary-600", "text-white");
        viewGridBtn?.classList.remove("bg-primary-600", "text-white");
      } else {
        viewGridBtn?.classList.add("bg-primary-600", "text-white");
        viewListBtn?.classList.remove("bg-primary-600", "text-white");
      }
    } catch (error) {
      console.error("Failed to restore donor filter state", error);
    }
  },

  showDonorDetails(donor) {
    const modal = document.getElementById("donor-modal");
    const modalContent = document.getElementById("modal-content");

    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
            <div class="text-center mb-6">
                <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-3xl font-bold text-white">${donor.bloodGroup}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">${this.escapeHtml(donor.name)}</h3>
                <p class="text-gray-500 dark:text-gray-400">${this.escapeHtml(donor.city)}, ${this.escapeHtml(donor.district)}</p>
            </div>
            
            <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Phone</span>
                    <a href="tel:${donor.phone}" class="text-primary-600 hover:text-primary-700 font-medium">${this.escapeHtml(donor.phone)}</a>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Email</span>
                    <a href="mailto:${donor.email}" class="text-primary-600 hover:text-primary-700 font-medium">${this.escapeHtml(donor.email)}</a>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Status</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donor.available ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}">${donor.available ? "Available" : "Unavailable"}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Last Donation</span>
                    <span class="font-medium text-gray-900 dark:text-white">${this.formatDate(donor.lastDonation)}</span>
                </div>
                <div class="flex items-center justify-between py-2">
                    <span class="text-gray-600 dark:text-gray-400">Total Donations</span>
                    <span class="font-bold text-primary-600 dark:text-primary-400">${donor.totalDonations}</span>
                </div>
            </div>
            
            <div class="mt-6 flex space-x-3">
                <a href="tel:${donor.phone}" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-center font-medium transition-colors">
                    Call Now
                </a>
                <button onclick="document.getElementById('donor-modal').classList.add('hidden')" class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Close
                </button>
            </div>
        `;

    modal.classList.remove("hidden");
  },

  formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  showToast(message, type = "success") {
    if (typeof Toast !== "undefined") {
      Toast.show(message, type);
      return;
    }

    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  },

  escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  renderPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination || totalPages <= 1) {
      if (pagination) pagination.innerHTML = "";
      return;
    }

    let html = "";

    html += `
      <button 
        onclick="DonorPage.changePage(${this.currentPage - 1})"
        ${this.currentPage === 1 ? "disabled" : ""}
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        html += `
          <button 
            onclick="DonorPage.changePage(${i})"
            class="w-10 h-10 rounded-lg ${
              i === this.currentPage
                ? "bg-primary-600 text-white"
                : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            } transition-colors"
          >
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += '<span class="px-2 text-gray-400">...</span>';
      }
    }

    html += `
      <button 
        onclick="DonorPage.changePage(${this.currentPage + 1})"
        ${this.currentPage === totalPages ? "disabled" : ""}
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    `;

    pagination.innerHTML = html;
  },

  changePage(page) {
    const totalPages = Math.ceil(
      this.filteredDonors.length / this.donorsPerPage,
    );
    if (page < 1 || page > totalPages) return;

    this.currentPage = page;
    this.renderDonors();
    document
      .getElementById("donors-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  DonorPage.init();
});
