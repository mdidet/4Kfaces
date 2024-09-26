document.addEventListener('DOMContentLoaded', function() {
    const avatarGrid = document.getElementById('avatar-grid');
    const colorCircles = document.querySelectorAll('.circle');
    let selectedColor = 'rgba(255, 255, 255, 0)'; // Default to transparent
    let currentCircle = null; // Track the currently selected circle

    // Function to load avatars dynamically
    function loadAvatars(gender, totalImages) {
        avatarGrid.innerHTML = ''; // Clear previous avatars

        for (let i = 1; i <= totalImages; i++) {
            const imgSrc = `images/${gender}${i}.png`;

            const img = new Image();
            img.src = imgSrc;

            img.onload = function() {
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
                    downloadImage(imgSrc, selectedColor);
                });
            };

            img.onerror = function() {
                console.log(`${imgSrc} not found.`);
            };
        }
    }

    // Load female avatars by default
    loadAvatars('female', 50);  // Adjust this number to the maximum expected images

    // Add event listeners to buttons for gender toggle
    document.getElementById('female').addEventListener('click', () => {
        loadAvatars('female', 50);
        document.getElementById('female').classList.add('active');
        document.getElementById('male').classList.remove('active');
    });

    document.getElementById('male').addEventListener('click', () => {
        loadAvatars('male', 50);
        document.getElementById('male').classList.add('active');
        document.getElementById('female').classList.remove('active');
    });

    // Add event listeners for color circles
    colorCircles.forEach(circle => {
        circle.addEventListener('click', (e) => {
            const newColor = e.target.style.backgroundColor;
    
            // Toggle background color
            if (currentCircle === circle) {
                selectedColor = 'rgba(255, 255, 255, 0)'; // Reset to transparent
                currentCircle.classList.remove('selected'); // Remove tick from circle
                currentCircle = null; // Reset the current circle
            } else {
                // Remove tick from the previously selected circle, if any
                if (currentCircle) {
                    currentCircle.classList.remove('selected');
                }
                selectedColor = newColor; // Set to selected color
                currentCircle = circle; // Update the current circle
                currentCircle.classList.add('selected'); // Add tick to the selected circle
            }
    
            document.querySelectorAll('.avatar img').forEach(img => {
                img.style.backgroundColor = selectedColor; // Change background color of avatars
            });
        });
    });
    

    // Function to download the avatar with the selected background color
    function downloadImage(src, bgColor) {
        const img = new Image();
        img.src = src;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;

            // Fill canvas with background color
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
});
