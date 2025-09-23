// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const dynamicContentArea = document.getElementById('dynamic-content-area');
    const homeSection = document.getElementById('home-section');
    const loginRegisterBtn = document.getElementById('loginRegisterBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const profileBtn = document.getElementById('profileBtn');

    // Simulate logged-in user state and role (REMOVE IN PRODUCTION, USE BACKEND)
    // For testing: Set these manually or after a simulated login/register
    let isLoggedIn = false;
    let currentUserRole = null; // 'donor' or 'recipient'

    const pagePaths = {
        'home': 'home-section', // Special case for the hero section
        'login-register': 'pages/login-register.html',
        'food-donation': 'pages/food-donation.html',
        'education-support': 'pages/education-support.html',
        'amenities-donation': 'pages/amenities-donation.html',
        'donor-dashboard': 'pages/donor-dashboard.html',
        'recipient-dashboard': 'pages/recipient-dashboard.html',
        'profile-settings': 'pages/profile-settings.html',
        'crisis-mode': 'pages/crisis-mode.html'
    };

    window.navigate = async (page) => {
        // Clear previous content before loading new
        dynamicContentArea.innerHTML = '<p class="text-center text-gray-500 text-xl py-20">Loading...</p>';

        // Handle visibility of home section vs dynamic content
        if (page !== 'home') {
            homeSection.classList.add('hidden');
            dynamicContentArea.classList.remove('hidden');
        } else {
            homeSection.classList.remove('hidden');
            dynamicContentArea.classList.add('hidden'); // Hide dynamic area if on home
            history.pushState(null, '', `#home`);
            return;
        }

        const path = pagePaths[page];
        if (!path) {
            console.error(`Page '${page}' not found.`);
            dynamicContentArea.innerHTML = '<p class="text-center text-red-500 text-xl py-20">Error: Page not found.</p>';
            return;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            dynamicContentArea.innerHTML = htmlContent;

            history.pushState(null, '', `#${page}`);

            // Call the corresponding JS initialization function for the loaded module
            // Pass the current user role to these functions
            switch (page) {
                case 'login-register':
                    loadLoginRegisterForm();
                    break;
                case 'food-donation':
                    loadFoodDonationModule(currentUserRole); // Pass role
                    break;
                case 'education-support':
                    loadEducationSupportModule(currentUserRole); // Pass role
                    break;
                case 'amenities-donation':
                    loadAmenitiesDonationModule(currentUserRole); // Pass role
                    break;
                case 'donor-dashboard':
                    loadDonorDashboard();
                    break;
                case 'recipient-dashboard':
                    loadRecipientDashboard();
                    break;
                case 'profile-settings':
                    loadProfileSettings();
                    break;
                case 'crisis-mode':
                    loadCrisisModeContent();
                    break;
            }
        } catch (error) {
            console.error(`Could not load page ${page}:`, error);
            dynamicContentArea.innerHTML = `<p class="text-center text-red-500 text-xl py-20">Failed to load content for ${page}. Please try again.</p>`;
        }
    };

    // --- User Authentication State Management ---
    // This is where you'll integrate with your backend's actual auth state.
    // For now, it's a simulation.
    window.updateAuthUI = (loggedInStatus, role = null) => {
        isLoggedIn = loggedInStatus;
        currentUserRole = role;

        if (isLoggedIn) {
            loginRegisterBtn.classList.add('hidden');
            dashboardBtn.classList.remove('hidden');
            profileBtn.classList.remove('hidden');

            dashboardBtn.textContent = role === 'donor' ? 'Donor Dashboard' : 'Recipient Dashboard';
            dashboardBtn.onclick = () => { navigate(`${role}-dashboard`); };

            // Add a Logout button for logged-in users
            if (!document.getElementById('logoutBtn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.className = 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ml-4';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', () => {
                    alert('Logging out...'); // Replace with actual backend logout API call
                    window.updateAuthUI(false, null);
                    navigate('home');
                });
                dashboardBtn.parentNode.insertBefore(logoutBtn, dashboardBtn.nextSibling);
            }

        } else {
            loginRegisterBtn.classList.remove('hidden');
            dashboardBtn.classList.add('hidden');
            profileBtn.classList.add('hidden');
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.remove();
            }
        }
    };

    // Initial check for authentication state (e.g., from local storage token)
    // updateAuthUI(localStorage.getItem('authToken') ? true : false, localStorage.getItem('userRole'));
    // For immediate testing, let's set a default state:
    // window.updateAuthUI(true, 'donor'); // Uncomment to start as logged-in donor
    // window.updateAuthUI(true, 'recipient'); // Uncomment to start as logged-in recipient
    // updateAuthUI(false, null); // Start as logged out

    // --- Event Listeners ---
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            navigate(pageId);
        });
    });

    loginRegisterBtn.addEventListener('click', () => {
        navigate('login-register');
    });

    profileBtn.addEventListener('click', () => {
        navigate('profile-settings');
    });

    // Handle initial load based on URL hash (if any)
    const initialHash = window.location.hash.substring(1);
    if (initialHash && pagePaths[initialHash]) {
        navigate(initialHash);
    } else {
        navigate('home'); // Load home section by default
    }
});