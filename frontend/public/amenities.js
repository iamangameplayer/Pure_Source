// js/amenities.js

const loadAmenitiesDonationModule = (userRole) => {
    const amenityDonationFormContainer = document.querySelector('#amenities-donation .grid > div:first-child');
    const amenityRecipientSectionContainer = document.querySelector('#amenities-donation .grid > div:last-child');

    if (!amenityDonationFormContainer || !amenityRecipientSectionContainer) {
        console.error("Amenities module containers not found.");
        return;
    }

    amenityDonationFormContainer.innerHTML = '';
    amenityRecipientSectionContainer.innerHTML = '';

    if (userRole === 'donor') {
        amenityDonationFormContainer.innerHTML = `
            <h3 class="text-2xl font-semibold text-red-600 mb-4">Donate Amenities</h3>
            <form id="amenityDonationForm" class="space-y-4">
                <div>
                    <label for="amenityType" class="block text-gray-700 font-semibold mb-2">Amenity Item Name:</label>
                    <input type="text" id="amenityType" name="amenityType" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="e.g., Clothes, Furniture, Electronics" required>
                </div>
                <div>
                    <label for="amenityCondition" class="block text-gray-700 font-semibold mb-2">Condition:</label>
                    <select id="amenityCondition" name="amenityCondition" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" required>
                        <option value="">Select Condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="worn">Worn</option>
                    </select>
                </div>
                 <div>
                    <label for="amenitySize" class="block text-gray-700 font-semibold mb-2">Size/Dimensions (Optional):</label>
                    <input type="text" id="amenitySize" name="amenitySize" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="e.g., L, XL, 30x40cm, Adult, Child">
                </div>
                <div>
                    <label for="amenityDescription" class="block text-gray-700 font-semibold mb-2">Description (Optional):</label>
                    <textarea id="amenityDescription" name="amenityDescription" rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="e.g., Gently used winter coats, Working TV with remote"></textarea>
                </div>
                <div>
                    <label for="amenityPhotos" class="block text-gray-700 font-semibold mb-2">Upload Photos (Max 3):</label>
                    <input type="file" id="amenityPhotos" name="amenityPhotos" accept="image/*" multiple class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
                <button type="submit" class="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300">List Amenity for Donation</button>
            </form>
        `;
        amenityRecipientSectionContainer.remove();
        attachAmenitiesDonorEventListeners();

    } else if (userRole === 'recipient') {
        amenityRecipientSectionContainer.innerHTML = `
            <h3 class="text-2xl font-semibold text-orange-600 mb-4">Find Amenities</h3>
            <div class="mb-4">
                <label for="amenitySearch" class="block text-gray-700 font-semibold mb-2">Search/Browse Amenities:</label>
                <input type="text" id="amenitySearch" placeholder="Search for clothes, furniture, etc." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500">
            </div>
            <div id="amenityListings" class="space-y-4">
                <p class="text-gray-500 text-center">Loading amenity listings...</p>
            </div>

             <div class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-2">Crisis Mode <span class="text-sm font-normal">(Emergency Needs)</span></h3>
                <p class="mb-3">During natural disasters or crises, specific urgent needs will be highlighted here.</p>
                <button id="viewCrisisNeedsBtn" class="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-300">View Crisis Needs</button>
            </div>
        `;
        amenityDonationFormContainer.remove();
        attachAmenitiesRecipientEventListeners();

    } else {
        amenityDonationFormContainer.innerHTML = '<p class="text-center text-xl text-gray-600">Please log in to donate or receive amenities.</p>';
        amenityRecipientSectionContainer.remove();
    }
};

const attachAmenitiesDonorEventListeners = () => {
    const amenityDonationForm = document.getElementById('amenityDonationForm');
    if (amenityDonationForm) {
        amenityDonationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(amenityDonationForm);
            const amenityData = Object.fromEntries(formData.entries());
            console.log('Amenity Donation Submitted:', amenityData);

            // --- Backend Integration Placeholder ---
            try {
                const response = await fetch('/api/donate-amenity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(amenityData)
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Amenity listing created successfully!');
                    amenityDonationForm.reset();
                    window.navigate('donor-dashboard'); // Navigate to donor dashboard
                } else {
                    alert(`Failed to list amenity: ${data.message || 'An error occurred'}`);
                }
            } catch (error) {
                console.error('Error listing amenity:', error);
                alert('An error occurred while listing amenity. Please try again.');
            }
        });
    }
};

