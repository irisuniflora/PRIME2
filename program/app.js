// 전역 변수
let currentBook = null;
let currentBookKey = null;
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let currentGradeFilter = 'all';

// 점수 추적
let scores = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
};

// Book icons by grade level
const gradeIcons = {
    '1-2': ['🐣', '🐰', '🦋', '🌈', '🌻', '🍎', '🐝', '🦊'],
    '3-4': ['🐉', '🏰', '🧙', '🦉', '🎭', '📚', '🗝️', '🌟'],
    '5+': ['⚔️', '🔮', '🐺', '🏆', '🌙', '🎯', '💎', '🦅']
};

// Get grade level from book
function getGradeLevel(book) {
    if (typeof book.book_level === 'object') {
        return book.book_level.grade;
    }
    return parseFloat(book.book_level) || 3;
}

// Get grade range for filtering
function getGradeRange(grade) {
    if (grade <= 2) return '1-2';
    if (grade <= 4) return '3-4';
    return '5+';
}

// 책 목록 초기화
function initBookList() {
    renderBooks();
}

// Render books with current filters
function renderBooks() {
    const bookGrid = document.getElementById('book-grid');
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    bookGrid.innerHTML = '';

    // Sort books by grade level
    const sortedBooks = Object.keys(quizData).sort((a, b) => {
        const gradeA = getGradeLevel(quizData[a]);
        const gradeB = getGradeLevel(quizData[b]);
        return gradeA - gradeB;
    });

    // Counter for icons
    const iconCounters = { '1-2': 0, '3-4': 0, '5+': 0 };

    sortedBooks.forEach((bookKey) => {
        const book = quizData[bookKey];
        const grade = getGradeLevel(book);
        const gradeRange = getGradeRange(grade);

        const bookTitle = book.title || book.book_title;
        let authorText;
        if (book.authors && Array.isArray(book.authors)) {
            authorText = book.authors.join(', ');
        } else {
            authorText = book.author;
        }

        // Apply filters
        if (currentGradeFilter !== 'all' && gradeRange !== currentGradeFilter) {
            return;
        }

        if (searchTerm && !bookTitle.toLowerCase().includes(searchTerm) &&
            !authorText.toLowerCase().includes(searchTerm)) {
            return;
        }

        // Get icon
        const icons = gradeIcons[gradeRange];
        const iconIndex = iconCounters[gradeRange] % icons.length;
        iconCounters[gradeRange]++;
        const icon = icons[iconIndex];

        const card = document.createElement('div');
        card.className = 'book-card';
        card.setAttribute('data-grade', gradeRange);
        card.onclick = () => selectBook(bookKey);

        card.innerHTML = `
            <div class="book-icon">${icon}</div>
            <div class="book-info">
                <h3>${bookTitle}</h3>
                <p>${authorText}</p>
            </div>
            <span class="book-grade">Level ${grade}</span>
        `;

        bookGrid.appendChild(card);
    });

    // Show empty state if no books
    if (bookGrid.children.length === 0) {
        bookGrid.innerHTML = '<p class="no-books">No books found</p>';
    }
}

// Filter by search
function filterBooks() {
    renderBooks();
}

// Filter by grade
function filterByGrade(grade) {
    currentGradeFilter = grade;

    // Update active button
    document.querySelectorAll('.grade-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-grade') === grade) {
            btn.classList.add('active');
        }
    });

    renderBooks();
}

// 책 선택
function selectBook(bookKey) {
    currentBook = quizData[bookKey];
    currentBookKey = bookKey;
    prepareQuestions();
    showScreen('quiz-screen');
    renderQuestion();
}

// 문제 준비
function prepareQuestions() {
    const allQuestions = currentBook.questions;

    const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');

    const selectedEasy = shuffleArray(easyQuestions).slice(0, 4);
    const selectedMedium = shuffleArray(mediumQuestions).slice(0, 4);
    const selectedHard = shuffleArray(hardQuestions).slice(0, 4);

    questions = shuffleArray([...selectedEasy, ...selectedMedium, ...selectedHard]);
    currentQuestionIndex = 0;
    selectedAnswer = null;

    // 점수 초기화
    scores = {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 }
    };
}

