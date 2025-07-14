// Dictionary of verses with placeholders and correct answers
const verses = {
    3: { text: "Ge Adamo a na le mengwaga ye __________, o ile a ba le morwa yo a swanago le yena mme a mo rea leina la Sete.", answer: 130 },
    4: { text: "Ka morago ga fao Adamo o phetše mengwaga ye mengwe ye __________. O ile a ba le bana ba bangwe,", answer: 800 },
    5: { text: "mme a hlokafala a na le mengwaga ye __________.", answer: 930 },
    6: { text: "Ge Sete a na le mengwaga ye __________, o ile a ba le morwa, e lego Enose,", answer: 105 },
    7: { text: "mme a phela mengwaga ye mengwe ye __________. O ile a ba le bana ba bangwe,", 807 },
    8: { text: "mme a hlokafala a na le mengwaga ye __________.", 912 },
};

// Dictionary mapping verse numbers to MP3 file names
// Audio files must be in an 'audio/' subfolder relative to index.html
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
const quizArea = document.getElementById('quiz-area');
const resultsArea = document.getElementById('results-area');
const correctCountSpan = document.getElementById('correct-count');
const totalQuestionsCountSpan = document.getElementById('total-questions-count');
const percentageSpan = document.getElementById('percentage');
const restartButton = document.getElementById('restart-button');

let currentVerseIndex = 0;
let correctAnswers = 0;
const verseNumbers = Object.keys(verses).map(Number).sort((a, b) => a - b); // Get ordered list of verse numbers
const totalQuestions = verseNumbers.length;

// --- Functions ---

async function loadVerse() {
    if (currentVerseIndex >= totalQuestions) {
        showResults();
        return;
    }

    const verseNum = verseNumbers[currentVerseIndex];
    const verseData = verses[verseNum];

    verseDisplay.textContent = `Verse ${verseNum}: ${verseData.text}`;
    userInput.value = '';
    feedback.textContent = '';
    userInput.focus(); // Focus input for quick typing

    if (audioFiles[verseNum]) {
        const audioPath = `audio/${audioFiles[verseNum]}`; // Relative path to audio folder
        audioPlayer.src = audioPath;
        audioPlayer.load(); // Load the audio
        
        audioStatus.textContent = 'Playing audio...';
        try {
            await audioPlayer.play(); // Play the audio and wait for it to finish
            audioStatus.textContent = ''; // Clear status once playing starts
        } catch (error) {
            audioStatus.textContent = `Error playing audio: ${error.message}`;
            console.error("Audio playback failed:", error);
            // If autoplay is blocked, often there's a user interaction needed.
            // For quizzes, often best to just allow user to answer while audio loads/plays.
        }
    } else {
        audioStatus.textContent = 'No audio for this verse.';
    }
}

function checkAnswer() {
    const verseNum = verseNumbers[currentVerseIndex];
    const verseData = verses[verseNum];
    const userAnswer = parseInt(userInput.value.trim());

    if (isNaN(userAnswer)) {
        feedback.textContent = "Please enter a valid number.";
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
    // Use a small delay before loading the next verse for user to see feedback
    setTimeout(loadVerse, 1500); 
}

function showResults() {
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';

    correctCountSpan.textContent = correctAnswers;
    totalQuestionsCountSpan.textContent = totalQuestions;
    const percentage = (correctAnswers / totalQuestions) * 100 || 0;
    percentageSpan.textContent = `${percentage.toFixed(2)}%`;
}

function restartTest() {
    currentVerseIndex = 0;
    correctAnswers = 0;
    resultsArea.style.display = 'none';
    quizArea.style.display = 'block';
    loadVerse();
}

// --- Event Listeners ---
submitButton.addEventListener('click', checkAnswer);
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});
restartButton.addEventListener('click', restartTest);


// --- Initialize Test ---
document.addEventListener('DOMContentLoaded', loadVerse); // Start when the page is loaded