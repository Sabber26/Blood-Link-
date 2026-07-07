// Donor Page Module
const DonorPage = {
    allDonors: [],
    filteredDonors: [],
    currentPage: 1,
    donorsPerPage: 9,
    
    init() {
        this.handleLoading();
        this.initMobileMenu();
        this.initDarkMode();
        this.initFilters();
        this.initModal();
        this.initSorting();
        this.loadDonors();
    },
    
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
    },
    
    initDarkMode() {
        if (typeof DarkMode !== 'undefined') {
            DarkMode.init();
        } else {
            this.fallbackDarkMode();
        }
    },
    
    fallbackDarkMode() {
        const toggle = document.getElementById('dark-mode-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        
        if (!toggle) return;
        
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.documentElement.classList.add('dark');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
        }
        
        toggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('darkMode', 'enabled');
                if (sunIcon) sunIcon.classList.remove('hidden');
                if (moonIcon) moonIcon.classList.add('hidden');
            } else {
                localStorage.setItem('darkMode', null);
                if (sunIcon) sunIcon.classList.add('hidden');
                if (moonIcon) moonIcon.classList.remove('hidden');
            }
        });
    },
    
    initFilters() {
        const searchInput = document.getElementById('search-input');
        const bloodFilter = document.getElementById('blood-filter');
        const districtFilter = document.getElementById('district-filter');
        const availabilityFilter = document.getElementById('availability-filter');
        const resetBtn = document.getElementById('reset-filters');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        
        // Add event listeners
        searchInput?.addEventListener('input', () => this.applyFilters());
        bloodFilter?.addEventListener('change', () => this.applyFilters());
        districtFilter?.addEventListener('change', () => this.applyFilters());
        availabilityFilter?.addEventListener('change', () => this.applyFilters());
        resetBtn?.addEventListener('click', () => this.resetFilters());
        clearFiltersBtn?.addEventListener('click', () => this.resetFilters());
    },
    
    initModal() {
        const modal = document.getElementById('donor-modal');
        const closeBtn = document.getElementById('close-modal');
        
        closeBtn?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    },
    
    initSorting() {
        const sortBy = document.getElementById('sort-by');
        sortBy?.addEventListener('change', () => {
            this.sortDonors();
            this.renderDonors();
        });
    },
    
    async loadDonors() {
        try {
            const response = await fetch('data/donors.json');
            if (!response.ok) throw new Error('Failed to fetch donors');
            
            this.allDonors = await response.json();
            this.populateDistrictFilter();
            this.applyFilters();
        } catch (error) {
            console.error('Error loading donors:', error);
            // Load sample data as fallback
            this.allDonors = this.getSampleDonors();
            this.populateDistrictFilter();
            this.applyFilters();
            this.showToast('Loaded sample donor data', 'success');
        }
    },
    
    getSampleDonors() {
        return [
            { id: 1, name: "John Doe", bloodGroup: "O+", district: "Manhattan", city: "New York", available: true, phone: "+1-555-0101", email: "john.doe@email.com", lastDonation: "2024-01-15", totalDonations: 12 },
            { id: 2, name: "Jane Smith", bloodGroup: "A-", district: "Hollywood", city: "Los Angeles", available: false, phone: "+1-555-0102", email: "jane.smith@email.com", lastDonation: "2024-02-20", totalDonations: 8 },
            { id: 3, name: "Mike Johnson", bloodGroup: "B+", district: "Loop", city: "Chicago", available: true, phone: "+1-555-0103", email: "mike.j@email.com", lastDonation: "2024-03-10", totalDonations: 5 },
            { id: 4, name: "Sarah Wilson", bloodGroup: "AB+", district: "Downtown", city: "Houston", available: true, phone: "+1-555-0104", email: "sarah.w@email.com", lastDonation: "2024-01-28", totalDonations: 15 },
            { id: 5, name: "David Brown", bloodGroup: "O-", district: "Midtown", city: "Phoenix", available: true, phone: "+1-555-0105", email: "david.b@email.com", lastDonation: "2024-04-01", totalDonations: 20 },
            { id: 6, name: "Emily Davis", bloodGroup: "A+", district: "Manhattan", city: "New York", available: false, phone: "+1-555-0106", email: "emily.d@email.com", lastDonation: "2024-03-15", totalDonations: 3 },
            { id: 7, name: "Robert Taylor", bloodGroup: "B-", district: "Hollywood", city: "Los Angeles", available: true, phone: "+1-555-0107", email: "robert.t@email.com", lastDonation: "2024-02-01", totalDonations: 10 },
            { id: 8, name: "Lisa Anderson", bloodGroup: "O+", district: "Loop", city: "Chicago", available: true, phone: "+1-555-0108", email: "lisa.a@email.com", lastDonation: "2024-04-10", totalDonations: 7 },
            { id: 9, name: "Tom Martinez", bloodGroup: "AB-", district: "Downtown", city: "Houston", available: false, phone: "+1-555-0109", email: "tom.m@email.com", lastDonation: "2024-01-05", totalDonations: 18 },
            { id: 10, name: "Anna White", bloodGroup: "A+", district: "Midtown", city: "Phoenix", available: true, phone: "+1-555-0110", email: "anna.w@email.com", lastDonation: "2024-03-20", totalDonations: 6 }
        ];
    },
    
    populateDistrictFilter() {
        const districtFilter = document.getElementById('district-filter');
        if (!districtFilter) return;
        
        // Get unique districts
        const districts = [...new Set(this.allDonors.map(d => d.district))].sort();
        
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtFilter.appendChild(option);
        });
    },
    
    applyFilters() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
        const bloodGroup = document.getElementById('blood-filter')?.value || '';
        const district = document.getElementById('district-filter')?.value || '';
        const availability = document.getElementById('availability-filter')?.value || '';
        
        this.filteredDonors = this.allDonors.filter(donor => {
            const matchSearch = !searchTerm || 
                donor.name.toLowerCase().includes(searchTerm) ||
                donor.city.toLowerCase().includes(searchTerm) ||
                donor.district.toLowerCase().includes(searchTerm);
                
            const matchBlood = !bloodGroup || donor.bloodGroup === bloodGroup;
            const matchDistrict = !district || donor.district === district;
            const matchAvailability = !availability || 
                (availability === 'available' && donor.available) ||
                (availability === 'unavailable' && !donor.available);
            
            return matchSearch && matchBlood && matchDistrict && matchAvailability;
        });
        
        this.updateActiveFilters(searchTerm, bloodGroup, district, availability);
        this.sortDonors();
        this.currentPage = 1;
        this.renderDonors();
    },
    
    updateActiveFilters(searchTerm, bloodGroup, district, availability) {
        const activeFiltersDiv = document.getElementById('active-filters');
        if (!activeFiltersDiv) return;
        
        let badges = '';
        
        if (searchTerm) {
            badges += `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                Search: "${searchTerm}"
                <button onclick="document.getElementById('search-input').value=''; DonorPage.applyFilters();" class="ml-2">&times;</button>
            </span>`;
        }
        
        if (bloodGroup) {
            badges += `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                Blood: ${bloodGroup}
                <button onclick="document.getElementById('blood-filter').value=''; DonorPage.applyFilters();" class="ml-2">&times;</button>
            </span>`;
        }
        
        if (district) {
            badges += `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                District: ${district}
                <button onclick="document.getElementById('district-filter').value=''; DonorPage.applyFilters();" class="ml-2">&times;</button>
            </span>`;
        }
        
        if (availability) {
            badges += `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                ${availability === 'available' ? 'Available' : 'Unavailable'}
                <button onclick="document.getElementById('availability-filter').value=''; DonorPage.applyFilters();" class="ml-2">&times;</button>
            </span>`;
        }
        
        activeFiltersDiv.innerHTML = badges || '<span class="text-sm text-gray-400">No active filters</span>';
    },
    
    resetFilters() {
        const searchInput = document.getElementById('search-input');
        const bloodFilter = document.getElementById('blood-filter');
        const districtFilter = document.getElementById('district-filter');
        const availabilityFilter = document.getElementById('availability-filter');
        
        if (searchInput) searchInput.value = '';
        if (bloodFilter) bloodFilter.value = '';
        if (districtFilter) districtFilter.value = '';
        if (availabilityFilter) availabilityFilter.value = '';
        
        this.applyFilters();
        this.showToast('Filters have been reset', 'success');
    },
    
    sortDonors() {
        const sortBy = document.getElementById('sort-by')?.value || 'name';
        
        this.filteredDonors.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'bloodGroup':
                    return a.bloodGroup.localeCompare(b.bloodGroup);
                case 'totalDonations':
                    return b.totalDonations - a.totalDonations;
                case 'lastDonation':
                    return new Date(b.lastDonation) - new Date(a.lastDonation);
                default:
                    return 0;
            }
        });
    },
    
    renderDonors() {
        const donorsGrid = document.getElementById('donors-grid');
        const loadingState = document.getElementById('loading-state');
        const emptyState = document.getElementById('empty-state');
        const resultsCount = document.getElementById('results-count');
        const pagination = document.getElementById('pagination');
        
        if (!donorsGrid) return;
        
        // Hide loading state
        if (loadingState) loadingState.classList.add('hidden');
        
        // Update results count
        if (resultsCount) resultsCount.textContent = this.filteredDonors.length;
        
        // Show empty state if no results
        if (this.filteredDonors.length === 0) {
            donorsGrid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            if (pagination) pagination.innerHTML = '';
            return;
        }
        
        if (emptyState) emptyState.classList.add('hidden');
        
        // Calculate pagination
        const totalPages = Math.ceil(this.filteredDonors.length / this.donorsPerPage);
        const startIndex = (this.currentPage - 1) * this.donorsPerPage;
        const endIndex = startIndex + this.donorsPerPage;
        const pageDonors = this.filteredDonors.slice(startIndex, endIndex);
        
        // Render donor cards
        donorsGrid.innerHTML = pageDonors.map(donor => this.createDonorCard(donor)).join('');
        
        // Render pagination
        this.renderPagination(totalPages);
        
        // Add click events to view buttons
        document.querySelectorAll('.view-donor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const donorId = parseInt(e.target.closest('button').getAttribute('data-id'));
                const donor = this.allDonors.find(d => d.id === donorId);
                if (donor) this.showDonorDetails(donor);
            });
        });
    },
    
    createDonorCard(donor) {
        const bloodColors = {
            'A+': 'bg-red-500', 'A-': 'bg-red-600',
            'B+': 'bg-blue-500', 'B-': 'bg-blue-600',
            'AB+': 'bg-purple-500', 'AB-': 'bg-purple-600',
            'O+': 'bg-green-500', 'O-': 'bg-green-600'
        };
        
        const bloodColor = bloodColors[donor.bloodGroup] || 'bg-primary-600';
        
        return `
            <div class="donor-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl">
                <div class="p-6">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-14 h-14 ${bloodColor} rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="text-xl font-bold text-white">${donor.bloodGroup}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">${donor.name}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${donor.city}, ${donor.district}</p>
                        </div>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donor.available 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }">
                            ${donor.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span class="truncate">${donor.phone}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span class="truncate">${donor.email}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Last donation: ${this.formatDate(donor.lastDonation)}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Donations: </span>
                            <span class="font-semibold text-primary-600 dark:text-primary-400">${donor.totalDonations}</span>
                        </div>
                        <button 
                            class="view-donor-btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            data-id="${donor.id}"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination || totalPages <= 1) {
            if (pagination) pagination.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button
        html += `
            <button 
                onclick="DonorPage.changePage(${this.currentPage - 1})"
                ${this.currentPage === 1 ? 'disabled' : ''}
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                html += `
                    <button 
                        onclick="DonorPage.changePage(${i})"
                        class="w-10 h-10 rounded-lg ${i === this.currentPage 
                            ? 'bg-primary-600 text-white' 
                            : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors"
                    >
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span class="px-2 text-gray-400">...</span>';
            }
        }
        
        // Next button
        html += `
            <button 
                onclick="DonorPage.changePage(${this.currentPage + 1})"
                ${this.currentPage === totalPages ? 'disabled' : ''}
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        `;
        
        pagination.innerHTML = html;
    },
    
    changePage(page) {
        const totalPages = Math.ceil(this.filteredDonors.length / this.donorsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderDonors();
        
        // Scroll to top of donor grid
        document.getElementById('donors-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    showDonorDetails(donor) {
        const modal = document.getElementById('donor-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (!modal || !modalContent) return;
        
        modalContent.innerHTML = `
            <div class="text-center mb-6">
                <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-3xl font-bold text-white">${donor.bloodGroup}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">${donor.name}</h3>
                <p class="text-gray-500 dark:text-gray-400">${donor.city}, ${donor.district}</p>
            </div>
            
            <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Phone</span>
                    <a href="tel:${donor.phone}" class="text-primary-600 hover:text-primary-700 font-medium">${donor.phone}</a>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Email</span>
                    <a href="mailto:${donor.email}" class="text-primary-600 hover:text-primary-700 font-medium">${donor.email}</a>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Status</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donor.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }">${donor.available ? 'Available' : 'Unavailable'}</span>
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
        
        modal.classList.remove('hidden');
    },
    
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DonorPage.init();
});