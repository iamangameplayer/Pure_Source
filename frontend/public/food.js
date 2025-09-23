// js/food.js

// Now accepts a 'userRole' parameter
const loadFoodDonationModule = (userRole) => {
    const foodDonationFormContainer = document.querySelector('#food-donation .grid > div:first-child'); // Targeting the donor form div
    const foodRecipientSectionContainer = document.querySelector('#food-donation .grid > div:last-child'); // Targeting the recipient listings div

    // Ensure elements are present
    if (!foodDonationFormContainer || !foodRecipientSectionContainer) {
        console.error("Food module containers not found.");
        return;
    }

    // Clear previous content to ensure clean render
    foodDonationFormContainer.innerHTML = '';
    foodRecipientSectionContainer.innerHTML = '';

    if (userRole === 'donor') {
        // Render Donor Form
        foodDonationFormContainer.innerHTML = `
            <h3 class="text-2xl font-semibold text-green-600 mb-4">Donate Food</h3>
            <form id="foodDonationForm" class="space-y-4">
                <div>
                    <label for="foodType" class="block text-gray-700 font-semibold mb-2">Food Item Name:</label>
                    <input type="text" id="foodType" name="foodType" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., Cooked Rice, Bread, Fruits" required>
                </div>
                <div>
                    <label for="foodQuantity" class="block text-gray-700 font-semibold mb-2">Quantity/Servings:</label>
                    <input type="text" id="foodQuantity" name="foodQuantity" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., 20 servings, 5 kg" required>
                </div>
                <div>
                    <label for="expirationDate" class="block text-gray-700 font-semibold mb-2">Best Before Date:</label>
                    <input type="date" id="expirationDate" name="expirationDate" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required>
                </div>
                <div>
                    <label for="dietaryRestrictions" class="block text-gray-700 font-semibold mb-2">Dietary Restrictions (Optional):</label>
                    <input type="text" id="dietaryRestrictions" name="dietaryRestrictions" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., Vegetarian, Gluten-free, Contains nuts">
                </div>
                <div>
                    <label for="pickupInstructions" class="block text-gray-700 font-semibold mb-2">Pickup Instructions (Optional):</label>
                    <textarea id="pickupInstructions" name="pickupInstructions" rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., Available for pickup after 6 PM, ring bell"></textarea>
                </div>
                <div>
                    <label for="foodPhotos" class="block text-gray-700 font-semibold mb-2">Upload Photos (Max 3):</label>
                    <input type="file" id="foodPhotos" name="foodPhotos" accept="image/*" multiple class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                </div>
                <button type="submit" class="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">List Food for Donation</button>
            </form>
        `;
        foodRecipientSectionContainer.remove(); // Remove recipient section for donor view
        attachFoodDonorEventListeners();

    } else if (userRole === 'recipient') {
        // Render Recipient Listings
        foodRecipientSectionContainer.innerHTML = `
            <h3 class="text-2xl font-semibold text-teal-600 mb-4">Find Food</h3>
            <div class="mb-4">
                <label for="foodCategoryFilter" class="block text-gray-700 font-semibold mb-2">Filter by Category:</label>
                <select id="foodCategoryFilter" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500">
                    <option value="">All Categories</option>
                    <option value="cooked">Cooked Meals</option>
                    <option value="fresh-produce">Fresh Produce</option>
                    <option value="packaged">Packaged Goods</option>
                    <option value="bakery">Bakery Items</option>
                </select>
            </div>
            <div id="foodListings" class="space-y-4">
                <p class="text-gray-500 text-center">Loading food listings...</p>
            </div>
        `;
        foodDonationFormContainer.remove(); // Remove donor section for recipient view
        attachFoodRecipientEventListeners();

    } else {
        // Default or unauthenticated view - maybe show a message to login
        foodDonationFormContainer.innerHTML = '<p class="text-center text-xl text-gray-600">Please log in to donate or receive food.</p>';
        foodRecipientSectionContainer.remove();
    }
};

