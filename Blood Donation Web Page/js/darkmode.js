// Dark Mode Module
const DarkMode = {
    init() {
        this.toggle = document.getElementById('dark-mode-toggle');
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');
        
        // Check saved preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            this.enable();
        } else {
            this.disable();
        }
        
        // Toggle event
        this.toggle.addEventListener('click', () => {
            if (localStorage.getItem('darkMode') !== 'enabled') {
                this.enable();
            } else {
                this.disable();
            }
        });
    },
    
    enable() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
        this.sunIcon.classList.remove('hidden');
        this.moonIcon.classList.add('hidden');
    },
    
    disable() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', null);
        this.sunIcon.classList.add('hidden');
        this.moonIcon.classList.remove('hidden');
    }
};