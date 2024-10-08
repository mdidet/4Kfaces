document.addEventListener('DOMContentLoaded', function () {
    const avatarGrid = document.getElementById('avatar-grid');
    const colorCircles = document.querySelectorAll('.circle');
    const colorPickerModal = document.getElementById('color-picker-modal');
    const colorPickerBtn = document.getElementById('color-picker-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const hexColorInput = document.getElementById('hex-color');
    const applyColorBtn = document.getElementById('apply-color');

    let selectedColor = 'rgba(255, 255, 255, 0)'; // Default to transparent
    let currentCircle = null; // Track the currently selected circle
    let maleCount = 0; // Count of male avatars
    let femaleCount = 0; // Count of female avatars
    const totalAvatars = 100; // Change this to the total number of avatars available


   // Lazy loading observer for images
 const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src; // Load image only when in view
            img.classList.add('visible');
            observer.unobserve(img); // Stop observing after loading
        }
    });
}, { rootMargin: '0px 0px 100px 0px', threshold: 0.1 });

// Function to load avatar images lazily
function createAvatarElement(imgSrc) {
    const avatarElement = document.createElement('div');
    avatarElement.classList.add('avatar');
    avatarElement.innerHTML = `
        <div class="avatar-container">
            <img data-src="${imgSrc}" alt="Avatar" class="lazy-avatar" style="background-color: ${selectedColor};">
            <a href="#" class="btn-download">Download</a>
        </div>
    `;
    avatarGrid.appendChild(avatarElement);

    // Lazy load the image
    const avatarImage = avatarElement.querySelector('img');
    lazyLoadObserver.observe(avatarImage); // Observe for lazy loading
}


  
    // Function to load all avatars
    function loadAllAvatars() {
        for (let i = 1; i <= totalAvatars; i++) {
            const imgSrcMale = `images/male${i}.png`;
            const imgSrcFemale = `images/female${i}.png`;

            // Check for male avatars
            const maleImg = new Image();
            maleImg.src = imgSrcMale;
            maleImg.onload = function () {
                maleCount++;
                createAvatarElement(maleImg.src);
            };

            // Check for female avatars
            const femaleImg = new Image();
            femaleImg.src = imgSrcFemale;
            femaleImg.onload = function () {
                femaleCount++;
                createAvatarElement(femaleImg.src);
            };

            // Log if image is not found
            maleImg.onerror = () => console.log(`${imgSrcMale} not found.`);
            femaleImg.onerror = () => console.log(`${imgSrcFemale} not found.`);
        }
    }

    // Function to create avatar element
    function createAvatarElement(imgSrc) {
        const avatarElement = document.createElement('div');
        avatarElement.classList.add('avatar');
        avatarElement.innerHTML = `
            <div class="avatar-container">
                <img src="${imgSrc}" alt="Avatar" style="background-color: ${selectedColor};">
                <a href="#" class="btn-download">Download</a>
            </div>
        `;
        avatarGrid.appendChild(avatarElement);

        // Add event listener to download button
        avatarElement.querySelector('.btn-download').addEventListener('click', (e) => {
            e.preventDefault();
            downloadImage(imgSrc, avatarElement.querySelector('img').style.backgroundColor);
        });
    }

    // Load random avatars by default
    function loadRandomAvatars() {
        avatarGrid.innerHTML = ''; // Clear previous avatars
        const randomAvatars = [];
        const totalAvailable = Math.max(maleCount, femaleCount);

        for (let i = 0; i < totalAvailable; i++) {
            const gender = (i % 2 === 0) ? 'male' : 'female';
            const imgSrc = `images/${gender}${Math.floor(i / 2) + 1}.png`;
            randomAvatars.push(imgSrc);
        }

        randomAvatars.forEach(imgSrc => {
            createAvatarElement(imgSrc);
        });
    }

    // Load all avatars on page load
    loadAllAvatars();

    // Load random avatars after all avatars are loaded
    setTimeout(loadRandomAvatars, 1000); // Adjust delay as necessary

    // Event listener for the random avatars
    document.getElementById('random').addEventListener('click', () => {
        loadRandomAvatars();
        document.getElementById('random').classList.add('active');
        document.getElementById('female').classList.remove('active');
        document.getElementById('male').classList.remove('active');
    });

    // Event listeners for female and male buttons
    document.getElementById('female').addEventListener('click', () => {
        avatarGrid.innerHTML = ''; // Clear previous avatars
        for (let i = 1; i <= femaleCount; i++) {
            createAvatarElement(`images/female${i}.png`);
        }
        document.getElementById('female').classList.add('active');
        document.getElementById('male').classList.remove('active');
        document.getElementById('random').classList.remove('active');
    });

    document.getElementById('male').addEventListener('click', () => {
        avatarGrid.innerHTML = ''; // Clear previous avatars
        for (let i = 1; i <= maleCount; i++) {
            createAvatarElement(`images/male${i}.png`);
        }
        document.getElementById('male').classList.add('active');
        document.getElementById('female').classList.remove('active');
        document.getElementById('random').classList.remove('active');
    });

  
    // Function to download the avatar with the selected background color
    function downloadImage(src, bgColor) {
        const img = new Image();
        img.src = src;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;

            // Fill canvas with the background color
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the avatar image on top
            ctx.drawImage(img, 0, 0);

            // Create a link and trigger download
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'avatar.png';
            link.click();
        };
    }

    // Function to generate a random color in hex format
 
