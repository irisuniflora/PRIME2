// Script to add explanations to questions that don't have them
const fs = require('fs');

// Read the quiz data file
let content = fs.readFileSync('quiz-data.js', 'utf8');

// Temporarily modify to export
const modifiedContent = content.replace('const quizData =', 'module.exports =');
fs.writeFileSync('quiz-data-temp.js', modifiedContent, 'utf8');

// Require it
const quizData = require('./quiz-data-temp.js');

// Delete temp file
fs.unlinkSync('quiz-data-temp.js');

// Explanations for Magic of the Wizard Dragon
const dragonExplanations = {
  1: "Drake's dragon is named Worm, an Earth Dragon who has been his companion throughout the Dragon Masters series.",
  2: "The story begins with Drake and Rory in an empty classroom at the Castle of the Wizards, where they are studying magic.",
  3: "Vulcan is a Fire Dragon, known for breathing fire and having flame-related powers.",
  4: "Zoltan is Wolfgang's father, a wizard who plays an important role in the story.",
  5: "When Worm uses his transportation powers, his body glows green, which is characteristic of Earth Dragon magic.",
  6: "Jaina is the head wizard at the Castle of the Wizards, leading the wizard council.",
  7: "Barga is a land covered in snow, a cold northern region where Wolfgang travels during the story.",
  8: "Kinguk is an Earth Dragon, sharing similar powers with Worm.",
  9: "In Nuna's language, 'Kinguk' means 'Worm', showing the connection between the two Earth Dragons.",
  10: "Maldred was transformed into 100 flies before being trapped in a bottle as punishment for his evil deeds.",
  11: "Stinkweed was the plant Nuna used to heal Kinguk, despite its unpleasant smell it has healing properties.",
  12: "The Naga is a powerful dragon that guards the bottle containing Maldred.",
  13: "When the Naga turns his eye to a place, an earthquake happens, demonstrating his immense power.",
  14: "Blue magic came from Wolfgang's wand when he created a warm coat for Drake to protect him from the cold.",
  15: "Vulcan is Rory's dragon, a Fire Dragon that Rory has bonded with.",
  16: "The Dragon Stone glows when a dragon is nearby, serving as a detection tool for Dragon Masters.",
  17: "Worm communicated with Drake through mind messages, which is how Earth Dragons connect with their masters.",
  18: "Wolfgang was worried about Drake because he cared about his friend's safety in the dangerous cold of Barga.",
  19: "The wizards trapped the Naga using powerful combined magic after he caused destruction.",
  20: "Drake felt a connection to Kinguk because both are Earth Dragons, and Earth Dragons share a special bond.",
  21: "Maldred wanted to control all dragons to gain ultimate power over the magical world.",
  22: "The bottle trap was created using ancient wizard magic, one of the most powerful containment spells.",
  23: "Wolfgang proved his loyalty by helping Drake despite the dangers they faced together.",
  24: "Nuna's knowledge of healing plants saved Kinguk's life when he was injured.",
  25: "The earthquake was caused by the Naga's power, showing the danger of his awakening.",
  26: "Drake's bravery was shown when he faced the Naga despite knowing the danger.",
  27: "The wizards decided to keep the Naga trapped because releasing him would cause massive destruction.",
  28: "Worm's transportation ability allowed them to escape dangerous situations quickly.",
  29: "The cold in Barga was magical, created by ancient spells that made it unnaturally freezing.",
  30: "Wolfgang learned to trust others through his adventures with Drake and the Dragon Masters.",
  31: "The Castle of the Wizards serves as the main training ground for young wizards and Dragon Masters.",
  32: "Earth Dragons like Worm and Kinguk can sense each other because they share elemental energy.",
  33: "Maldred's evil plan was stopped by the combined efforts of the Dragon Masters and wizards.",
  34: "The Dragon Stone was created by ancient wizards to help identify potential Dragon Masters.",
  35: "Rory's determination helped the team overcome obstacles during their quest.",
  36: "The Naga was originally a guardian dragon before being corrupted by dark magic.",
  37: "Drake learned that teamwork is essential when facing powerful enemies.",
  38: "Wolfgang's magic skills improved significantly throughout his journey with the Dragon Masters.",
  39: "The healing process for Kinguk required both magical plants and rest.",
  40: "Barga's harsh environment tested the characters' survival skills and determination.",
  41: "Understanding dragon language helps Dragon Masters form stronger bonds with their dragons.",
  42: "The ancient wizards created many magical safeguards to protect the world from evil.",
  43: "Maldred underestimated the power of friendship and teamwork among the Dragon Masters.",
  44: "Fire Dragons like Vulcan are naturally resistant to cold, making them valuable in icy regions.",
  45: "The story teaches that even former enemies can become allies when they share a common goal.",
  46: "Dragon Masters must learn to trust their dragons' instincts in dangerous situations.",
  47: "The magical bond between a Dragon Master and their dragon grows stronger over time.",
  48: "Wolfgang's character development shows that people can change and grow.",
  49: "The Naga's power represents the dangers of unchecked magical abilities.",
  50: "Drake's leadership skills developed as he faced increasingly difficult challenges.",
  51: "The Castle of the Wizards contains many magical artifacts and ancient knowledge.",
  52: "Earth Dragon powers include transportation, sensing, and connecting with the earth itself.",
  53: "The story emphasizes the importance of protecting magical creatures and their habitats.",
  54: "Nuna's wisdom about plants and healing represents traditional knowledge passed down through generations.",
  55: "The final battle required all the characters to use their unique abilities together.",
  56: "Maldred's imprisonment serves as a warning about the consequences of seeking power through evil means.",
  57: "Dragons in this world are intelligent beings capable of forming deep emotional connections.",
  58: "The snow-covered lands of Barga hide many magical secrets and ancient artifacts.",
  59: "The Dragon Masters' mission is to protect both humans and dragons from threats.",
  60: "The ending shows that peace can be achieved through understanding and cooperation."
};

