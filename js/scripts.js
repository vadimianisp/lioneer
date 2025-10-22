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

    // =============================================================================
    // OPTIMIZED CANVAS ANIMATION - NEURONAL NETWORK WITH FLOCKING BEHAVIOR
    // =============================================================================

    // Performance and device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = isMobile || navigator.hardwareConcurrency <= 2;

    // Canvas Setup
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    let width, height;
    let gridSize = 100;
    let grid = [];

    function sizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        gridSize = Math.max(80, Math.min(width, height) / 8);
        initGrid();
    }
    sizeCanvas();

    // Adaptive configuration based on device
    const config = {
        bgFade: isLowEnd ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.05)',
        glowColor: 'rgba(120, 230, 255, 0.8)',
        nodeFill: 'rgba(180, 230, 255, 0.7)',
        nodeRadius: isLowEnd ? 2.5 : 3,
        nodeGlow: isLowEnd ? 6 : 10,

        maxSpeed: isLowEnd ? 1.8 : 2.5,
        maxForce: 0.04,
        separationRadius: isLowEnd ? 35 : 40,
        alignmentRadius: isLowEnd ? 45 : 50,
        cohesionRadius: isLowEnd ? 45 : 50,
        separationWeight: 1.5,
        alignmentWeight: 1.0,
        cohesionWeight: 1.0,
        friction: 0.99,
        lineLength: isLowEnd ? 100 : 120,

        maxPoints: (() => {
            const area = width * height;
            if (isLowEnd) return Math.min(40, Math.floor(area / 25000));
            if (area < 1000000) return Math.min(60, Math.floor(area / 15000));
            return Math.min(100, Math.floor(area / 12000));
        })(),

        framesPerPoint: isLowEnd ? 15 : 12,

        pulseRadius: isLowEnd ? 3 : 4,
        pulsesPerFrame: isLowEnd ? 1 : 2,
        maxPulses: isLowEnd ? 20 : 40,
        pulseMinSpeed: 0.015,
        pulseMaxSpeed: 0.045,

        useGlow: !isLowEnd,
        maxConnections: isLowEnd ? 2 : 3
    };

    function lineColor(alpha) {
        return `rgba(100, 200, 255, ${alpha * 0.6})`;
    }

    // Spatial grid for optimization
    function initGrid() {
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);
        grid = Array.from({ length: cols }, () => Array(rows).fill(null).map(() => []));
    }

    function clearGrid() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j].length = 0;
            }
        }
    }

    function addToGrid(point) {
        const col = Math.floor(point.x / gridSize);
        const row = Math.floor(point.y / gridSize);
        if (col >= 0 && col < grid.length && row >= 0 && row < grid[0].length) {
            grid[col][row].push(point);
        }
    }

    function getNearbyPoints(point, radius) {
        const col = Math.floor(point.x / gridSize);
        const row = Math.floor(point.y / gridSize);
        const nearby = [];
        const cellRadius = Math.ceil(radius / gridSize);

        for (let i = Math.max(0, col - cellRadius); i <= Math.min(grid.length - 1, col + cellRadius); i++) {
            for (let j = Math.max(0, row - cellRadius); j <= Math.min(grid[0].length - 1, row + cellRadius); j++) {
                nearby.push(...grid[i][j]);
            }
        }
        return nearby;
    }

    // Arrays
    const points = [];
    const pulses = [];
    let frameCounter = 0;

    // Optimized Point Class
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.2 + 0.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.ax = 0;
            this.ay = 0;
            this.age = 0;
            this.maxAge = 800 + Math.random() * 1500;
        }

        update() {
            this.age++;
            this.flock();
            this.applyFriction();
            this.move();
            this.bounce();
        }

        flock() {
            let separation = { x: 0, y: 0 };
            let alignment = { x: 0, y: 0 };
            let cohesion = { x: 0, y: 0 };
            let totalSeparation = 0;
            let totalAlignment = 0;
            let totalCohesion = 0;

            const maxRadius = Math.max(config.separationRadius, config.alignmentRadius, config.cohesionRadius);
            const nearbyPoints = getNearbyPoints(this, maxRadius);

            for (let other of nearbyPoints) {
                if (other === this) continue;

                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distSq = dx * dx + dy * dy;
                const distance = Math.sqrt(distSq);

                if (distance > 0 && distance < config.separationRadius) {
                    separation.x -= dx / distance;
                    separation.y -= dy / distance;
                    totalSeparation++;
                }

                if (distance > 0 && distance < config.alignmentRadius) {
                    alignment.x += other.vx;
                    alignment.y += other.vy;
                    totalAlignment++;
                }

                if (distance > 0 && distance < config.cohesionRadius) {
                    cohesion.x += other.x;
                    cohesion.y += other.y;
                    totalCohesion++;
                }
            }

            if (totalSeparation > 0) {
                separation.x /= totalSeparation;
                separation.y /= totalSeparation;
                separation = this.limitForce(separation, config.maxForce);
                this.ax += separation.x * config.separationWeight;
                this.ay += separation.y * config.separationWeight;
            }

            if (totalAlignment > 0) {
                alignment.x /= totalAlignment;
                alignment.y /= totalAlignment;
                let alignmentMag = Math.sqrt(alignment.x * alignment.x + alignment.y * alignment.y);
                if (alignmentMag > 0) {
                    alignment.x = (alignment.x / alignmentMag) * config.maxSpeed;
                    alignment.y = (alignment.y / alignmentMag) * config.maxSpeed;
                }
                alignment.x -= this.vx;
                alignment.y -= this.vy;
                alignment = this.limitForce(alignment, config.maxForce);
                this.ax += alignment.x * config.alignmentWeight;
                this.ay += alignment.y * config.alignmentWeight;
            }

            if (totalCohesion > 0) {
                cohesion.x /= totalCohesion;
                cohesion.y /= totalCohesion;
                cohesion.x -= this.x;
                cohesion.y -= this.y;
                let cohesionMag = Math.sqrt(cohesion.x * cohesion.x + cohesion.y * cohesion.y);
                if (cohesionMag > 0) {
                    cohesion.x = (cohesion.x / cohesionMag) * config.maxSpeed;
                    cohesion.y = (cohesion.y / cohesionMag) * config.maxSpeed;
                }
                cohesion.x -= this.vx;
                cohesion.y -= this.vy;
                cohesion = this.limitForce(cohesion, config.maxForce);
                this.ax += cohesion.x * config.cohesionWeight;
                this.ay += cohesion.y * config.cohesionWeight;
            }
        }

        applyFriction() {
            this.vx *= config.friction;
            this.vy *= config.friction;
        }

        move() {
            this.vx += this.ax;
            this.vy += this.ay;
            let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > config.maxSpeed) {
                this.vx = (this.vx / speed) * config.maxSpeed;
                this.vy = (this.vy / speed) * config.maxSpeed;
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
            let magSq = force.x * force.x + force.y * force.y;
            if (magSq > max * max) {
                let mag = Math.sqrt(magSq);
                return { x: (force.x / mag) * max, y: (force.y / mag) * max };
            }
            return force;
        }

        isDead() {
            return this.age > this.maxAge;
        }
    }

    // Helper functions
    function createPoint() {
        const x = Math.random() * width;
        const y = Math.random() * height;
        points.push(new Point(x, y));
        if (points.length > config.maxPoints) {
            points.shift();
        }
    }

    function strokeWithGlow(drawFn, glow = 8) {
        if (config.useGlow) {
            ctx.save();
            ctx.shadowColor = config.glowColor;
            ctx.shadowBlur = glow;
            drawFn();
            ctx.restore();
        } else {
            drawFn();
        }
    }

    function fillWithGlow(drawFn, glow = 10) {
        if (config.useGlow) {
            ctx.save();
            ctx.shadowColor = config.glowColor;
            ctx.shadowBlur = glow;
            drawFn();
            ctx.restore();
        } else {
            drawFn();
        }
    }

    // Optimized main drawing function
    function drawNeuronalWeb() {
        ctx.fillStyle = config.bgFade;
        ctx.fillRect(0, 0, width, height);

        clearGrid();
        for (let point of points) {
            addToGrid(point);
        }

        const edges = [];

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            p1.update();

            if (p1.isDead()) {
                points.splice(i, 1);
                i--;
                continue;
            }

            let connections = 0;
            const nearbyPoints = getNearbyPoints(p1, config.lineLength);

            for (let p2 of nearbyPoints) {
                if (p2 === p1 || points.indexOf(p2) <= i) continue;
                if (connections >= config.maxConnections) break;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distSq = dx * dx + dy * dy;
                const lineLengthSq = config.lineLength * config.lineLength;

                if (distSq < lineLengthSq) {
                    connections++;

                    const distance = Math.sqrt(distSq);
                    const alpha = 1 - (distance / config.lineLength);
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

        for (let k = 0; k < points.length; k++) {
            const p = points[k];
            fillWithGlow(() => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, config.nodeRadius, 0, Math.PI * 2);
                ctx.fillStyle = config.nodeFill;
                ctx.fill();
            }, config.nodeGlow);
        }

        for (let s = 0; s < config.pulsesPerFrame && pulses.length < config.maxPulses; s++) {
            if (edges.length === 0) break;
            const e = edges[Math.floor(Math.random() * edges.length)];
            pulses.push({
                x1: e.x1,
                y1: e.y1,
                x2: e.x2,
                y2: e.y2,
                t: 0,
                speed: config.pulseMinSpeed + Math.random() * (config.pulseMaxSpeed - config.pulseMinSpeed)
            });
        }

        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.t += p.speed;
            const x = p.x1 + (p.x2 - p.x1) * p.t;
            const y = p.y1 + (p.y2 - p.y1) * p.t;

            fillWithGlow(() => {
                ctx.beginPath();
                ctx.arc(x, y, config.pulseRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(120, 230, 255, 0.95)';
                ctx.fill();
            }, 12);

            if (p.t >= 1) {
                pulses.splice(i, 1);
            }
        }
    }

    // Animation loop
    function animate() {
        frameCounter++;
        if (frameCounter % config.framesPerPoint === 0) {
            createPoint();
        }
        drawNeuronalWeb();
        requestAnimationFrame(animate);
    }

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            sizeCanvas();
            const area = width * height;
            if (isLowEnd) {
                config.maxPoints = Math.min(40, Math.floor(area / 25000));
            } else if (area < 1000000) {
                config.maxPoints = Math.min(60, Math.floor(area / 15000));
            } else {
                config.maxPoints = Math.min(100, Math.floor(area / 12000));
            }
        }, 250);
    });

    // Start animation
    animate();
});