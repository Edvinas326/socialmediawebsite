// Teacher Dashboard Module
(function() {
    // Local storage keys - kept inside closure to avoid global conflicts
    const LOCAL_CURRENT_USER_KEY = 'current_user';
    const LOCAL_PROFILES_KEY = 'local_profiles';

    document.addEventListener('DOMContentLoaded', () => {
        console.log('Teacher dashboard loaded');
        
        // Check if user is authenticated and is a teacher
        const sessionData = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
        if (!sessionData) {
            console.error('No user session found');
            window.location.href = '../../login page/login.html';
            return;
        }
        
        const session = JSON.parse(sessionData);
        
        // Check if session is expired
        if (new Date(session.expires_at) < new Date()) {
            console.log('Session expired');
            localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
            window.location.href = '../../login page/login.html';
            return;
        }
        
        const user = session.user;
        if (!user || !user.id) {
            console.error('Invalid user in session');
            window.location.href = '../../login page/login.html';
            return;
        }
        
        // Check if user is a teacher
        const userRole = user.user_metadata?.role;
        if (userRole !== 'teacher') {
            console.error('User is not a teacher, redirecting');
            window.location.href = '../main-page.html';
            return;
        }
        
        console.log('Teacher user verified:', user);
        
        // Update profile display
        updateTeacherProfile(user);
        
        // Setup logout button
        const signoutButton = document.getElementById('signout-button');
        if (signoutButton) {
            signoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
                window.location.href = '../../login page/login.html';
            });
        }
        
        // Setup user menu dropdown
        const userMenuButton = document.getElementById('user-menu-button');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', () => {
                userDropdown.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });
        }
        
        // Setup dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                const isDarkMode = document.documentElement.classList.toggle('dark');
                localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
                
                // Update icons
                const sunIcon = darkModeToggle.querySelector('svg:first-of-type');
                const moonIcon = darkModeToggle.querySelector('svg:last-of-type');
                
                if (isDarkMode) {
                    sunIcon.style.display = 'block';
                    moonIcon.style.display = 'none';
                } else {
                    sunIcon.style.display = 'none';
                    moonIcon.style.display = 'block';
                }
            });
        }
        
        // Show local storage notice
        const noticeElement = document.createElement('div');
        noticeElement.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-center py-1 text-white text-sm';
        noticeElement.textContent = '⚠️ Local Storage Mode: Your data is stored in this browser only';
        document.body.prepend(noticeElement);
    });

    // Function to update teacher profile display
    function updateTeacherProfile(user) {
        // Get profile data
        const profiles = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY)) || [];
        let profile = profiles.find(p => p.id === user.id);
        
        if (!profile) {
            console.warn('Teacher profile not found');
            return;
        }
        
        // Update profile image
        const profileImage = document.getElementById('profile-image');
        const sidebarProfileImage = document.getElementById('sidebar-profile-image');
        
        const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'Teacher')}&background=random`;
        const avatarUrl = profile.avatar_url || defaultAvatarUrl;
        
        if (profileImage) profileImage.src = avatarUrl;
        if (sidebarProfileImage) sidebarProfileImage.src = avatarUrl;
        
        // Update username display
        const userNameDisplay = document.getElementById('user-name-display');
        if (userNameDisplay) {
            userNameDisplay.textContent = profile.full_name || 'Teacher';
        }
    }
})(); 