// Explanations for Alice in Wonderland
const aliceExplanations = {
  1: "Alice followed the White Rabbit down the rabbit hole, beginning her adventure in Wonderland.",
  2: "Alice found a bottle labeled 'DRINK ME' which caused her to shrink when she drank from it.",
  3: "The Caterpillar sat on a mushroom, smoking a hookah when Alice first encountered him.",
  4: "The Queen of Hearts is famous for shouting 'Off with their heads!' as her favorite punishment.",
  5: "The Mad Hatter, March Hare, and Dormouse were at the mad tea party.",
  6: "Alice grew very tall after eating a piece of the mushroom the Caterpillar told her about.",
  7: "The Cheshire Cat is known for his ability to disappear, leaving only his grin visible.",
  8: "Alice played croquet with the Queen using flamingos as mallets and hedgehogs as balls.",
  9: "The Duchess's baby transformed into a pig when Alice was holding it.",
  10: "The Mock Turtle told Alice his sad history while crying constantly.",
  11: "Alice attended the trial of the Knave of Hearts, who was accused of stealing tarts.",
  12: "The White Rabbit served as a herald at the trial, reading the accusations.",
  13: "Alice woke up to find her sister brushing dead leaves off her face.",
  14: "The Caterpillar asked Alice 'Who are you?' which made her question her own identity.",
  15: "The garden with the talking flowers criticized Alice and mistook her for a weed.",
  16: "The Pool of Tears was created when giant Alice cried, and she later swam in it when small.",
  17: "The Dodo organized a Caucus Race where everyone runs in circles and everyone wins.",
  18: "The Hatter explained that Time stopped at six o'clock because he quarreled with Time.",
  19: "The Queen's garden had white roses that the cards were painting red to avoid punishment.",
  20: "Alice found the key to the tiny door on a glass table in the hall.",
  21: "The Caterpillar's advice about the mushroom helped Alice control her size changes.",
  22: "The Cheshire Cat directed Alice to both the March Hare and the Mad Hatter.",
  23: "The Dormouse told the story of three sisters who lived at the bottom of a treacle well.",
  24: "The Queen threatened to execute Alice, but Alice stood up to her by the end.",
  25: "The Gryphon took Alice to meet the Mock Turtle to hear his story.",
  26: "Alice's neck grew so long she was mistaken for a serpent by a pigeon.",
  27: "The Mad Hatter's riddle 'Why is a raven like a writing desk?' famously has no answer.",
  28: "The Lobster Quadrille was a dance the Mock Turtle and Gryphon demonstrated for Alice.",
  29: "Bill the Lizard was sent down the chimney and kicked out by Alice.",
  30: "The baby turning into a pig represents the absurdity and transformations in Wonderland.",
  31: "The trial was about stolen tarts, with the Knave of Hearts as the accused.",
  32: "Father William's poems were recited incorrectly by Alice, coming out as nonsense.",
  33: "The Queen's croquet game was chaotic because the equipment was alive and uncooperative.",
  34: "Alice realized Wonderland characters were 'nothing but a pack of cards' before waking.",
  35: "The Caucus Race satirizes politics, where running in circles accomplishes nothing.",
  36: "The Hatter's watch showed the day of the month because it was always tea-time.",
  37: "The Cheshire Cat's philosophical comments about madness suggest everyone in Wonderland is mad.",
  38: "Alice's growing and shrinking represents the confusing changes of childhood.",
  39: "The Mock Turtle's name is a pun on mock turtle soup, made from calf's head.",
  40: "The Queen of Hearts represents arbitrary authority and irrational anger.",
  41: "Tweedledee and Tweedledum are twin brothers who argue constantly.",
  42: "The Jabberwocky poem is famous for its invented nonsense words.",
  43: "The White Queen offers Alice a job as her lady's maid with payment of jam.",
  44: "The Red Queen explains that you must run just to stay in place in Looking-Glass world.",
  45: "Humpty Dumpty explains that words mean whatever he chooses them to mean.",
  46: "The Walrus and the Carpenter eat the oysters after leading them on a walk.",
  47: "The Lion and the Unicorn fight for the crown as in the nursery rhyme.",
  48: "Alice becomes a Queen after reaching the eighth square, like in chess.",
  49: "The White Knight is known for his kindness and his many impractical inventions.",
  50: "Looking-Glass world runs on chess rules, with Alice as a pawn becoming a queen.",
  51: "The Garden of Live Flowers is where flowers talk and criticize Alice.",
  52: "The Sheep's shop transforms into a rowboat, showing the fluid nature of Looking-Glass world.",
  53: "The train journey shows how different Looking-Glass world is from normal reality.",
  54: "Memory works backwards in Looking-Glass world, according to the White Queen.",
  55: "The banquet at the end has food that comes alive and cannot be eaten.",
  56: "Alice shakes the Red Queen until she turns into Alice's kitten, ending the dream.",
  57: "Carroll's stories explore logic, language, and the nature of reality through absurdity.",
  58: "The Bread-and-Butterfly is a creature that can only live on weak tea.",
  59: "Haigha and Hatta are the White King's messengers, based on the Hare and Hatter.",
  60: "The final question of who dreamed it all - Alice or the Red King - is never answered."
};

// Add explanations to questions
Object.keys(quizData).forEach(bookKey => {
  const book = quizData[bookKey];

  if (bookKey === 'Magic_of_the_Wizard_Dragon') {
    book.questions.forEach(q => {
      if (!q.explanation && dragonExplanations[q.id]) {
        q.explanation = dragonExplanations[q.id];
      }
    });
  }

  if (bookKey === 'Alice_in_Wonderland') {
    book.questions.forEach(q => {
      if (!q.explanation && aliceExplanations[q.id]) {
        q.explanation = aliceExplanations[q.id];
      }
    });
  }
});

// Count to verify
let total = 0;
let withExp = 0;
Object.keys(quizData).forEach(bookKey => {
  quizData[bookKey].questions.forEach(q => {
    total++;
    if (q.explanation) withExp++;
  });
});

console.log(`Total questions: ${total}`);
console.log(`With explanations: ${withExp}`);

// Write back
const output = 'const quizData = ' + JSON.stringify(quizData, null, 2) + ';\n';
fs.writeFileSync('quiz-data.js', output, 'utf8');

console.log('Done! Explanations added.');
