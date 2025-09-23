// js/auth.js

const loadLoginRegisterForm = () => {
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (!showLoginBtn || !showRegisterBtn || !loginForm || !registerForm) {
        console.error("Login/Register form elements not found. HTML might not be loaded yet.");
        return;
    }

    // Ensure initial state is correct (login form visible)
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    showLoginBtn.classList.add('border-green-600', 'text-green-700');
    showLoginBtn.classList.remove('border-gray-300', 'text-gray-600');
    showRegisterBtn.classList.add('border-gray-300', 'text-gray-600');
    showRegisterBtn.classList.remove('border-green-600', 'text-green-700');


    showLoginBtn.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        showLoginBtn.classList.add('border-green-600', 'text-green-700');
        showLoginBtn.classList.remove('border-gray-300', 'text-gray-600');
        showRegisterBtn.classList.add('border-gray-300', 'text-gray-600');
        showRegisterBtn.classList.remove('border-green-600', 'text-green-700');
    });

    showRegisterBtn.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        showRegisterBtn.classList.add('border-green-600', 'text-green-700');
        showRegisterBtn.classList.remove('border-gray-300', 'text-gray-600');
        showLoginBtn.classList.add('border-gray-300', 'text-gray-600');
        showLoginBtn.classList.remove('border-green-600', 'text-green-700');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.loginEmail.value;
        const password = loginForm.loginPassword.value;
        const selectedRole = document.querySelector('input[name="loginRole"]:checked') ? document.querySelector('input[name="loginRole"]:checked').value : 'donor'; // Default to donor if no selection found

        // --- Backend Integration Placeholder ---
        console.log('Login attempt:', { email, password, role: selectedRole }); // Log role
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: selectedRole })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful! Welcome.');
                console.log('Login response:', data);
                const userRole = (email.includes('donor')) ? 'donor' : 'recipient'; // Example heuristic
                window.updateAuthUI(true, selectedRole); // Use selectedRole
                window.navigate(`${selectedRole}-dashboard`); // Navigate based on selected role
            } else {
                alert(`Login failed: ${data.message || 'Invalid credentials'}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
        // --- End Backend Integration Placeholder ---
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = registerForm.registerName.value;
        const email = registerForm.registerEmail.value;
        const password = registerForm.registerPassword.value;
        const confirmPassword = registerForm.confirmPassword.value;
        const isPublic = registerForm.isPublicProfile.checked;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // --- Backend Integration Placeholder ---
        console.log('Register attempt:', { name, email, password, isPublic });
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, isPublic })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                console.log('Registration response:', data);
                showLoginBtn.click(); // After successful registration, switch to login form
            } else {
                alert(`Registration failed: ${data.message || 'An error occurred'}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
        // --- End Backend Integration Placeholder ---
    });
};