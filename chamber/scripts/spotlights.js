// Member spotlights functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const spotlightsContainer = document.getElementById('spotlights-container');
    
    // State variables
    let allMembers = [];
    
    // Fetch members data
    async function fetchMembers() {
        try {
            const response = await fetch('data/members.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allMembers = data.members;
            
            displaySpotlights();
            
        } catch (error) {
            console.error('Error fetching members:', error);
            showSpotlightsError();
        }
    }
    
    // Filter gold and silver members
    function getQualifiedMembers() {
        return allMembers.filter(member => member.membershipLevel >= 2); // Gold (3) and Silver (2)
    }
    
    // Randomly select 2-3 members for spotlights
    function selectRandomSpotlights() {
        const qualifiedMembers = getQualifiedMembers();
        
        if (qualifiedMembers.length === 0) {
            return [];
        }
        
        // Determine number of spotlights (2 or 3)
        const numSpotlights = Math.min(qualifiedMembers.length, Math.random() > 0.5 ? 3 : 2);
        
        // Shuffle and select random members
        const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numSpotlights);
    }
    
    // Get membership level info
    function getMembershipInfo(level) {
        switch(level) {
            case 3:
                return { name: 'Gold Member', class: 'gold' };
            case 2:
                return { name: 'Silver Member', class: 'silver' };
            default:
                return { name: 'Member', class: 'member' };
        }
    }
    
    // Format phone number for display
    function formatPhoneNumber(phone) {
        return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    
    // Create spotlight card HTML
    function createSpotlightCard(member) {
        const membershipInfo = getMembershipInfo(member.membershipLevel);
        const companyInitials = member.name.split(' ').map(word => word[0]).join('').substring(0, 2);
        
        return `
            <div class="spotlight-card ${membershipInfo.class}">
                <img src="${member.image}" alt="${member.name} logo" class="spotlight-logo" 
                     loading="lazy"
                     width="100" height="100"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.style.display='block'; this.nextElementSibling.style.display='none';">
                <div class="spotlight-logo placeholder" style="display:none; width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #f3f4f6, #e5e7eb); color:#6b7280; font-weight:600; font-size:1.5rem; margin:0 auto 1rem; border:3px solid #f1f5f9; align-items:center; justify-content:center;">${companyInitials}</div>
                
                <h3 class="spotlight-name">${member.name}</h3>
                <div class="spotlight-membership ${membershipInfo.class}">${membershipInfo.name}</div>
                
                <div class="spotlight-details">
                    <p><strong>📍</strong> ${member.address}<br>${member.city}, ${member.state} ${member.zip}</p>
                    <p><strong>📞</strong> ${formatPhoneNumber(member.phone)}</p>
                    ${member.description ? `<p class="spotlight-description">"${member.description}"</p>` : ''}
                </div>
                
                <div class="spotlight-contact">
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
                    <a href="tel:${member.phone.replace(/\D/g, '')}">Call Now</a>
                </div>
            </div>
        `;
    }
    
    // Display spotlights
    function displaySpotlights() {
        if (!spotlightsContainer) return;
        
        const selectedMembers = selectRandomSpotlights();
        
        if (selectedMembers.length === 0) {
            spotlightsContainer.innerHTML = `
                <div class="spotlights-error">
                    <p>No qualified members available for spotlights.</p>
                    <p>Gold and Silver members are eligible for spotlight features.</p>
                </div>
            `;
            return;
        }
        
        const spotlightsHTML = selectedMembers.map(member => createSpotlightCard(member)).join('');
        spotlightsContainer.innerHTML = spotlightsHTML;
        
        // Add animation class after a short delay
        setTimeout(() => {
            const cards = spotlightsContainer.querySelectorAll('.spotlight-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 100);
    }
    
    // Show error message
    function showSpotlightsError() {
        if (spotlightsContainer) {
            spotlightsContainer.innerHTML = `
                <div class="spotlights-error">
                    <h3>Unable to load member spotlights</h3>
                    <p>Please check back later to see featured members.</p>
                </div>
            `;
        }
    }
    
    // Add some demo spotlight members if the JSON doesn't load
    function showDemoSpotlights() {
        if (spotlightsContainer) {
            spotlightsContainer.innerHTML = `
                <div class="spotlight-card gold">
                    <div class="spotlight-logo placeholder" style="display:flex; width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #f3f4f6, #e5e7eb); color:#6b7280; font-weight:600; font-size:1.5rem; margin:0 auto 1rem; border:3px solid #f1f5f9; align-items:center; justify-content:center;">TS</div>
                    <h3 class="spotlight-name">TechSolutions Inc.</h3>
                    <div class="spotlight-membership gold">Gold Member</div>
                    <div class="spotlight-details">
                        <p><strong>📍</strong> 456 Innovation Blvd<br>Your City, ST 12345</p>
                        <p><strong>📞</strong> (555) 123-4567</p>
                        <p class="spotlight-description">"Leading provider of innovative technology solutions for businesses."</p>
                    </div>
                    <div class="spotlight-contact">
                        <a href="#" onclick="return false;">Visit Website</a>
                        <a href="#" onclick="return false;">Call Now</a>
                    </div>
                </div>
                
                <div class="spotlight-card silver">
                    <div class="spotlight-logo placeholder" style="display:flex; width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #f3f4f6, #e5e7eb); color:#6b7280; font-weight:600; font-size:1.5rem; margin:0 auto 1rem; border:3px solid #f1f5f9; align-items:center; justify-content:center;">GV</div>
                    <h3 class="spotlight-name">Green Valley Restaurant</h3>
                    <div class="spotlight-membership silver">Silver Member</div>
                    <div class="spotlight-details">
                        <p><strong>📍</strong> 123 Main Street<br>Your City, ST 12345</p>
                        <p><strong>📞</strong> (555) 234-5678</p>
                        <p class="spotlight-description">"Farm-to-table dining with locally sourced ingredients."</p>
                    </div>
                    <div class="spotlight-contact">
                        <a href="#" onclick="return false;">Visit Website</a>
                        <a href="#" onclick="return false;">Call Now</a>
                    </div>
                </div>
            `;
        }
    }
    
    // Initialize spotlights
    function initSpotlights() {
        // Try to fetch real data, fall back to demo if needed
        fetchMembers().catch(() => {
            console.log('Using demo spotlight data');
            showDemoSpotlights();
        });
    }
    
    // Start spotlights functionality
    initSpotlights();
    
    // Refresh spotlights every 5 minutes to show different random members
    setInterval(() => {
        if (allMembers.length > 0) {
            displaySpotlights();
        }
    }, 300000); // 5 minutes
    
    // Public method to refresh spotlights manually
    window.refreshSpotlights = function() {
        if (allMembers.length > 0) {
            displaySpotlights();
        } else {
            initSpotlights();
        }
    };
});
