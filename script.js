// Temporary word database for testing
const tempWordDatabase = [
    {
        word: "Serendipity",
        pronunciation: "ser-uhn-dip-i-tee",
        syllables: "ser•en•dip•i•ty",
        results: [{
            partOfSpeech: "noun",
            definition: "The occurrence of events by chance in a happy or beneficial way.",
            examples: ["Finding this book was pure serendipity."],
            synonyms: ["chance", "fortune", "luck"],
            antonyms: ["misfortune", "bad luck"]
        }]
    },
    {
        word: "Ephemeral",
        pronunciation: "ih-fem-er-uhl",
        syllables: "e•phem•er•al",
        results: [{
            partOfSpeech: "adjective",
            definition: "Lasting for a very short time.",
            examples: ["The beauty of cherry blossoms is ephemeral."],
            synonyms: ["temporary", "fleeting", "transient"],
            antonyms: ["permanent", "eternal", "lasting"]
        }]
    },
    {
        word: "Mellifluous",
        pronunciation: "muh-lif-loo-uhs",
        syllables: "mel•lif•lu•ous",
        results: [{
            partOfSpeech: "adjective",
            definition: "Sweet or musical; pleasant to hear.",
            examples: ["Her mellifluous voice charmed the audience."],
            synonyms: ["sweet", "honeyed", "musical"],
            antonyms: ["harsh", "grating", "discordant"]
        }]
    }
];

