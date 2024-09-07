// Get DOM elements
const toggleSidebar = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar-right');
const content = document.querySelector('.content');
const showMoreAwards = document.getElementById('showMoreAwards');
const moreAwards = document.getElementById('moreAwards');
const moreAwardsWrapper = document.getElementById('moreAwardsWrapper');
const resetButton = document.querySelector('.btn-danger');
const filterButtons = document.querySelectorAll('.sidebar-right .btn-primary');
const yearDropdown = document.getElementById('yearDropdown');
const inputAward = document.querySelector('#moreAwards input');
const sortAsc = document.getElementById('sortAsc');
const sortDesc = document.getElementById('sortDesc');

// Toggle sidebar
toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    content.classList.toggle('shifted');
});

// Toggle visibility of more awards
showMoreAwards.addEventListener('click', () => {
    moreAwards.classList.toggle('d-none');
    showMoreAwards.textContent = moreAwards.classList.contains('d-none') ? 'More Awards' : 'Less Awards';

    if (!moreAwards.classList.contains('d-none')) {
        moreAwardsWrapper.parentNode.appendChild(moreAwardsWrapper);
    }
});

// Toggle button active/inactive state
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

// Sorting buttons (ASC and DESC)
sortAsc.addEventListener('click', () => {
    sortDesc.classList.remove('active');
    sortAsc.classList.add('active');
});

sortDesc.addEventListener('click', () => {
    sortAsc.classList.remove('active');
    sortDesc.classList.add('active');
});

// Reset all filters
resetButton.addEventListener('click', () => {
    filterButtons.forEach(button => button.classList.remove('active'));
    yearDropdown.selectedIndex = 0;
    inputAward.value = '';
    moreAwards.classList.add('d-none');
    showMoreAwards.textContent = 'More Awards';
});

// Carousel Section

let currentIndex = 0;
const buttonWidth = 112; // Adjust based on button width and margin
const visibleButtons = 6; // Number of visible buttons at once

// Show carousel slide
function showSlide(index) {
    const slides = document.querySelector('.category-inner');
    const totalButtons = document.querySelectorAll('.category-button').length;
    const maxIndex = totalButtons - visibleButtons;

    if (index > maxIndex) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = maxIndex;
    } else {
        currentIndex = index;
    }

    const offset = -currentIndex * (buttonWidth + 10); // 10px margin
    slides.style.transform = `translateX(${offset}px)`;
}

// Move to the next slide
function nextSlide() {
    showSlide(currentIndex + 1);
}

// Move to the previous slide
function prevSlide() {
    showSlide(currentIndex - 1);
}

// Handle carousel button click for multiple-choice
function handleButtonClick(event) {
    event.target.classList.toggle('active');
}

// Add event listeners for carousel buttons
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

function scrollActors(direction) {
    const container = document.getElementById('actorList');
    const scrollAmount = 130 * direction; // Scroll by 8 actors at a time
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}