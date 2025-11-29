/* assets/js/script.js
   Polished, consolidated JS for the site.
   - Theme toggle (persisted)
   - Terminal demo heavy typing + glitch
   - FAQ open/close + search + copy + save prompts (localStorage)
   - Download checklist
   - Quiz feedback
   - Toast messages
*/

(() => {
    'use strict';

    // Small helpers
    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));
    const LS = window.localStorage;

    // Toast helper
    const toastEl = document.querySelector('.toastEl');
    function showToast(msg, ms = 1800) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.style.opacity = '1';
        toastEl.style.transform = 'translateY(0)';
        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateY(8px)';
        }, ms);
    }

    /* =========================
       THEME TOGGLING (heavy)
       ========================= */
    const themeButtons = $$('.themeToggleButton');
    const applyTheme = (mode) => {
        if (mode === 'light') {
            document.documentElement.classList.add('lightMode');
            LS.setItem('siteTheme', 'light');
            themeButtons.forEach(b => b.innerHTML = '<i class="fa-solid fa-moon"></i>');
        } else {
            document.documentElement.classList.remove('lightMode');
            LS.setItem('siteTheme', 'dark');
            themeButtons.forEach(b => b.innerHTML = '<i class="fa-solid fa-sun"></i>');
        }
    };
    const savedTheme = LS.getItem('siteTheme') || 'dark';
    applyTheme(savedTheme);
    themeButtons.forEach(btn => btn.addEventListener('click', () => {
        const current = LS.getItem('siteTheme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
        showToast((LS.getItem('siteTheme') === 'light') ? 'Light mode enabled' : 'Dark mode enabled', 1200);
    }));

    /* =========================
       NAV ACTIVE LINK (simple)
       ========================= */
    (() => {
        const path = location.pathname.split('/').pop() || 'index.html';
        $$('.navLink').forEach(a => {
            const href = a.getAttribute('href');
            if (href === path) a.classList.add('active');
            else a.classList.remove('active');
        });
    })();

    /* =========================
       TERMINAL DEMO + GLITCH (heavy)
       ========================= */
    const terminalOutput = $('#terminalOutput');
    const runDemoBtn = $('#runDemoBtn');
    const openFaqBtn = $('#openFaqBtn');

    function heavyType(lines, targetEl, speed = 32, lineDelay = 350) {
        targetEl.textContent = '';
        let i = 0;
        const runLine = () => {
            if (i >= lines.length) return;
            const line = lines[i] + '\n';
            let j = 0;
            const t = setInterval(() => {
                targetEl.textContent += line[j] || '';
                j++;
                if (j >= line.length) {
                    clearInterval(t);
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
                '> heavy-mode: initializing neon pipeline...',
                '> checking integrity modules...',
                '> scanning sources (simulated) — ok',
                '> generating checklist... saved',
                '> reminder: verify outputs and cite sources'
            ];
            heavyType(lines, terminalOutput, 28, 240);
            // add glitch to title briefly
            const title = document.querySelector('.heroTitle');
            if (title) {
                title.classList.add('activeGlitch');
                setTimeout(() => title.classList.remove('activeGlitch'), 2400);
            }
        });
    }
    if (openFaqBtn) openFaqBtn.addEventListener('click', () => location.href = 'faq.html');

    /* =========================
       FAQ: OPEN/CLOSE, SEARCH, COPY, SAVE PROMPT
       ========================= */
    const faqSearch = $('#faqSearch');
    const faqClear = $('#faqClear');

    // Toggle faq sections
    $$('.faqQuestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.target;
            const panel = document.getElementById(id);
            if (!panel) return;
            panel.classList.toggle('open');
        });
    });

    // Search filtering
    if (faqSearch) {
        faqSearch.addEventListener('input', () => {
            const q = faqSearch.value.trim().toLowerCase();
            $$('.faqItem').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }
    if (faqClear) faqClear.addEventListener('click', () => { if (faqSearch) { faqSearch.value = ''; faqSearch.dispatchEvent(new Event('input')); } });

    // Copy buttons
    // Copy buttons
    $$('.copyBtn').forEach(b => {
        b.addEventListener('click', (e) => {
            // Find the <p> element within the same .faqItem that contains the FAQ answer
            const faqItem = b.closest('.faqItem'); // Find the closest .faqItem to the button
            const answerText = faqItem.querySelector('.faqAnswer p'); // Get the <p> inside .faqAnswer

            // Check if the <p> tag exists and copy the text
            if (answerText) {
                const txt = answerText.textContent.trim(); // Get text content of <p>
                navigator.clipboard?.writeText(txt).then(() => {
                    showToast('Copied to clipboard.');
                }).catch((err) => {
                    showToast('Failed to copy text.');
                    console.error('Error copying text: ', err);
                });
            }
        });
    });


    // Save prompt to localStorage
    const savedPromptsContainer = $('#savedPrompts');
    function loadPrompts() {
        if (!savedPromptsContainer) return;
        const list = JSON.parse(LS.getItem('savedPrompts') || '[]');
        if (!list.length) { savedPromptsContainer.textContent = 'No saved prompts yet.'; return; }
        savedPromptsContainer.innerHTML = '';
        list.slice(0, 8).forEach(p => {
            const el = document.createElement('div');
            el.className = 'small';
            el.textContent = p;
            savedPromptsContainer.appendChild(el);
        });
    }
    $$('.savePromptBtn').forEach(b => {
        b.addEventListener('click', () => {
            const prompt = b.dataset.prompt || '';
            if (!prompt) return;
            const list = JSON.parse(LS.getItem('savedPrompts') || '[]');
            list.unshift(prompt);
            LS.setItem('savedPrompts', JSON.stringify(list.slice(0, 40)));
            loadPrompts();
            showToast('Prompt saved locally.');
        });
    });
    const clearSavedPromptsBtn = $('#clearSavedPrompts');
    if (clearSavedPromptsBtn) clearSavedPromptsBtn.addEventListener('click', () => {
        LS.removeItem('savedPrompts'); loadPrompts(); showToast('Saved prompts cleared.');
    });
    loadPrompts();

    /* =========================
       QUIZ BUTTONS (ethics)
       ========================= */
    $$('.quizBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const correct = btn.dataset.correct === 'yes';
            const fb = $('#quizFeedback');
            if (!fb) return;
            if (correct) {
                fb.textContent = 'Correct — disclose significant AI assistance.';
                fb.style.color = '#9fffe8';
            } else {
                fb.textContent = 'Incorrect — transparency is recommended.';
                fb.style.color = '#ffd1d1';
            }
        });
    });

    /* =========================
       ARTICLE INTERACTIONS
       ========================= */
    const requestSampleBtn = $('#requestSampleBtn');
    if (requestSampleBtn) requestSampleBtn.addEventListener('click', () => showToast('Request for sample edit sent (simulated).'));
    const negotiateBtn = $('#negotiateBtn');
    if (negotiateBtn) negotiateBtn.addEventListener('click', () => showToast('Negotiation prompt opened (simulated).'));

    /* =========================
       Small UX touch: reveal animations on scroll (heavy)
       ========================= */
    const revealElems = () => $$('section, .cardNeo, .terminalCard, .cardNeo').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 120) el.style.transform = 'translateY(0) scale(1)';
        else el.style.transform = 'translateY(22px) scale(.995)';
    });
    window.addEventListener('scroll', () => window.requestAnimationFrame(revealElems));
    window.addEventListener('resize', () => window.requestAnimationFrame(revealElems));
    document.addEventListener('DOMContentLoaded', () => {
        // initial states for heavy animation transform
        $$('section, .cardNeo, .terminalCard, .cardNeo').forEach(el => {
            el.style.transition = 'transform 480ms cubic-bezier(.2,.9,.2,1), box-shadow 420ms';
            el.style.transform = 'translateY(18px) scale(.995)';
        });
        setTimeout(() => revealElems(), 80);
    });

    // end
})();