// Word of the Day functionality
function getWordOfTheDay() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                console.log('API Response Status:', this.status);
                console.log('API Response:', this.responseText);
                
                try {
                    if (this.status !== 200) {
                        throw new Error(`API returned status ${this.status}`);
                    }

                    const response = JSON.parse(this.responseText);
                    if (!Array.isArray(response) || response.length === 0) {
                        throw new Error('No word data received');
                    }

                    const word = response[0]; // Dictionary API returns an array
                    if (!word || !word.word) {
                        throw new Error('Invalid word data received');
                    }

                    displayWord(word);
                    resolve(word);
                } catch (error) {
                    console.error('Error details:', error);
                    document.getElementById('word-display').innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Error loading word: ${error.message}</p>
                            <p>Please try again later.</p>
                        </div>
                    `;
                    reject(error);
                }
            }
        });

        xhr.addEventListener('error', function() {
            console.error('Network error occurred');
            document.getElementById('word-display').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Network error. Please check your connection and try again.</p>
                </div>
            `;
            reject(new Error('Network error'));
        });

        xhr.addEventListener('timeout', function() {
            console.error('Request timed out');
            document.getElementById('word-display').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Request timed out. Please try again.</p>
                </div>
            `;
            reject(new Error('Request timeout'));
        });

        // Get a random word from a predefined list
        const randomWords = [
            // B1 Level Vocabulary
            'accomplish', 'adequate', 'adjust', 'advocate', 'allocate',
            'anticipate', 'appreciate', 'approach', 'appropriate', 'approximate',
            'argue', 'arrange', 'assess', 'assist', 'assume',
            'authorize', 'available', 'aware', 'benefit', 'brief',
            'calculate', 'challenge', 'characteristic', 'circumstance', 'clarify',
            'collaborate', 'combine', 'comment', 'commit', 'communicate',
            'compare', 'compete', 'complain', 'complete', 'complicate',
            'compose', 'comprise', 'concentrate', 'conclude', 'conduct',
            'confine', 'confirm', 'conflict', 'confront', 'confuse',
            'connect', 'consider', 'consist', 'constant', 'construct'
        ];

        // Shuffle the array to ensure more random selection
        for (let i = randomWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomWords[i], randomWords[j]] = [randomWords[j], randomWords[i]];
        }

        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];

        xhr.open('GET', `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        xhr.timeout = 10000;

        try {
            xhr.send();
        } catch (error) {
            console.error('Error sending request:', error);
            document.getElementById('word-display').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error sending request: ${error.message}</p>
                </div>
            `;
            reject(error);
        }
    });
}

function displayWord(word) {
    const wordDisplay = document.getElementById('word-display');
    
    // Get pronunciation with fallback
    const pronunciation = word.phonetic || '';
    
    // Get all definitions with proper error handling
    let definitionsHtml = '';
    if (word.meanings && Array.isArray(word.meanings)) {
        word.meanings.forEach(meaning => {
            if (!meaning) return;

            const partOfSpeech = meaning.partOfSpeech || 'unknown';
            const definition = meaning.definitions[0]?.definition || 'No definition available';
            const example = meaning.definitions[0]?.example || null;
            const synonyms = meaning.synonyms || [];
            const antonyms = meaning.antonyms || [];

            definitionsHtml += `
                <div class="meaning-section">
                    <p class="part-of-speech">${partOfSpeech}</p>
                    <div class="definitions">
                        <div class="definition-item">
                            <p class="definition-text">${definition}</p>
                            ${example ? `
                                <p class="example-text">"${example}"</p>
                            ` : ''}
                        </div>
                    </div>
                    ${synonyms.length > 0 ? `
                        <div class="synonyms">
                            <span class="label">Synonyms:</span>
                            <span class="synonym-list">${synonyms.slice(0, 3).join(', ')}</span>
                        </div>
                    ` : ''}
                    ${antonyms.length > 0 ? `
                        <div class="antonyms">
                            <span class="label">Antonyms:</span>
                            <span class="antonym-list">${antonyms.slice(0, 3).join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } else {
        definitionsHtml = `
            <div class="meaning-section">
                <p class="no-definition">No definitions available for this word.</p>
            </div>
        `;
    }
    
    wordDisplay.innerHTML = `
        <div class="word-header">
            <h4 class="word">${word.word}</h4>
            ${pronunciation ? `<p class="phonetic">${pronunciation}</p>` : ''}
            <p class="date">Random Word</p>
        </div>
        <div class="meanings-container">
            ${definitionsHtml}
        </div>
        <div class="word-actions">
            <button class="action-button" onclick="speakWord('${word.word}')">
                <i class="fas fa-volume-up"></i> Listen
            </button>
            <button class="action-button" onclick="saveWord('${word.word}')">
                <i class="fas fa-bookmark"></i> Save
            </button>
            <button class="action-button refresh" onclick="refreshWord()">
                <i class="fas fa-sync-alt"></i> New Word
            </button>
        </div>
    `;
}

// Function to refresh word
async function refreshWord() {
    const refreshButton = document.querySelector('.action-button.refresh');
    if (refreshButton.disabled) return;
    
    try {
        refreshButton.disabled = true;
        refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        await getWordOfTheDay();
    } catch (error) {
        console.error('Error refreshing word:', error);
    } finally {
        refreshButton.disabled = false;
        refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> New Word';
    }
}

// Function to speak the word
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
}

// Function to save word to localStorage
function saveWord(word) {
    let savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    if (!savedWords.includes(word)) {
        savedWords.push(word);
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
        alert('Word saved successfully!');
        updateSavedWordsList(); // Update the list when a new word is saved
    } else {
        alert('Word already saved!');
    }
}

// Function to display saved words
function updateSavedWordsList() {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    const savedWordsContainer = document.getElementById('saved-words');
    
    if (savedWords.length === 0) {
        savedWordsContainer.innerHTML = '<p class="no-words">No saved words yet.</p>';
        return;
    }
    
    let html = '<div class="saved-words-list">';
    savedWords.forEach(word => {
        html += `
            <div class="saved-word-item">
                <span class="word">${word}</span>
                <div class="word-actions">
                    <button onclick="speakWord('${word}')" class="action-button small">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button onclick="removeWord('${word}')" class="action-button small delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    savedWordsContainer.innerHTML = html;
}

// Function to remove a saved word
function removeWord(word) {
    let savedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
    savedWords = savedWords.filter(w => w !== word);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    updateSavedWordsList();
}

// Quiz functionality
const quizQuestions = [
    {
        question: "Which sentence is grammatically correct?",
        options: [
            "I am student",
            "I am a student",
            "I student",
            "I a student"
        ],
        correct: 1
    },
    {
        question: "What is the past tense of 'write'?",
        options: ["wrote", "written", "writed", "writing"],
        correct: 0
    },
    {
        question: "Choose the correct word: I ___ to school every day.",
        options: ["go", "goes", "going", "went"],
        correct: 0
    },
    {
        question: "Which word is a verb?",
        options: ["beautiful", "happiness", "run", "quickly"],
        correct: 2
    },
    {
        question: "Select the correct article: ___ apple a day keeps the doctor away.",
        options: ["a", "an", "the", "no article"],
        correct: 1
    },
    {
        question: "What is the opposite of 'begin'?",
        options: ["start", "continue", "end", "proceed"],
        correct: 2
    },
    {
        question: "Which sentence uses the present perfect tense correctly?",
        options: [
            "I am living here for 5 years.",
            "I have lived here for 5 years.",
            "I live here for 5 years.",
            "I lived here for 5 years."
        ],
        correct: 1
    },
    {
        question: "What is the plural of 'child'?",
        options: ["childs", "children", "childrens", "child"],
        correct: 1
    },
    {
        question: "Which word is an adjective?",
        options: ["run", "beautiful", "happiness", "quickly"],
        correct: 1
    },
    {
        question: "Choose the correct preposition: The book is ___ the table.",
        options: ["in", "on", "at", "by"],
        correct: 1
    }
];

let usedQuestions = [];

function getRandomQuestion() {
    if (usedQuestions.length === quizQuestions.length) {
        usedQuestions = [];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizQuestions.length);
    } while (usedQuestions.includes(randomIndex));
    
    usedQuestions.push(randomIndex);
    return quizQuestions[randomIndex];
}

function loadQuizQuestion() {
    const quiz = document.getElementById('quiz');
    const question = getRandomQuestion();
    
    quiz.querySelector('.question').textContent = question.question;
    
    const optionsContainer = quiz.querySelector('.options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(index, question.correct);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option-button');
    
    // Disable all buttons
    options.forEach(button => {
        button.disabled = true;
        button.style.pointerEvents = 'none';
    });
    
    // Show correct and incorrect answers
    if (selectedIndex === correctIndex) {
        options[selectedIndex].style.backgroundColor = '#2ecc71';
        options[selectedIndex].style.color = 'white';
        options[selectedIndex].style.borderColor = '#2ecc71';
    } else {
        options[selectedIndex].style.backgroundColor = '#e74c3c';
        options[selectedIndex].style.color = 'white';
        options[selectedIndex].style.borderColor = '#e74c3c';
        options[correctIndex].style.backgroundColor = '#2ecc71';
        options[correctIndex].style.color = 'white';
        options[correctIndex].style.borderColor = '#2ecc71';
    }
    
    // Load new question after delay
    setTimeout(() => {
        loadQuizQuestion();
    }, 2000);
}

// Dictionary search functionality
async function searchWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const wordData = data[0];
            const wordDetails = document.getElementById('word-details');
            
            let html = `
                <h3>${wordData.word}</h3>
                <p><strong>Phonetic:</strong> ${wordData.phonetic || 'Not available'}</p>
            `;
            
            wordData.meanings.forEach(meaning => {
                html += `
                    <div class="meaning">
                        <p><strong>${meaning.partOfSpeech}</strong></p>
                        <p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>
                        ${meaning.definitions[0].example ? 
                            `<p><strong>Example:</strong> ${meaning.definitions[0].example}</p>` : ''}
                    </div>
                `;
            });
            
            wordDetails.innerHTML = html;
        } else {
            document.getElementById('word-details').innerHTML = '<p>Word not found</p>';
        }
    } catch (error) {
        console.error('Error searching word:', error);
        document.getElementById('word-details').innerHTML = '<p>Error searching word</p>';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load initial word of the day
    getWordOfTheDay();
    
    // Load initial quiz question
    loadQuizQuestion();
    
    // Load saved words
    updateSavedWordsList();
    
    // Dictionary search
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('word-search');
    
    searchButton.addEventListener('click', () => {
        const word = searchInput.value.trim();
        if (word) {
            searchWord(word);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const word = searchInput.value.trim();
            if (word) {
                searchWord(word);
            }
        }
    });
    
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Start Learning button
    document.querySelector('.cta-button').addEventListener('click', () => {
        document.querySelector('#lessons').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Lesson cards
    document.querySelectorAll('.start-lesson').forEach(button => {
        button.addEventListener('click', () => {
            alert('Lesson content will be available soon!');
        });
    });
}); 