// 배열 셔플 함수
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 문제 렌더링
function renderQuestion() {
    const question = questions[currentQuestionIndex];

    // 진행 상태 업데이트
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('progress-fill').style.width = `${((currentQuestionIndex + 1) / 12) * 100}%`;

    // 난이도 배지
    const difficultyBadge = document.getElementById('difficulty-badge');
    difficultyBadge.className = 'difficulty-badge ' + question.difficulty;

    let difficultyText;
    switch(question.difficulty) {
        case 'easy':
            difficultyText = 'Easy';
            break;
        case 'medium':
            difficultyText = 'Medium';
            break;
        case 'hard':
            difficultyText = 'Hard';
            break;
    }

    difficultyBadge.querySelector('.difficulty-text').textContent = difficultyText;

    // 문제 텍스트
    document.getElementById('question-text').textContent = question.question;

    // 옵션 렌더링
    const optionsContainer = document.getElementById('options');
    const letters = ['A', 'B', 'C', 'D'];

    optionsContainer.innerHTML = '';

    let optionsArray;
    if (Array.isArray(question.options)) {
        optionsArray = question.options;
    } else {
        optionsArray = letters.map(letter => question.options[letter]);
    }

    optionsArray.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.onclick = () => selectOption(index);

        btn.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option}</span>
        `;

        optionsContainer.appendChild(btn);
    });

    // 상태 초기화
    selectedAnswer = null;
    document.getElementById('check-btn').disabled = true;
    document.getElementById('check-btn').style.display = 'block';
    const resultBox = document.getElementById('result-box');
    resultBox.style.display = 'none';
    resultBox.classList.remove('show', 'correct', 'wrong');
}

// 옵션 선택
function selectOption(index) {
    selectedAnswer = index;

    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.classList.remove('selected');
        if (i === index) {
            btn.classList.add('selected');
        }
    });

    document.getElementById('check-btn').disabled = false;
}

// 정답 확인
function checkAnswer() {
    const question = questions[currentQuestionIndex];
    const letters = ['A', 'B', 'C', 'D'];

    const correctAnswer = question.correct_answer || question.answer;
    const correctIndex = letters.indexOf(correctAnswer);
    const isCorrect = selectedAnswer === correctIndex;

    // 옵션 스타일 업데이트
    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.onclick = null;
        if (i === correctIndex) {
            btn.classList.add('correct');
        } else if (i === selectedAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // 결과 박스 표시
    const resultBox = document.getElementById('result-box');
    const resultTitle = document.getElementById('result-title');
    const explanationText = document.getElementById('explanation-text');

    // 점수 기록
    const difficulty = question.difficulty;
    scores[difficulty].total++;
    if (isCorrect) {
        scores[difficulty].correct++;
    }

    resultBox.style.display = 'block';
    if (isCorrect) {
        resultBox.classList.add('show', 'correct');
        resultTitle.textContent = 'Correct!';
    } else {
        resultBox.classList.add('show', 'wrong');
        resultTitle.textContent = 'Incorrect!';
    }

    explanationText.textContent = question.explanation || '';

    // 정답 확인 버튼 숨기기
    document.getElementById('check-btn').style.display = 'none';

    // Update next button text
    const nextBtn = resultBox.querySelector('.next-btn');
    if (currentQuestionIndex === 11) {
        nextBtn.textContent = 'View Results';
    } else {
        nextBtn.textContent = 'Next Question';
    }
}

// 다음 문제
function nextQuestion() {
    if (currentQuestionIndex < 11) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

// 결과 화면 표시
function showResults() {
    // 점수 계산 (쉬움 2점, 보통 3점, 어려움 5점)
    const easyScore = scores.easy.correct * 2;
    const mediumScore = scores.medium.correct * 3;
    const hardScore = scores.hard.correct * 5;
    const totalScore = easyScore + mediumScore + hardScore;
    const maxScore = 40; // 2×4 + 3×4 + 5×4 = 40
    const scaledScore = Math.round((totalScore / maxScore) * 100);

    // 총 정답/오답 수
    const totalCorrect = scores.easy.correct + scores.medium.correct + scores.hard.correct;
    const totalQuestions = 12;

    // 결과 화면 업데이트
    document.getElementById('result-grade').textContent = scaledScore;
    document.getElementById('result-correct').textContent = totalCorrect;
    document.getElementById('result-wrong').textContent = totalQuestions - totalCorrect;
    document.getElementById('result-percentage').textContent = Math.round((totalCorrect / totalQuestions) * 100) + '%';

    // 난이도별 결과
    document.getElementById('easy-correct').textContent = scores.easy.correct;
    document.getElementById('easy-total').textContent = scores.easy.total;
    document.getElementById('easy-bar').style.width = scores.easy.total > 0
        ? (scores.easy.correct / scores.easy.total * 100) + '%' : '0%';

    document.getElementById('medium-correct').textContent = scores.medium.correct;
    document.getElementById('medium-total').textContent = scores.medium.total;
    document.getElementById('medium-bar').style.width = scores.medium.total > 0
        ? (scores.medium.correct / scores.medium.total * 100) + '%' : '0%';

    document.getElementById('hard-correct').textContent = scores.hard.correct;
    document.getElementById('hard-total').textContent = scores.hard.total;
    document.getElementById('hard-bar').style.width = scores.hard.total > 0
        ? (scores.hard.correct / scores.hard.total * 100) + '%' : '0%';

    showScreen('result-screen');
}

// 화면 전환
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Exit quiz
function goBack() {
    if (confirm('Are you sure you want to exit the quiz?')) {
        showScreen('book-select');
    }
}

// 홈으로
function goHome() {
    showScreen('book-select');
}

// 다시 풀기
function retryQuiz() {
    prepareQuestions();
    showScreen('quiz-screen');
    renderQuestion();
}

// 스크립트 토글
function toggleScript() {
    const panel = document.getElementById('script-panel');
    const overlay = document.getElementById('script-overlay');

    panel.classList.toggle('active');
    overlay.classList.toggle('active');

    if (panel.classList.contains('active') && currentBook) {
        const bookTitle = currentBook.title || currentBook.book_title;
        let authorText;
        if (currentBook.authors && Array.isArray(currentBook.authors)) {
            authorText = currentBook.authors.join(', ');
        } else {
            authorText = currentBook.author;
        }

        const genre = currentBook.genre || 'Fiction';
        const series = currentBook.series || '';
        const gradeLevel = getGradeLevel(currentBook);

        document.getElementById('script-body').innerHTML = `
            <h4 style="margin-bottom: 12px; color: #1d1d1f;">${bookTitle}</h4>
            <p style="margin-bottom: 8px;"><strong>Author:</strong> ${authorText}</p>
            ${series ? `<p style="margin-bottom: 8px;"><strong>Series:</strong> ${series}</p>` : ''}
            <p style="margin-bottom: 8px;"><strong>Genre:</strong> ${genre}</p>
            <p style="margin-bottom: 8px;"><strong>Grade Level:</strong> ${gradeLevel}</p>
        `;
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initBookList();
});