// Helper function to attach event listeners for Donor Form
const attachFoodDonorEventListeners = () => {
    const foodDonationForm = document.getElementById('foodDonationForm');
    if (foodDonationForm) {
        foodDonationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(foodDonationForm);
            const foodData = Object.fromEntries(formData.entries());
            console.log('Food Donation Submitted:', foodData);

            // --- Backend Integration Placeholder ---
            try {
                const response = await fetch('/api/donate-food', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Include token
                    body: JSON.stringify(foodData)
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Food listing created successfully!');
                    foodDonationForm.reset();
                    // Optionally, navigate to donor dashboard or show success message
                    window.navigate('donor-dashboard');
                } else {
                    alert(`Failed to list food: ${data.message || 'An error occurred'}`);
                }
            } catch (error) {
                console.error('Error listing food:', error);
                alert('An error occurred while listing food. Please try again.');
            }
        });
    }
};

// Helper function to attach event listeners for Recipient Listings
const attachFoodRecipientEventListeners = () => {
    const foodCategoryFilter = document.getElementById('foodCategoryFilter');
    const foodListingsDiv = document.getElementById('foodListings');

    if (foodCategoryFilter && foodListingsDiv) {
        foodCategoryFilter.addEventListener('change', () => {
            const selectedCategory = foodCategoryFilter.value;
            loadFoodListings(selectedCategory);
        });
        loadFoodListings(); // Load initial listings
    }
};

// Function to load food listings (remains largely same)
const loadFoodListings = async (filterCategory = '') => {
    const foodListingsDiv = document.getElementById('foodListings');
    if (!foodListingsDiv) return;

    foodListingsDiv.innerHTML = '<p class="text-gray-500 text-center">Loading listings...</p>';
    try {
        // Sample data for demonstration, replace with actual API call
        const sampleFoods = [
            { id: 1, type: 'Cooked Rice & Dal', quantity: '30 servings', expiry: '2025-07-20', restrictions: 'Vegetarian', pickup: 'Available 7-9 PM', photos: ['https://via.placeholder.com/150/FF6347/FFFFFF?text=Food1'], category: 'cooked' },
            { id: 2, type: 'Fresh Bread', quantity: '10 loaves', expiry: '2025-07-21', restrictions: 'None', pickup: 'Anytime after 10 AM', photos: ['https://via.placeholder.com/150/4682B4/FFFFFF?text=Food2'], category: 'bakery' },
            { id: 3, type: 'Assorted Fruits', quantity: '5 kg', expiry: '2025-07-22', restrictions: 'None', pickup: 'Contact for details', photos: ['https://via.placeholder.com/150/32CD32/FFFFFF?text=Food3'], category: 'fresh-produce' },
            { id: 4, type: 'Packaged Biscuits', quantity: '20 packs', expiry: '2026-01-15', restrictions: 'None', pickup: 'From supermarket', photos: ['https://via.placeholder.com/150/FFD700/FFFFFF?text=Food4'], category: 'packaged' }
        ];

        const filteredFoods = filterCategory
            ? sampleFoods.filter(food => food.category === filterCategory)
            : sampleFoods;

        foodListingsDiv.innerHTML = '';
        if (filteredFoods.length === 0) {
            foodListingsDiv.innerHTML = '<p class="text-gray-500 text-center">No listings found for this category.</p>';
            return;
        }

        filteredFoods.forEach(food => {
            const foodCard = document.createElement('div');
            foodCard.className = 'bg-gray-100 p-4 rounded-lg shadow-sm flex items-start space-x-4';
            foodCard.innerHTML = `
                <img src="${food.photos[0] || 'https://via.placeholder.com/150/CCCCCC/808080?text=Food'}" alt="${food.type}" class="w-24 h-24 object-cover rounded-md">
                <div>
                    <h4 class="text-xl font-semibold text-gray-800">${food.type}</h4>
                    <p class="text-gray-600">Quantity: ${food.quantity}</p>
                    <p class="text-gray-600">Best Before: ${food.expiry}</p>
                    ${food.restrictions ? `<p class="text-gray-600">Restrictions: ${food.restrictions}</p>` : ''}
                    <p class="text-gray-600">Pickup: ${food.pickup}</p>
                    <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" onclick="contactDonor(${food.id}, 'food')">Contact Donor</button>
                </div>
            `;
            foodListingsDiv.appendChild(foodCard);
        });
    } catch (error) {
        console.error('Error loading food listings:', error);
        foodListingsDiv.innerHTML = '<p class="text-center text-red-500 text-lg">Failed to load food listings.</p>';
    }
};

window.contactDonor = (itemId, itemType) => {
    alert(`Initiating contact for ${itemType} item ID: ${itemId}. (This would open a chat/messaging interface via backend)`);
    console.log(`Contact donor for ${itemType} item ID:`, itemId);
};