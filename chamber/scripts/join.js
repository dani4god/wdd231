// Join page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Set timestamp when page loads
    function setTimestamp() {
        const timestampField = document.getElementById('timestamp');
        if (timestampField) {
            const now = new Date();
            const timestamp = now.toISOString();
            timestampField.value = timestamp;
            
            // Also set a formatted version for display
            const formattedDate = now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            console.log('Form loaded at:', formattedDate);
        }
    }
    
    // Form validation
    function validateForm() {
        const form = document.querySelector('.membership-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];
            
            // Check required fields
            const requiredFields = [
                { id: 'firstName', name: 'First Name' },
                { id: 'lastName', name: 'Last Name' },
                { id: 'email', name: 'Email' },
                { id: 'phone', name: 'Phone' },
                { id: 'businessName', name: 'Business Name' }
            ];
            
            requiredFields.forEach(field => {
                const element = document.getElementById(field.id);
                if (element && !element.value.trim()) {
                    isValid = false;
                    errors.push(`${field.name} is required`);
                    element.style.borderColor = '#ef4444';
                } else if (element) {
                    element.style.borderColor = '#10b981';
                }
            });
            
            // Validate organizational title pattern if filled
            const titleField = document.getElementById('title');
            if (titleField && titleField.value.trim()) {
                const pattern = /^[A-Za-z\s\-]{7,}$/;
                if (!pattern.test(titleField.value)) {
                    isValid = false;
                    errors.push('Organizational title must be at least 7 characters and contain only letters, spaces, and hyphens');
                    titleField.style.borderColor = '#ef4444';
                }
            }
            
            // Validate email format
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    errors.push('Please enter a valid email address');
                    emailField.style.borderColor = '#ef4444';
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please correct the following errors:\n\n' + errors.join('\n'));
                
                // Focus on first invalid field
                const firstInvalidField = document.querySelector('input[style*="ef4444"]');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });
    }
    
    // Phone number formatting
    function formatPhoneNumber() {
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                } else if (value.length >= 3) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                }
                
                e.target.value = value;
            });
        }
    }
    
    // Real-time validation feedback
    function addRealTimeValidation() {
        const inputs = document.querySelectorAll('input[required], input[pattern]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.style.borderColor = '#10b981';
                } else {
                    this.style.borderColor = '#ef4444';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    if (this.checkValidity()) {
                        this.style.borderColor = '#10b981';
                    }
                }
            });
        });
    }
    
    // Initialize all functions
    setTimestamp();
    validateForm();
    formatPhoneNumber();
    addRealTimeValidation();
});

// Modal functions (global scope for onclick attributes)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const closeButton = modal.querySelector('.close');
        if (closeButton) {
            closeButton.focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            openModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
});
