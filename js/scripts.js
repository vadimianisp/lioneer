document.addEventListener('DOMContentLoaded', () => {

    // Debug Font Loading
    const testFont = new FontFace('Girassol', "url('fonts/Girassol-Regular.ttf')");
    testFont.load().then(() => {
        console.log('Girassol font loaded successfully.');
        document.fonts.add(testFont);
    }).catch((e) => {
        console.error('Error loading Girassol font:', e);
        showError('Error: Girassol font failed to load.');
    });

    // Debug Logo
    const toplogo = document.querySelector('.toplogo-container img');
    toplogo.addEventListener('error', () => {
        console.error('Error loading toplogo.png. Check path: images/toplogo.png');
        toplogo.src = 'https://picsum.photos/200/48?random=1';
        showError('Error: Logo toplogo.png failed to load.');
    });
    toplogo.addEventListener('load', () => {
        console.log('Logo toplogo.png loaded successfully.');
    });

    // Debug Hero Image
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
        console.error('Gallery section contains no items. Check if .gallery-grid exists and is populated.');
        showError('Error: Gallery contains no items.');
    }
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.image');
        const bgImage = img.style.backgroundImage.slice(5, -2);
        const tempImg = new Image();
        tempImg.src = bgImage;
        tempImg.onerror = () => {
            console.error(`Image product${index + 1}.jpg failed to load. Check path: ${bgImage}`);
            img.style.backgroundImage = 'url(https://picsum.photos/600/500?random=' + (index + 1) + ')';
            showError(`Error: Image product${index + 1}.jpg failed to load.`);
        };
        tempImg.onload = () => {
            console.log(`Image product${index + 1}.jpg loaded successfully: ${bgImage}`);
        };
    });

    // Accordion Setup
    function setupAccordion(contentId, toggleId) {
        const content = document.getElementById(contentId);
        const toggle = document.getElementById(toggleId);
        const arrow = toggle ? toggle.querySelector('.toggle-arrow') : null;
        let expanded = false;

        if (!content || !toggle) return;

        toggle.addEventListener('click', e => {
            e.preventDefault();
            expanded = !expanded;

            if (expanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                if (arrow) arrow.classList.add('rotated');
                const label = toggle.querySelector('.toggle-label');
                if (label) label.textContent = 'Show Less';
            } else {
                content.style.maxHeight = '100px';
                if (arrow) arrow.classList.remove('rotated');
                const label = toggle.querySelector('.toggle-label');
                if (label) label.textContent = 'Discover More';
            }
        });
    }

    setupAccordion('aboutContent', 'aboutToggle');
    setupAccordion('instructionsContent', 'instructionsToggle');

    // Contact accordion
    const contactToggle = document.getElementById('contactToggle');
    const contactContent = document.getElementById('contactContent');
    const contactArrow = document.querySelector('.contact-arrow');

    if (contactToggle && contactContent) {
        let isOpen = false;

        contactToggle.addEventListener('click', () => {
            isOpen = !isOpen;

            if (isOpen) {
                contactContent.style.maxHeight = contactContent.scrollHeight + 'px';
                if (contactArrow) contactArrow.style.transform = 'rotate(180deg)';
            } else {
                contactContent.style.maxHeight = '0px';
                if (contactArrow) contactArrow.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const topbarNav = document.querySelector('.topbar-nav');
    if (hamburger && topbarNav) {
        hamburger.addEventListener('click', () => {
            topbarNav.classList.toggle('active');
            hamburger.textContent = topbarNav.classList.contains('active') ? '×' : '☰';
        });
    }

    // // Parallax Effect for Gallery
    // function updateParallax() {
    //     galleryItems.forEach(item => {
    //         const rect = item.getBoundingClientRect();
    //         if (rect.top < window.innerHeight && rect.bottom > 0) {
    //             const image = item.querySelector('.image');
    //             const info = item.querySelector('.info');
    //             const offset = (window.innerHeight - rect.top) / window.innerHeight;
    //             const parallaxOffset = offset * 0.4 * 100;
    //             if (image) image.style.transform = `translateY(${(parallaxOffset - 70) / 2}px)`;
    //             if (info) info.style.transform = `translateY(${(1 - offset) * 3}px)`;
    //         }
    //     });
    // }
    // window.addEventListener('scroll', updateParallax);


    // Intersection Observer for Fade In Animation
    // const observerOptions = {
    //     root: null,
    //     rootMargin: '0px',
    //     threshold: 0.2
    // };
    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             entry.target.classList.add('visible');
    //             console.log(`Section ${entry.target.id || entry.target.className} is visible.`);
    //             observer.unobserve(entry.target);
    //         }
    //     });
    // }, observerOptions);

    // galleryItems.forEach(item => observer.observe(item));
    // document.querySelectorAll('.tech-card').forEach(card => observer.observe(card));
    // document.querySelectorAll('.glassmorphic, .technologies, .more-information, #contact, .footer').forEach(section => observer.observe(section));


    
    // Topbar Scroll Behavior
    let lastScrollTop = 0;
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        topbar.classList.add('visible');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 56) {
                topbar.classList.remove('visible');
                topbar.classList.add('hidden');
                if (topbarNav) topbarNav.classList.remove('active');
                if (hamburger) hamburger.textContent = '☰';
            } else if (scrollTop < lastScrollTop || scrollTop <= 56) {
                topbar.classList.remove('hidden');
                topbar.classList.add('visible');
            }
            lastScrollTop = scrollTop;
        });
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
    }

    if (mediaPlayerClose) {
        mediaPlayerClose.addEventListener('click', () => {
            if (mediaPlayer) mediaPlayer.classList.remove('active');
        });
    }

    if (mediaPlayer) {
        mediaPlayer.addEventListener('click', (e) => {
            if (e.target === mediaPlayer) {
                mediaPlayer.classList.remove('active');
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('.topbar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth <= 768) {
                    if (topbarNav) topbarNav.classList.remove('active');
                    if (hamburger) hamburger.textContent = '☰';
                }
            } else {
                console.error(`Section ${this.getAttribute('href')} not found.`);
                showError(`Section ${this.getAttribute('href')} not found.`);
            }
        });
    });

    // Canvas Animation
    // ========================================
    // CANVAS ANIMATION - NEURONAL NETWORK
    // ========================================
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Canvas context not available.');
        return;
    }

    let width = 0;
    let height = 0;

    function sizeCanvas() {
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const w = window.innerWidth;
        const h = window.innerHeight;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        width = w;
        height = h;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
    }

    sizeCanvas();

    // Animation variables
    let points = [];
    const maxPoints = 150;
    const lineLength = 120;
    let frameCounter = 0;
    const framesPerPoint = 1;

    const separationDistance = 30;
    const alignmentDistance = 60;
    const cohesionDistance = 60;
    const maxForce = 0.09;
    const maxSpeed = 3.8;
    const friction = 0.993;

    const bgFade = 'rgba(10, 10, 10, 0.08)';
    const lineColor = (a) => `hsla(210, 100%, 60%, ${a})`;
    const glowColor = 'rgba(0, 200, 255, 0.7)';

    const nodeRadius = 1.2;
    const nodeGlow = 6;
    const nodeFill = 'rgba(150, 230, 255, 0.35)';

    let pulses = [];
    const maxPulses = 80;
    const pulseMinSpeed = 0.03;
    const pulseMaxSpeed = 0.026;
    const pulsesPerFrame = 2;
    const pulseRadius = 1.6;

    // Point class for network nodes
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
            this.vx *= friction;
            this.vy *= friction;
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
                return { x: (force.x / mag) * max, y: (force.y / mag) * max };
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

    function strokeWithGlow(drawFn, glow = 8) {
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glow;
        drawFn();
        ctx.restore();
    }

    function fillWithGlow(drawFn, glow = 10) {
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glow;
        drawFn();
        ctx.restore();
    }

    function drawNeuronalWeb() {
        ctx.fillStyle = bgFade;
        ctx.fillRect(0, 0, width, height);

        const edges = [];

        // Update and draw points with connections
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
                    const lineWidth = 0.2 + (1.4 - 0.2) * alpha;

                    strokeWithGlow(() => {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = lineColor(alpha);
                        ctx.stroke();
                    }, 8);

                    edges.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, a: alpha });
                }
            }
        }

        // Draw nodes
        for (let k = 0; k < points.length; k++) {
            const p = points[k];
            fillWithGlow(() => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
                ctx.fillStyle = nodeFill;
                ctx.fill();
            }, nodeGlow);
        }

        // Create and animate pulses
        for (let s = 0; s < pulsesPerFrame && pulses.length < maxPulses; s++) {
            if (edges.length === 0) break;
            const e = edges[(Math.random() * edges.length) | 0];
            pulses.push({
                x1: e.x1,
                y1: e.y1,
                x2: e.x2,
                y2: e.y2,
                t: 0,
                speed: pulseMinSpeed + Math.random() * (pulseMaxSpeed - pulseMinSpeed)
            });
        }

        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.t += p.speed;
            const x = p.x1 + (p.x2 - p.x1) * p.t;
            const y = p.y1 + (p.y2 - p.y1) * p.t;

            fillWithGlow(() => {
                ctx.beginPath();
                ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(120, 230, 255, 0.95)';
                ctx.fill();
            }, 12);

            if (p.t >= 1) {
                pulses.splice(i, 1);
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

    // Handle window resize
    window.addEventListener('resize', () => {
        sizeCanvas();
    });

    // Start animation
    animate();
});