// Script to shuffle answer options and balance answer distribution
const fs = require('fs');

// Read the quiz data file
let content = fs.readFileSync('quiz-data.js', 'utf8');

// Temporarily modify to export
const modifiedContent = content.replace('const quizData =', 'module.exports =');
fs.writeFileSync('quiz-data-temp.js', modifiedContent, 'utf8');

// Require it
const quizData = require('./quiz-data-temp.js');

// Delete temp file
fs.unlinkSync('quiz-data-temp.js');

// Shuffle array helper
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const letters = ['A', 'B', 'C', 'D'];

// Process each book
Object.keys(quizData).forEach(bookKey => {
    const book = quizData[bookKey];

    book.questions.forEach(question => {
        // Get current options as array
        let optionsArray;
        let currentAnswer;

        if (Array.isArray(question.options)) {
            optionsArray = [...question.options];
            currentAnswer = question.correct_answer || question.answer;
        } else {
            optionsArray = letters.map(l => question.options[l]);
            currentAnswer = question.answer;
        }

        // Get the correct answer text
        const correctIndex = letters.indexOf(currentAnswer);
        const correctText = optionsArray[correctIndex];

        // Shuffle options
        const shuffledOptions = shuffleArray(optionsArray);

        // Find new position of correct answer
        const newCorrectIndex = shuffledOptions.indexOf(correctText);
        const newAnswer = letters[newCorrectIndex];

        // Update question
        if (Array.isArray(question.options)) {
            question.options = shuffledOptions;
            question.correct_answer = newAnswer;
        } else {
            question.options = {};
            letters.forEach((l, i) => {
                question.options[l] = shuffledOptions[i];
            });
            question.answer = newAnswer;
        }
    });
});

// Count distribution
let counts = { A: 0, B: 0, C: 0, D: 0 };
Object.keys(quizData).forEach(bookKey => {
    quizData[bookKey].questions.forEach(q => {
        const ans = q.correct_answer || q.answer;
        counts[ans]++;
    });
});

console.log('New answer distribution:', counts);

// Write back
const output = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';\n';
fs.writeFileSync('quiz-data.js', output, 'utf8');

console.log('Done! quiz-data.js has been updated.');
