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

    if (downloadBtn && versionText) {
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
                        downloadBtn.href = zipAsset.browser_download_url;
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

});
