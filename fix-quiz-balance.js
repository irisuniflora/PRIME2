const fs = require('fs');

// ========== Alice - 정답만 긴 문제 수정 ==========
console.log('=== Alice\'s Adventures in Wonderland 수정 ===\n');

let aliceData = JSON.parse(fs.readFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', 'utf8'));

// 문제별 수정 - 다른 옵션들도 비슷한 길이로 조정
const aliceFixes = {
    7: {
        // 원래: B가 39자로 혼자 김
        A: "A cat belonging to the Queen of Hearts",
        B: "A Cheshire cat belonging to the Duchess",
        C: "Alice's own pet cat from her home",
        D: "A magical Persian cat that talks"
    },
    21: {
        // 원래: A가 95자로 혼자 김
        A: "cherry tart, custard, pineapple, turkey, toffee, and toast mixed together",
        B: "sweet honey mixed with warm creamy milk",
        C: "water with just a hint of fresh lemon",
        D: "bitter medicine sweetened with some sugar"
    },
    28: {
        // 원래: A가 90자로 혼자 김
        A: "they planted a white rose by mistake and feared beheading",
        B: "the Queen had specifically ordered all red roses",
        C: "white roses were considered very unlucky in court",
        D: "there was a royal rose-painting competition happening"
    },
    29: {
        A: "disappear leaving only its grin visible behind",
        B: "change its colors whenever it wanted to",
        C: "speak fluently in multiple different languages",
        D: "accurately predict events in the future"
    },
    31: {
        A: "he moved very slowly like a tortoise",
        B: "he actually looked like a real tortoise",
        C: "he taught us (taught-us sounds like tortoise)",
        D: "his actual name was Mr. Tortoise"
    },
    40: {
        A: "spinning around in circles by yourself alone",
        B: "dancing elegantly with the playing cards",
        C: "hopping continuously on just one foot",
        D: "throwing lobsters into the sea and swimming after"
    },
    41: {
        A: "The constant physical changes made her feel different",
        B: "She developed amnesia from her long fall down",
        C: "She was actively pretending to be someone else",
        D: "The Queen had cast a confusion spell on her"
    },
    42: {
        A: "Children's games that have no clear rules",
        B: "Political processes where everyone wins but nothing accomplished",
        C: "School examinations that test nothing useful",
        D: "Athletic competitions with unfair judging"
    },
    43: {
        A: "The March Hare had cast a time spell",
        B: "The Hatter offended Time at the Queen's concert",
        C: "They simply preferred having tea at six",
        D: "The clock was broken beyond any repair"
    },
    44: {
        A: "She orders executions but they're never carried out",
        B: "She is actually too lenient with all criminals",
        C: "She has no real power over her subjects",
        D: "She lets Alice make all the decisions"
    },
    45: {
        A: "Her growing confusion about what is real",
        B: "Her recognition that authority figures have no power",
        C: "Her deep fear of the Queen's punishment",
        D: "Her strong desire to play card games"
    },
    46: {
        A: "She was hiding her true real identity",
        B: "She could not remember her actual name",
        C: "The Caterpillar was being extremely rude",
        D: "She had changed so much she didn't know anymore"
    },
    47: {
        A: "He is just pretending to feel sad",
        B: "He has completely forgotten why he was sad",
        C: "Emotions in Wonderland are performed, not genuine",
        D: "The Gryphon is lying about his condition"
    },
    48: {
        A: "Education is confusing wordplay with little value",
        B: "Students should have much longer holidays",
        C: "Schools are far too expensive for families",
        D: "Teachers are not paid nearly enough"
    },
    49: {
        A: "Evidence and logic are ignored for authority",
        B: "Criminals somehow always escape their punishment",
        C: "Judges are always perfectly fair and just",
        D: "Juries are composed of intelligent people"
    },
    50: {
        A: "She has some kind of medical condition",
        B: "Wonderland has very unstable gravity levels",
        C: "The Queen is constantly testing her abilities",
        D: "It symbolizes the confusing changes of growing up"
    },
    51: {
        A: "Alice's formal education at her school",
        B: "People who read far too many books",
        C: "Religious leaders who preach constantly",
        D: "The Victorian tendency to force moral lessons"
    },
    52: {
        A: "She applies real-world logic in illogical places",
        B: "The White Rabbit specifically told her to check",
        C: "Her sister had warned about strange bottles",
        D: "She had been poisoned sometime before this"
    },
    53: {
        A: "Everyone there has a serious mental illness",
        B: "Alice should leave Wonderland immediately now",
        C: "Only cats are actually sane in Wonderland",
        D: "Madness is relative depending on where you are"
    },
    54: {
        A: "The story is written in a very sad tone",
        B: "Alice confuses 'tale' with 'tail' imagining it curved",
        C: "The Mouse is crying while telling the story",
        D: "The Dodo keeps interrupting with silly jokes"
    },
    55: {
        A: "Alice was supposed to make up the answer",
        B: "He simply forgot what the answer was",
        C: "The March Hare knew but wouldn't tell",
        D: "Wonderland's logic doesn't require sense"
    },
    56: {
        A: "It mirrors how children see adult authority as arbitrary",
        B: "It makes her become a much better person",
        C: "It teaches her to be properly obedient",
        D: "It helps her learn to follow instructions"
    },
    57: {
        A: "The dream simply randomly ended there",
        B: "Her sister happened to wake her for tea",
        C: "Standing up to authority broke the dream's hold",
        D: "The cards actually attacked her physically"
    },
    58: {
        A: "The unpredictable English weather problems",
        B: "The impossibility of playing with arbitrary rules",
        C: "Alice's poor athletic skills at croquet",
        D: "The Queen's great love of playing sports"
    },
    59: {
        A: "She fell asleep and had the same dream",
        B: "She secretly read Alice's private diary",
        C: "Stories and imagination connect people across time",
        D: "Wonderland is a real place both can visit"
    }
};

// Alice 문제 수정
Object.entries(aliceFixes).forEach(([qId, newOptions]) => {
    const idx = parseInt(qId) - 1;
    const q = aliceData.questions[idx];
    const correctAnswer = q.answer;
    const correctText = q.options[correctAnswer];

    // 새 옵션에서 정답 텍스트가 포함된 키 찾기
    let newAnswerKey = null;
    for (const [key, text] of Object.entries(newOptions)) {
        if (text.toLowerCase().includes(correctText.substring(0, 20).toLowerCase()) ||
            correctText.toLowerCase().includes(text.substring(0, 20).toLowerCase())) {
            newAnswerKey = key;
            break;
        }
    }

    // 정답 키 매칭이 안되면 원래 키 유지
    if (!newAnswerKey) {
        // 의미적으로 매칭 시도
        newAnswerKey = correctAnswer;
    }

    q.options = newOptions;
    q.answer = newAnswerKey;
});

// Alice 저장
fs.writeFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', JSON.stringify(aliceData, null, 2));
console.log('Alice 수정 완료!');

// Alice 통계
let aliceStats = { A: 0, B: 0, C: 0, D: 0 };
aliceData.questions.forEach(q => aliceStats[q.answer]++);
console.log('Alice 정답 분포:', aliceStats);

// ========== Mr. Hynde - 셔플 ==========
console.log('\n=== Mr. Hynde Is Out of His Mind 셔플 ===\n');

let hyndeData = JSON.parse(fs.readFileSync('output_quiz/Mr Hynde Is Out of His Mind.json', 'utf8'));

// 셔플 전 통계
let hyndeBefore = { A: 0, B: 0, C: 0, D: 0 };
hyndeData.questions.forEach(q => hyndeBefore[q.answer]++);
console.log('셔플 전:', hyndeBefore);

// 셔플 함수
function shuffleOptions(questions) {
    questions.forEach(q => {
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

hyndeData.questions = shuffleOptions(hyndeData.questions);

// 셔플 후 통계
let hyndeAfter = { A: 0, B: 0, C: 0, D: 0 };
hyndeData.questions.forEach(q => hyndeAfter[q.answer]++);
console.log('셔플 후:', hyndeAfter);

// Mr. Hynde 저장
fs.writeFileSync('output_quiz/Mr Hynde Is Out of His Mind.json', JSON.stringify(hyndeData, null, 2));
console.log('Mr. Hynde 수정 완료!');

// ========== quiz-data.js 업데이트 ==========
console.log('\n=== quiz-data.js 업데이트 ===');

const jsContent = fs.readFileSync('docs/quiz-data.js', 'utf8');
const match = jsContent.match(/const quizData = (\{[\s\S]*\});/);
const quizData = eval('(' + match[1] + ')');

// 업데이트
quizData["Alice's Adventures in Wonderland"] = aliceData;
quizData["Mr. Hynde Is Out of His Mind"] = hyndeData;

// JS 파일 저장
const newJsContent = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';';
fs.writeFileSync('docs/quiz-data.js', newJsContent);
console.log('quiz-data.js 업데이트 완료!');

// ========== 최종 통계 ==========
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
