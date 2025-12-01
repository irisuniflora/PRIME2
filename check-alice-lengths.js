const fs = require('fs');

const data = JSON.parse(fs.readFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', 'utf8'));

console.log('=== Alice 정답 길이 분석 ===\n');

const problems = [];

data.questions.forEach((q, idx) => {
    const options = q.options;
    const answer = q.answer;
    const correctLen = options[answer].length;

    // 다른 옵션들의 평균 길이
    const otherKeys = ['A', 'B', 'C', 'D'].filter(k => k !== answer);
    const otherLens = otherKeys.map(k => options[k].length);
    const avgOther = otherLens.reduce((a, b) => a + b, 0) / 3;
    const maxOther = Math.max(...otherLens);

    // 정답이 다른 옵션 평균보다 1.5배 이상 길면 문제
    const ratio = correctLen / avgOther;

    if (ratio > 1.4 || correctLen > maxOther * 1.3) {
        problems.push({
            id: q.id,
            question: q.question.substring(0, 50) + '...',
            answer: answer,
            correctLen: correctLen,
            avgOther: avgOther.toFixed(1),
            maxOther: maxOther,
            ratio: ratio.toFixed(2),
            correctText: options[answer],
            options: options
        });
    }
});

console.log(`문제 발견: ${problems.length}개\n`);

problems.forEach(p => {
    console.log(`Q${p.id}: ${p.question}`);
    console.log(`  정답(${p.answer}): ${p.correctLen}자 | 평균: ${p.avgOther}자 | 최대: ${p.maxOther}자 | 비율: ${p.ratio}x`);
    console.log(`  정답 텍스트: "${p.correctText}"`);
    console.log(`  A(${p.options.A.length}): ${p.options.A}`);
    console.log(`  B(${p.options.B.length}): ${p.options.B}`);
    console.log(`  C(${p.options.C.length}): ${p.options.C}`);
    console.log(`  D(${p.options.D.length}): ${p.options.D}`);
    console.log('');
});
