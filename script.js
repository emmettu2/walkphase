/* ============================================
   WalkPhase Landing Page — Scripts
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
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Trigger elements near top of page immediately
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add('visible');
                fadeObserver.unobserve(el);
            }
        });
    }, 100);

    // --- Nav scroll effect ---
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    let overlay = null;

    function closeMobileNav() {
        navLinks.classList.remove('mobile-open');
        navToggle.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
            overlay = null;
        }
    }

    function openMobileNav() {
        navLinks.classList.add('mobile-open');
        navToggle.classList.add('active');
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay active';
        overlay.addEventListener('click', closeMobileNav);
        document.body.appendChild(overlay);
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('mobile-open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
    }

    // --- Screenshot carousel ---
    const screenshots = document.querySelectorAll('.iphone-screenshot');
    const dots = document.querySelectorAll('.screenshot-dot');
    let currentScreen = 0;

    function showScreen(index) {
        screenshots.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        screenshots[index]?.classList.add('active');
        dots[index]?.classList.add('active');
        currentScreen = index;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showScreen(parseInt(dot.dataset.index));
        });
    });

    if (screenshots.length > 1) {
        setInterval(() => {
            showScreen((currentScreen + 1) % screenshots.length);
        }, 4000);
    }

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

        const duration = 4000;
        const startTime = performance.now();
        const totalSeconds = 18;

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const fastProgress = Math.min(progress / 0.72, 1);
            const fastLeft = 10 + fastProgress * 80;
            walkerFast.style.left = fastLeft + '%';

            const slowProgress = progress * 0.7;
            const slowLeft = 10 + slowProgress * 80;
            walkerSlow.style.left = slowLeft + '%';

            const timerValue = Math.max(0, Math.round(totalSeconds * (1 - progress)));
            if (timerFast) timerFast.textContent = timerValue;
            if (timerSlow) timerSlow.textContent = timerValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
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
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = prefix + current.toFixed(decimals) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });

        setTimeout(() => {
            metricBars.forEach(bar => {
                const width = bar.dataset.width;
                bar.style.width = width + '%';
            });
        }, 200);
    }

    // --- Grant Pathway interactive selector ---
    const pathwayOptions = document.querySelectorAll('.pathway-option');
    const pathwayPanels = document.querySelectorAll('.pathway-panel');
    const pathwaySteps = document.querySelectorAll('.pathway-step');
    const pathwayLines = document.querySelectorAll('.pathway-step-line');

    const stepHighlights = {
        existing:    { active: ['implement'], completed: ['plan', 'demonstrate'], lines: [0, 1] },
        developing:  { active: ['demonstrate'], completed: ['plan'], lines: [0] },
        none:        { active: ['plan'], completed: [], lines: [] }
    };

    function updatePathway(optionKey) {
        pathwayOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`[data-option="${optionKey}"]`)?.classList.add('active');

        pathwayPanels.forEach(panel => panel.classList.remove('active'));
        document.querySelector(`[data-panel="${optionKey}"]`)?.classList.add('active');

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

    updatePathway('existing');

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 102; // announcement bar + nav
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                if (navLinks.classList.contains('mobile-open')) {
                    closeMobileNav();
                }
            }
        });
    });

});
