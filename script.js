document.addEventListener('DOMContentLoaded', () => {

    const modalElement = document.getElementById('download-modal');
    if (modalElement && modalElement.parentElement !== document.body) {
        document.body.appendChild(modalElement);
    }

    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });

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

    const modal = document.getElementById('download-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const countdownSpan = document.getElementById('countdown');
    const forceLink = document.getElementById('force-download-link');

    let downloadUrl = "https://github.com/LeafClientMC/LeafClient/raw/refs/heads/main/latestexe/LeafClient.zip";

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Download clicked. Modal exists?", !!modal);

            if (modal) {
                openDownloadModal();
            } else {
                console.warn("Modal not found, falling back to direct download.");
                window.location.href = downloadUrl;
            }
        });

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

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeDownloadModal();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal();
        }
    });

    function openDownloadModal() {
        const modalEl = document.getElementById('download-modal');
        if (modalEl) {
            modalEl.style.display = 'flex';
            modalEl.classList.add('active');
            document.body.classList.add('modal-open');

            const adFrame = document.getElementById('modal-ad-frame');
            if (adFrame && !adFrame.src && adFrame.dataset.src) {
                adFrame.src = adFrame.dataset.src;
            }

            startDownloadCountdown();
        }
    }

    function closeDownloadModal() {
        const modalEl = document.getElementById('download-modal');
        if (modalEl) {
            modalEl.classList.remove('active');
            modalEl.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    function startDownloadCountdown() {
        let seconds = 5;
        if (countdownSpan) countdownSpan.innerText = seconds;

        if (forceLink) {
            forceLink.classList.add('hidden');
            forceLink.href = downloadUrl;
        }

        const timer = setInterval(() => {
            seconds--;
            if (countdownSpan) countdownSpan.innerText = seconds;

            if (seconds <= 0) {
                clearInterval(timer);

                console.log("Countdown finished. Triggering download: " + downloadUrl);
                window.location.href = downloadUrl;

                if (forceLink) {
                    forceLink.classList.remove('hidden');
                }
                if (countdownSpan) countdownSpan.innerText = "0";
            }
        }, 1000);
    }

});