function getRandomColor() {
    const getPastelValue = () => Math.floor((Math.random() * 128) + 127); // Values between 127 and 255 for light colors
    const r = getPastelValue();
    const g = getPastelValue();
    const b = getPastelValue();

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`; // Convert RGB to hex
}


    // Event listener for the random color button
    document.getElementById('randomly-picker-btn').addEventListener('click', () => {
        // Generate a random color and update selectedColor
        selectedColor = getRandomColor();

        // Apply the random color to all avatar backgrounds
        document.querySelectorAll('.avatar img').forEach(img => {
            img.style.backgroundColor = selectedColor; // Change background color of avatars
        });
    });

    // Event listener for the floating button to open the color picker modal
    colorPickerBtn.addEventListener('click', () => {
        colorPickerModal.style.display = 'block';
    });

    // Event listener for closing the modal
    window.addEventListener('click', (event) => {
        if (event.target === colorPickerModal) {
            colorPickerModal.style.display = 'none';
        }
    });

    // Event listener for applying the hex color
    applyColorBtn.addEventListener('click', () => {
        const hexColor = hexColorInput.value;

        // Validate hex color format
        if (/^#([0-9A-F]{3}){1,2}$/i.test(hexColor)) {
            selectedColor = hexColor;
            document.querySelectorAll('.avatar img').forEach(img => {
                img.style.backgroundColor = selectedColor; // Change background color of avatars
            });
            colorPickerModal.style.display = 'none'; // Close modal
        } else {
            alert('Please enter a valid hex color code (e.g., #FFFFFF)');
        }
    });

    

 // Event listener for making PNG
 document.getElementById('makpng').addEventListener('click', () => {
    document.querySelectorAll('.avatar img').forEach(img => {
        img.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Set background to transparent
    });
    selectedColor = 'rgba(255, 255, 255, 0)'; // Update the selected color state to transparent
});
});




// Hide the button initially
const makPngBtn = document.getElementById('makpng');
makPngBtn.style.display = 'none';

// Function to check if avatars have a background color and show the button
function checkAvatarBackgrounds() {
    const avatars = document.querySelectorAll('.avatar img');
    let hasBgColor = false;

    avatars.forEach(img => {
        const bgColor = window.getComputedStyle(img).backgroundColor; // Get the computed background color
        if (bgColor && bgColor !== 'rgba(255, 255, 255, 0)' && bgColor !== 'transparent') {
            hasBgColor = true;
        }
    });

    if (hasBgColor) {
        makPngBtn.style.display = 'block'; // Show the button
    } else {
        makPngBtn.style.display = 'none'; // Hide the button
    }
}

// Add this to update the button visibility after background color is applied
document.querySelectorAll('.circle').forEach(circle => {
    circle.addEventListener('click', () => {
        setTimeout(checkAvatarBackgrounds, 100); // Small delay to ensure color is applied
    });
});

document.getElementById('apply-color').addEventListener('click', () => {
    setTimeout(checkAvatarBackgrounds, 100); // Small delay to ensure color is applied
});

document.getElementById('randomly-picker-btn').addEventListener('click', () => {
    setTimeout(checkAvatarBackgrounds, 100); // Small delay to ensure color is applied
});

// Event listener for making PNG
makPngBtn.addEventListener('click', () => {
    document.querySelectorAll('.avatar img').forEach(img => {
        img.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Set background to transparent
    });
    selectedColor = 'rgba(255, 255, 255, 0)'; // Update the selected color state to transparent

    // Hide the button again after resetting the backgrounds
    makPngBtn.style.display = 'none';
});


// Event listener for making PNG with scatter background animation
document.getElementById('makpng').addEventListener('click', () => {
    document.querySelectorAll('.avatar img').forEach(img => {
        // Add scatter-bg animation class to animate the background color
        img.classList.add('scatter-bg');

        // After the background color animation ends, set the background to fully transparent
        img.addEventListener('animationend', () => {
            img.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Ensure the background is fully transparent
            img.classList.remove('scatter-bg'); // Remove scatter-bg class after animation
        }, { once: true }); // Ensure the event only triggers once
    });

    selectedColor = 'rgba(255, 255, 255, 0)'; // Update the selected color state to transparent
    makPngBtn.style.display = 'none'; // Hide the button after the action
});



// Call loadAllAvatars() to initially load all avatars
loadAllAvatars();

