const fs = require('fs');
const path = require('path');

// Read existing quiz-data.js
const quizDataPath = path.join(__dirname, 'quiz-data.js');
let quizDataContent = fs.readFileSync(quizDataPath, 'utf8');

// Extract the quizData object
const match = quizDataContent.match(/const quizData = ({[\s\S]*});/);
let quizData;
eval('quizData = ' + match[1]);

// Read all JSON files from output_quiz folder
const quizFolder = path.join(__dirname, '..', 'output_quiz');
const files = fs.readdirSync(quizFolder).filter(f => f.endsWith('.json'));

// Books already in quiz-data.js
const existingBooks = Object.keys(quizData);
console.log('Existing books:', existingBooks);

// Process each new quiz file
files.forEach(file => {
    const filePath = path.join(quizFolder, file);
    let jsonData;
    try {
        jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.log(`Error parsing ${file}: ${e.message}`);
        return;
    }

    if (!jsonData.title) {
        console.log(`Skipping ${file} - no title found`);
        return;
    }

    // Create key from title
    const key = jsonData.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');

    // Skip if already exists
    if (existingBooks.some(k => k.toLowerCase().includes(key.toLowerCase().substring(0, 10)))) {
        console.log(`Skipping ${jsonData.title} - already exists`);
        return;
    }

    // Convert options format if needed (array to object)
    const convertedQuestions = jsonData.questions.map(q => {
        let options = q.options;
        if (Array.isArray(options)) {
            options = {
                A: options[0],
                B: options[1],
                C: options[2],
                D: options[3]
            };
        }
        return {
            id: q.id,
            difficulty: q.difficulty,
            question: q.question,
            options: options,
            answer: q.correct_answer,
            explanation: q.explanation
        };
    });

    // Normalize book_level
    let bookLevel = jsonData.book_level;
    if (typeof bookLevel === 'string') {
        bookLevel = {
            grade: parseFloat(bookLevel),
            description: `Level ${bookLevel}`
        };
    } else if (typeof bookLevel === 'number') {
        bookLevel = {
            grade: bookLevel,
            description: `Level ${bookLevel}`
        };
    }

    // Create new quiz entry
    quizData[key] = {
        book_title: jsonData.title,
        author: jsonData.author,
        genre: jsonData.genre,
        book_level: bookLevel,
        total_questions: jsonData.total_questions,
        questions: convertedQuestions
    };

    console.log(`Added: ${jsonData.title}`);
});

// Write back to quiz-data.js
const output = `const quizData = ${JSON.stringify(quizData, null, 2)};`;
fs.writeFileSync(quizDataPath, output, 'utf8');

console.log('\nDone! Total books:', Object.keys(quizData).length);
