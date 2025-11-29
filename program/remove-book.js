const fs = require('fs');
const path = require('path');

// Read existing quiz-data.js
const quizDataPath = path.join(__dirname, 'quiz-data.js');
let quizDataContent = fs.readFileSync(quizDataPath, 'utf8');

// Extract the quizData object
const match = quizDataContent.match(/const quizData = ({[\s\S]*});/);
let quizData;
eval('quizData = ' + match[1]);

// Remove Dramatic_Readings_Vol3
if (quizData['Dramatic_Readings_Vol3']) {
    delete quizData['Dramatic_Readings_Vol3'];
    console.log('Removed: Dramatic_Readings_Vol3');
} else {
    console.log('Dramatic_Readings_Vol3 not found');
}

// Write back to quiz-data.js
const output = `const quizData = ${JSON.stringify(quizData, null, 2)};`;
fs.writeFileSync(quizDataPath, output, 'utf8');

console.log('Done! Total books:', Object.keys(quizData).length);
