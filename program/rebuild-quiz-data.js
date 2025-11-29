const fs = require('fs');
const path = require('path');

// Read all JSON files from output_quiz folder
const quizFolder = path.join(__dirname, '..', 'output_quiz');
const files = fs.readdirSync(quizFolder).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} quiz files:`);
files.forEach(f => console.log(`  - ${f}`));

const quizData = {};

files.forEach(file => {
    const filePath = path.join(quizFolder, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const quiz = JSON.parse(content);

    // Create key from title
    const title = quiz.title || quiz.book_title;
    const key = title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');

    // Normalize schema: ensure 'answer' key (not 'correct_answer')
    if (quiz.questions) {
        quiz.questions.forEach(q => {
            // Convert correct_answer to answer if needed
            if (q.correct_answer && !q.answer) {
                q.answer = q.correct_answer;
                delete q.correct_answer;
            }

            // Convert array options to object if needed
            if (Array.isArray(q.options)) {
                const letters = ['A', 'B', 'C', 'D'];
                const optObj = {};
                q.options.forEach((opt, i) => {
                    optObj[letters[i]] = opt;
                });
                q.options = optObj;
            }

            // Remove junk phrases from options
            const junkPhrases = [
                ', which was quite significant',
                ', according to the story',
                ', a notable element',
                ', central to the plot',
                ', worth remembering',
                ', an important detail',
                ', which played a key role',
                ', essential to understand',
                ', as revealed in the tale',
                ', a crucial point',
                ' shimmering in the light',
                ' with a bright glow',
                ' with vibrant hues',
                ' sparkling brilliantly',
                ' shining magnificently',
                ' radiating softly',
                ' glowing faintly',
                ' gleaming mysteriously',
                ' with deep intensity',
                ' of great importance',
                ' of remarkable power',
                ' of unusual appearance',
                ' with special abilities',
                ' with hidden secrets',
                ' with mysterious origins',
                ' with magical properties',
                ' from the ancient times',
                ' from a distant land',
                ' from the old legends',
                ' in the heart of the kingdom',
                ' at the edge of the forest',
                ' beyond the mountain pass',
                ' across the misty valley',
                ' within the castle walls',
                ' through clever thinking',
                ' with great determination',
                ' with unexpected results',
                ' by the old stone bridge',
                ' in the northern region'
            ];

            // Clean options
            if (typeof q.options === 'object') {
                Object.keys(q.options).forEach(key => {
                    let opt = q.options[key];
                    junkPhrases.forEach(phrase => {
                        opt = opt.split(phrase).join('');
                    });
                    q.options[key] = opt;
                });
            }
        });
    }

    quizData[key] = quiz;
    console.log(`  Loaded: ${key} (${quiz.questions?.length || 0} questions)`);
});

// Write to quiz-data.js
const output = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';';
fs.writeFileSync(path.join(__dirname, 'quiz-data.js'), output);

console.log(`\nGenerated quiz-data.js with ${Object.keys(quizData).length} books`);
