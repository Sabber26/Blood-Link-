// Language Module
const Language = {
  currentLang: "bn",

  translations: {
    en: {
      // Navigation
      nav_home: "Home",
      nav_about: "About",
      nav_donors: "Donors",
      nav_request: "Request Blood",
      nav_contact: "Contact",
      nav_login: "Login",
      nav_register: "Register",

      // Emergency Banner
      emergency_title:
        "🚨 Emergency Blood Needed: O-Negative donors urgently required in City Hospital",
      emergency_button: "Request Blood",

      // Hero Section
      hero_title: "Donate Blood,",
      hero_highlight: "Save Lives",
      hero_description:
        "Your single donation can save up to three lives. Join our community of heroes and make a difference today.",
      hero_donor_btn: "Become a Donor",
      hero_find_btn: "Find a Donor",
      hero_donors: "Donors",
      hero_lives: "Lives Saved",
      hero_cities: "Cities",

      // Statistics
      stats_donors: "Registered Donors",
      stats_donations: "Successful Donations",
      stats_cities: "Cities Covered",
      stats_satisfaction: "Satisfaction Rate %",

      // How It Works
      how_title: "How It",
      how_highlight: "Works",
      step1_title: "Register",
      step1_desc:
        "Create your donor profile with basic information and medical history.",
      step2_title: "Get Verified",
      step2_desc:
        "Complete health screening and eligibility verification process.",
      step3_title: "Donate",
      step3_desc: "Donate blood at your nearest center when called upon.",
      step4_title: "Save Lives",
      step4_desc: "Your donation can save up to three lives. Become a hero!",

      // Compatibility Checker
      compat_title: "Blood Compatibility",
      compat_highlight: "Checker",
      compat_recipient: "Recipient Blood Group",
      compat_donor: "Donor Blood Group",
      compat_select: "Select Blood Group",
      compat_check_btn: "Check Compatibility",
      compat_compatible: "Compatible!",
      compat_not_compatible: "Not Compatible",
      compat_msg_compatible: "Donor blood group",
      compat_msg_can_donate: "can safely donate to recipient with",
      compat_msg_blood_group: "blood group.",
      compat_msg_cannot: "cannot donate to recipient with",

      // Featured Donors
      featured_title: "Featured",
      featured_highlight: "Donors",
      donor_available: "Available",
      donor_last_donated: "Last Donated:",

      // Testimonials
      testimonials_title: "What People",
      testimonials_highlight: "Say",
      testimonial1_text:
        '"This platform helped me find a donor for my father during an emergency. Forever grateful!"',
      testimonial1_name: "Sarah Wilson",
      testimonial1_role: "Recipient's Daughter",
      testimonial2_text:
        '"Regular donor for 5 years now. The reminder system helps me stay consistent with donations."',
      testimonial2_name: "David Chen",
      testimonial2_role: "Regular Donor",
      testimonial3_text:
        '"The blood compatibility checker is so helpful. It educated me about blood groups and compatibility."',
      testimonial3_name: "Emily Rodriguez",
      testimonial3_role: "Medical Student",

      // FAQ
      faq_title: "Frequently Asked",
      faq_highlight: "Questions",
      faq1_q: "Who can donate blood?",
      faq1_a:
        "Anyone between 18-65 years, weighing at least 50kg, and in good health can donate blood. You must not have any infectious diseases and should not be on certain medications.",
      faq2_q: "How often can I donate blood?",
      faq2_a:
        "Men can donate every 3 months, while women can donate every 4 months. This allows your body to replenish the donated blood cells.",
      faq3_q: "Is blood donation painful?",
      faq3_a:
        "There is minimal pain during the needle insertion, similar to a blood test. The actual donation takes about 10-15 minutes and is generally not painful.",

      // CTA
      cta_title: "Ready to Save Lives?",
      cta_desc: "Join thousands of donors making a difference every day.",
      cta_register: "Register Now",
      cta_learn: "Learn More",

      // Footer
      footer_desc:
        "Saving lives through blood donation since 2020. Your donation matters.",
      footer_quick: "Quick Links",
      footer_about: "About Us",
      footer_find: "Find Donors",
      footer_contact: "Contact",
      footer_info: "Contact Info",
      footer_follow: "Follow Us",
      footer_rights:
        "© 2024 BloodDonate. All rights reserved. Made with ❤️ for humanity.",

      // Language Switcher
      lang_en: "English",
      lang_bn: "বাংলা",

      // Forms
      form_name: "Full Name",
      form_email: "Email Address",
      form_phone: "Phone Number",
      form_blood_group: "Blood Group",
      form_district: "District",
      form_city: "City",
      form_password: "Password",
      form_confirm_password: "Confirm Password",
      form_submit: "Submit",
      form_reset: "Reset",

      // Messages
      loading: "Loading...",
      no_donors: "No donors found matching your criteria",
      contact_donor: "Contact",
      back_to_top: "Back to top",
      dark_mode: "Toggle dark mode",
      menu_open: "Open menu",
    },

    bn: {
      // Navigation
      nav_home: "হোম",
      nav_about: "সম্পর্কে",
      nav_donors: "রক্তদাতা",
      nav_request: "রক্তের অনুরোধ",
      nav_contact: "যোগাযোগ",
      nav_login: "লগইন",
      nav_register: "রেজিস্টার",

      // Emergency Banner
      emergency_title:
        "🚨 জরুরি রক্ত প্রয়োজন: সিটি হাসপাতালে ও-নেগেটিভ রক্তদাতা জরুরিভাবে প্রয়োজন",
      emergency_button: "রক্তের অনুরোধ",

      // Hero Section
      hero_title: "রক্ত দান করুন,",
      hero_highlight: "জীবন বাঁচান",
      hero_description:
        "আপনার একটি রক্তদান তিনটি জীবন বাঁচাতে পারে। আমাদের বীরদের সম্প্রদায়ে যোগ দিন এবং আজই পরিবর্তন আনুন।",
      hero_donor_btn: "রক্তদাতা হন",
      hero_find_btn: "রক্তদাতা খুঁজুন",
      hero_donors: "রক্তদাতা",
      hero_lives: "জীবন বাঁচানো",
      hero_cities: "শহর",

      // Statistics
      stats_donors: "নিবন্ধিত রক্তদাতা",
      stats_donations: "সফল রক্তদান",
      stats_cities: "অন্তর্ভুক্ত শহর",
      stats_satisfaction: "সন্তুষ্টির হার %",

      // How It Works
      how_title: "কিভাবে এটি",
      how_highlight: "কাজ করে",
      step1_title: "রেজিস্টার",
      step1_desc:
        "মৌলিক তথ্য এবং চিকিৎসা ইতিহাস সহ আপনার রক্তদাতা প্রোফাইল তৈরি করুন।",
      step2_title: "যাচাইকরণ",
      step2_desc:
        "স্বাস্থ্য পরীক্ষা এবং যোগ্যতা যাচাই প্রক্রিয়া সম্পূর্ণ করুন।",
      step3_title: "রক্তদান",
      step3_desc: "ডাকা হলে আপনার নিকটস্থ কেন্দ্রে রক্তদান করুন।",
      step4_title: "জীবন বাঁচান",
      step4_desc: "আপনার রক্তদান তিনটি জীবন বাঁচাতে পারে। একজন বীর হন!",

      // Compatibility Checker
      compat_title: "রক্তের সামঞ্জস্যতা",
      compat_highlight: "পরীক্ষক",
      compat_recipient: "গ্রহীতার রক্তের গ্রুপ",
      compat_donor: "রক্তদাতার রক্তের গ্রুপ",
      compat_select: "রক্তের গ্রুপ নির্বাচন করুন",
      compat_check_btn: "সামঞ্জস্যতা পরীক্ষা করুন",
      compat_compatible: "সামঞ্জস্যপূর্ণ!",
      compat_not_compatible: "সামঞ্জস্যপূর্ণ নয়",
      compat_msg_compatible: "রক্তদাতার রক্তের গ্রুপ",
      compat_msg_can_donate: "গ্রহীতাকে নিরাপদে রক্তদান করতে পারে",
      compat_msg_blood_group: "রক্তের গ্রুপের।",
      compat_msg_cannot: "গ্রহীতাকে রক্তদান করতে পারে না",

      // Featured Donors
      featured_title: "বিশেষ",
      featured_highlight: "রক্তদাতা",
      donor_available: "উপলব্ধ",
      donor_last_donated: "শেষ রক্তদান:",

      // Testimonials
      testimonials_title: "মানুষ যা",
      testimonials_highlight: "বলে",
      testimonial1_text:
        '"এই প্ল্যাটফর্মটি জরুরি অবস্থায় আমার বাবার জন্য রক্তদাতা খুঁজে পেতে সাহায্য করেছে। চিরকৃতজ্ঞ!"',
      testimonial1_name: "সারাহ উইলসন",
      testimonial1_role: "গ্রহীতার কন্যা",
      testimonial2_text:
        '"৫ বছর ধরে নিয়মিত রক্তদাতা। রিমাইন্ডার সিস্টেম আমাকে নিয়মিত রক্তদানে সহায়তা করে।"',
      testimonial2_name: "ডেভিড চেন",
      testimonial2_role: "নিয়মিত রক্তদাতা",
      testimonial3_text:
        '"রক্তের সামঞ্জস্যতা পরীক্ষক খুবই সহায়ক। এটি আমাকে রক্তের গ্রুপ এবং সামঞ্জস্যতা সম্পর্কে শিক্ষিত করেছে।"',
      testimonial3_name: "এমিলি রদ্রিগেজ",
      testimonial3_role: "মেডিকেল শিক্ষার্থী",

      // FAQ
      faq_title: "সচরাচর জিজ্ঞাসিত",
      faq_highlight: "প্রশ্নাবলী",
      faq1_q: "কে রক্তদান করতে পারেন?",
      faq1_a:
        "১৮-৬৫ বছর বয়সী, কমপক্ষে ৫০ কেজি ওজনের এবং সুস্থ যে কেউ রক্তদান করতে পারেন। আপনার কোনো সংক্রামক রোগ থাকা যাবে না এবং নির্দিষ্ট ওষুধ সেবন করা যাবে না।",
      faq2_q: "কত ঘন ঘন রক্তদান করা যায়?",
      faq2_a:
        "পুরুষরা প্রতি ৩ মাসে এবং মহিলারা প্রতি ৪ মাসে রক্তদান করতে পারেন। এটি আপনার শরীরকে দান করা রক্তকণিকা পুনরায় পূরণ করতে সময় দেয়।",
      faq3_q: "রক্তদান কি বেদনাদায়ক?",
      faq3_a:
        "সূঁচ প্রবেশের সময় ন্যূনতম ব্যথা হয়, রক্ত পরীক্ষার মতোই। আসল রক্তদানে প্রায় ১০-১৫ মিনিট সময় লাগে এবং সাধারণত বেদনাদায়ক নয়।",

      // CTA
      cta_title: "জীবন বাঁচাতে প্রস্তুত?",
      cta_desc:
        "প্রতিদিন হাজার হাজার রক্তদাতার সাথে যোগ দিন যারা পরিবর্তন আনছেন।",
      cta_register: "এখনই রেজিস্টার",
      cta_learn: "আরও জানুন",

      // Footer
      footer_desc:
        "২০২০ সাল থেকে রক্তদানের মাধ্যমে জীবন বাঁচানো। আপনার রক্তদান গুরুত্বপূর্ণ।",
      footer_quick: "দ্রুত লিঙ্ক",
      footer_about: "আমাদের সম্পর্কে",
      footer_find: "রক্তদাতা খুঁজুন",
      footer_contact: "যোগাযোগ",
      footer_info: "যোগাযোগের তথ্য",
      footer_follow: "আমাদের অনুসরণ করুন",
      footer_rights:
        "© ২০২৪ ব্লাডডোনেট। সর্বস্বত্ব সংরক্ষিত। মানবতার জন্য ❤️ দিয়ে তৈরি।",

      // Language Switcher
      lang_en: "English",
      lang_bn: "বাংলা",

      // Forms
      form_name: "পূর্ণ নাম",
      form_email: "ইমেইল ঠিকানা",
      form_phone: "ফোন নম্বর",
      form_blood_group: "রক্তের গ্রুপ",
      form_district: "জেলা",
      form_city: "শহর",
      form_password: "পাসওয়ার্ড",
      form_confirm_password: "পাসওয়ার্ড নিশ্চিত করুন",
      form_submit: "জমা দিন",
      form_reset: "রিসেট",

      // Messages
      loading: "লোড হচ্ছে...",
      no_donors: "আপনার মানদণ্ডের সাথে মিলে যাওয়া কোনো রক্তদাতা পাওয়া যায়নি",
      contact_donor: "যোগাযোগ",
      back_to_top: "উপরে ফিরে যান",
      dark_mode: "ডার্ক মোড টগল করুন",
      menu_open: "মেনু খুলুন",
    },
  },

  init() {
    // Load saved language preference
    const savedLang = localStorage.getItem("language") || "bn";
    // suppress toast on initial load
    this.setLanguage(savedLang, true);

    // Apply translations to current page
    this.translatePage();
  },

  setLanguage(lang, suppressToast = false) {
    this.currentLang = lang;
    localStorage.setItem("language", lang);

    // Update current language indicator
    const langLabel = document.getElementById("current-lang-label");
    if (langLabel) {
      langLabel.textContent = lang === "bn" ? "BN" : "EN";
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Add Bangla font if needed
    if (lang === "bn") {
      this.addBanglaFont();
      document.body.style.fontFamily =
        "'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }

    // Translate the page
    this.translatePage();

    // Close dropdown
    document.getElementById("lang-options")?.classList.add("hidden");
    // Show a subtle, non-blocking toast when language changes (unless suppressed)
    if (!suppressToast) {
      this.showLanguageToast(
        lang === "bn"
          ? "ভাষা বাংলায় পরিবর্তন করা হয়েছে"
          : "Language changed to English",
      );
    }
  },

  showLanguageToast(message) {
    try {
      let toast = document.getElementById("lang-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "lang-toast";
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.zIndex = "10001";
        toast.style.padding = "8px 12px";
        toast.style.background = "rgba(0,0,0,0.7)";
        toast.style.color = "white";
        toast.style.borderRadius = "8px";
        toast.style.fontSize = "13px";
        toast.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
        toast.style.transition =
          "opacity 250ms ease-in-out, transform 250ms ease-in-out";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-6px)";
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      // show
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      });
      // hide after 2s
      clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-6px)";
      }, 2000);
    } catch (e) {
      // silent fail
      console.error(e);
    }
  },

  addBanglaFont() {
    if (!document.getElementById("bangla-font")) {
      const link = document.createElement("link");
      link.id = "bangla-font";
      link.href =
        "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  },

  translate(key) {
    return this.translations[this.currentLang]?.[key] || key;
  },

  translatePage() {
    // Translate all elements with data-lang attribute
    document.querySelectorAll("[data-lang]").forEach((element) => {
      const key = element.getAttribute("data-lang");
      const translation = this.translate(key);

      // Skip if translation not found
      if (!translation || translation === key) return;

      // Handle different element types
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (element.type === "submit" || element.type === "button") {
          element.value = translation;
        } else {
          element.placeholder = translation;
        }
      } else if (element.tagName === "SELECT") {
        // Update only the first option (placeholder)
        const firstOption = element.querySelector("option:first-child");
        if (firstOption && firstOption.hasAttribute("data-lang")) {
          firstOption.textContent = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Update page title based on language
    const pageTitle =
      this.currentLang === "bn"
        ? "ব্লাডডোনেট - জীবন বাঁচান, আজই রক্তদান করুন"
        : "BloodDonate - Save Lives, Donate Blood Today";
    document.title = pageTitle;

    // Trigger custom event for dynamic content
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { lang: this.currentLang },
      }),
    );
  },
};

// Export for use in other modules
window.Language = Language;
