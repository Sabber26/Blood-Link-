// Donate Blood Page Module
const DonatePage = {
    // State
    currentCenter: null,
    selectedDate: null,
    selectedTime: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    donationHistory: [],
    centers: [],
    bookings: [],
    
    // Initialize
    init() {
        this.handleLoading();
        this.initMobileMenu();
        this.initDarkMode();
        this.initLanguage();
        this.loadData();
        this.initEligibilityChecker();
        this.initCenterSearch();
        this.initBooking();
        this.initDonationHistory();
        this.initQuickStats();
        this.initEmergencyDonate();
    },
    
    // Loading Screen
    handleLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 500);
        });
    },
    
    // Mobile Menu (shared from app.js pattern)
    initMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!menuButton || !mobileMenu) return;
        
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    },
    
    // Dark Mode
    initDarkMode() {
        if (typeof DarkMode !== 'undefined') {
            DarkMode.init();
        }
    },
    
    // Language
    initLanguage() {
        if (typeof Language !== 'undefined') {
            Language.init();
        }
        
        // Language switcher
        const langToggleBtn = document.getElementById('lang-toggle-btn');
        const langOptions = document.getElementById('lang-options');
        
        if (langToggleBtn && langOptions) {
            langToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langOptions.classList.toggle('hidden');
            });
            
            document.addEventListener('click', (e) => {
                if (!langToggleBtn.contains(e.target) && !langOptions.contains(e.target)) {
                    langOptions.classList.add('hidden');
                }
            });
        }
    },
    
    // Global language switch
    switchLanguage(lang) {
        if (typeof Language !== 'undefined' && Language.setLanguage) {
            Language.setLanguage(lang);
        }
        document.getElementById('lang-options')?.classList.add('hidden');
    },
    
    // Load Data
    loadData() {
        // Load donation centers
        this.loadCenters();
        
        // Load donation history from localStorage
        this.loadDonationHistory();
        
        // Load bookings from localStorage
        this.loadBookings();
    },
    
    async loadCenters() {
        try {
            const response = await fetch('data/centers.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`Unable to load centers (${response.status})`);

            const centers = await response.json();
            if (!Array.isArray(centers)) throw new Error('Invalid centers data');

            this.centers = centers;
            this.filterCenters();
            this.updateQuickStats();
            return;
        } catch (error) {
            console.warn('Using built-in center fallback:', error);
        }

        // Sample centers data
        this.centers = [
            {
                id: 1,
                name: "City Hospital Blood Bank",
                type: "hospital",
                address: "123 Main Street, Dhaka",
                distance: "1.2 km",
                rating: 4.8,
                phone: "+880 1234-567890",
                hours: "8:00 AM - 8:00 PM",
                available: true,
                bloodTypes: ["A+", "A-", "B+", "O+", "O-"],
                image: "🏥"
            },
            {
                id: 2,
                name: "Red Cross Blood Center",
                type: "blood-bank",
                address: "45 Liberty Road, Dhaka",
                distance: "3.5 km",
                rating: 4.9,
                phone: "+880 1234-567891",
                hours: "9:00 AM - 9:00 PM",
                available: true,
                bloodTypes: ["A+", "B+", "AB+", "O+"],
                image: "🩸"
            },
            {
                id: 3,
                name: "Dhaka Medical Clinic",
                type: "clinic",
                address: "78 Green Avenue, Dhaka",
                distance: "5.0 km",
                rating: 4.6,
                phone: "+880 1234-567892",
                hours: "10:00 AM - 6:00 PM",
                available: true,
                bloodTypes: ["A-", "B-", "AB-", "O-"],
                image: "🏪"
            },
            {
                id: 4,
                name: "Mobile Blood Donation Unit",
                type: "mobile",
                address: "Gulshan Circle 2, Dhaka",
                distance: "7.2 km",
                rating: 4.7,
                phone: "+880 1234-567893",
                hours: "10:00 AM - 4:00 PM",
                available: false,
                bloodTypes: ["O+", "O-", "A+"],
                image: "🚐"
            },
            {
                id: 5,
                name: "National Heart Foundation",
                type: "hospital",
                address: "56 Hospital Road, Dhaka",
                distance: "2.8 km",
                rating: 4.9,
                phone: "+880 1234-567894",
                hours: "7:00 AM - 10:00 PM",
                available: true,
                bloodTypes: ["A+", "B+", "AB+", "O+", "O-"],
                image: "🏥"
            },
            {
                id: 6,
                name: "Blood Donation Center - Mirpur",
                type: "blood-bank",
                address: "12 Mirpur Road, Dhaka",
                distance: "8.5 km",
                rating: 4.5,
                phone: "+880 1234-567895",
                hours: "9:00 AM - 7:00 PM",
                available: true,
                bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "O+"],
                image: "🩸"
            }
        ];
        
        this.filterCenters();
        this.updateQuickStats();
    },
    
    renderCenters(centers) {
        const grid = document.getElementById('centers-grid');
        if (!grid) return;
        
        if (centers.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400 text-lg">No centers found matching your criteria</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = centers.map(center => this.createCenterCard(center)).join('');
        
        // Add click events to center cards
        grid.querySelectorAll('.center-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                const center = this.centers.find(c => c.id === id);
                if (center) this.selectCenter(center);
            });
        });
    },
    
    createCenterCard(center) {
        const ratingStars = this.getRatingStars(center.rating);
        const statusColor = center.available ? 'text-green-600' : 'text-yellow-600';
        const statusText = center.available ? 'Open' : 'Closed';
        
        return `
            <div class="center-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center space-x-3">
                            <span class="text-3xl">${center.image}</span>
                            <div>
                                <h4 class="font-semibold text-gray-900 dark:text-white">${center.name}</h4>
                                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">${this.getCenterTypeLabel(center.type)}</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-1">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">${center.rating}</span>
                            <span class="text-yellow-400 text-sm">${ratingStars}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center space-x-2">
                            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>${center.address}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>${center.hours}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            <span>${center.phone}</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-1 mt-3">
                        ${center.bloodTypes.map(type => `<span class="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">${type}</span>`).join('')}
                    </div>
                    
                    <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div>
                            <span class="text-xs font-medium ${statusColor}">● ${statusText}</span>
                            <span class="text-xs text-gray-400 ml-2">${center.distance} away</span>
                        </div>
                        <button class="center-select-btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors" data-id="${center.id}">
                            Select
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (halfStar) {
            stars += '☆';
        }
        return stars || '☆';
    },
    
    getCenterTypeLabel(type) {
        const labels = {
            'hospital': 'Hospital',
            'clinic': 'Clinic',
            'blood-bank': 'Blood Bank',
            'mobile': 'Mobile Unit'
        };
        return labels[type] || type;
    },
    
    // Center Search & Filter
    initCenterSearch() {
        const searchInput = document.getElementById('center-search');
        const filterSelect = document.getElementById('center-filter');
        const bloodFilter = document.getElementById('center-blood-filter');
        const quickBtns = document.querySelectorAll('.center-quick-btn');

        const savedSelection = this.getSharedBloodGroup();
        if (bloodFilter && savedSelection) bloodFilter.value = savedSelection;
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCenters());
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.updateQuickFilterButtons();
                this.filterCenters();
            });
        }

        if (bloodFilter) {
            bloodFilter.addEventListener('change', () => {
                this.saveSharedBloodGroup(bloodFilter.value);
                this.filterCenters();
            });
        }
        
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                const filterSelect = document.getElementById('center-filter');
                if (filterSelect) {
                    filterSelect.value = filterSelect.value === type ? 'all' : type;
                    this.updateQuickFilterButtons();
                    this.filterCenters();
                }
            });
        });

        this.updateQuickFilterButtons();

        window.addEventListener('storage', (event) => {
            if (event.key !== 'bloodDonationSelection' || !bloodFilter) return;
            bloodFilter.value = this.getSharedBloodGroup();
            this.filterCenters();
        });
        
        // Map toggle
        const toggleMap = document.getElementById('toggle-map');
        if (toggleMap) {
            toggleMap.addEventListener('click', () => {
                App.showToast('Map view coming soon!', 'success');
            });
        }
    },
    
    filterCenters() {
        const searchTerm = document.getElementById('center-search')?.value.toLowerCase() || '';
        const filterType = document.getElementById('center-filter')?.value || 'all';
        const bloodGroup = document.getElementById('center-blood-filter')?.value || '';
        
        let filtered = this.centers.filter(center => {
            const matchSearch = !searchTerm || 
                center.name.toLowerCase().includes(searchTerm) ||
                center.address.toLowerCase().includes(searchTerm);
            const matchType = filterType === 'all' || center.type === filterType;
            const matchBloodGroup = !bloodGroup || center.bloodTypes.includes(bloodGroup);
            return matchSearch && matchType && matchBloodGroup;
        });
        
        this.renderCenters(filtered);
    },

    getSharedBloodGroup() {
        try {
            return JSON.parse(localStorage.getItem('bloodDonationSelection') || '{}').bloodGroup || '';
        } catch {
            return '';
        }
    },

    saveSharedBloodGroup(bloodGroup) {
        if (bloodGroup) {
            localStorage.setItem('bloodDonationSelection', JSON.stringify({ bloodGroup }));
        } else {
            localStorage.removeItem('bloodDonationSelection');
        }
    },

    updateQuickFilterButtons() {
        const activeType = document.getElementById('center-filter')?.value || 'all';
        document.querySelectorAll('.center-quick-btn').forEach((button) => {
            const isActive = button.dataset.type === activeType;
            button.setAttribute('aria-pressed', String(isActive));
            button.classList.toggle('bg-primary-600', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('border-primary-600', isActive);
            button.classList.toggle('shadow-md', isActive);
            button.classList.toggle('dark:bg-primary-600', isActive);
        });
    },
    
    // Select Center
    selectCenter(center) {
        this.currentCenter = center;
        this.selectedDate = null;
        this.selectedTime = null;
        
        // Show booking section
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
            bookingSection.classList.remove('hidden');
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Update booking title
        const title = document.querySelector('#booking-section h3');
        if (title) {
            title.textContent = `📅 Schedule Appointment at ${center.name}`;
        }
        
        // Reset calendar
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.renderCalendar();
        
        App.showToast(`Selected ${center.name}`, 'success');
    },
    
    // Booking System
    initBooking() {
        // Close booking
        document.getElementById('close-booking')?.addEventListener('click', () => {
            document.getElementById('booking-section')?.classList.add('hidden');
        });
        
        // Calendar navigation
        document.getElementById('prev-month')?.addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.renderCalendar();
        });
        
        document.getElementById('next-month')?.addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.renderCalendar();
        });
        
        // Confirm booking
        document.getElementById('confirm-booking')?.addEventListener('click', () => {
            this.confirmBooking();
        });
        
        // Initialize calendar
        this.renderCalendar();
    },
    
    renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        document.getElementById('current-month').textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        const daysContainer = document.getElementById('calendar-days');
        if (!daysContainer) return;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        
        let html = '';
        
        // Empty slots for days before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div></div>';
        }
        
        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === todayDate && this.currentMonth === todayMonth && this.currentYear === todayYear;
            const isPast = new Date(this.currentYear, this.currentMonth, d) < new Date(todayYear, todayMonth, todayDate);
            const isSelected = this.selectedDate && 
                this.selectedDate.getDate() === d && 
                this.selectedDate.getMonth() === this.currentMonth && 
                this.selectedDate.getFullYear() === this.currentYear;
            
            let classes = 'calendar-day';
            if (isToday) classes += ' border-2 border-primary-600 font-bold';
            if (isSelected) classes += ' selected';
            if (isPast) classes += ' unavailable';
            
            html += `
                <div class="${classes}" data-day="${d}" data-month="${this.currentMonth}" data-year="${this.currentYear}" ${isPast ? 'style="pointer-events:none;"' : ''}>
                    ${d}
                </div>
            `;
        }
        
        daysContainer.innerHTML = html;
        
        // Add click events to days
        daysContainer.querySelectorAll('.calendar-day:not(.unavailable)').forEach(day => {
            day.addEventListener('click', () => {
                const dayNum = parseInt(day.getAttribute('data-day'));
                const month = parseInt(day.getAttribute('data-month'));
                const year = parseInt(day.getAttribute('data-year'));
                this.selectedDate = new Date(year, month, dayNum);
                this.renderCalendar();
                this.renderTimeSlots();
            });
        });
    },
    
    renderTimeSlots() {
        const container = document.getElementById('time-slots');
        if (!container) return;
        
        if (!this.selectedDate) {
            container.innerHTML = '<p class="text-sm text-gray-500 col-span-full">Please select a date first</p>';
            return;
        }
        
        // Generate time slots (9 AM - 6 PM)
        const slots = [];
        for (let i = 9; i <= 18; i++) {
            const hour = i > 12 ? i - 12 : i;
            const ampm = i >= 12 ? 'PM' : 'AM';
            const timeStr = `${hour}:00 ${ampm}`;
            // Randomly mark some slots as booked
            const isBooked = Math.random() > 0.7;
            slots.push({ time: timeStr, booked: isBooked });
        }
        
        container.innerHTML = slots.map(slot => `
            <button class="time-slot px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 ${slot.booked ? 'booked' : 'hover:bg-primary-600 hover:text-white'}" 
                    ${slot.booked ? 'disabled' : ''}
                    data-time="${slot.time}">
                ${slot.time}
                ${slot.booked ? '🔒' : ''}
            </button>
        `).join('');
        
        // Add click events to available slots
        container.querySelectorAll('.time-slot:not(.booked)').forEach(slot => {
            slot.addEventListener('click', () => {
                container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                this.selectedTime = slot.getAttribute('data-time');
            });
        });
    },
    
    confirmBooking() {
        if (!this.currentCenter) {
            App.showToast('Please select a donation center first', 'error');
            return;
        }
        
        if (!this.selectedDate) {
            App.showToast('Please select a date', 'error');
            return;
        }
        
        if (!this.selectedTime) {
            App.showToast('Please select a time slot', 'error');
            return;
        }
        
        const notes = document.getElementById('booking-notes')?.value || '';
        
        // Create booking
        const booking = {
            id: Date.now(),
            center: this.currentCenter,
            date: this.selectedDate.toISOString().split('T')[0],
            time: this.selectedTime,
            notes: notes,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Save booking
        this.bookings.push(booking);
        this.saveBookings();
        this.addDonationHistory(booking);
        
        // Show success
        App.showToast(`✅ Appointment confirmed at ${this.currentCenter.name} on ${booking.date} at ${booking.time}`, 'success');
        
        // Close booking section
        document.getElementById('booking-section')?.classList.add('hidden');
        
        // Reset
        this.currentCenter = null;
        this.selectedDate = null;
        this.selectedTime = null;
        
        // Update history
        this.renderDonationHistory();
        this.updateQuickStats();
    },
    
    // Donation History
    loadDonationHistory() {
        const saved = localStorage.getItem('donationHistory');
        if (saved) {
            try {
                this.donationHistory = JSON.parse(saved);
            } catch (e) {
                this.donationHistory = [];
            }
        } else {
            // Sample history
            this.donationHistory = [
                {
                    id: 1,
                    center: 'City Hospital Blood Bank',
                    date: '2024-06-15',
                    time: '10:00 AM',
                    status: 'completed',
                    notes: 'Donated 1 unit of blood'
                },
                {
                    id: 2,
                    center: 'Red Cross Blood Center',
                    date: '2024-03-10',
                    time: '2:30 PM',
                    status: 'completed',
                    notes: 'Donated 1 unit of blood'
                }
            ];
            this.saveDonationHistory();
        }
    },
    
    saveDonationHistory() {
        localStorage.setItem('donationHistory', JSON.stringify(this.donationHistory));
    },
    
    loadBookings() {
        const saved = localStorage.getItem('donationBookings');
        if (saved) {
            try {
                this.bookings = JSON.parse(saved);
            } catch (e) {
                this.bookings = [];
            }
        } else {
            this.bookings = [];
        }
    },
    
    saveBookings() {
        localStorage.setItem('donationBookings', JSON.stringify(this.bookings));
    },
    
    addDonationHistory(booking) {
        const historyEntry = {
            id: booking.id,
            center: booking.center.name,
            date: booking.date,
            time: booking.time,
            status: 'upcoming',
            notes: booking.notes || 'Scheduled donation'
        };
        this.donationHistory.unshift(historyEntry);
        this.saveDonationHistory();
    },
    
    renderDonationHistory() {
        const container = document.getElementById('donation-history');
        if (!container) return;
        
        if (this.donationHistory.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    No donation history yet. Schedule your first donation today!
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.donationHistory.map(entry => `
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full ${entry.status === 'completed' ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'} flex items-center justify-center">
                        <span class="${entry.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}">${entry.status === 'completed' ? '✅' : '⏳'}</span>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">${entry.center}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${entry.date} at ${entry.time}</p>
                        ${entry.notes ? `<p class="text-xs text-gray-400">${entry.notes}</p>` : ''}
                    </div>
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${entry.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}">
                    ${entry.status}
                </span>
            </div>
        `).join('');
    },
    
    // Eligibility Checker
    initEligibilityChecker() {
        const checkBtn = document.getElementById('check-eligibility-btn');
        const resetBtn = document.getElementById('reset-eligibility-btn');
        const checkboxes = document.querySelectorAll('.eligibility-check');
        const ageInput = document.getElementById('eligibility-age');
        const weightInput = document.getElementById('eligibility-weight');
        const genderSelect = document.getElementById('eligibility-gender');
        const pregnancyStatus = document.getElementById('pregnancy-status');

        this.restoreEligibilityAnswers();

        checkboxes.forEach((checkbox) => checkbox.addEventListener('change', () => this.calculateEligibility()));
        [ageInput, weightInput].forEach((input) => input?.addEventListener('input', () => this.calculateEligibility()));
        [ageInput, weightInput].forEach((input) => input?.addEventListener('wheel', (event) => event.preventDefault(), { passive: false }));
        pregnancyStatus?.addEventListener('change', () => this.calculateEligibility());
        genderSelect?.addEventListener('change', () => {
            this.togglePregnancyScreening();
            this.calculateEligibility();
        });
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                const { checked, total, score, pregnancyDeferred } = this.calculateEligibility();
                const formPreview = document.getElementById('eligibility-form-preview');

                if (score >= 80 && !pregnancyDeferred) {
                    formPreview?.classList.remove('hidden');
                    App.showToast('You reached the 80% eligibility threshold. Your registration form is coming soon.', 'success');
                    formPreview?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    formPreview?.classList.add('hidden');
                    App.showToast(`Please review the remaining ${total - checked} requirement${total - checked === 1 ? '' : 's'}.`, 'warning');
                }
            });
        }

        resetBtn?.addEventListener('click', () => {
            checkboxes.forEach((checkbox) => { checkbox.checked = false; });
            if (ageInput) ageInput.value = '';
            if (weightInput) weightInput.value = '';
            if (genderSelect) genderSelect.value = '';
            if (pregnancyStatus) pregnancyStatus.value = '';
            localStorage.removeItem('donationEligibilityAnswers');
            document.getElementById('eligibility-form-preview')?.classList.add('hidden');
            this.togglePregnancyScreening();
            this.calculateEligibility();
        });

        this.togglePregnancyScreening();
        this.calculateEligibility();
    },

    togglePregnancyScreening() {
        const gender = document.getElementById('eligibility-gender')?.value;
        const screening = document.getElementById('pregnancy-screening');
        const pregnancyStatus = document.getElementById('pregnancy-status');
        const relevant = gender === 'female' || gender === 'self-describe';

        screening?.classList.toggle('hidden', !relevant);
        if (!relevant && pregnancyStatus) pregnancyStatus.value = '';
    },

    calculateEligibility() {
        const checkboxes = document.querySelectorAll('.eligibility-check');
        const age = Number(document.getElementById('eligibility-age')?.value || 0);
        const weight = Number(document.getElementById('eligibility-weight')?.value || 0);
        const gender = document.getElementById('eligibility-gender')?.value || '';
        const pregnancyStatus = document.getElementById('pregnancy-status')?.value || '';
        const pregnancyRelevant = gender === 'female' || gender === 'self-describe';
        const pregnancyDeferred = pregnancyRelevant && pregnancyStatus === 'yes';
        const requirements = [
            age >= 18 && age <= 65,
            weight >= 50,
            Boolean(gender),
            ...Array.from(checkboxes).map((checkbox) => checkbox.checked),
        ];

        if (pregnancyRelevant) requirements.splice(3, 0, pregnancyStatus === 'no');

        const total = requirements.length;
        const checked = requirements.filter(Boolean).length;
        const score = Math.round((checked / total) * 100);

        const scoreElement = document.getElementById('eligibility-score');
        const bar = document.getElementById('eligibility-bar');
        const message = document.getElementById('eligibility-message');
        const status = document.getElementById('eligibility-status');
        const result = document.getElementById('eligibility-result');
        const count = document.getElementById('eligibility-count');

        scoreElement.textContent = `${score}%`;
        bar.style.width = `${score}%`;
        count.textContent = `${checked} of ${total}`;

        checkboxes.forEach((checkbox) => {
            checkbox.closest('.eligibility-item')?.classList.toggle('is-checked', checkbox.checked);
        });

        result.classList.remove('bg-green-50', 'dark:bg-green-900/30', 'bg-amber-50', 'dark:bg-amber-900/20');
        bar.classList.remove('bg-green-500', 'bg-amber-500', 'bg-primary-600');

        if (pregnancyDeferred) {
            status.textContent = 'Please postpone donation for now';
            message.textContent = 'Pregnancy, recent childbirth, and breastfeeding can require a temporary deferral. Please ask the donation center when it is safe to donate.';
            message.className = 'mt-1 text-xs text-rose-700 dark:text-rose-300';
            result.classList.add('bg-amber-50', 'dark:bg-amber-900/20');
            bar.classList.add('bg-amber-500');
        } else if (score === 100) {
            status.textContent = 'Ready for the next step';
            message.textContent = 'Your answers meet this preliminary check. A donation-center screening is still required.';
            message.className = 'mt-1 text-xs text-green-700 dark:text-green-300';
            result.classList.add('bg-green-50', 'dark:bg-green-900/30');
            bar.classList.add('bg-green-500');
        } else if (checked > 0) {
            status.textContent = `${total - checked} requirement${total - checked === 1 ? '' : 's'} left to review`;
            message.textContent = 'Complete every item before booking an appointment.';
            message.className = 'mt-1 text-xs text-amber-700 dark:text-amber-300';
            result.classList.add('bg-amber-50', 'dark:bg-amber-900/20');
            bar.classList.add('bg-amber-500');
        } else {
            status.textContent = 'Start by confirming each requirement';
            message.textContent = 'This short check helps you prepare for the center’s final screening.';
            message.className = 'mt-1 text-xs text-gray-500 dark:text-gray-400';
            bar.classList.add('bg-primary-600');
        }

        localStorage.setItem('donationEligibilityAnswers', JSON.stringify({
            age: document.getElementById('eligibility-age')?.value || '',
            weight: document.getElementById('eligibility-weight')?.value || '',
            gender,
            pregnancyStatus,
            checks: Array.from(checkboxes).map((checkbox) => checkbox.checked),
        }));

        return { checked, total, score, pregnancyDeferred };
    },

    restoreEligibilityAnswers() {
        try {
            const savedAnswers = JSON.parse(localStorage.getItem('donationEligibilityAnswers') || '{}');
            if (!savedAnswers || typeof savedAnswers !== 'object' || Array.isArray(savedAnswers)) return;

            document.getElementById('eligibility-age').value = savedAnswers.age || '';
            document.getElementById('eligibility-weight').value = savedAnswers.weight || '';
            document.getElementById('eligibility-gender').value = savedAnswers.gender || '';
            document.getElementById('pregnancy-status').value = savedAnswers.pregnancyStatus || '';
            document.querySelectorAll('.eligibility-check').forEach((checkbox, index) => {
                checkbox.checked = Boolean(savedAnswers.checks?.[index]);
            });
        } catch {
            localStorage.removeItem('donationEligibilityAnswers');
        }
    },
    
    // Quick Stats
    initQuickStats() {
        this.updateQuickStats();
    },
    
    updateQuickStats() {
        // Total donations (completed)
        const completed = this.donationHistory.filter(h => h.status === 'completed');
        document.getElementById('total-donations').textContent = (12000 + completed.length).toLocaleString();
        
        // Active centers
        const active = this.centers.filter(c => c.available);
        document.getElementById('active-centers').textContent = active.length;
        
        // Today's donors (simulated)
        const today = new Date().toISOString().split('T')[0];
        const todayDonations = this.donationHistory.filter(h => h.date === today);
        document.getElementById('today-donors').textContent = 85 + todayDonations.length;
        
        // Next eligible (simulated)
        const lastDonation = this.donationHistory.find(h => h.status === 'completed');
        if (lastDonation) {
            const lastDate = new Date(lastDonation.date);
            const nextDate = new Date(lastDate);
            nextDate.setMonth(nextDate.getMonth() + 3); // 3 months eligibility gap
            const today = new Date();
            const diffTime = nextDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            document.getElementById('next-eligible').textContent = diffDays > 0 ? `${diffDays} days` : 'Eligible now!';
        } else {
            document.getElementById('next-eligible').textContent = 'Eligible now!';
        }
    },
    
    // Emergency Donate
    initEmergencyDonate() {
        const btn = document.getElementById('emergency-donate-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                // Find eligible centers
                const eligibleCenters = this.centers.filter(c => 
                    c.available && c.bloodTypes.includes('O-') || c.bloodTypes.includes('O+')
                );
                
                if (eligibleCenters.length > 0) {
                    this.selectCenter(eligibleCenters[0]);
                    // Auto-select today's date
                    const today = new Date();
                    this.selectedDate = today;
                    this.renderCalendar();
                    this.renderTimeSlots();
                    App.showToast('🚨 Emergency donation setup! Please book ASAP.', 'success');
                } else {
                    App.showToast('No centers available for emergency donation right now.', 'error');
                }
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DonatePage.init();
});

// Export for global use
window.DonatePage = DonatePage;
window.switchLanguage = (lang) => {
    if (typeof DonatePage !== 'undefined') {
        DonatePage.switchLanguage(lang);
    }
};
