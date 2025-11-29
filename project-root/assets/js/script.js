/* assets/js/script.js
   Optimized core functionality
*/

(() => {
    'use strict';

    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));
    const LS = window.localStorage;
    /* =========================
THEME TOGGLING — F##SHBANG #RO## MODE
========================= */

    // FLASHBANG TROLL – polished, safe, DOM-ready
    (function () {
        'use strict';

        // small helpers (safe – existing helpers still available in file)
        const $ = (sel) => document.querySelector(sel);
        const $$ = (sel) => Array.from(document.querySelectorAll(sel));
        const LS = window.localStorage;

        // ensure code runs after DOM loaded
        document.addEventListener('DOMContentLoaded', () => {

            // find theme buttons (may be multiple)
            const themeButtons = $$('.themeToggleButton');

            // make or find overlay (works even if overlay placed after script)
            let flashbangOverlay = $('#flashbangOverlay');
            let flashbangText = $('#flashbangText');

            if (!flashbangOverlay) {
                flashbangOverlay = document.createElement('div');
                flashbangOverlay.id = 'flashbangOverlay';
                flashbangOverlay.style.position = 'fixed';
                flashbangOverlay.style.inset = '0';
                flashbangOverlay.style.display = 'none';
                flashbangOverlay.style.justifyContent = 'center';
                flashbangOverlay.style.alignItems = 'center';
                flashbangOverlay.style.background = '#ffffff';
                flashbangOverlay.style.zIndex = '2147483647'; // very high
                flashbangOverlay.style.transition = 'opacity 0.6s ease';
                flashbangOverlay.style.opacity = '1';
                const pre = document.createElement('pre');
                pre.id = 'flashbangText';
                pre.style.margin = '0';
                pre.style.whiteSpace = 'pre-wrap';
                pre.style.fontFamily = "'Share Tech Mono', monospace";
                pre.style.color = '#000';
                pre.style.fontSize = '18px';
                pre.style.textAlign = 'center';
                pre.style.padding = '20px';
                flashbangOverlay.appendChild(pre);
                document.body.appendChild(flashbangOverlay);
                flashbangText = pre;
            }

            // small toast fallback if showToast isn't defined elsewhere
            let externalShowToast = (typeof window.showToast === 'function') ? window.showToast : null;
            function localShowToast(msg, ms = 1600) {
                if (externalShowToast) return externalShowToast(msg, ms);
                // minimal fallback toast
                let t = document.createElement('div');
                t.textContent = msg;
                t.style.position = 'fixed';
                t.style.right = '18px';
                t.style.bottom = '18px';
                t.style.background = 'rgba(0,0,0,0.75)';
                t.style.color = '#fff';
                t.style.padding = '8px 12px';
                t.style.borderRadius = '8px';
                t.style.zIndex = '2147483647';
                t.style.boxShadow = '0 6px 30px rgba(0,0,0,0.6)';
                document.body.appendChild(t);
                setTimeout(() => { t.style.transition = 'opacity 300ms'; t.style.opacity = '0'; }, ms);
                setTimeout(() => t.remove(), ms + 350);
            }

            // typed-line helper using async/await; returns when done
            async function typeLine(el, text, speed = 45) {
                el.textContent = '';
                for (let i = 0; i < text.length; i++) {
                    el.textContent += text[i];
                    // small micro-yield to keep UI smooth
                    await new Promise((r) => setTimeout(r, speed));
                }
            }

            // guard so multiple clicks do not stack
            let isRunning = false;

            // main sequence
            async function runFlashbang() {
                if (isRunning) return;
                isRunning = true;

                // ensure dark mode persists (no real light mode)
                document.documentElement.classList.remove('lightMode');
                try { LS.setItem('siteTheme', 'dark'); } catch (e) {/* ignore */ }

                // disable buttons visually while running
                themeButtons.forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });

                // show overlay (white)
                flashbangOverlay.style.display = 'flex';
                flashbangOverlay.style.opacity = '1';
                flashbangText.textContent = '';

                // blinding hold
                await new Promise(r => setTimeout(r, 900));

                // first line (slightly slower)
                await typeLine(flashbangText, `Sorry, "night owls" don't use light mode for a reason...`, 45);

                // small pause
                await new Promise(r => setTimeout(r, 850));

                // second line only — clear and type only the second phrase
                flashbangText.textContent = '';
                await typeLine(flashbangText, `this is the reason...`, 60);

                // hold before fade
                await new Promise(r => setTimeout(r, 1000));

                // fade out
                flashbangOverlay.style.opacity = '0';
                setTimeout(() => {
                    flashbangOverlay.style.display = 'none';
                }, 650);

                // re-enable buttons
                themeButtons.forEach(b => { b.disabled = false; b.style.pointerEvents = ''; });

                // show toast
                localShowToast('Flashbang prank delivered 💥', 1300);

                // small safety: ensure dark mode remains
                document.documentElement.classList.remove('lightMode');
                try { LS.setItem('siteTheme', 'dark'); } catch (e) { }

                isRunning = false;
            }

            // bind the function to the theme buttons
            if (!themeButtons.length) {
                // find by alternate selector if class missing
                const fallback = document.querySelector('.controlBtn') || document.querySelector('.themeToggle');
                if (fallback) {
                    fallback.addEventListener('click', runFlashbang);
                    fallback.innerHTML = `<i class="fa-solid fa-sun"></i>`;
                }
            } else {
                themeButtons.forEach(btn => {
                    // make button purpose explicit
                    try { btn.innerHTML = `<i class="fa-solid fa-sun"></i>`; } catch (e) { }
                    // remove any existing click handlers safely
                    btn.onclick = null;
                    btn.addEventListener('click', runFlashbang);
                });
            }

        }); // DOMContentLoaded
    })();




    /* Nav Active Link */
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('.navLink').forEach(a => {
        const href = a.getAttribute('href');
        if (href === path) a.classList.add('active');
        else a.classList.remove('active');
    });

    /* Terminal Demo */
    const terminalOutput = $('#terminalOutput');
    const runDemoBtn = $('#runDemoBtn');
    const openFaqBtn = $('#openFaqBtn');

    function typeText(lines, targetEl, speed = 30, lineDelay = 300) {
        if (!targetEl) return;
        targetEl.textContent = '';
        let i = 0;

        const runLine = () => {
            if (i >= lines.length) return;
            const line = lines[i] + '\n';
            let j = 0;
            const interval = setInterval(() => {
                targetEl.textContent += line[j] || '';
                j++;
                if (j >= line.length) {
                    clearInterval(interval);
                    i++;
                    setTimeout(runLine, lineDelay);
                }
            }, speed);
        };
        runLine();
    }

    if (runDemoBtn && terminalOutput) {
        runDemoBtn.addEventListener('click', () => {
            const lines = [
                '> initializing neon pipeline...',
                '> checking integrity modules...',
                '> scanning sources – ok',
                '> generating checklist... saved',
                '> reminder: verify outputs and cite sources'
            ];
            typeText(lines, terminalOutput, 25, 200);

            const title = $('.heroTitle');
            if (title) {
                title.classList.add('activeGlitch');
                setTimeout(() => title.classList.remove('activeGlitch'), 2400);
            }
        });
    }

    if (openFaqBtn) {
        openFaqBtn.addEventListener('click', () => location.href = 'faq.html');
    }

    /* FAQ Toggle */
    $$('.faqQuestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.target;
            const panel = document.getElementById(id);
            if (panel) panel.classList.toggle('open');
        });
    });

    /* FAQ Search */
    const faqSearch = $('#faqSearch');
    const faqClear = $('#faqClear');

    if (faqSearch) {
        faqSearch.addEventListener('input', () => {
            const query = faqSearch.value.trim().toLowerCase();
            $$('.faqItem').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    if (faqClear) {
        faqClear.addEventListener('click', () => {
            if (faqSearch) {
                faqSearch.value = '';
                faqSearch.dispatchEvent(new Event('input'));
            }
        });
    }

    /* Copy Buttons */
    $$('.copyBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.closest('.faqItem');
            const answerText = faqItem?.querySelector('.faqAnswer p');

            if (answerText && navigator.clipboard) {
                const text = answerText.textContent.trim();
                navigator.clipboard.writeText(text)
                    .then(() => {
                        btn.textContent = 'Copied!';
                        setTimeout(() => btn.textContent = 'Copy', 1500);
                    })
                    .catch(() => {
                        btn.textContent = 'Failed';
                        setTimeout(() => btn.textContent = 'Copy', 1500);
                    });
            }
        });
    });

    /* Quiz Buttons */
    $$('.quizBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const correct = btn.dataset.correct === 'yes';
            const feedback = $('#quizFeedback');
            if (!feedback) return;

            if (correct) {
                feedback.textContent = 'Correct – disclose significant AI assistance.';
                feedback.style.color = '#9fffe8';
            } else {
                feedback.textContent = 'Incorrect – transparency is recommended.';
                feedback.style.color = '#ffd1d1';
            }
        });
    });

    /* Scroll Reveal Animation */
    const revealElements = () => {
        $$('.cardNeo, .terminalCard').forEach(el => {
            const rect = el.getBoundingClientRect();
            const inView = rect.top < window.innerHeight - 100;

            if (inView) {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.opacity = '1';
            }
        });
    };

    window.addEventListener('scroll', () => requestAnimationFrame(revealElements));
    window.addEventListener('resize', () => requestAnimationFrame(revealElements));

    document.addEventListener('DOMContentLoaded', () => {
        $$('.cardNeo, .terminalCard').forEach(el => {
            el.style.transition = 'transform 480ms cubic-bezier(.2,.9,.2,1), opacity 420ms';
            el.style.transform = 'translateY(20px) scale(.995)';
            el.style.opacity = '0.8';
        });
        setTimeout(revealElements, 100);
    });

})();