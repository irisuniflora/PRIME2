const fs = require('fs');

// 셔플 함수 - 정답 위치를 골고루 분배
function shuffleAnswers(questions) {
    // 목표: ABCD가 각각 약 25%씩
    const targetPerOption = Math.floor(questions.length / 4);

    questions.forEach((q, idx) => {
        const options = q.options;
        const currentAnswer = q.answer;
        const correctText = options[currentAnswer];

        // 옵션들을 배열로 변환
        const optionTexts = [options.A, options.B, options.C, options.D];

        // 셔플
        for (let i = optionTexts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionTexts[i], optionTexts[j]] = [optionTexts[j], optionTexts[i]];
        }

        // 새 옵션 할당
        q.options = {
            A: optionTexts[0],
            B: optionTexts[1],
            C: optionTexts[2],
            D: optionTexts[3]
        };

        // 정답 위치 찾기
        const newAnswer = ['A', 'B', 'C', 'D'].find(key => q.options[key] === correctText);
        q.answer = newAnswer;
    });

    return questions;
}

// Alice's Adventures in Wonderland 처리
console.log('=== Alice\'s Adventures in Wonderland 셔플 ===');
let aliceData = JSON.parse(fs.readFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', 'utf8'));

// 셔플 전 통계
let beforeStats = { A: 0, B: 0, C: 0, D: 0 };
aliceData.questions.forEach(q => beforeStats[q.answer]++);
console.log('셔플 전:', beforeStats);

// 셔플
aliceData.questions = shuffleAnswers(aliceData.questions);

// 셔플 후 통계
let afterStats = { A: 0, B: 0, C: 0, D: 0 };
aliceData.questions.forEach(q => afterStats[q.answer]++);
console.log('셔플 후:', afterStats);

// 저장
fs.writeFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', JSON.stringify(aliceData, null, 2));
console.log('Alice JSON 저장 완료!\n');

// Billionaire Boy 처리
console.log('=== Billionaire Boy 셔플 ===');
let billionaireData = JSON.parse(fs.readFileSync('output_quiz/Billionaire Boy.json', 'utf8'));

// 셔플 전 통계
beforeStats = { A: 0, B: 0, C: 0, D: 0 };
billionaireData.questions.forEach(q => beforeStats[q.answer]++);
console.log('셔플 전:', beforeStats);

// 셔플
billionaireData.questions = shuffleAnswers(billionaireData.questions);

// 셔플 후 통계
afterStats = { A: 0, B: 0, C: 0, D: 0 };
billionaireData.questions.forEach(q => afterStats[q.answer]++);
console.log('셔플 후:', afterStats);

// 저장
fs.writeFileSync('output_quiz/Billionaire Boy.json', JSON.stringify(billionaireData, null, 2));
console.log('Billionaire Boy JSON 저장 완료!\n');

// quiz-data.js 업데이트
console.log('=== quiz-data.js 업데이트 ===');
const jsContent = fs.readFileSync('docs/quiz-data.js', 'utf8');
const match = jsContent.match(/const quizData = (\{[\s\S]*\});/);
const quizData = eval('(' + match[1] + ')');

// Alice 업데이트
quizData["Alice's Adventures in Wonderland"] = aliceData;

// Billionaire Boy 업데이트
quizData["Billionaire Boy"] = billionaireData;

// JS 파일 저장
const newJsContent = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';';
fs.writeFileSync('docs/quiz-data.js', newJsContent);
console.log('quiz-data.js 업데이트 완료!');

// 최종 통계 출력
console.log('\n=== 최종 전체 통계 ===');
let totalStats = { A: 0, B: 0, C: 0, D: 0 };
let totalQuestions = 0;

Object.keys(quizData).forEach(key => {
    quizData[key].questions.forEach(q => {
        totalStats[q.answer]++;
        totalQuestions++;
    });
});

console.log('총 문제 수:', totalQuestions);
console.log('A:', totalStats.A, '(' + (totalStats.A/totalQuestions*100).toFixed(1) + '%)');
console.log('B:', totalStats.B, '(' + (totalStats.B/totalQuestions*100).toFixed(1) + '%)');
console.log('C:', totalStats.C, '(' + (totalStats.C/totalQuestions*100).toFixed(1) + '%)');
console.log('D:', totalStats.D, '(' + (totalStats.D/totalQuestions*100).toFixed(1) + '%)');
