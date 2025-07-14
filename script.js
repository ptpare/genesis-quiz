// Ensure this structure is strictly followed for all verses.
// Each verse number maps to an OBJECT containing 'text' and 'answer'.
const verses = {
    3: { text: "Ge Adamo a na le mengwaga ye __________, o ile a ba le morwa yo a swanago le yena mme a mo rea leina la Sete.", answer: 130 },
    4: { text: "Ka morago ga fao Adamo o phetše mengwaga ye mengwe ye __________. O ile a ba le bana ba bangwe,", answer: 800 },
    5: { text: "mme a hlokafala a na le mengwaga ye __________.", answer: 930 },
    6: { text: "Ge Sete a na le mengwaga ye __________, o ile a ba le morwa, e lego Enose,", answer: 105 },
    7: { text: "mme a phela mengwaga ye mengwe ye __________. O ile a ba le bana ba bangwe,", answer: 807 },
    8: { text: "mme a hlokafala a na le mengwaga ye __________.", answer: 912 },
};

// Dictionary mapping verse numbers to MP3 file names
const audioFiles = {
    3: "Genesis 005_03.mp3",
    4: "Genesis 005_04.mp3",
    5: "Genesis 005_05.mp3",
    6: "Genesis 005_06.mp3",
    7: "Genesis 005_07.mp3",
    8: "Genesis 005_08.mp3",
};

// Get DOM elements
const verseDisplay = document.getElementById('verse-display');
const audioPlayer = document.getElementById('audio-player');
const audioStatus = document.getElementById('audio-status');
const userInput = document.getElementById('user-input');
const submitButton = document.getElementById('submit-button');
const feedback = document.getElementById('feedback');

// DOM elements for screen management
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const quizArea = document.getElementById('quiz-area');
const resultsArea = document.getElementById('results-area');

const correctCountSpan = document.getElementById('correct-count');
const totalQuestionsCountSpan = document.getElementById('total-questions-count');
const percentageSpan = document.getElementById('percentage');
const restartButton = document.getElementById('restart-button');

let currentVerseIndex = 0;
let correctAnswers = 0;
const verseNumbers = Object.keys(verses).map(Number).sort((a, b) => a - b);
const totalQuestions = verseNumbers.length;

// --- Functions ---

async function loadVerse() {
    console.log(`Loading verse: ${currentVerseIndex + 1}/${totalQuestions}`); // Debug log
    if (currentVerseIndex >= totalQuestions) {
        showResults();
        return;
    }

    const verseNum = verseNumbers[currentVerseIndex];
    const verseData = verses[verseNum];

    verseDisplay.textContent = `Verse ${verseNum}: ${verseData.text}`;
    userInput.value = '';
    feedback.textContent = '';
    userInput.focus();

    if (audioFiles[verseNum]) {
        const audioPath = `audio/${audioFiles[verseNum]}`; // Relative path
        audioPlayer.src = audioPath;
        audioPlayer.load();
        
        audioStatus.textContent = 'Playing audio...';
        try {
            await audioPlayer.play(); 
            audioStatus.textContent = '';
            console.log(`Audio for Verse ${verseNum} started playing.`); // Debug log
        } catch (error) {
            console.error("Audio playback failed:", error); // Log full error
            if (error.name === "NotAllowedError" || error.name === "AbortError") {
                audioStatus.textContent = 'Audio playback blocked. Please click "Start Quiz" or interact with the page.';
            } else {
                audioStatus.textContent = `Error playing audio: ${error.message}. Check console for details.`;
            }
        }
    } else {
        audioStatus.textContent = 'No audio for this verse.';
        console.log(`No audio file specified for Verse ${verseNum}.`); // Debug log
    }
}

function checkAnswer() {
    console.log("Check Answer button clicked!"); // Debug log
    const verseNum = verseNumbers[currentVerseIndex];
    const verseData = verses[verseNum];
    const userAnswer = parseInt(userInput.value.trim());

    if (isNaN(userAnswer)) {
        feedback.textContent = "Please enter a valid number.";
        feedback.style.color = 'orange';
        return;
    }

    if (userAnswer === verseData.answer) {
        correctAnswers++;
        feedback.textContent = `Correct! (${verseData.answer})`;
        feedback.style.color = 'green';
    } else {
        feedback.textContent = `Incorrect. Expected ${verseData.answer}, got ${userAnswer}.`;
        feedback.style.color = 'red';
    }

    currentVerseIndex++;
    setTimeout(loadVerse, 1500); 
}

function showResults() {
    console.log("Showing results screen."); // Debug log
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';
    startScreen.style.display = 'none'; // Ensure start screen is hidden

    correctCountSpan.textContent = correctAnswers;
    totalQuestionsCountSpan.textContent = totalQuestions;
    const percentage = (correctAnswers / totalQuestions) * 100 || 0;
    percentageSpan.textContent = `${percentage.toFixed(2)}%`;
}

function restartTest() {
    console.log("Restarting test."); // Debug log
    currentVerseIndex = 0;
    correctAnswers = 0;
    resultsArea.style.display = 'none';
    startScreen.style.display = 'block'; // Go back to start screen to re-enable audio
    quizArea.style.display = 'none'; // Hide quiz area
    audioPlayer.pause();
    audioPlayer.src = '';
    audioStatus.textContent = '';
    userInput.value = '';
    feedback.textContent = '';
}

// New function to start the quiz after user interaction
function startQuiz() {
    console.log("Start Quiz button clicked! Attempting to hide start screen and show quiz area."); // Debug log
    startScreen.style.display = 'none';
    quizArea.style.display = 'block';
    loadVerse(); // Start loading the first verse and its audio
}

// --- Event Listeners ---
submitButton.addEventListener('click', checkAnswer);
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});
restartButton.addEventListener('click', restartTest);
startButton.addEventListener('click', startQuiz); // Listen for click on the new start button


// --- Initialize Page State ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing screen states."); // Debug log
    // Initially hide quiz and results, show start screen
    quizArea.style.display = 'none';
    resultsArea.style.display = 'none';
    startScreen.style.display = 'block';
});