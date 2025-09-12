
document.addEventListener('DOMContentLoaded', () => {



    // Debug Font Loading
    const testFont = new FontFace('Girassol', "url('fonts/Girassol-Regular.ttf')");
    testFont.load().then(() => {
        console.log('Fontul Girassol s-a încărcat cu succes.');
        document.fonts.add(testFont);
    }).catch((e) => {
        console.error('Eroare la încărcarea fontului Girassol:', e);
        showError('Eroare: Fontul Girassol nu s-a încărcat.');
    });

    const langElements = document.querySelectorAll('.lang-text');
    const lang = 'en'; // or 'ru'

    langElements.forEach(el => {
        el.textContent = el.dataset[lang];
    });


    // Debug Logo
    const toplogo = document.querySelector('.toplogo-container img');
    toplogo.addEventListener('error', () => {
        console.error('Eroare la încărcarea toplogo.png. Verifică calea: images/toplogo.png');
        toplogo.src = 'https://picsum.photos/200/48?random=1';
        showError('Eroare: Logo toplogo.png nu s-a încărcat.');
    });
    toplogo.addEventListener('load', () => {
        console.log('Logo toplogo.png încărcat cu succes.');
    });

    // Debug Hero Image (works with <picture> or plain <img>)
    (() => {
        const heroImage =
            document.getElementById('heroFlag') ||
            document.querySelector('.flag-container picture img, .flag-container img');

        if (!heroImage) {
            console.error('Hero image not found in .flag-container');
            return;
        }

        const fallback = 'https://picsum.photos/1200/600?random=0';

        const onLoad = () => {
            console.log('Hero loaded:', heroImage.currentSrc || heroImage.src);
        };

        const onError = () => {
            console.error('Failed to load hero image:', heroImage.src);
            if (!heroImage.src.includes('picsum.photos')) {
                heroImage.src = fallback;
                heroImage.style.opacity = '0.6';
            }
        };

        // Handle cached or already-attempted loads
        if (heroImage.complete) {
            heroImage.naturalWidth > 0 ? onLoad() : onError();
        } else {
            heroImage.addEventListener('load', onLoad, { once: true });
            heroImage.addEventListener('error', onError, { once: true });
        }
    })();


    // Debug Gallery Images
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) {
        console.error('Secțiunea gallery nu conține elemente. Verifică dacă .gallery-grid există și este populată.');
        showError('Eroare: Galeria nu conține elemente.');
    }
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.image');
        const bgImage = img.style.backgroundImage.slice(5, -2);
        const tempImg = new Image();
        tempImg.src = bgImage;
        tempImg.onerror = () => {
            console.error(`Imaginea product${index + 1}.jpg nu s-a încărcat. Verifică calea: ${bgImage}`);
            img.style.backgroundImage = 'url(https://picsum.photos/600/500?random=' + (index + 1) + ')';
            showError(`Eroare: Imaginea product${index + 1}.jpg nu s-a încărcat.`);
        };
        tempImg.onload = () => {
            console.log(`Imaginea product${index + 1}.jpg încărcată cu succes: ${bgImage}`);
        };
    });

    function setupAccordion(contentId, toggleId) {
        const content = document.getElementById(contentId);
        const toggle = document.getElementById(toggleId);
        let expanded = false;

        toggle.textContent = toggle.dataset.en || 'Discover More';

        toggle.addEventListener('click', e => {
            e.preventDefault();
            expanded = !expanded;

            if (expanded) {
                // remove old inline height to get a fresh scrollHeight
                content.style.maxHeight = 'none';
                const fullHeight = content.scrollHeight + 'px';
                // force reflow so the next assignment animates
                void content.offsetHeight;
                content.style.maxHeight = fullHeight;
                toggle.textContent = toggle.dataset.enClose || 'Close';
            } else {
                content.style.maxHeight = '100px';
                toggle.textContent = toggle.dataset.en || 'Discover More';
            }
        });
    }

    setupAccordion('aboutContent', 'aboutToggle');
    setupAccordion('instructionsContent', 'instructionsToggle');


    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const topbarNav = document.querySelector('.topbar-nav');
    hamburger.addEventListener('click', () => {
        topbarNav.classList.toggle('active');
        hamburger.textContent = topbarNav.classList.contains('active') ? '×' : '☰';
    });

    function scrollToCenter(element) {
        const offset = element.getBoundingClientRect().top + window.scrollY;
        const viewportHeight = window.innerHeight;
        const elementHeight = element.offsetHeight;
        const scrollTarget = offset - (viewportHeight / 2) + (elementHeight / 2);

        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }

    // Parallax Effect for Gallery
    function updateParallax() {
        galleryItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const scrollY = window.pageYOffset;
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const image = item.querySelector('.image');
                const info = item.querySelector('.info');
                const offset = (window.innerHeight - rect.top) / window.innerHeight;
                const parallaxOffset = offset * 0.4 * 100;
                image.style.transform = `translateY(${(parallaxOffset - 70) / 2}px)`;
                info.style.transform = `translateY(${(1 - offset) * 3}px)`;
            }
        });
    }
    window.addEventListener('scroll', updateParallax);

    // Intersection Observer for Fade In Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log(`Secțiunea ${entry.target.id || entry.target.className} este vizibilă.`);
                observer.unobserve(entry.target);
            } else {
                console.log(`Secțiunea ${entry.target.id || entry.target.className} nu este vizibilă.`);
            }
        });
    }, observerOptions);
    galleryItems.forEach(item => observer.observe(item));
    document.querySelectorAll('.tech-card').forEach(card => observer.observe(card));
    document.querySelectorAll('.glassmorphic, .technologies, .more-information, #contact, .footer').forEach(section => observer.observe(section));

    // Topbar Scroll Behavior
    let lastScrollTop = 0;
    const topbar = document.querySelector('.topbar');
    topbar.classList.add('visible'); // Show topbar on load
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 56) {
            topbar.classList.remove('visible');
            topbar.classList.add('hidden');
            topbarNav.classList.remove('active');
            hamburger.textContent = '☰';
        } else if (scrollTop < lastScrollTop || scrollTop <= 56) {
            topbar.classList.remove('hidden');
            topbar.classList.add('visible');
        }
        lastScrollTop = scrollTop;
    });

    // Language Switcher
    const languageButtons = document.querySelectorAll('.language-button');
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            languageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
            if (heroImage) {
                heroImage.classList.toggle('lang-ru', lang === 'ru');
            }
        });
    });

    function setLanguage(lang) {
        try {
            document.querySelectorAll('.lang-text').forEach(element => {
                const text = element.getAttribute(`data-${lang}`);
                if (text) {
                    element.innerHTML = text;
                } else {
                    console.warn(`Atributul data-${lang} lipsește pentru element:`, element);
                }
            });
            document.querySelectorAll('.language-button').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
            });
        } catch (e) {
            console.error('Eroare în setLanguage:', e);
            showError('Eroare la schimbarea limbii.');
        }
    }

    // Error Message Display
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message active';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.classList.remove('active');
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }

    // Media Player
    const mediaPlayer = document.getElementById('mediaPlayer');
    const mediaPlayerImage = document.getElementById('mediaPlayerImage');
    const mediaPlayerTitle = document.getElementById('mediaPlayerTitle');
    const mediaPlayerDescription = document.getElementById('mediaPlayerDescription');
    const mediaPlayerClose = document.getElementById('mediaPlayerClose');
    let currentImageIndex = 0;

    function updateMediaPlayer(index) {

        return null;
        try {
            const item = galleryItems[index];
            const imageUrl = item.querySelector('.image').style.backgroundImage.slice(5, -2);
            const title = item.querySelector('.info h3').textContent;
            const description = item.querySelector('.info p');
            mediaPlayerImage.style.backgroundImage = `url('${imageUrl}')`;
            mediaPlayerTitle.textContent = title;
            mediaPlayerDescription.setAttribute('data-en', description.getAttribute('data-en'));
            mediaPlayerDescription.setAttribute('data-ru', description.getAttribute('data-ru'));
            mediaPlayerDescription.innerHTML = description.innerHTML;
            setLanguage(document.querySelector('.language-button.active')?.getAttribute('data-lang') || 'en');
            currentImageIndex = index;
            // console.log(`Media player actualizat cu imaginea ${imageUrl}`);
        } catch (e) {
            console.error('Eroare la actualizarea media player:', e);
            showError('Eroare la actualizarea media player.');
        }
    }

    galleryItems.forEach((item, index) => {
        const image = item.querySelector('.image');
        image.addEventListener('click', () => {
            updateMediaPlayer(index);
            // mediaPlayer.classList.add('active');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (mediaPlayer.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
                updateMediaPlayer(currentImageIndex);
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
                updateMediaPlayer(currentImageIndex);
            } else if (e.key === 'Escape') {
                mediaPlayer.classList.remove('active');
            }
        }
    });

    mediaPlayerClose.addEventListener('click', () => {
        mediaPlayer.classList.remove('active');
    });

    mediaPlayer.addEventListener('click', (e) => {
        if (e.target === mediaPlayer) {
            mediaPlayer.classList.remove('active');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('.topbar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth <= 768) {
                    topbarNav.classList.remove('active');
                    hamburger.textContent = '☰';
                }
            } else {
                console.error(`Secțiunea ${this.getAttribute('href')} nu a fost găsită.`);
                showError(`Secțiunea ${this.getAttribute('href')} nu a fost găsită.`);
            }
        });
    });

    // Canvas Animation
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context nu este disponibil.');
        showError('Eroare: Canvas-ul neuronal nu este disponibil.');
        return;
    }
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;

    let points = [];
    const maxPoints = 150;
    const lineLength = 100;
    let hue = 51;
    const minLineWidth = 0.2;
    const maxLineWidth = 1.2;
    let frameCounter = 0;
    const framesPerPoint = 2;
    const separationDistance = 30;
    const alignmentDistance = 50;
    const cohesionDistance = 50;
    const maxForce = 0.05;
    const maxSpeed = 2;

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.ax = 0;
            this.ay = 0;
            this.age = 0;
            this.maxAge = Math.random() * 300 + 200;
            this.isWhite = Math.random() < 0.1;
        }

        update(points) {
            this.flock(points);
            this.applyFriction();
            this.move();
            this.bounce();
            this.age++;
        }

        flock(points) {
            let separation = { x: 0, y: 0 };
            let alignment = { x: 0, y: 0 };
            let cohesion = { x: 0, y: 0 };
            let totalSeparation = 0;
            let totalAlignment = 0;
            let totalCohesion = 0;

            for (let other of points) {
                if (other === this) continue;
                let dx = other.x - this.x;
                let dy = other.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < separationDistance && distance > 0) {
                    separation.x -= (dx / distance);
                    separation.y -= (dy / distance);
                    totalSeparation++;
                }

                if (distance < alignmentDistance) {
                    alignment.x += other.vx;
                    alignment.y += other.vy;
                    totalAlignment++;
                }

                if (distance < cohesionDistance) {
                    cohesion.x += other.x;
                    cohesion.y += other.y;
                    totalCohesion++;
                }
            }

            if (totalSeparation > 0) {
                separation.x /= totalSeparation;
                separation.y /= totalSeparation;
                separation = this.limitForce(separation, maxForce);
                this.ax += separation.x;
                this.ay += separation.y;
            }

            if (totalAlignment > 0) {
                alignment.x /= totalAlignment;
                alignment.y /= totalAlignment;
                let alignmentMag = Math.sqrt(alignment.x * alignment.x + alignment.y * alignment.y);
                if (alignmentMag > 0) {
                    alignment.x = (alignment.x / alignmentMag) * maxSpeed;
                    alignment.y = (alignment.y / alignmentMag) * maxSpeed;
                }
                alignment.x -= this.vx;
                alignment.y -= this.vy;
                alignment = this.limitForce(alignment, maxForce);
                this.ax += alignment.x;
                this.ay += alignment.y;
            }

            if (totalCohesion > 0) {
                cohesion.x /= totalCohesion;
                cohesion.y /= totalCohesion;
                cohesion.x -= this.x;
                cohesion.y -= this.y;
                let cohesionMag = Math.sqrt(cohesion.x * cohesion.x + cohesion.y * cohesion.y);
                if (cohesionMag > 0) {
                    cohesion.x = (cohesion.x / cohesionMag) * maxSpeed;
                    cohesion.y = (cohesion.y / cohesionMag) * maxSpeed;
                }
                cohesion.x -= this.vx;
                cohesion.y -= this.vy;
                cohesion = this.limitForce(cohesion, maxForce);
                this.ax += cohesion.x;
                this.ay += cohesion.y;
            }
        }

        applyFriction() {
            this.vx *= 0.98;
            this.vy *= 0.98;
        }

        move() {
            this.vx += this.ax;
            this.vy += this.ay;
            let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }
            this.x += this.vx;
            this.y += this.vy;
            this.ax = 0;
            this.ay = 0;
        }

        bounce() {
            if (this.x <= 0) {
                this.x = 0;
                this.vx *= -1;
            }
            if (this.x >= width) {
                this.x = width;
                this.vx *= -1;
            }
            if (this.y <= 0) {
                this.y = 0;
                this.vy *= -1;
            }
            if (this.y >= height) {
                this.y = height;
                this.vy *= -1;
            }
        }

        limitForce(force, max) {
            let mag = Math.sqrt(force.x * force.x + force.y * force.y);
            if (mag > max) {
                return {
                    x: (force.x / mag) * max,
                    y: (force.y / mag) * max
                };
            }
            return force;
        }

        isDead() {
            return this.age > this.maxAge;
        }
    }

    function createPoint() {
        const x = Math.random() * width;
        const y = Math.random() * height;
        points.push(new Point(x, y));
        if (points.length > maxPoints) {
            points.shift();
        }
    }

    function drawNeuronalWeb() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            p1.update(points);

            if (p1.isDead()) {
                points.splice(i, 1);
                i--;
                continue;
            }

            let connections = 0;
            const maxConnections = 3;

            for (let j = i + 1; j < points.length; j++) {
                const p2 = points[j];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < lineLength) {
                    if (connections >= maxConnections) break;
                    connections++;

                    const alpha = 1 - (distance / lineLength);
                    const lineWidth = minLineWidth + (maxLineWidth - minLineWidth) * alpha;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineWidth = lineWidth;

                    if (p1.isWhite || p2.isWhite) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.0})`;
                    } else {
                        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha * 1.0})`;
                    }
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        frameCounter++;
        if (frameCounter % framesPerPoint === 0) {
            createPoint();
        }
        drawNeuronalWeb();
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    animate();
});
