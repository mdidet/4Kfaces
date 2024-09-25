document.addEventListener('DOMContentLoaded', function() {
    const avatarGrid = document.getElementById('avatar-grid');

    // Function to load avatars dynamically
    function loadAvatars(gender, totalImages) {
        avatarGrid.innerHTML = ''; // Clear previous avatars

        for (let i = 1; i <= totalImages; i++) {
            const imgSrc = `images/${gender}${i}.png`;

            // Create a new Image object to check if the image exists
            const img = new Image();
            img.src = imgSrc;

            // On successful image load, display the avatar and download button
            img.onload = function() {
                const avatarElement = document.createElement('div');
                avatarElement.classList.add('avatar');
                avatarElement.innerHTML = `
                    <div class="avatar-container">
                        <img src="${imgSrc}" alt="Avatar">
                        <a href="${imgSrc}" download class="btn-download">Download</a>
                    </div>
                `;
                avatarGrid.appendChild(avatarElement);
            };

            // On error (image not found), do nothing
            img.onerror = function() {
                console.log(`${imgSrc} not found.`);
            };
        }
    }

    // Load female avatars by default
    loadAvatars('female', 50);  // Adjust this number to the maximum expected images

    // Add event listeners to buttons for gender toggle
    document.getElementById('female').addEventListener('click', () => {
        loadAvatars('female', 50);  // Adjust this number to match the max female images
        document.getElementById('female').classList.add('active');
        document.getElementById('male').classList.remove('active');
    });

    document.getElementById('male').addEventListener('click', () => {
        loadAvatars('male', 50);  // Adjust this number to match the max male images
        document.getElementById('male').classList.add('active');
        document.getElementById('female').classList.remove('active');
    });
});
