// Modal functionality
function showModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Form submissions
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Add your login logic here
    console.log('Login attempt:', { email, password });
    
    // For demo purposes, show success and close modal
    alert('Login successful!');
    closeModal('login');
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Add your signup logic here
    console.log('Signup attempt:', { name, email, password });
    
    // For demo purposes, show success and close modal
    alert('Sign up successful!');
    closeModal('signup');
});

// Smooth scroll for Get Started button
document.querySelector('.get-started-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const signupModal = document.getElementById('signupModal');
    signupModal.style.display = 'block';
});