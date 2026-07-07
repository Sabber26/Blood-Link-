// Register Page Module
const RegisterPage = {
    init() {
        this.handleLoading();
        this.initMobileMenu();
        this.initDarkMode();
        this.initPasswordToggle();
        this.initPasswordStrength();
        this.initPasswordMatch();
        this.initFormValidation();
        this.initDistrictCityDependency();
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
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
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
    
    initPasswordToggle() {
        const toggleButton = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');
        const eyeOffIcon = document.getElementById('eye-off-icon');
        
        if (!toggleButton || !passwordInput) return;
        
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (eyeIcon && eyeOffIcon) {
                eyeIcon.classList.toggle('hidden');
                eyeOffIcon.classList.toggle('hidden');
            }
            
            const isVisible = type === 'text';
            toggleButton.setAttribute('aria-label', 
                isVisible ? 'Hide password' : 'Show password'
            );
        });
    },
    
    initPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text').querySelector('span');
        
        if (!passwordInput || !strengthBar) return;
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = this.calculatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = strength.percent + '%';
            strengthBar.style.backgroundColor = strength.color;
            strengthBar.style.height = '4px';
            strengthBar.style.borderRadius = '2px';
            strengthBar.style.transition = 'all 0.3s ease';
            
            // Update strength text
            strengthText.textContent = strength.label;
            strengthText.style.color = strength.color;
        });
    },
    
    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length === 0) {
            return { percent: 0, color: '#e5e7eb', label: 'Not set' };
        }
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Determine strength level
        if (score <= 2) {
            return { percent: 25, color: '#ef4444', label: 'Weak' };
        } else if (score <= 3) {
            return { percent: 50, color: '#f59e0b', label: 'Fair' };
        } else if (score <= 4) {
            return { percent: 75, color: '#3b82f6', label: 'Good' };
        } else {
            return { percent: 100, color: '#10b981', label: 'Strong' };
        }
    },
    
    initPasswordMatch() {
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        const matchText = document.getElementById('password-match-text');
        
        if (!passwordInput || !confirmInput || !matchText) return;
        
        const checkMatch = () => {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            if (confirm.length === 0) {
                matchText.classList.add('hidden');
                confirmInput.classList.remove('border-green-500', 'border-red-500');
                return;
            }
            
            matchText.classList.remove('hidden');
            
            if (password === confirm) {
                matchText.textContent = '✓ Passwords match';
                matchText.className = 'text-xs text-green-500 mt-1';
                confirmInput.classList.add('border-green-500');
                confirmInput.classList.remove('border-red-500');
            } else {
                matchText.textContent = '✗ Passwords do not match';
                matchText.className = 'text-xs text-red-500 mt-1';
                confirmInput.classList.add('border-red-500');
                confirmInput.classList.remove('border-green-500');
            }
        };
        
        passwordInput.addEventListener('input', checkMatch);
        confirmInput.addEventListener('input', checkMatch);
    },
    
    initFormValidation() {
        const registerForm = document.getElementById('register-form');
        if (!registerForm) return;
        
        // Real-time validation on blur
        const fields = ['fullname', 'email', 'phone', 'password', 'confirm-password', 'city'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                if (field.classList.contains('border-red-500')) {
                    this.validateField(field);
                }
            });
        });
        
        // Blood group and district validation
        const bloodGroup = document.getElementById('blood-group');
        const district = document.getElementById('district');
        
        if (bloodGroup) {
            bloodGroup.addEventListener('change', () => {
                this.validateSelect(bloodGroup, 'Blood group');
            });
        }
        
        if (district) {
            district.addEventListener('change', () => {
                this.validateSelect(district, 'District');
            });
        }
        
        // Form submission
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.id;
        this.clearFieldError(field);
        
        // Required check
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }
        
        // Specific validations
        switch (field.id) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'password':
                if (value && value.length < 8) {
                    this.showFieldError(field, 'Password must be at least 8 characters');
                    return false;
                }
                if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    this.showFieldError(field, 'Password must contain uppercase, lowercase, and number');
                    return false;
                }
                break;
                
            case 'confirm-password':
                const password = document.getElementById('password').value;
                if (value && value !== password) {
                    this.showFieldError(field, 'Passwords do not match');
                    return false;
                }
                break;
                
            case 'fullname':
                if (value && value.length < 3) {
                    this.showFieldError(field, 'Name must be at least 3 characters');
                    return false;
                }
                break;
                
            case 'dob':
                if (value) {
                    const age = this.calculateAge(value);
                    if (age < 18) {
                        this.showFieldError(field, 'You must be at least 18 years old to donate');
                        return false;
                    }
                    if (age > 65) {
                        this.showFieldError(field, 'Maximum age for blood donation is 65 years');
                        return false;
                    }
                }
                break;
        }
        
        this.showFieldSuccess(field);
        return true;
    },
    
    validateSelect(field, fieldName) {
        this.clearFieldError(field);
        
        if (!field.value) {
            this.showFieldError(field, `${fieldName} is required`);
            return false;
        }
        
        this.showFieldSuccess(field);
        return true;
    },
    
    handleSubmit() {
        // Clear all errors
        this.clearAllErrors();
        
        let isValid = true;
        const fields = ['fullname', 'email', 'phone', 'dob', 'city', 'password', 'confirm-password'];
        
        // Validate all text fields
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate select fields
        if (!this.validateSelect(document.getElementById('blood-group'), 'Blood group')) {
            isValid = false;
        }
        if (!this.validateSelect(document.getElementById('district'), 'District')) {
            isValid = false;
        }
        
        // Validate terms checkbox
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            this.showToast('Please agree to the Terms of Service', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            this.shakeForm();
            return;
        }
        
        // Proceed with registration
        this.simulateRegistration();
    },
    
    async simulateRegistration() {
        const submitButton = document.querySelector('#register-form button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
            </span>
        `;
        
        // Simulate API call
        await this.delay(2000);
        
        // Collect form data
        const userData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            bloodGroup: document.getElementById('blood-group').value,
            dob: document.getElementById('dob').value,
            district: document.getElementById('district').value,
            city: document.getElementById('city').value,
            availability: document.querySelector('input[name="availability"]:checked')?.value,
            registeredAt: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show success message
        this.showToast('Registration successful! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    },
    
    initDistrictCityDependency() {
        // Optional: Update city options based on district selection
        const districtSelect = document.getElementById('district');
        const cityInput = document.getElementById('city');
        
        if (!districtSelect || !cityInput) return;
        
        districtSelect.addEventListener('change', () => {
            cityInput.value = '';
            cityInput.placeholder = `Enter city in ${districtSelect.options[districtSelect.selectedIndex]?.text || 'your district'}`;
        });
    },
    
    calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    },
    
    // Utility Functions
    getFieldLabel(fieldName) {
        const labels = {
            'fullname': 'Full Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
            'password': 'Password',
            'confirm-password': 'Confirm Password',
            'city': 'City'
        };
        return labels[fieldName] || fieldName;
    },
    
    showFieldError(field, message) {
        field.classList.add('border-red-500');
        field.classList.remove('border-green-500', 'border-gray-300', 'dark:border-gray-600');
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        const errorDiv = document.createElement('p');
        errorDiv.className = 'text-red-500 text-xs mt-1 error-message flex items-center';
        errorDiv.innerHTML = `
            <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            ${message}
        `;
        field.parentNode.appendChild(errorDiv);
    },
    
    showFieldSuccess(field) {
        field.classList.remove('border-red-500');
        field.classList.add('border-green-500');
    },
    
    clearFieldError(field) {
        field.classList.remove('border-red-500', 'border-green-500');
        field.classList.add('border-gray-300', 'dark:border-gray-600');
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
    },
    
    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('input, select').forEach(field => {
            field.classList.remove('border-red-500', 'border-green-500');
            field.classList.add('border-gray-300', 'dark:border-gray-600');
        });
    },
    
    shakeForm() {
        const card = document.querySelector('.bg-white.dark\\:bg-gray-800');
        if (card) {
            card.classList.add('shake');
            setTimeout(() => {
                card.classList.remove('shake');
            }, 600);
        }
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone(phone) {
        return /^\+?[\d\s-]{10,}$/.test(phone);
    },
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        const icons = {
            success: `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`
        };
        
        toast.innerHTML = `
            <div class="flex items-center">
                ${icons[type] || icons.success}
                <span>${message}</span>
            </div>
        `;
        
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    RegisterPage.init();
});