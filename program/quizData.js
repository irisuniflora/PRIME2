// PRIME Quiz Data - All Books Combined
// Auto-generated unified quiz file

const quizData = {
  // Metadata
  generatedAt: "2024",
  totalBooks: 15,

  // All quiz data will be loaded dynamically from JSON files
  books: []
};

// Function to load quiz from JSON file
async function loadQuizFromJSON(filename) {
  try {
    const response = await fetch(`../output_quiz/${filename}`);
    if (!response.ok) throw new Error(`Failed to load ${filename}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

// List of all quiz files
const quizFiles = [
  "Alice in Wonderland.json",
  "Billionaire Boy.json",
  "Biscuit Wants to Play.json",
  "Black Beauty.json",
  "Diary of a Wimpy Kid.json",
  "Dramatic Readings Vol.3.json",
  "Goblet of Fire.json",
  "Henry and Mudge in the Sparkle Days.json",
  "Magic of Oz.json",
  "Magic of the Wizard Dragon.json",
  "Mr Hynde Is Out of His Mind.json",
  "The Fleeing Fang.json",
  "The School Is Alive.json",
  "There Was an Old Lady.json",
  "Warriors Into the Wild.json"
];

// Load all quizzes
async function loadAllQuizzes() {
  const loadedQuizzes = [];

  for (const file of quizFiles) {
    const quiz = await loadQuizFromJSON(file);
    if (quiz) {
      loadedQuizzes.push(quiz);
    }
  }

  quizData.books = loadedQuizzes;
  quizData.totalBooks = loadedQuizzes.length;

  console.log(`Loaded ${loadedQuizzes.length} quizzes successfully`);
  return quizData;
}

// Get quiz by title
function getQuizByTitle(title) {
  return quizData.books.find(book =>
    book.title?.toLowerCase().includes(title.toLowerCase()) ||
    book.book_title?.toLowerCase().includes(title.toLowerCase())
  );
}

// Get all book titles
function getAllBookTitles() {
  return quizData.books.map(book => book.title || book.book_title);
}

// Get questions by difficulty
function getQuestionsByDifficulty(quiz, difficulty) {
  return quiz.questions.filter(q => q.difficulty === difficulty);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { quizData, loadAllQuizzes, getQuizByTitle, getAllBookTitles, getQuestionsByDifficulty };
}
