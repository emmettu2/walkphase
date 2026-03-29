/* ============================================
   WalkPhase Interactive Demo
   ============================================ */

(function () {
    'use strict';

    // ---- DUMMY DATA ----

    const INTERSECTIONS = [
        {
            id: 'times-square',
            name: 'Times Square',
            subtitle: 'Broadway & 7th Ave',
            lat: 40.7580,
            lng: -73.9855,
            safetyScore: 72,
            safetyLabel: 'Marginal for slower walkers',
            safetyClass: 'marginal',
            crossings: 12,
            avgTime: 14.2,
            avgWait: 48,
            avgSpeed: 0.78,
            walkPhase: 25,
            crossingDistance: 18.5,
            timingCycle: { walk: 25, flash: 8, wait: 42 }
        },
        {
            id: '5th-34th',
            name: '5th Ave & 34th St',
            subtitle: 'Near Empire State',
            lat: 40.7484,
            lng: -73.9856,
            safetyScore: 85,
            safetyLabel: 'Safe for most walkers',
            safetyClass: 'safe',
            crossings: 8,
            avgTime: 12.8,
            avgWait: 38,
            avgSpeed: 0.92,
            walkPhase: 28,
            crossingDistance: 15.2,
            timingCycle: { walk: 28, flash: 7, wait: 40 }
        },
        {
            id: 'broadway-canal',
            name: 'Broadway & Canal',
            subtitle: 'Chinatown border',
            lat: 40.7189,
            lng: -73.9998,
            safetyScore: 43,
            safetyLabel: 'At risk for vulnerable users',
            safetyClass: 'at-risk',
            crossings: 6,
            avgTime: 22.4,
            avgWait: 61,
            avgSpeed: 0.62,
            walkPhase: 20,
            crossingDistance: 22.0,
            timingCycle: { walk: 20, flash: 6, wait: 49 }
        },
        {
            id: 'lex-42nd',
            name: 'Lexington & 42nd',
            subtitle: 'Grand Central area',
            lat: 40.7527,
            lng: -73.9772,
            safetyScore: 68,
            safetyLabel: 'Marginal at peak hours',
            safetyClass: 'marginal',
            crossings: 9,
            avgTime: 16.1,
            avgWait: 52,
            avgSpeed: 0.81,
            walkPhase: 22,
            crossingDistance: 16.8,
            timingCycle: { walk: 22, flash: 7, wait: 46 }
        },
        {
            id: '8th-23rd',
            name: '8th Ave & 23rd St',
            subtitle: 'Chelsea',
            lat: 40.7448,
            lng: -73.9978,
            safetyScore: 91,
            safetyLabel: 'Safe for all users',
            safetyClass: 'safe',
            crossings: 5,
            avgTime: 11.3,
            avgWait: 32,
            avgSpeed: 1.04,
            walkPhase: 30,
            crossingDistance: 14.0,
            timingCycle: { walk: 30, flash: 8, wait: 37 }
        },
        {
            id: 'park-59th',
            name: 'Park Ave & 59th',
            subtitle: 'Upper East Side',
            lat: 40.7636,
            lng: -73.9712,
            safetyScore: 56,
            safetyLabel: 'Marginal for elderly',
            safetyClass: 'marginal',
            crossings: 7,
            avgTime: 19.5,
            avgWait: 55,
            avgSpeed: 0.71,
            walkPhase: 23,
            crossingDistance: 19.8,
            timingCycle: { walk: 23, flash: 7, wait: 45 }
        },
        {
            id: 'houston-2nd',
            name: 'Houston & 2nd Ave',
            subtitle: 'East Village',
            lat: 40.7254,
            lng: -73.9913,
            safetyScore: 78,
            safetyLabel: 'Generally safe',
            safetyClass: 'safe',
            crossings: 4,
            avgTime: 13.6,
            avgWait: 41,
            avgSpeed: 0.88,
            walkPhase: 26,
            crossingDistance: 16.2,
            timingCycle: { walk: 26, flash: 7, wait: 42 }
        },
        {
            id: 'columbus-circle',
            name: 'Columbus Circle',
            subtitle: 'W 59th & Broadway',
            lat: 40.7681,
            lng: -73.9819,
            safetyScore: 38,
            safetyLabel: 'Dangerous for impaired mobility',
            safetyClass: 'at-risk',
            crossings: 10,
            avgTime: 26.8,
            avgWait: 64,
            avgSpeed: 0.58,
            walkPhase: 18,
            crossingDistance: 24.5,
            timingCycle: { walk: 18, flash: 6, wait: 51 }
        }
    ];

    // Inactive intersection markers (grey dots)
    const INACTIVE_INTERSECTIONS = [
        { lat: 40.7540, lng: -73.9900 },
        { lat: 40.7510, lng: -73.9830 },
        { lat: 40.7460, lng: -73.9920 },
        { lat: 40.7600, lng: -73.9760 },
        { lat: 40.7380, lng: -73.9950 },
        { lat: 40.7350, lng: -73.9880 },
        { lat: 40.7620, lng: -73.9880 },
        { lat: 40.7700, lng: -73.9770 },
        { lat: 40.7420, lng: -73.9810 },
        { lat: 40.7300, lng: -73.9960 },
        { lat: 40.7560, lng: -73.9940 },
        { lat: 40.7480, lng: -73.9740 }
    ];

    const RECENT_CROSSINGS = [
        { intersection: 'Times Square', date: 'Mar 28, 12:34 PM', duration: 14.8, speed: 0.82 },
        { intersection: 'Columbus Circle', date: 'Mar 28, 11:15 AM', duration: 28.1, speed: 0.55 },
        { intersection: 'Lexington & 42nd', date: 'Mar 27, 5:48 PM', duration: 15.9, speed: 0.84 },
        { intersection: '5th Ave & 34th St', date: 'Mar 27, 2:12 PM', duration: 12.3, speed: 0.96 },
        { intersection: 'Broadway & Canal', date: 'Mar 26, 9:30 AM', duration: 24.6, speed: 0.61 }
    ];

    // ---- STATE ----

    let currentTab = 'signal';
    let selectedIntersection = INTERSECTIONS[0]; // Times Square
    let timerStart = null;
    let animFrameId = null;
    let leafletMap = null;
    let mapInitialized = false;
    let detailVisible = false;

    // ---- BUILD DOM ----

    function init() {
        const container = document.getElementById('appDemo');
        if (!container) return;

        container.innerHTML = buildShell();
        bindTabs();
        bindDetailView();
        startTimer();

        // Observe visibility for lazy map init
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !mapInitialized) {
                    // Small delay to ensure tab is rendered
                    setTimeout(() => initMap(), 300);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(container);
    }

    function buildShell() {
        return `
            <div class="demo-notch"></div>
            <div class="demo-status-bar">
                <span class="demo-status-time">9:41</span>
                <span class="demo-status-icons">
                    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M1 9h2v3H1zM5 6h2v6H5zM9 3h2v9H9zM13 0h2v12h-2z" fill="currentColor"/></svg>
                    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 3C5.8 3 3.8 3.8 2.3 5.2l1.4 1.4C5 5.4 6.4 4.8 8 4.8s3 .6 4.3 1.8l1.4-1.4C12.2 3.8 10.2 3 8 3zm0 4c-1.1 0-2.1.5-2.8 1.2L8 11l2.8-2.8C10.1 7.5 9.1 7 8 7z" fill="currentColor"/></svg>
                    <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" fill="none" stroke-width="1"/><rect x="21" y="4" width="2" height="4" rx="0.5" fill="currentColor"/><rect x="2" y="3" width="14" height="6" rx="1" fill="#33E680"/></svg>
                </span>
            </div>
            <div class="demo-screen">
                ${buildMapTab()}
                ${buildSignalTab()}
                ${buildInsightsTab()}
                ${buildDetailOverlay()}
            </div>
            ${buildTabBar()}
        `;
    }

    // ---- MAP TAB ----

    function buildMapTab() {
        return `
            <div class="demo-tab-content" data-tab="discover">
                <div class="demo-map-container">
                    <div id="demoLeafletMap" style="width:100%;height:100%;"></div>
                    <div class="demo-map-header">
                        <div class="demo-map-title">Discover</div>
                        <div class="demo-map-subtitle">${INTERSECTIONS.length} active intersections</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ---- SIGNAL TAB ----

    function buildSignalTab() {
        const int = selectedIntersection;
        return `
            <div class="demo-tab-content active" data-tab="signal">
                <div class="demo-signal">
                    <div class="demo-signal-intersection" id="demoIntName">${int.name}</div>
                    <div class="demo-signal-bucket">Midday</div>

                    <div class="demo-countdown-container">
                        <svg class="demo-countdown-svg" viewBox="0 0 220 220">
                            <circle class="demo-countdown-track" cx="110" cy="110" r="100"/>
                            <circle class="demo-countdown-ring" id="demoRing" cx="110" cy="110" r="100"
                                stroke-dasharray="628.32" stroke-dashoffset="0"/>
                        </svg>
                        <div class="demo-countdown-center">
                            <span class="demo-countdown-number" id="demoNumber">25</span>
                            <span class="demo-countdown-phase" id="demoPhase">WALK</span>
                        </div>
                    </div>

                    <div class="demo-crossing-state">
                        <div class="demo-state-step">
                            <div class="demo-state-dot completed"></div>
                            <span class="demo-state-label">Approach</span>
                        </div>
                        <div class="demo-state-line"></div>
                        <div class="demo-state-step">
                            <div class="demo-state-dot active"></div>
                            <span class="demo-state-label active">Kerb</span>
                        </div>
                        <div class="demo-state-line"></div>
                        <div class="demo-state-step">
                            <div class="demo-state-dot"></div>
                            <span class="demo-state-label">Crossing</span>
                        </div>
                        <div class="demo-state-line"></div>
                        <div class="demo-state-step">
                            <div class="demo-state-dot"></div>
                            <span class="demo-state-label">Done</span>
                        </div>
                    </div>

                    <div class="demo-safety-badge">
                        <span class="demo-safety-score ${int.safetyClass}" id="demoSafetyScore">${int.safetyScore}</span>
                        <span class="demo-safety-text" id="demoSafetyText">${int.safetyLabel}</span>
                    </div>

                    <button class="demo-view-details" id="demoViewDetails">View Details</button>
                </div>
            </div>
        `;
    }

    // ---- INSIGHTS TAB ----

    function buildInsightsTab() {
        const topIntersections = INTERSECTIONS.slice(0, 5);
        return `
            <div class="demo-tab-content" data-tab="insights">
                <div class="demo-insights">
                    <div class="demo-insights-title">Insights</div>

                    <div class="demo-glass-card">
                        <div class="demo-card-label">Your Walking Speed</div>
                        <div class="demo-speed-value">0.82 <span style="font-size:16px;font-weight:400;color:rgba(255,255,255,0.4)">m/s</span></div>
                        <div class="demo-speed-label">Normal pace</div>
                    </div>

                    <div class="demo-glass-card">
                        <div class="demo-card-label">Crossings</div>
                        <div class="demo-stats-row">
                            <div class="demo-stat-item">
                                <div class="demo-stat-value">34</div>
                                <div class="demo-stat-label">Total</div>
                            </div>
                            <div class="demo-stat-item">
                                <div class="demo-stat-value">8</div>
                                <div class="demo-stat-label">This Week</div>
                            </div>
                            <div class="demo-stat-item">
                                <div class="demo-stat-value">47s</div>
                                <div class="demo-stat-label">Avg Wait</div>
                            </div>
                        </div>
                    </div>

                    <div class="demo-glass-card">
                        <div class="demo-card-label">My Intersections</div>
                        <ul class="demo-int-list">
                            ${topIntersections.map(i => `
                                <li class="demo-int-item">
                                    <div class="demo-int-left">
                                        <div class="demo-int-dot ${i.safetyClass}"></div>
                                        <span class="demo-int-name">${i.name}</span>
                                    </div>
                                    <span class="demo-int-count">${i.crossings} crossings</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="demo-glass-card">
                        <div class="demo-card-label">Recent Crossings</div>
                        ${RECENT_CROSSINGS.map(c => `
                            <div class="demo-crossing-item">
                                <div class="demo-crossing-left">
                                    <span class="demo-crossing-name">${c.intersection}</span>
                                    <span class="demo-crossing-date">${c.date}</span>
                                </div>
                                <div class="demo-crossing-right">
                                    <div class="demo-crossing-duration">${c.duration}s</div>
                                    <div class="demo-crossing-speed">${c.speed} m/s</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ---- DETAIL OVERLAY ----

    function buildDetailOverlay() {
        const int = selectedIntersection;
        const dist = int.crossingDistance;
        const wp = int.walkPhase;
        const profiles = [
            { label: 'Standard', speed: 1.0 },
            { label: 'Elderly', speed: 0.8 },
            { label: 'Impaired', speed: 0.6 }
        ];

        return `
            <div class="demo-detail-overlay" id="demoDetailOverlay">
                <button class="demo-detail-back" id="demoDetailBack">
                    <svg width="18" height="18" viewBox="0 0 18 18"><path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Signal
                </button>

                <div class="demo-health-banner ${int.safetyClass}" id="demoHealthBanner">
                    <span class="demo-health-score" id="demoHealthScore">${int.safetyScore}</span>
                    <div class="demo-health-info">
                        <span class="demo-health-label" id="demoHealthLabel">${int.safetyLabel}</span>
                        <span class="demo-health-sub">Based on ${int.crossings} crossings</span>
                    </div>
                </div>

                <div class="demo-detail-title" id="demoDetailTitle">${int.name}</div>

                <div class="demo-detail-content">
                    <div class="demo-detail-stats">
                        <div class="demo-detail-stat">
                            <div class="demo-detail-stat-value" id="demoDetCrossings">${int.crossings}</div>
                            <div class="demo-detail-stat-label">Crossings</div>
                        </div>
                        <div class="demo-detail-stat">
                            <div class="demo-detail-stat-value" id="demoDetAvgTime">${int.avgTime}s</div>
                            <div class="demo-detail-stat-label">Avg Time</div>
                        </div>
                        <div class="demo-detail-stat">
                            <div class="demo-detail-stat-value" id="demoDetAvgWait">${int.avgWait}s</div>
                            <div class="demo-detail-stat-label">Avg Wait</div>
                        </div>
                        <div class="demo-detail-stat">
                            <div class="demo-detail-stat-value" id="demoDetAvgSpeed">${int.avgSpeed} m/s</div>
                            <div class="demo-detail-stat-label">Avg Speed</div>
                        </div>
                    </div>

                    <div class="demo-clearance">
                        <div class="demo-clearance-title">Clearance Analysis</div>
                        <div class="demo-clearance-info">
                            <span class="demo-clearance-info-label">Walk phase</span>
                            <span class="demo-clearance-info-value" id="demoDetWalkPhase">${wp}s</span>
                        </div>
                        <div class="demo-clearance-info">
                            <span class="demo-clearance-info-label">Crossing distance</span>
                            <span class="demo-clearance-info-value" id="demoDetDistance">${dist}m</span>
                        </div>

                        ${profiles.map(p => {
                            const needed = (dist / p.speed).toFixed(1);
                            const sufficient = parseFloat(needed) <= wp;
                            return `
                                <div class="demo-clearance-row" data-profile="${p.label.toLowerCase()}">
                                    <div>
                                        <div class="demo-clearance-profile">${p.label} (${p.speed} m/s)</div>
                                    </div>
                                    <div class="demo-clearance-needed">${needed}s needed</div>
                                    <div class="demo-clearance-verdict ${sufficient ? 'pass' : 'fail'}">
                                        ${sufficient ? '&#10003; Sufficient' : '&#10007; Insufficient'}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="demo-detail-crossings-title">Recent Crossings</div>
                    <div class="demo-glass-card" style="margin-top:8px;">
                        ${RECENT_CROSSINGS.filter(c => c.intersection === int.name || RECENT_CROSSINGS.indexOf(c) < 3).slice(0, 3).map(c => `
                            <div class="demo-crossing-item">
                                <div class="demo-crossing-left">
                                    <span class="demo-crossing-name">${c.intersection}</span>
                                    <span class="demo-crossing-date">${c.date}</span>
                                </div>
                                <div class="demo-crossing-right">
                                    <div class="demo-crossing-duration">${c.duration}s</div>
                                    <div class="demo-crossing-speed">${c.speed} m/s</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ---- TAB BAR ----

    function buildTabBar() {
        return `
            <div class="demo-tab-bar">
                <button class="demo-tab" data-tab="discover">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span class="demo-tab-label">Discover</span>
                </button>
                <button class="demo-tab active" data-tab="signal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span class="demo-tab-label">Signal</span>
                </button>
                <button class="demo-tab" data-tab="insights">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    <span class="demo-tab-label">Insights</span>
                </button>
            </div>
        `;
    }

    // ---- TAB SWITCHING ----

    function bindTabs() {
        const container = document.getElementById('appDemo');
        container.querySelectorAll('.demo-tab').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
    }

    function switchTab(tabName) {
        if (tabName === currentTab) return;
        currentTab = tabName;

        const container = document.getElementById('appDemo');

        // Update tab buttons
        container.querySelectorAll('.demo-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update panels
        container.querySelectorAll('.demo-tab-content').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.tab === tabName);
        });

        // Close detail overlay if open
        if (detailVisible && tabName !== 'signal') {
            hideDetail();
        }

        // Lazy init map
        if (tabName === 'discover' && !mapInitialized) {
            setTimeout(() => initMap(), 100);
        }
    }

    // ---- DETAIL VIEW ----

    function bindDetailView() {
        const container = document.getElementById('appDemo');
        const viewBtn = container.querySelector('#demoViewDetails');
        const backBtn = container.querySelector('#demoDetailBack');

        if (viewBtn) viewBtn.addEventListener('click', showDetail);
        if (backBtn) backBtn.addEventListener('click', hideDetail);
    }

    function showDetail() {
        const overlay = document.getElementById('demoDetailOverlay');
        if (overlay) {
            overlay.classList.add('visible');
            detailVisible = true;
        }
    }

    function hideDetail() {
        const overlay = document.getElementById('demoDetailOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            detailVisible = false;
        }
    }

    // ---- UPDATE SIGNAL TAB FOR SELECTED INTERSECTION ----

    function updateSignalTab(int) {
        selectedIntersection = int;

        const container = document.getElementById('appDemo');
        const nameEl = container.querySelector('#demoIntName');
        const scoreEl = container.querySelector('#demoSafetyScore');
        const textEl = container.querySelector('#demoSafetyText');

        if (nameEl) nameEl.textContent = int.name;
        if (scoreEl) {
            scoreEl.textContent = int.safetyScore;
            scoreEl.className = 'demo-safety-score ' + int.safetyClass;
        }
        if (textEl) textEl.textContent = int.safetyLabel;

        // Update detail overlay
        updateDetailOverlay(int);

        // Reset timer
        timerStart = performance.now();
    }

    function updateDetailOverlay(int) {
        const dist = int.crossingDistance;
        const wp = int.walkPhase;

        const el = (id) => document.getElementById(id);
        const set = (id, val) => { const e = el(id); if (e) e.textContent = val; };

        set('demoHealthScore', int.safetyScore);
        set('demoHealthLabel', int.safetyLabel);
        set('demoDetailTitle', int.name);
        set('demoDetCrossings', int.crossings);
        set('demoDetAvgTime', int.avgTime + 's');
        set('demoDetAvgWait', int.avgWait + 's');
        set('demoDetAvgSpeed', int.avgSpeed + ' m/s');
        set('demoDetWalkPhase', wp + 's');
        set('demoDetDistance', dist + 'm');

        const banner = el('demoHealthBanner');
        if (banner) {
            banner.className = 'demo-health-banner ' + int.safetyClass;
        }

        // Update clearance rows
        const profiles = [
            { label: 'standard', speed: 1.0 },
            { label: 'elderly', speed: 0.8 },
            { label: 'impaired', speed: 0.6 }
        ];

        profiles.forEach(p => {
            const row = document.querySelector(`.demo-clearance-row[data-profile="${p.label}"]`);
            if (!row) return;
            const needed = (dist / p.speed).toFixed(1);
            const sufficient = parseFloat(needed) <= wp;
            const neededEl = row.querySelector('.demo-clearance-needed');
            const verdictEl = row.querySelector('.demo-clearance-verdict');
            if (neededEl) neededEl.textContent = needed + 's needed';
            if (verdictEl) {
                verdictEl.className = 'demo-clearance-verdict ' + (sufficient ? 'pass' : 'fail');
                verdictEl.innerHTML = sufficient ? '&#10003; Sufficient' : '&#10007; Insufficient';
            }
        });
    }

    // ---- COUNTDOWN TIMER ----

    function startTimer() {
        timerStart = performance.now();
        tick();
    }

    function tick() {
        animFrameId = requestAnimationFrame(tick);

        const int = selectedIntersection;
        const cycle = int.timingCycle;
        const totalCycle = cycle.walk + cycle.flash + cycle.wait;
        const elapsed = ((performance.now() - timerStart) / 1000) % totalCycle;

        let phase, remaining, color;

        if (elapsed < cycle.walk) {
            phase = 'WALK';
            remaining = Math.ceil(cycle.walk - elapsed);
            color = '#33E680';
        } else if (elapsed < cycle.walk + cycle.flash) {
            phase = 'FLASH';
            remaining = Math.ceil((cycle.walk + cycle.flash) - elapsed);
            color = '#FFA600';
        } else {
            phase = 'WAIT';
            remaining = Math.ceil(totalCycle - elapsed);
            color = '#F24040';
        }

        // Update number
        const numEl = document.getElementById('demoNumber');
        const phaseEl = document.getElementById('demoPhase');
        const ringEl = document.getElementById('demoRing');

        if (numEl) {
            numEl.textContent = remaining;
            numEl.style.color = color;
            numEl.classList.toggle('flash', phase === 'FLASH');
        }
        if (phaseEl) {
            phaseEl.textContent = phase;
            phaseEl.style.color = color;
        }

        // Update ring
        if (ringEl) {
            const circumference = 628.32; // 2 * PI * 100
            let phaseDuration, phaseElapsed;

            if (phase === 'WALK') {
                phaseDuration = cycle.walk;
                phaseElapsed = elapsed;
            } else if (phase === 'FLASH') {
                phaseDuration = cycle.flash;
                phaseElapsed = elapsed - cycle.walk;
            } else {
                phaseDuration = cycle.wait;
                phaseElapsed = elapsed - cycle.walk - cycle.flash;
            }

            const progress = 1 - (phaseElapsed / phaseDuration);
            const offset = circumference * (1 - progress);

            ringEl.setAttribute('stroke', color);
            ringEl.setAttribute('stroke-dashoffset', offset.toFixed(2));

            // Add glow filter
            ringEl.style.filter = `drop-shadow(0 0 6px ${color}40)`;
        }
    }

    // ---- LEAFLET MAP ----

    function initMap() {
        if (mapInitialized) return;
        if (typeof L === 'undefined') {
            // Leaflet not loaded yet, retry
            setTimeout(initMap, 200);
            return;
        }

        const mapContainer = document.getElementById('demoLeafletMap');
        if (!mapContainer) return;

        // Check container has size
        if (mapContainer.offsetWidth === 0) {
            setTimeout(initMap, 200);
            return;
        }

        mapInitialized = true;

        leafletMap = L.map('demoLeafletMap', {
            center: [40.7580, -73.9855],
            zoom: 13,
            zoomControl: false,
            attributionControl: false,
            dragging: true,
            scrollWheelZoom: false,
            doubleClickZoom: true,
            touchZoom: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18
        }).addTo(leafletMap);

        // Active markers
        INTERSECTIONS.forEach(int => {
            const icon = L.divIcon({
                className: '',
                html: '<div class="demo-marker-active"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            const marker = L.marker([int.lat, int.lng], { icon }).addTo(leafletMap);

            const scoreClass = int.safetyClass;
            const popupContent = `
                <div class="demo-popup-name">${int.name}</div>
                <div class="demo-popup-score ${scoreClass}">${int.safetyScore} — ${int.safetyLabel}</div>
                <div class="demo-popup-link" data-int-id="${int.id}">View Signal &rarr;</div>
            `;

            marker.bindPopup(popupContent, {
                className: 'demo-map-popup',
                closeButton: false,
                offset: [0, -4]
            });

            marker.on('popupopen', () => {
                // Bind the popup link
                setTimeout(() => {
                    const link = document.querySelector(`.demo-popup-link[data-int-id="${int.id}"]`);
                    if (link) {
                        link.addEventListener('click', () => {
                            updateSignalTab(int);
                            switchTab('signal');
                            leafletMap.closePopup();
                        });
                    }
                }, 50);
            });
        });

        // Inactive markers
        INACTIVE_INTERSECTIONS.forEach(pos => {
            const icon = L.divIcon({
                className: '',
                html: '<div class="demo-marker-inactive"></div>',
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });

            L.marker([pos.lat, pos.lng], { icon, interactive: false }).addTo(leafletMap);
        });

        // Invalidate size after a moment
        setTimeout(() => {
            if (leafletMap) leafletMap.invalidateSize();
        }, 300);
    }

    // ---- INIT ----

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
