const fs = require('fs');
const path = require('path');

const outputDir = './output_quiz';
const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json'));

let quizData = {};

files.forEach(file => {
  const filePath = path.join(outputDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const title = data.title;
  quizData[title] = data;
});

const jsContent = `const quizData = ${JSON.stringify(quizData, null, 2)};`;

fs.writeFileSync('./docs/quiz-data.js', jsContent);
console.log(`quiz-data.js 업데이트 완료! (${files.length}개 책)`);
