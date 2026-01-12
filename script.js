document.addEventListener('DOMContentLoaded', () => {
    
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const repoOwner = "LeafClientMC";
    const repoName = "LeafClient";
    const downloadBtn = document.getElementById('download-btn');
    const versionText = document.getElementById('version-text');
    
    // --- DOWNLOAD MODAL ELEMENTS ---
    const modal = document.getElementById('download-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const countdownSpan = document.getElementById('countdown');
    const forceLink = document.getElementById('force-download-link');
    
    // Default fallback URL
    let downloadUrl = "https://github.com/LeafClientMC/LeafClient/raw/refs/heads/main/latestexe/LeafClient.zip"; 

    // --- DOWNLOAD BUTTON LOGIC ---
    if (downloadBtn) {
        // 1. Attach click listener IMMEDIATELY (don't wait for fetch)
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop any default link behavior
            console.log("Download clicked. Modal exists?", !!modal);
            
            if (modal) {
                openDownloadModal();
            } else {
                // Fallback if modal is missing
                console.warn("Modal not found, falling back to direct download.");
                window.location.href = downloadUrl;
            }
        });

        // 2. Fetch latest version in background to update text and URL
        if (versionText) {
            fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    const latestRelease = data[0];

                    if (latestRelease) {
                        versionText.textContent = `Version: ${latestRelease.tag_name}`;

                        const zipAsset = latestRelease.assets.find(asset => asset.name.endsWith('.zip'));

                        if (zipAsset) {
                            // Update the URL variable, so the modal uses the new link when it opens
                            downloadUrl = zipAsset.browser_download_url;
                            console.log("Updated download URL to:", downloadUrl);
                        } else {
                            console.error('No .zip asset found in the latest release.');
                            versionText.textContent = "Version found, but no Zip file.";
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching release data:', error);
                    versionText.textContent = "Version: Manual Download";
                });
        }
    }

    // --- MODAL FUNCTIONS ---

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeDownloadModal();
        });
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal();
        }
    });

    function openDownloadModal() {
        modal.classList.add('active');
        startDownloadCountdown();
    }

    function closeDownloadModal() {
        modal.classList.remove('active');
    }

    function startDownloadCountdown() {
        let seconds = 5;
        if (countdownSpan) countdownSpan.innerText = seconds;
        
        // Setup the force link immediately
        if (forceLink) {
            forceLink.classList.add('hidden'); // Hide link initially
            forceLink.href = downloadUrl;      // Set dynamic URL
        }

        const timer = setInterval(() => {
            seconds--;
            if (countdownSpan) countdownSpan.innerText = seconds;

            if (seconds <= 0) {
                clearInterval(timer);
                
                // Trigger download
                console.log("Countdown finished. Triggering download: " + downloadUrl);
                window.location.href = downloadUrl;
                
                // Show "click here" link in case auto-download blocked
                if (forceLink) {
                    forceLink.classList.remove('hidden');
                }
                if (countdownSpan) countdownSpan.innerText = "0";
            }
        }, 1000);
    }

});
