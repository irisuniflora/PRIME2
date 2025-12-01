const fs = require('fs');

let data = JSON.parse(fs.readFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', 'utf8'));

console.log('=== Alice 정답 길이 수정 ===\n');

// 수정할 문제들
const fixes = {
    5: {
        // Drink Me가 8자, 나머지 5-6자 -> 비슷하게
        A: "Poison Warning",
        B: "Eat Me Now",
        C: "Drink Me",
        D: "Pure Magic"
    },
    15: {
        // A real turtle (13자) vs 6-9자
        A: "A real turtle",
        B: "A large fish",
        C: "A small crab",
        D: "A red lobster"
    },
    19: {
        // Comfits (candies) 17자 vs 5-7자
        A: "Beautiful flowers",
        B: "Comfits (candies)",
        C: "Small sweet cakes",
        D: "Shiny gold coins"
    },
    21: {
        // 73자 vs 37-41자 -> 전체적으로 비슷하게
        A: "cherry tart, custard, pineapple, turkey, toffee, and buttered toast",
        B: "sweet honey mixed with warm milk and a touch of vanilla cream",
        C: "cold water with a hint of fresh lemon and mint leaves mixed in",
        D: "bitter medicine sweetened with sugar and a spoonful of honey"
    },
    25: {
        // 34자 vs 19-28자
        A: "a serpent because of her long neck",
        B: "a spy sent by the evil Queen",
        C: "a thief trying to steal her eggs",
        D: "a forest witch casting spells"
    },
    26: {
        // 34자 vs 16-22자
        A: "what the current time was now",
        B: "why a raven is like a writing-desk",
        C: "if she wanted some more hot tea",
        D: "where exactly she came from today"
    },
    33: {
        // 22자 vs 7-21자
        A: "his housemaid Marianne",
        B: "a terrifying monster",
        C: "an enormous giant girl",
        D: "the Queen in disguise"
    },
    36: {
        // 54자 vs 25-35자
        A: "all persons more than a mile high must leave the court",
        B: "no one may speak without the King's express permission",
        C: "all witnesses must tell the complete and honest truth",
        D: "the Queen's final word is always the absolute law"
    },
    42: {
        // 64자 vs 41-44자
        A: "Children's games that have no rules and make no sense at all",
        B: "Political processes where everyone wins but nothing is done",
        C: "School examinations that test nothing useful or meaningful",
        D: "Athletic competitions judged unfairly by biased officials"
    },
    56: {
        // 56자 vs 38-41자
        A: "It mirrors how children see adult authority as arbitrary",
        B: "It makes her become a much better and stronger person",
        C: "It teaches her to be properly obedient to authority",
        D: "It helps her learn to follow instructions carefully"
    },
    60: {
        // 71자 vs 34-48자
        A: "Dreams are dangerous and confusing and should be avoided entirely",
        B: "Childhood is meaningless and forgettable and should be forgotten",
        C: "Children should always obey adults without questioning anything",
        D: "Childhood wonder and questioning should be preserved as we grow"
    }
};

// 적용
Object.entries(fixes).forEach(([qId, newOptions]) => {
    const idx = parseInt(qId) - 1;
    const q = data.questions[idx];
    const currentAnswer = q.answer;
    const correctText = q.options[currentAnswer];

    // 새 옵션에서 정답 찾기
    let newAnswer = null;
    for (const [key, text] of Object.entries(newOptions)) {
        // 정답 텍스트의 앞부분 매칭
        if (text.toLowerCase().includes(correctText.substring(0, 15).toLowerCase()) ||
            correctText.toLowerCase().includes(text.substring(0, 15).toLowerCase())) {
            newAnswer = key;
            break;
        }
    }

    if (!newAnswer) {
        newAnswer = currentAnswer; // 매칭 안되면 기존 키 유지
    }

    console.log(`Q${qId}: ${q.question.substring(0, 40)}...`);
    console.log(`  이전: ${currentAnswer} -> 이후: ${newAnswer}`);

    q.options = newOptions;
    q.answer = newAnswer;
});

// 저장
fs.writeFileSync('output_quiz/Alice\'s Adventures in Wonderland.json', JSON.stringify(data, null, 2));
console.log('\nAlice JSON 저장 완료!');

// 길이 검증
console.log('\n=== 수정 후 검증 ===');
Object.keys(fixes).forEach(qId => {
    const idx = parseInt(qId) - 1;
    const q = data.questions[idx];
    const lens = ['A', 'B', 'C', 'D'].map(k => q.options[k].length);
    const avg = (lens.reduce((a, b) => a + b, 0) / 4).toFixed(1);
    const max = Math.max(...lens);
    const min = Math.min(...lens);
    console.log(`Q${qId}: 길이 ${lens.join('/')} | 평균: ${avg} | 범위: ${min}-${max}`);
});
