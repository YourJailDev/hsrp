document.addEventListener('DOMContentLoaded', function() {
    // Join button event listener
    const joinButton = document.getElementById('joinButton');
    if (joinButton) {
        joinButton.addEventListener('click', function() {
            // Replace with your actual join functionality
            alert('Thanks for your interest in joining Hawaii State Roleplay!');
            // You could redirect to a signup page or open a modal here
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation for feature boxes on scroll (optional enhancement)
    const featureBoxes = document.querySelectorAll('.feature-box');
    
    // Simple animation when scrolling to features
    function checkScroll() {
        featureBoxes.forEach(box => {
            const boxTop = box.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (boxTop < windowHeight * 0.8) {
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initial style for animation
    featureBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check on scroll and initial load
    window.addEventListener('scroll', checkScroll);
    checkScroll();
});