// Thank you page functionality
document.addEventListener('DOMContentLoaded', function() {

    // Get URL parameters
    function getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};

        for (const [key, value] of urlParams) {
            params[key] = decodeURIComponent(value);
        }

        return params;
    }

    // Format timestamp for display
    function formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return timestamp; // Return original if parsing fails
        }
    }

    // Format membership level for display
    function formatMembershipLevel(level) {
        const levels = {
            'np': 'NP Membership (Non-Profit)',
            'bronze': 'Bronze Membership',
            'silver': 'Silver Membership',
            'gold': 'Gold Membership'
        };
        return levels[level] || level;
    }

    // Display form data
    function displayFormData() {
        const params = getUrlParams();
        const summaryContainer = document.querySelector('#application-summary .summary-content');

        if (!summaryContainer) return;

        // Required fields to display
        const fieldsToDisplay = [
            { key: 'firstName', label: 'First Name', required: true },
            { key: 'lastName', label: 'Last Name', required: true },
            { key: 'email', label: 'Email Address', required: true },
            { key: 'phone', label: 'Mobile Phone', required: true },
            { key: 'businessName', label: 'Business Name', required: true },
            { key: 'title', label: 'Organizational Title', required: false },
            { key: 'membershipLevel', label: 'Membership Level', required: false, formatter: formatMembershipLevel },
            { key: 'businessDescription', label: 'Business Description', required: false },
            { key: 'timestamp', label: 'Application Submitted', required: true, formatter: formatTimestamp }
        ];

        // Check if we have data
        const hasData = fieldsToDisplay.some(field => params[field.key]);

        if (!hasData) {
            summaryContainer.innerHTML = `
                <div class="error">
                    <h3>No application data found</h3>
                    <p>It looks like you accessed this page directly. Please submit the membership form to see your application summary.</p>
                    <a href="join.html" class="btn btn-primary" style="margin-top: 1rem;">Return to Join Form</a>
                </div>
            `;
            return;
        }

        // Create summary HTML
        let summaryHTML = '<div class="summary-grid">';

        fieldsToDisplay.forEach(field => {
            const value = params[field.key];

            // Show required fields always, optional fields only if they have values
            if (field.required || (value && value.trim())) {
                let displayValue = value || 'Not provided';

                // Apply formatter if available
                if (field.formatter && value) {
                    displayValue = field.formatter(value);
                }

                // Truncate long descriptions
                if (field.key === 'businessDescription' && displayValue.length > 150) {
                    displayValue = displayValue.substring(0, 150) + '...';
                }

                summaryHTML += `
                    <div class="summary-item">
                        <span class="summary-label">${field.label}</span>
                        <span class="summary-value">${displayValue}</span>
                    </div>
                `;
            }
        });

        summaryHTML += '</div>';

        // Add a confirmation message
        summaryHTML += `
            <div style="margin-top: 2rem; padding: 1rem; background: #f0f9ff; border-radius: 8px; text-align: center;">
                <p style="color: #1e40af; font-weight: 500; margin: 0;">
                    Thank you — your application has been submitted successfully!
                </p>
                <p style="margin-top: .5rem; margin-bottom: 0;">
                    A confirmation has been sent to <strong>${params.email || 'your email address'}</strong>.
                </p>
                <a href="join.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
                    Return to Join Form
                </a>
            </div>
        `;

        // Insert HTML into the page
        summaryContainer.innerHTML = summaryHTML;
    }

    // Run on page load
    displayFormData();
});
