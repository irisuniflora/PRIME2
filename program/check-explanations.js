const fs = require('fs');
const path = require('path');

const quizFolder = path.join(__dirname, '..', 'output_quiz');
const files = fs.readdirSync(quizFolder).filter(f => f.endsWith('.json'));

console.log('=== Checking Question-Explanation Alignment ===\n');

let totalIssues = 0;

files.forEach(file => {
    const filePath = path.join(quizFolder, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const quiz = JSON.parse(content);
    const title = quiz.title || quiz.book_title;

    let issues = [];

    if (quiz.questions) {
        quiz.questions.forEach(q => {
            const question = q.question.toLowerCase();
            const explanation = q.explanation.toLowerCase();
            const answer = q.answer || q.correct_answer;

            // Get the correct option text
            let correctOptionText = '';
            if (q.options) {
                if (Array.isArray(q.options)) {
                    const idx = answer.charCodeAt(0) - 65;
                    correctOptionText = (q.options[idx] || '').toLowerCase();
                } else {
                    correctOptionText = (q.options[answer] || '').toLowerCase();
                }
            }

            // Extract key nouns from question
            const questionWords = question.match(/\b[a-z]{4,}\b/g) || [];
            const explanationWords = explanation.match(/\b[a-z]{4,}\b/g) || [];

            // Check if explanation mentions key elements from question or answer
            const keyTerms = [...new Set([...questionWords.slice(0, 5)])];
            const matchCount = keyTerms.filter(word =>
                explanation.includes(word) || correctOptionText.includes(word)
            ).length;

            // Flag if very low match
            if (matchCount < 2 && q.id > 10) {
                // Check if explanation seems unrelated
                const explanationKeywords = explanationWords.slice(0, 5);
                const questionOverlap = explanationKeywords.filter(w => question.includes(w)).length;

                if (questionOverlap < 2) {
                    issues.push({
                        id: q.id,
                        question: q.question.substring(0, 60) + '...',
                        explanation: q.explanation.substring(0, 60) + '...'
                    });
                }
            }
        });
    }

    if (issues.length > 0) {
        console.log(`\n📚 ${title}`);
        console.log(`   File: ${file}`);
        console.log(`   Issues found: ${issues.length}`);
        issues.slice(0, 5).forEach(i => {
            console.log(`   Q${i.id}: ${i.question}`);
            console.log(`       Exp: ${i.explanation}`);
        });
        if (issues.length > 5) {
            console.log(`   ... and ${issues.length - 5} more`);
        }
        totalIssues += issues.length;
    } else {
        console.log(`✅ ${title} - OK`);
    }
});

console.log(`\n=== Total potential issues: ${totalIssues} ===`);
