// Initialize Lucide icons
lucide.createIcons();

// Theme toggling
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('[data-lucide]');

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
}

themeToggle.addEventListener('click', toggleTheme);

// // Section navigation
// const sidebarBtns = document.querySelectorAll('.sidebar-btn');
// const sections = document.querySelectorAll('.section');

// function showSection(sectionId) {
//   sections.forEach(section => {
//     section.classList.remove('active');
//   });
//   sidebarBtns.forEach(btn => {
//     btn.classList.remove('active');
//   });

//   document.getElementById(sectionId).classList.add('active');
//   document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
// }

// sidebarBtns.forEach(btn => {
//   btn.addEventListener('click', () => {
//     const sectionId = btn.getAttribute('data-section');
//     showSection(sectionId);
//   });
// });

// Random progress bar animations
function updateProgressBars() {
  const bars = document.querySelectorAll('.progress');
  bars.forEach(bar => {
    const newWidth = Math.random() * 100;
    bar.style.width = `${newWidth}%`;
  });
}

// Update progress bars every 5 seconds
setInterval(updateProgressBars, 5000);

// Chart animations
function updateChart() {
  const bars = document.querySelectorAll('.chart .bar');
  bars.forEach(bar => {
    const newHeight = Math.random() * 100;
    bar.style.height = `${newHeight}%`;
  });
}

// Update chart every 3 seconds
setInterval(updateChart, 3000);