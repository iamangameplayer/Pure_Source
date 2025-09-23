// js/profile.js

const loadProfileSettings = async () => {
    const profileSettingsForm = document.getElementById('profileSettingsForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profileIsPublicCheckbox = document.getElementById('profileIsPublic');

    if (!profileSettingsForm || !changePasswordForm || !profileNameInput || !profileEmailInput || !profileIsPublicCheckbox) {
        console.error("Profile settings elements not found. HTML might not be loaded yet.");
        return;
    }

    // --- Backend Integration Placeholder: Load existing profile data ---
    try {
        const response = await fetch('/api/user/profile'); // Assuming an API endpoint for user profile
        if (response.ok) {
            const userData = await response.json();
            profileNameInput.value = userData.name || '';
            profileEmailInput.value = userData.email || '';
            profileIsPublicCheckbox.checked = userData.isPublicProfile || false;
        } else {
            console.error('Failed to fetch user profile:', response.statusText);
            alert('Failed to load profile data.');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('An error occurred while loading profile data.');
    }
    // --- End Backend Integration Placeholder ---

    profileSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = profileNameInput.value;
        const isPublic = profileIsPublicCheckbox.checked;

        // --- Backend Integration Placeholder: Update profile data ---
        console.log('Profile Settings Saved:', { name, isPublic });
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT', // or PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, isPublicProfile: isPublic })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
                console.log('Profile update response:', data);
            } else {
                alert(`Failed to update profile: ${data.message || 'An error occurred'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating profile. Please try again.');
        }
        // --- End Backend Integration Placeholder ---
    });

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }

        // --- Backend Integration Placeholder: Change password ---
        console.log('Change Password Attempt:', { currentPassword, newPassword });
        try {
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Password changed successfully!');
                changePasswordForm.reset();
            } else {
                alert(`Failed to change password: ${data.message || 'An error occurred'}`);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred while changing password. Please try again.');
        }
        // --- End Backend Integration Placeholder ---
    });
};