const attachAmenitiesRecipientEventListeners = () => {
    const amenitySearchInput = document.getElementById('amenitySearch');
    const amenityListingsDiv = document.getElementById('amenityListings');
    const viewCrisisNeedsBtn = document.getElementById('viewCrisisNeedsBtn');

    if (amenitySearchInput && amenityListingsDiv && viewCrisisNeedsBtn) {
        amenitySearchInput.addEventListener('input', () => {
            const searchTerm = amenitySearchInput.value.toLowerCase();
            loadAmenityListings(searchTerm);
        });

        viewCrisisNeedsBtn.addEventListener('click', () => {
            window.navigate('crisis-mode');
        });

        loadAmenityListings(); // Load initial listings
    }
};

const loadAmenityListings = async (searchTerm = '') => {
    const amenityListingsDiv = document.getElementById('amenityListings');
    if (!amenityListingsDiv) return;

    amenityListingsDiv.innerHTML = '<p class="text-gray-500 text-center">Loading listings...</p>';
    try {
        const sampleAmenities = [
            { id: 1, type: 'Winter Coats', condition: 'Good', size: 'Adult Large', description: 'Gently used, clean winter coats.', photos: ['https://via.placeholder.com/150/000080/FFFFFF?text=Coat'], category: 'clothing' },
            { id: 2, type: 'Study Table', condition: 'Like New', size: '100x60cm', description: 'Small study table, perfect for students.', photos: ['https://via.placeholder.com/150/8A2BE2/FFFFFF?text=Table'], category: 'furniture' },
            { id: 3, type: 'Working Television', condition: 'Good', size: '32-inch', description: 'Older model, but fully functional TV with remote.', photos: ['https://via.placeholder.com/150/FF4500/FFFFFF?text=TV'], category: 'electronics' },
            { id: 4, type: 'Hygiene Kits', condition: 'New', size: 'Standard', description: 'Contains soap, toothbrush, toothpaste, and shampoo.', photos: ['https://via.placeholder.com/150/DA70D6/FFFFFF?text=Hygiene'], category: 'hygiene' }
        ];

        const filteredAmenities = sampleAmenities.filter(amenity =>
            amenity.type.toLowerCase().includes(searchTerm) ||
            amenity.description.toLowerCase().includes(searchTerm) ||
            amenity.condition.toLowerCase().includes(searchTerm)
        );

        amenityListingsDiv.innerHTML = '';
        if (filteredAmenities.length === 0) {
            amenityListingsDiv.innerHTML = '<p class="text-gray-500 text-center">No amenities found matching your search.</p>';
            return;
        }

        filteredAmenities.forEach(amenity => {
            const amenityCard = document.createElement('div');
            amenityCard.className = 'bg-gray-100 p-4 rounded-lg shadow-sm flex items-start space-x-4';
            amenityCard.innerHTML = `
                <img src="${amenity.photos[0] || 'https://via.placeholder.com/150/CCCCCC/808080?text=No+Image'}" alt="${amenity.type}" class="w-24 h-24 object-cover rounded-md">
                <div>
                    <h4 class="text-xl font-semibold text-gray-800">${amenity.type}</h4>
                    <p class="text-gray-600">Condition: ${amenity.condition}</p>
                    ${amenity.size ? `<p class="text-gray-600">Size: ${amenity.size}</p>` : ''}
                    ${amenity.description ? `<p class="text-gray-600">Description: ${amenity.description}</p>` : ''}
                    <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" onclick="contactDonor(${amenity.id}, 'amenity')">Contact Donor</button>
                </div>
            `;
            amenityListingsDiv.appendChild(amenityCard);
        });
    } catch (error) {
        console.error('Error loading amenity listings:', error);
        amenityListingsDiv.innerHTML = '<p class="text-center text-red-500 text-lg">Failed to load amenity listings.</p>';
    }
};

const loadCrisisModeContent = () => {
    // This static content HTML is loaded by main.js, this function just logs it.
    console.log("Crisis mode content loaded.");
};