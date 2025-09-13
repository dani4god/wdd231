// Directory page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const membersContainer = document.getElementById('members-container');
    const loadingElement = document.getElementById('loading');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const membershipFilter = document.getElementById('membership-filter');
    
    // State variables
    let allMembers = [];
    let filteredMembers = [];
    let currentView = 'grid';
    let currentFilter = 'all';
    
    // Fetch members data
    async function fetchMembers() {
        try {
            showLoading(true);
            const response = await fetch('data/members.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allMembers = data.members;
            filteredMembers = [...allMembers];
            
            displayMembers(filteredMembers);
            showLoading(false);
            
        } catch (error) {
            console.error('Error fetching members:', error);
            showError('Unable to load member directory. Please try again later.');
            showLoading(false);
        }
    }
    
    // Show/hide loading state
    function showLoading(show) {
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
        if (membersContainer) {
            membersContainer.style.display = show ? 'none' : 'grid';
        }
    }
    
    // Show error message
    function showError(message) {
        if (membersContainer) {
            membersContainer.innerHTML = `
                <div class="error">
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                </div>
            `;
            membersContainer.style.display = 'block';
        }
    }
    
    // Get membership level name and class
    function getMembershipInfo(level) {
        switch(level) {
            case 3:
                return { name: 'Gold', class: 'gold' };
            case 2:
                return { name: 'Silver', class: 'silver' };
            case 1:
            default:
                return { name: 'Member', class: 'member' };
        }
    }
    
    // Format address
    function formatAddress(member) {
        return `${member.address}<br>${member.city}, ${member.state} ${member.zip}`;
    }
    
    // Create member card HTML
    function createMemberCard(member) {
        const membershipInfo = getMembershipInfo(member.membershipLevel);
        
        return `
            <div class="member-card ${membershipInfo.class}">
                <div class="member-header">
                    <img src="${member.image}" alt="${member.name} logo" class="member-logo" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                         onload="this.style.display='block';">
                    <div style="display:none; width:80px; height:80px; background:#f3f4f6; border-radius:8px; flex-shrink:0;"></div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <span class="membership-badge badge ${membershipInfo.class}">
                            ${membershipInfo.name}
                        </span>
                    </div>
                </div>
                
                <div class="member-details">
                    <p><strong>Category:</strong> ${member.category}</p>
                    <p><strong>Address:</strong><br>${formatAddress(member)}</p>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Member Since:</strong> ${member.yearJoined}</p>
                    <p>${member.description}</p>
                    
                    ${member.services && member.services.length > 0 ? 
                        `<p><strong>Services:</strong> ${member.services.join(', ')}</p>` : ''
                    }
                </div>
                
                <div class="member-contact">
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">
                        Visit Website →
                    </a>
                </div>
            </div>
        `;
    }
    
    // Display members
    function displayMembers(members) {
        if (!membersContainer) return;
        
        if (members.length === 0) {
            membersContainer.innerHTML = `
                <div class="error">
                    <h3>No members found</h3>
                    <p>No members match the current filter criteria.</p>
                </div>
            `;
            return;
        }
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        
        members.forEach(member => {
            tempDiv.innerHTML = createMemberCard(member);
            fragment.appendChild(tempDiv.firstElementChild);
        });
        
        // Clear and append all at once to prevent flashing
        membersContainer.innerHTML = '';
        membersContainer.appendChild(fragment);
        
        // Update container class based on current view
        updateViewClass();
    }
    
    // Update view class
    function updateViewClass() {
        if (!membersContainer) return;
        
        membersContainer.classList.remove('list-view', 'grid-view');
        membersContainer.classList.add(`${currentView}-view`);
    }
    
    // Filter members by membership level
    function filterMembers(level) {
        if (level === 'all') {
            filteredMembers = [...allMembers];
        } else {
            const filterLevel = parseInt(level);
            filteredMembers = allMembers.filter(member => member.membershipLevel === filterLevel);
        }
        
        displayMembers(filteredMembers);
    }
    
    // Toggle between grid and list view
    function toggleView(newView) {
        if (newView === currentView) return;
        
        currentView = newView;
        
        // Update button states
        if (gridViewBtn && listViewBtn) {
            gridViewBtn.classList.toggle('active', newView === 'grid');
            listViewBtn.classList.toggle('active', newView === 'list');
        }
        
        // Update container class
        updateViewClass();
        
        // Save preference to localStorage (if available)
        try {
            localStorage.setItem('directory-view', newView);
        } catch (e) {
            // localStorage not available, continue without saving
        }
    }
    
    // Load saved view preference
    function loadViewPreference() {
        try {
            const savedView = localStorage.getItem('directory-view');
            if (savedView && (savedView === 'grid' || savedView === 'list')) {
                toggleView(savedView);
            }
        } catch (e) {
            // localStorage not available, use default
        }
    }
    
    // Event Listeners
    
    // View toggle buttons
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => toggleView('grid'));
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => toggleView('list'));
    }
    
    // Membership filter
    if (membershipFilter) {
        membershipFilter.addEventListener('change', function() {
            currentFilter = this.value;
            filterMembers(currentFilter);
        });
    }
    
    // Keyboard navigation for view buttons
    if (gridViewBtn) {
        gridViewBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleView('grid');
            }
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleView('list');
            }
        });
    }
    
    // Initialize the page
    function init() {
        loadViewPreference();
        fetchMembers();
    }
    
    // Start the application
    init();
    
    // Handle window resize for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Re-apply view class if needed
            updateViewClass();
        }, 150);
    });
});
