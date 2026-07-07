// Login Page Module
const LoginPage = {
    init() {
        this.handleLoading();
        this.initMobileMenu();
        this.initDarkMode();
        this.initPasswordToggle();
        this.initFormValidation();
        this.checkExistingSession();
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
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    },
    
    initDarkMode() {
        // Check if DarkMode module exists
        if (typeof DarkMode !== 'undefined') {
            DarkMode.init();
        } else {
            // Fallback dark mode toggle
            this.fallbackDarkMode();
        }
    },
    
    fallbackDarkMode() {
        const toggle = document.getElementById('dark-mode-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        
        if (!toggle) return;
        
        // Check saved preference
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
            
            // Update aria-label
            const isVisible = type === 'text';
            toggleButton.setAttribute('aria-label', 
                isVisible ? 'Hide password' : 'Show password'
            );
        });
    },
    
    initFormValidation() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;
        
        // Real-time validation on blur
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmailField(emailInput);
            });
            
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('border-red-500')) {
                    this.validateEmailField(emailInput);
                }
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => {
                this.validatePasswordField(passwordInput);
            });
            
            passwordInput.addEventListener('input', () => {
                if (passwordInput.classList.contains('border-red-500')) {
                    this.validatePasswordField(passwordInput);
                }
            });
        }
        
        // Form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Auto-fill email if remembered
        this.autoFillEmail();
    },
    
    validateEmailField(field) {
        const value = field.value.trim();
        this.clearFieldError(field);
        
        if (!value) {
            this.showFieldError(field, 'Email address is required');
            return false;
        }
        
        if (!this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        this.showFieldSuccess(field);
        return true;
    },
    
    validatePasswordField(field) {
        const value = field.value.trim();
        this.clearFieldError(field);
        
        if (!value) {
            this.showFieldError(field, 'Password is required');
            return false;
        }
        
        if (value.length < 6) {
            this.showFieldError(field, 'Password must be at least 6 characters');
            return false;
        }
        
        this.showFieldSuccess(field);
        return true;
    },
    
    handleSubmit() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberMe = document.getElementById('remember-me');
        
        // Clear all previous errors
        this.clearAllErrors();
        
        // Validate all fields
        const isEmailValid = this.validateEmailField(emailInput);
        const isPasswordValid = this.validatePasswordField(passwordInput);
        
        if (!isEmailValid || !isPasswordValid) {
            // Shake the form card
            this.shakeForm();
            
            // Focus first invalid field
            if (!isEmailValid) {
                emailInput.focus();
            } else if (!isPasswordValid) {
                passwordInput.focus();
            }
            
            return;
        }
        
        // Simulate login process
        this.simulateLogin(emailInput.value, passwordInput.value, rememberMe?.checked);
    },
    
    async simulateLogin(email, password, rememberMe) {
        const submitButton = document.querySelector('#login-form button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
            </span>
        `;
        
        // Simulate API call delay
        await this.delay(2000);
        
        // Demo credentials for testing
        const demoCredentials = {
            email: 'demo@blooddonate.com',
            password: 'demo123'
        };
        
        if (email === demoCredentials.email && password === demoCredentials.password) {
            // Successful login
            this.showToast('Login successful! Redirecting to home...', 'success');
            
            // Store login data
            const userData = {
                email: email,
                name: 'Demo User',
                bloodGroup: 'O+',
                loginTime: new Date().toISOString()
            };
            
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect to HOME PAGE (index.html) instead of dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } else {
            // Failed login
            this.showToast('Invalid email or password', 'error');
            this.shakeForm();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Clear password field
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    },
    
    checkExistingSession() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn === 'true') {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            // Show notification that user is already logged in
            setTimeout(() => {
                this.showToast(`Welcome back, ${userData.name || 'User'}!`, 'success');
            }, 1000);
            
            // Option to go to home page directly
            const formCard = document.querySelector('.bg-white.dark\\:bg-gray-800');
            if (formCard) {
                const existingSessionDiv = document.createElement('div');
                existingSessionDiv.className = 'px-8 pb-4';
                existingSessionDiv.innerHTML = `
                    <div class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <p class="text-sm text-primary-800 dark:text-primary-200 mb-3">
                            You are already logged in as <strong>${userData.email || 'User'}</strong>
                        </p>
                        <a href="index.html" class="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                            Go to Home
                        </a>
                    </div>
                `;
                
                const registerLink = formCard.querySelector('p:last-child');
                if (registerLink) {
                    registerLink.parentNode.insertBefore(existingSessionDiv, registerLink);
                }
            }
        }
    },
    
    autoFillEmail() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            const emailInput = document.getElementById('email');
            const rememberMe = document.getElementById('remember-me');
            
            if (emailInput) {
                emailInput.value = rememberedEmail;
                this.showFieldSuccess(emailInput);
            }
            
            if (rememberMe) {
                rememberMe.checked = true;
            }
        }
    },
    
    // Social Login Handlers
    initSocialLogin() {
        const facebookBtn = document.querySelector('.grid.grid-cols-2 button:first-child');
        const googleBtn = document.querySelector('.grid.grid-cols-2 button:last-child');
        
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.showToast('Facebook login coming soon!', 'success');
            });
        }
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.showToast('Google login coming soon!', 'success');
            });
        }
        
        // Forgot password
        const forgotPassword = document.querySelector('.text-primary-600.hover\\:text-primary-500');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                const email = document.getElementById('email')?.value.trim();
                
                if (email && this.isValidEmail(email)) {
                    this.showToast('Password reset link sent to your email!', 'success');
                } else {
                    this.showToast('Please enter your email address first', 'error');
                    document.getElementById('email')?.focus();
                }
            });
        }
    },
    
    // Utility Functions
    showFieldError(field, message) {
        field.classList.add('border-red-500');
        field.classList.remove('border-green-500', 'border-gray-300', 'dark:border-gray-600');
        
        // Remove existing error message
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
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('border-red-500', 'border-green-500');
            input.classList.add('border-gray-300', 'dark:border-gray-600');
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        // Set icon based on type
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
        
        // Auto hide after 3 seconds
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
    LoginPage.init();
    
    // Initialize social login after a short delay to ensure DOM is ready
    setTimeout(() => {
        LoginPage.initSocialLogin();
    }, 100);
});