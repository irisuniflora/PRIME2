const fs = require('fs');

// Alice 데이터 읽기
const aliceData = JSON.parse(fs.readFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', 'utf8'));

// quiz-data.js 읽기
const jsContent = fs.readFileSync('docs/quiz-data.js', 'utf8');
const match = jsContent.match(/const quizData = (\{[\s\S]*\});/);
const quizData = eval('(' + match[1] + ')');

// Alice 업데이트
quizData["Alice's Adventures in Wonderland"] = aliceData;

// 저장
const newJsContent = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';';
fs.writeFileSync('docs/quiz-data.js', newJsContent);

console.log('quiz-data.js 업데이트 완료!');
