// js/education.js

const loadEducationSupportModule = (userRole) => {
    const educationOfferFormContainer = document.querySelector('#education-support .grid > div:first-child');
    const educationRecipientSectionContainer = document.querySelector('#education-support .grid > div:last-child');

    if (!educationOfferFormContainer || !educationRecipientSectionContainer) {
        console.error("Education module containers not found.");
        return;
    }

    educationOfferFormContainer.innerHTML = '';
    educationRecipientSectionContainer.innerHTML = '';

    if (userRole === 'donor') { // For education, "donor" is someone offering to teach/resources
        educationOfferFormContainer.innerHTML = `
            <h3 class="text-2xl font-semibold text-indigo-600 mb-4">Offer Online Sessions</h3>
            <form id="educationOfferForm" class="space-y-4">
                <div>
                    <label for="teacherName" class="block text-gray-700 font-semibold mb-2">Your Name:</label>
                    <input type="text" id="teacherName" name="teacherName" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required>
                </div>
                <div>
                    <label for="subject" class="block text-gray-700 font-semibold mb-2">Subject/Topic:</label>
                    <input type="text" id="subject" name="subject" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Mathematics, English Grammar, Basic Coding" required>
                </div>
                <div>
                    <label for="sessionDetails" class="block text-gray-700 font-semibold mb-2">Session Details:</label>
                    <textarea id="sessionDetails" name="sessionDetails" rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe what you will teach and for whom (e.g., 'Algebra for 8th graders', 'Beginner English Conversation')"></textarea>
                </div>
                 <div>
                    <label for="sessionLink" class="block text-gray-700 font-semibold mb-2">Video Lecture Link (YouTube/Vimeo etc.):</label>
                    <input type="url" id="sessionLink" name="sessionLink" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://youtube.com/your-lecture-link">
                </div>
                <div>
                    <label for="quizLink" class="block text-gray-700 font-semibold mb-2">Quiz Link (Optional):</label>
                    <input type="url" id="quizLink" name="quizLink" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://forms.google.com/your-quiz">
                </div>
                <div>
                    <label for="availability" class="block text-gray-700 font-semibold mb-2">Preferred Availability:</label>
                    <input type="text" id="availability" name="availability" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Mon/Wed/Fri 4-5 PM IST">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="offerOffline" name="offerOffline" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <label for="offerOffline" class="ml-2 block text-gray-700">Willing to offer offline sessions?</label>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300">Offer Session</button>
            </form>
        `;
        educationRecipientSectionContainer.remove();
        attachEducationDonorEventListeners();

    } else if (userRole === 'recipient') { // For education, "recipient" is a learner
        educationRecipientSectionContainer.innerHTML = `
            <h3 class="text-2xl font-semibold text-purple-600 mb-4">Explore Learning Resources</h3>
            <div id="educationListings" class="space-y-4">
                <p class="text-gray-500 text-center">Loading educational sessions...</p>
            </div>
        `;
        educationOfferFormContainer.remove();
        attachEducationRecipientEventListeners();

    } else {
        educationOfferFormContainer.innerHTML = '<p class="text-center text-xl text-gray-600">Please log in to offer or access educational support.</p>';
        educationRecipientSectionContainer.remove();
    }
};

const attachEducationDonorEventListeners = () => {
    const educationOfferForm = document.getElementById('educationOfferForm');
    if (educationOfferForm) {
        educationOfferForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(educationOfferForm);
            const educationData = Object.fromEntries(formData.entries());
            console.log('Education Offer Submitted:', educationData);

            // --- Backend Integration Placeholder ---
            try {
                const response = await fetch('/api/offer-education', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(educationData)
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Education session offered successfully!');
                    educationOfferForm.reset();
                    window.navigate('donor-dashboard'); // Navigate to donor dashboard
                } else {
                    alert(`Failed to offer session: ${data.message || 'An error occurred'}`);
                }
            } catch (error) {
                console.error('Error offering session:', error);
                alert('An error occurred while offering education session. Please try again.');
            }
        });
    }
};

const attachEducationRecipientEventListeners = () => {
    const educationListingsDiv = document.getElementById('educationListings');
    if (educationListingsDiv) {
        loadEducationListings(); // Load initial listings
    }
};

const loadEducationListings = async () => {
    const educationListingsDiv = document.getElementById('educationListings');
    if (!educationListingsDiv) return;

    educationListingsDiv.innerHTML = '<p class="text-gray-500 text-center">Loading sessions...</p>';
    try {
        const sampleSessions = [
            { id: 1, teacher: 'Dr. Chaitanya Kishore', subject: 'Basic Python Programming', details: 'Introduction to Python for beginners, covering variables, loops, and functions.', link: 'https://www.youtube.com/embed/rfscVS0vtbw', quiz: 'https://forms.gle/samplequiz1', availability: 'Tue/Thu 6-7 PM IST', offline: false },
            { id: 2, teacher: 'A. Venkata Kavya Sri', subject: 'Frontend Web Development Basics', details: 'Learn HTML, CSS, and basic JavaScript to build simple web pages.', link: 'https://www.youtube.com/embed/pQN-oXT30PE', quiz: '', availability: 'Mon/Wed 3-4 PM IST', offline: true },
            { id: 3, teacher: 'B. Naga Sai Vignesh', subject: 'Supervised Machine Learning Concepts', details: 'Understanding core concepts of supervised learning like regression and classification.', link: 'https://www.youtube.com/embed/K_xzt4y8e00', quiz: 'https://forms.gle/samplequiz2', availability: 'Sat 10-11 AM IST', offline: false }
        ];

        educationListingsDiv.innerHTML = '';
        if (sampleSessions.length === 0) {
            educationListingsDiv.innerHTML = '<p class="text-gray-500 text-center">No educational sessions available yet.</p>';
            return;
        }

        sampleSessions.forEach(session => {
            const sessionCard = document.createElement('div');
            sessionCard.className = 'bg-gray-100 p-4 rounded-lg shadow-sm';
            sessionCard.innerHTML = `
                <h4 class="text-xl font-semibold text-gray-800">${session.subject}</h4>
                <p class="text-gray-600">By: ${session.teacher}</p>
                <p class="text-gray-600 mb-2">${session.details}</p>
                <p class="text-gray-600">Availability: ${session.availability}</p>
                ${session.offline ? '<span class="text-sm font-medium text-purple-700 bg-purple-100 rounded-full px-3 py-1 mt-1 inline-block">Offline Possible</span>' : ''}
                <div class="mt-3 space-x-2">
                    <a href="${session.link}" target="_blank" class="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300">Watch Video</a>
                    ${session.quiz ? `<a href="${session.quiz}" target="_blank" class="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">Take Quiz</a>` : ''}
                    <button class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" onclick="contactDonor(${session.id}, 'education')">Contact Educator</button>
                </div>
            `;
            educationListingsDiv.appendChild(sessionCard);
        });
    } catch (error) {
        console.error('Error loading education listings:', error);
        educationListingsDiv.innerHTML = '<p class="text-center text-red-500 text-lg">Failed to load education listings.</p>';
    }
};