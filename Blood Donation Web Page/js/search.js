// Search Module
const Search = {
    init() {
        this.searchInput = document.getElementById('donor-search');
        this.bloodGroupFilter = document.getElementById('blood-group-filter');
        this.districtFilter = document.getElementById('district-filter');
        this.cityFilter = document.getElementById('city-filter');
        this.availabilityFilter = document.getElementById('availability-filter');
        this.resultsContainer = document.getElementById('search-results');
        
        if (this.searchInput) {
            this.loadDonors();
            this.searchInput.addEventListener('input', () => this.filterDonors());
            this.bloodGroupFilter?.addEventListener('change', () => this.filterDonors());
            this.districtFilter?.addEventListener('change', () => this.filterDonors());
            this.cityFilter?.addEventListener('change', () => this.filterDonors());
            this.availabilityFilter?.addEventListener('change', () => this.filterDonors());
        }
    },
    
    async loadDonors() {
        try {
            const response = await fetch('../data/donors.json');
            this.donors = await response.json();
            this.displayDonors(this.donors);
        } catch (error) {
            console.error('Error loading donors:', error);
            // Fallback sample data
            this.donors = [
                { name: "John Doe", bloodGroup: "O+", district: "Manhattan", city: "New York", available: true, phone: "+1-555-0101" },
                { name: "Jane Smith", bloodGroup: "A-", district: "Hollywood", city: "Los Angeles", available: false, phone: "+1-555-0102" },
                { name: "Mike Johnson", bloodGroup: "B+", district: "Loop", city: "Chicago", available: true, phone: "+1-555-0103" }
            ];
            this.displayDonors(this.donors);
        }
    },
    
    filterDonors() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const bloodGroup = this.bloodGroupFilter?.value || '';
        const district = this.districtFilter?.value || '';
        const city = this.cityFilter?.value || '';
        const availability = this.availabilityFilter?.value || '';
        
        const filtered = this.donors.filter(donor => {
            const matchSearch = !searchTerm || donor.name.toLowerCase().includes(searchTerm);
            const matchBlood = !bloodGroup || donor.bloodGroup === bloodGroup;
            const matchDistrict = !district || donor.district === district;
            const matchCity = !city || donor.city === city;
            const matchAvailability = !availability || 
                (availability === 'available' && donor.available) ||
                (availability === 'unavailable' && !donor.available);
            
            return matchSearch && matchBlood && matchDistrict && matchCity && matchAvailability;
        });
        
        this.displayDonors(filtered);
    },
    
    displayDonors(donors) {
        if (!this.resultsContainer) return;
        
        if (donors.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400 text-lg">No donors found matching your criteria</p>
                </div>
            `;
            return;
        }
        
        this.resultsContainer.innerHTML = donors.map(donor => `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span class="text-primary-600 dark:text-primary-400 font-bold">${donor.bloodGroup}</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">${donor.name}</h3>
                        <p class="text-sm text-gray-500">${donor.city}, ${donor.district}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${donor.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${donor.available ? 'Available' : 'Unavailable'}
                    </span>
                    <button onclick="App.showToast('Contact: ${donor.phone}')" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Contact
                    </button>
                </div>
            </div>
        `).join('');
    }
};

// Initialize search if on donor page
if (window.location.pathname.includes('donor.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        Search.init();
    });
}