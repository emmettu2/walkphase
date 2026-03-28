/* ============================================
   Signal Landing Page — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll-triggered fade-in animations ---
    const fadeElements = document.querySelectorAll('.fade-up');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- Nav scroll effect ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '64px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(255,255,255,0.98)';
            navLinks.style.flexDirection = 'column';
            navLinks.style.padding = '24px';
            navLinks.style.gap = '16px';
            navLinks.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
            navLinks.style.backdropFilter = 'blur(20px)';
        });
    }

    // --- Hero countdown animation ---
    const heroCountdown = document.getElementById('heroCountdown');
    let countdownValue = 18;
    let countdownDirection = -1;

    setInterval(() => {
        countdownValue += countdownDirection;
        if (countdownValue <= 0) {
            countdownValue = 0;
            countdownDirection = 0;
            setTimeout(() => {
                countdownValue = 18;
                countdownDirection = -1;
            }, 2000);
        }
        if (heroCountdown) {
            heroCountdown.textContent = countdownValue;
        }
    }, 1000);

    // --- Crossing comparison animation ---
    const comparisonSection = document.getElementById('problem');
    let comparisonAnimated = false;

    const comparisonObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !comparisonAnimated) {
                comparisonAnimated = true;
                animateCrossing();
            }
        });
    }, { threshold: 0.3 });

    if (comparisonSection) {
        comparisonObserver.observe(comparisonSection);
    }

    function animateCrossing() {
        const walkerFast = document.getElementById('walkerFast');
        const walkerSlow = document.getElementById('walkerSlow');
        const timerFast = document.getElementById('timerFast');
        const timerSlow = document.getElementById('timerSlow');

        if (!walkerFast || !walkerSlow) return;

        const duration = 4000; // 4 seconds for the animation
        const startTime = performance.now();
        const totalSeconds = 18;

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Fast walker: reaches end at ~72% through
            const fastProgress = Math.min(progress / 0.72, 1);
            const fastLeft = 10 + fastProgress * 80;
            walkerFast.style.left = fastLeft + '%';

            // Slow walker: only reaches ~70% by end
            const slowProgress = progress * 0.7;
            const slowLeft = 10 + slowProgress * 80;
            walkerSlow.style.left = slowLeft + '%';

            // Timers
            const timerValue = Math.max(0, Math.round(totalSeconds * (1 - progress)));
            if (timerFast) timerFast.textContent = timerValue;
            if (timerSlow) timerSlow.textContent = timerValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Reset after pause
                setTimeout(() => {
                    walkerFast.style.left = '10%';
                    walkerSlow.style.left = '10%';
                    if (timerFast) timerFast.textContent = '18';
                    if (timerSlow) timerSlow.textContent = '18';
                    comparisonAnimated = false;
                }, 3000);
            }
        }

        requestAnimationFrame(animate);
    }

    // --- Animated metrics ---
    const metricsSection = document.getElementById('data');
    let metricsAnimated = false;

    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !metricsAnimated) {
                metricsAnimated = true;
                animateMetrics();
            }
        });
    }, { threshold: 0.3 });

    if (metricsSection) {
        metricsObserver.observe(metricsSection);
    }

    function animateMetrics() {
        const metricValues = document.querySelectorAll('.metric-value');
        const metricBars = document.querySelectorAll('.metric-bar-fill');

        metricValues.forEach(el => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const decimals = parseInt(el.dataset.decimals) || 0;
            const duration = 1500;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = prefix + current.toFixed(decimals) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });

        // Animate bars
        setTimeout(() => {
            metricBars.forEach(bar => {
                const width = bar.dataset.width;
                bar.style.width = width + '%';
            });
        }, 200);
    }

    // --- Map dots sequential animation ---
    const mapDots = document.querySelectorAll('.map-dot');
    let dotsAnimated = false;

    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !dotsAnimated) {
                dotsAnimated = true;
                mapDots.forEach((dot, i) => {
                    setTimeout(() => {
                        dot.classList.add('visible');
                    }, i * 250);
                });
            }
        });
    }, { threshold: 0.3 });

    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapObserver.observe(mapContainer);
    }

    // --- Grant Pathway interactive selector ---
    const pathwayOptions = document.querySelectorAll('.pathway-option');
    const pathwayPanels = document.querySelectorAll('.pathway-panel');
    const pathwaySteps = document.querySelectorAll('.pathway-step');
    const pathwayLines = document.querySelectorAll('.pathway-step-line');

    // Step highlight mapping for each option
    const stepHighlights = {
        existing:    { active: ['implement'], completed: ['plan', 'demonstrate'], lines: [0, 1] },
        developing:  { active: ['demonstrate'], completed: ['plan'], lines: [0] },
        none:        { active: ['plan'], completed: [], lines: [] }
    };

    function updatePathway(optionKey) {
        // Update option buttons
        pathwayOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`[data-option="${optionKey}"]`)?.classList.add('active');

        // Update panels
        pathwayPanels.forEach(panel => panel.classList.remove('active'));
        document.querySelector(`[data-panel="${optionKey}"]`)?.classList.add('active');

        // Update step indicators
        const highlight = stepHighlights[optionKey];
        if (!highlight) return;

        pathwaySteps.forEach(step => {
            const stepName = step.dataset.step;
            step.classList.remove('active', 'completed');
            if (highlight.active.includes(stepName)) step.classList.add('active');
            if (highlight.completed.includes(stepName)) step.classList.add('completed');
        });

        pathwayLines.forEach((line, i) => {
            if (highlight.lines.includes(i)) {
                line.classList.add('filled');
            } else {
                line.classList.remove('filled');
            }
        });
    }

    pathwayOptions.forEach(option => {
        option.addEventListener('click', () => {
            updatePathway(option.dataset.option);
        });
    });

    // Initialize default state
    updatePathway('existing');

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 64;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                if (window.innerWidth <= 900) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

});
