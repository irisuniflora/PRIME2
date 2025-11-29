// Script to extend wrong answer options to match correct answer length
const fs = require('fs');

// Read the quiz data file
let content = fs.readFileSync('quiz-data.js', 'utf8');
const modifiedContent = content.replace('const quizData =', 'module.exports =');
fs.writeFileSync('quiz-data-temp.js', modifiedContent, 'utf8');
const quizData = require('./quiz-data-temp.js');
fs.unlinkSync('quiz-data-temp.js');

const letters = ['A', 'B', 'C', 'D'];

// Phrases to extend short answers
const extensionPhrases = {
  place: [
    ' in the northern region',
    ' near the ancient ruins',
    ' by the old stone bridge',
    ' at the edge of the forest',
    ' in the heart of the kingdom',
    ' beyond the mountain pass',
    ' within the castle walls',
    ' across the misty valley',
    ' beside the crystal lake',
    ' through the enchanted woods'
  ],
  person: [
    ', the wise old sage',
    ', the mysterious stranger',
    ', the trusted advisor',
    ', the brave young hero',
    ', the cunning trickster',
    ', the loyal companion',
    ', the ancient guardian',
    ', the skilled craftsman',
    ', the wandering traveler',
    ', the noble protector'
  ],
  thing: [
    ' with magical properties',
    ' from the ancient times',
    ' of great importance',
    ' with mysterious origins',
    ' from a distant land',
    ' of remarkable power',
    ' with hidden secrets',
    ' from the old legends',
    ' of unusual appearance',
    ' with special abilities'
  ],
  color: [
    ' with a bright glow',
    ' shimmering in the light',
    ' with deep intensity',
    ' gleaming mysteriously',
    ' radiating softly',
    ' sparkling brilliantly',
    ' with vibrant hues',
    ' glowing faintly',
    ' with rich undertones',
    ' shining magnificently'
  ],
  action: [
    ' with great determination',
    ' in a surprising way',
    ' through careful planning',
    ' with unexpected results',
    ' in dramatic fashion',
    ' through sheer willpower',
    ' with remarkable skill',
    ' in an unusual manner',
    ' through clever thinking',
    ' with bold confidence'
  ],
  general: [
    ', according to the story',
    ', as revealed in the tale',
    ', which was quite significant',
    ', an important detail',
    ', a notable element',
    ', which played a key role',
    ', central to the plot',
    ', worth remembering',
    ', a crucial point',
    ', essential to understand'
  ]
};

function getRandomExtension(option) {
  const lowerOption = option.toLowerCase();
  let category = 'general';

  // Detect category based on content
  if (lowerOption.includes('castle') || lowerOption.includes('cave') || lowerOption.includes('forest') ||
      lowerOption.includes('land') || lowerOption.includes('house') || lowerOption.includes('room') ||
      lowerOption.includes('garden') || lowerOption.includes('place') || lowerOption.includes('island')) {
    category = 'place';
  } else if (lowerOption.includes('red') || lowerOption.includes('blue') || lowerOption.includes('green') ||
             lowerOption.includes('yellow') || lowerOption.includes('purple') || lowerOption.includes('orange') ||
             lowerOption.includes('black') || lowerOption.includes('white') || lowerOption.includes('gold')) {
    category = 'color';
  } else if (lowerOption.includes('dragon') || lowerOption.includes('sword') || lowerOption.includes('book') ||
             lowerOption.includes('stone') || lowerOption.includes('bottle') || lowerOption.includes('key') ||
             lowerOption.includes('ring') || lowerOption.includes('wand') || lowerOption.includes('potion')) {
    category = 'thing';
  } else if (lowerOption.includes('run') || lowerOption.includes('fly') || lowerOption.includes('fight') ||
             lowerOption.includes('escape') || lowerOption.includes('transform') || lowerOption.includes('help')) {
    category = 'action';
  }

  const phrases = extensionPhrases[category];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function extendOption(option, targetLength) {
  if (option.length >= targetLength - 10) {
    return option; // Already long enough
  }

  let extended = option;
  let attempts = 0;

  while (extended.length < targetLength - 10 && attempts < 3) {
    const ext = getRandomExtension(extended);
    extended = extended + ext;
    attempts++;
  }

  return extended;
}

// Process each question
let totalExtended = 0;
Object.keys(quizData).forEach(bookKey => {
  const book = quizData[bookKey];

  book.questions.forEach(question => {
    const answer = question.correct_answer || question.answer;

    let options;
    let isArray = Array.isArray(question.options);

    if (isArray) {
      options = [...question.options];
    } else {
      options = letters.map(l => question.options[l]);
    }

    // Get correct answer length
    const correctIndex = letters.indexOf(answer);
    const correctLength = options[correctIndex].length;

    // Extend wrong answers
    options = options.map((opt, i) => {
      if (letters[i] === answer) {
        return opt; // Keep correct answer as is
      }

      if (opt.length < correctLength - 10) {
        totalExtended++;
        return extendOption(opt, correctLength);
      }
      return opt;
    });

    // Update question
    if (isArray) {
      question.options = options;
    } else {
      question.options = {};
      letters.forEach((l, i) => {
        question.options[l] = options[i];
      });
    }
  });
});

console.log(`Extended ${totalExtended} options`);

// Verify new distribution
let correctLengths = [];
let wrongLengths = [];

Object.keys(quizData).forEach(bookKey => {
  quizData[bookKey].questions.forEach(q => {
    const answer = q.correct_answer || q.answer;
    let options;
    if (Array.isArray(q.options)) {
      options = q.options;
    } else {
      options = letters.map(l => q.options[l]);
    }

    options.forEach((opt, i) => {
      const len = opt.length;
      if (letters[i] === answer) {
        correctLengths.push(len);
      } else {
        wrongLengths.push(len);
      }
    });
  });
});

const avgCorrect = correctLengths.reduce((a,b) => a+b, 0) / correctLengths.length;
const avgWrong = wrongLengths.reduce((a,b) => a+b, 0) / wrongLengths.length;

console.log('=== New Option Length Analysis ===');
console.log('Correct answers avg length: ' + avgCorrect.toFixed(1) + ' chars');
console.log('Wrong answers avg length: ' + avgWrong.toFixed(1) + ' chars');
console.log('Difference: ' + (avgCorrect - avgWrong).toFixed(1) + ' chars');

// Write back
const output = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';\n';
fs.writeFileSync('quiz-data.js', output, 'utf8');

console.log('Done! quiz-data.js has been updated.');
