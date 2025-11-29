/* assets/js/article.js
   Interactive analogy component - Optimized
*/

(() => {
    'use strict';

    const questions = [
        {
            id: 'deal',
            question: 'Would you agree to that deal?',
            type: 'choice',
            options: ['Yes', 'No', 'Need more info']
        },
        {
            id: 'concerns',
            question: 'What are your concerns? (select all)',
            type: 'multiple',
            options: [
                'iPhone 16 Pro Max (not a "pro" camera)',
                'CapCut (not Premiere/Final Cut)',
                'Only 2 years experience',
                'Portfolio quality unclear',
                'No backup equipment mentioned',
                'Rights & deliverables undefined'
            ]
        },
        {
            id: 'priority',
            question: 'Rank these by importance (drag to reorder):',
            type: 'ranking',
            options: [
                'Technical quality (resolution, stabilization)',
                'Creative storytelling & emotion capture',
                'Reliability & backup systems',
                'Equipment brand/type'
            ]
        }
    ];

    let currentStep = 0;
    let answers = {};
    let rankedItems = [...questions[2].options];
    let draggedIndex = null;

    const container = document.getElementById('Contents');
    if (!container) return;

    function render() {
        currentStep >= questions.length ? renderResults() : renderQuestion();
    }

    function renderQuestion() {
        const q = questions[currentStep];
        const progress = Math.round(((currentStep + 1) / questions.length) * 100);

        container.innerHTML = `
            <article class="cardNeo articleCard analogyCard">
                <div class="progressWrapper">
                    <div class="progressInfo">
                        <span class="progressLabel">Question ${currentStep + 1} of ${questions.length}</span>
                        <span class="progressPercent">${progress}%</span>
                    </div>
                    <div class="progressBarWrapper">
                        <div class="progressBarFill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <h4 class="questionTitle">${q.question}</h4>
                <div class="optionsContainer" id="optionsContainer"></div>

                <div class="navigationButtons">
                    ${currentStep > 0 ? '<button class="btnOutline btnSmall" id="prevBtn">Previous</button>' : ''}
                    <button class="btnPrimary btnSmall btnContinue" id="nextBtn">
                        ${currentStep === questions.length - 1 ? 'See Analysis' : 'Continue'}
                    </button>
                </div>
            </article>
        `;

        renderOptions(q);
        attachListeners(q);
    }

    function renderOptions(q) {
        const container = document.getElementById('optionsContainer');

        if (q.type === 'choice') {
            container.innerHTML = q.options.map(opt => `
                <button class="choiceOption ${answers[q.id] === opt ? 'selected' : ''}" data-option='${opt}'>
                    ${opt}
                </button>
            `).join('');
        }
        else if (q.type === 'multiple') {
            container.innerHTML = q.options.map(opt => {
                const checked = (answers[q.id] || []).includes(opt);
                return `
                    <label class="multipleOption ${checked ? 'selected' : ''}">
                        <input type="checkbox" ${checked ? 'checked' : ''} data-option='${opt}'>
                        <span>${opt}</span>
                    </label>
                `;
            }).join('');
        }
        else if (q.type === 'ranking') {
            container.innerHTML = `
                <p class="rankingHint">Drag to reorder (1 = most important):</p>
                ${rankedItems.map((opt, idx) => `
                    <div class="rankingOption" draggable="true" data-index="${idx}">
                        <span class="rankNumber">${idx + 1}</span>
                        <span class="rankText">${opt}</span>
                    </div>
                `).join('')}
            `;
        }
    }

    function attachListeners(q) {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        nextBtn?.addEventListener('click', () => {
            if (q.type === 'ranking') answers[q.id] = [...rankedItems];
            currentStep++;
            render();
        });

        prevBtn?.addEventListener('click', () => {
            currentStep--;
            render();
        });

        if (q.type === 'choice') {
            document.querySelectorAll('.choiceOption').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    answers[q.id] = e.target.dataset.option;
                    renderQuestion();
                });
            });
        }

        if (q.type === 'multiple') {
            document.querySelectorAll('.multipleOption input').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const opt = e.target.dataset.option;
                    if (!answers[q.id]) answers[q.id] = [];

                    if (e.target.checked) {
                        answers[q.id].push(opt);
                    } else {
                        answers[q.id] = answers[q.id].filter(x => x !== opt);
                    }
                    renderQuestion();
                });
            });
        }

        if (q.type === 'ranking') {
            document.querySelectorAll('.rankingOption').forEach(opt => {
                opt.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(e.target.dataset.index);
                    e.target.classList.add('dragging');
                });

                opt.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });

                opt.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const targetIdx = parseInt(e.currentTarget.dataset.index);

                    if (draggedIndex !== null && draggedIndex !== targetIdx) {
                        const items = [...rankedItems];
                        const [draggedItem] = items.splice(draggedIndex, 1);
                        items.splice(targetIdx, 0, draggedItem);
                        rankedItems = items;
                        draggedIndex = targetIdx;
                        renderOptions(q);
                        attachListeners(q);
                    }
                });
            });
        }
    }

    function renderResults() {
        const equipmentRank = rankedItems.indexOf('Equipment brand/type') + 1;

        container.innerHTML = `
            <article class="cardNeo articleCard analogyCard">
                <h4>Your Answer</h4>
                <div class="answerSummary">
                    <p><strong>Deal decision:</strong> ${answers.deal}</p>
                    ${answers.concerns?.length ? `<p><strong>Concerns:</strong> ${answers.concerns.join(', ')}</p>` : ''}
                    <p><strong>Priority ranking:</strong> ${rankedItems.map((item, idx) => `${idx + 1}. ${item}`).join(' → ')}</p>
                </div>

                ${equipmentRank === 4 ? `
                    <div class="successNote">
                        <p>✓ You ranked equipment last. Smart – craft over tools.</p>
                    </div>
                ` : ''}

                <h1>Dev Thoughts on "Vibe Coders"</h1>
                
                <h4>Short Answer</h4>
                <p>Tools don't replace craft. The gear is fine, but check portfolio, rights, backups, and sample edits. Same with GenAI – verify provenance, license, and correctness.</p>

                <h4 class="analogyHeader">Analogy → GenAI "Vibe Coders"</h4>
                <div class="analogyComparison">
                    <div class="comparisonCard cyanCard">
                        <p class="comparisonTitle">Wedding Videographer</p>
                        <ul>
                            <li>iPhone 16 Pro Max</li>
                            <li>CapCut editing</li>
                            <li>2 years experience</li>
                            <li>Above-average portfolio</li>
                        </ul>
                    </div>
                    
                    <div class="comparisonCard limeCard">
                        <p class="comparisonTitle">"Vibe Coder"</p>
                        <ul>
                            <li>ChatGPT / Claude</li>
                            <li>Copy-paste workflow</li>
                            <li>Limited fundamentals</li>
                            <li>Functional output</li>
                        </ul>
                    </div>
                </div>

                <div class="sameQuestions">
                    <p class="sameQuestionsTitle">Same questions apply:</p>
                    <ul>
                        <li>Can they handle edge cases?</li>
                        <li>Do they understand the fundamentals?</li>
                        <li>Can they debug when things break?</li>
                        <li>Is there proper documentation/provenance?</li>
                        <li>Are rights & licenses clear?</li>
                    </ul>
                </div>

                <h4>Web Dev Thought</h4>
                <p class="webDevThought">
                    Most important to me: <strong class="highlightCyan">technical quality</strong>, 
                    <strong class="highlightCyan">creativity</strong>, 
                    <strong class="highlightCyan">reliability</strong>. 
                    Least important: <strong class="highlightMuted">equipment</strong>.
                </p>
                <p>The iPhone shoots 4K ProRes. CapCut has advanced features. If the portfolio proves competence and backups exist, the tools are secondary. Same with GenAI – output quality and understanding matter more than whether they used ChatGPT or wrote from scratch. Verify, don't assume.</p>

                <div class="articleActions">
                    <button class="btnPrimary btnSmall" id="restartBtn">Retake Questions</button>
                    <button class="btnOutline btnSmall" onclick="window.location.href='faq.html'">View FAQ</button>
                </div>
            </article>
        `;

        document.getElementById('restartBtn')?.addEventListener('click', () => {
            currentStep = 0;
            answers = {};
            rankedItems = [...questions[2].options];
            render();
        });
    }

    render();
})();