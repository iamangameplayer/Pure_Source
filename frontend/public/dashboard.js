// js/dashboard.js

const loadDonorDashboard = async () => {
    const dashboardDonorName = document.getElementById('dashboardDonorName');
    const activeDonationsDiv = document.getElementById('activeDonations');
    const donationHistoryDiv = document.getElementById('donationHistory');

    if (!dashboardDonorName || !activeDonationsDiv || !donationHistoryDiv) {
        console.error("Donor dashboard elements not found. HTML might not be loaded yet.");
        return;
    }

    // --- Backend Integration Placeholder ---
    // You'd fetch actual user name and their donations from backend
    try {
        // Example: Fetch user data
        const userResponse = await fetch('/api/user/profile');
        const userData = await userResponse.json();
        if (userResponse.ok) {
            dashboardDonorName.textContent = userData.name || 'Donor!';
        }

        // Example: Fetch active donations
        const activeDonationsResponse = await fetch('/api/user/donations/active');
        const activeDonations = await activeDonationsResponse.json();
        activeDonationsDiv.innerHTML = '';
        if (activeDonations.length === 0) {
            activeDonationsDiv.innerHTML = '<p class="text-gray-500">You currently have no active donations.</p>';
        } else {
            activeDonations.forEach(donation => {
                activeDonationsDiv.innerHTML += `<div class="bg-blue-50 p-3 rounded-lg">${donation.type} - ${donation.status}</div>`;
            });
        }

        // Example: Fetch donation history
        const donationHistoryResponse = await fetch('/api/user/donations/history');
        const donationHistory = await donationHistoryResponse.json();
        donationHistoryDiv.innerHTML = '';
        if (donationHistory.length === 0) {
            donationHistoryDiv.innerHTML = '<p class="text-gray-500">No past donations recorded yet.</p>';
        } else {
            donationHistory.forEach(history => {
                donationHistoryDiv.innerHTML += `<div class="bg-gray-100 p-3 rounded-lg">${history.type} - ${history.date}</div>`;
            });
        }

    } catch (error) {
        console.error('Error loading donor dashboard:', error);
        activeDonationsDiv.innerHTML = '<p class="text-red-500">Failed to load active donations.</p>';
        donationHistoryDiv.innerHTML = '<p class="text-red-500">Failed to load donation history.</p>';
    }
    // --- End Backend Integration Placeholder ---
};

const loadRecipientDashboard = async () => {
    const dashboardRecipientName = document.getElementById('dashboardRecipientName');
    const activeRequestsDiv = document.getElementById('activeRequests');
    const receivedHistoryDiv = document.getElementById('receivedHistory');

    if (!dashboardRecipientName || !activeRequestsDiv || !receivedHistoryDiv) {
        console.error("Recipient dashboard elements not found. HTML might not be loaded yet.");
        return;
    }

    // --- Backend Integration Placeholder ---
    // You'd fetch actual user name and their requests from backend
    try {
         // Example: Fetch user data
        const userResponse = await fetch('/api/user/profile');
        const userData = await userResponse.json();
        if (userResponse.ok) {
            dashboardRecipientName.textContent = userData.name || 'Recipient!';
        }

        // Example: Fetch active requests
        const activeRequestsResponse = await fetch('/api/user/requests/active');
        const activeRequests = await activeRequestsResponse.json();
        activeRequestsDiv.innerHTML = '';
        if (activeRequests.length === 0) {
            activeRequestsDiv.innerHTML = '<p class="text-gray-500">You currently have no active requests.</p>';
        } else {
            activeRequests.forEach(request => {
                activeRequestsDiv.innerHTML += `<div class="bg-blue-50 p-3 rounded-lg">${request.type} - ${request.status}</div>`;
            });
        }

        // Example: Fetch received history
        const receivedHistoryResponse = await fetch('/api/user/received/history');
        const receivedHistory = await receivedHistoryResponse.json();
        receivedHistoryDiv.innerHTML = '';
        if (receivedHistory.length === 0) {
            receivedHistoryDiv.innerHTML = '<p class="text-gray-500">No received items/sessions recorded yet.</p>';
        } else {
            receivedHistory.forEach(received => {
                receivedHistoryDiv.innerHTML += `<div class="bg-gray-100 p-3 rounded-lg">${received.type} - ${received.dateReceived}</div>`;
            });
        }

    } catch (error) {
        console.error('Error loading recipient dashboard:', error);
        activeRequestsDiv.innerHTML = '<p class="text-red-500">Failed to load active requests.</p>';
        receivedHistoryDiv.innerHTML = '<p class="text-red-500">Failed to load received history.</p>';
    }
    // --- End Backend Integration Placeholder ---
};