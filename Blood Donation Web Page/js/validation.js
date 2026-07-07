// Form Validation Module
const Validation = {
    init(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(form)) {
                this.handleSubmit(form);
            }
        });
        
        // Real-time validation
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    },
    
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.previousElementSibling?.textContent || 'This field';
        
        // Remove existing error messages
        this.removeError(field);
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            this.showError(field, `${fieldName} is required`);
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 8) {
                this.showError(field, 'Password must be at least 8 characters');
                return false;
            }
        }
        
        // Confirm password
        if (field.getAttribute('data-match')) {
            const matchField = document.getElementById(field.getAttribute('data-match'));
            if (matchField && value !== matchField.value) {
                this.showError(field, 'Passwords do not match');
                return false;
            }
        }
        
        // Add success styling
        field.classList.add('border-green-500');
        field.classList.remove('border-red-500');
        return true;
    },
    
    showError(field, message) {
        field.classList.add('border-red-500', 'error');
        field.classList.remove('border-green-500');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    },
    
    removeError(field) {
        field.classList.remove('border-red-500', 'error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    },
    
    handleSubmit(form) {
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        setTimeout(() => {
            App.showToast('Form submitted successfully!', 'success');
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Clear success styling
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.classList.remove('border-green-500');
            });
        }, 1500);
    }
};