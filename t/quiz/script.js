// DOM Elements
const uploadSection = document.getElementById('upload-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const checkpointSection = document.getElementById('checkpoint-section');

const fileInput = document.getElementById('fileInput');
const btnLoadSample = document.getElementById('btn-load-sample');
const btnRestart = document.getElementById('btn-restart');
const btnNewFile = document.getElementById('btn-new-file');
const btnContinue = document.getElementById('btn-continue');
const btnStop = document.getElementById('btn-stop');

const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const questionCount = document.getElementById('question-count');
const scoreDisplay = document.getElementById('score-display');
const progressFill = document.getElementById('progress-fill');

const finalScore = document.getElementById('final-score');
const feedbackMsg = document.getElementById('feedback-msg');
const checkpointScore = document.getElementById('checkpoint-score');

// State
let allQuestions = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;

// --- Event Listeners ---

// File Upload
fileInput.addEventListener('change', handleFileUpload);
btnLoadSample.addEventListener('click', loadSampleData);

// Navigation
btnRestart.addEventListener('click', restartQuiz);
btnNewFile.addEventListener('click', () => {
    showSection(uploadSection);
    fileInput.value = ''; // Reset file input
});

// Checkpoint Handling
btnContinue.addEventListener('click', () => {
    showSection(quizSection);
    renderQuestion();
});
btnStop.addEventListener('click', endQuiz);

// Drag and Drop Visuals
const dropArea = document.getElementById('drop-area');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.style.borderColor = 'var(--primary)', false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.style.borderColor = '#cbd5e1', false);
});

dropArea.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        handleFileUpload({ target: fileInput });
    }
});

// --- Logic functions ---

function showSection(section) {
    [uploadSection, quizSection, resultSection, checkpointSection].forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });
    section.classList.remove('hidden');
    section.classList.add('active');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        try {
            if (file.name.endsWith('.json')) {
                const data = JSON.parse(content);
                validateAndStart(data);
            } else if (file.name.endsWith('.csv')) {
                const data = parseCSV(content);
                validateAndStart(data);
            } else {
                alert('Format non supporté. Veuillez utiliser .json ou .csv');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la lecture du fichier. Vérifiez le format.');
        }
    };
    reader.readAsText(file);
}

const SAMPLE_PAIRS = [
    { q: "Afghanistan", a: "Kaboul" },
    { q: "Afrique du Sud", a: "Pretoria" },
    { q: "Albanie", a: "Tirana" },
    { q: "Algérie", a: "Alger" },
    { q: "Allemagne", a: "Berlin" },
    { q: "Andorre", a: "Andorre-la-Vieille" },
    { q: "Angola", a: "Luanda" },
    { q: "Antigua-et-Barbuda", a: "Saint John's" },
    { q: "Arabie saoudite", a: "Riyad" },
    { q: "Argentine", a: "Buenos Aires" },
    { q: "Arménie", a: "Erevan" },
    { q: "Australie", a: "Canberra" },
    { q: "Autriche", a: "Vienne" },
    { q: "Azerbaïdjan", a: "Bakou" },
    { q: "Bahamas", a: "Nassau" },
    { q: "Bahreïn", a: "Manama" },
    { q: "Bangladesh", a: "Dacca" },
    { q: "Barbade", a: "Bridgetown" },
    { q: "Belgique", a: "Bruxelles" },
    { q: "Belize", a: "Belmopan" },
    { q: "Bénin", a: "Porto-Novo" },
    { q: "Bhoutan", a: "Thimphou" },
    { q: "Biélorussie", a: "Minsk" },
    { q: "Birmanie", a: "Naypyidaw" },
    { q: "Bolivie", a: "Sucre" },
    { q: "Bosnie-Herzégovine", a: "Sarajevo" },
    { q: "Botswana", a: "Gaborone" },
    { q: "Brésil", a: "Brasilia" },
    { q: "Brunei", a: "Bandar Seri Begawan" },
    { q: "Bulgarie", a: "Sofia" },
    { q: "Burkina Faso", a: "Ouagadougou" },
    { q: "Burundi", a: "Gitega" },
    { q: "Cambodge", a: "Phnom Penh" },
    { q: "Cameroun", a: "Yaoundé" },
    { q: "Canada", a: "Ottawa" },
    { q: "Cap-Vert", a: "Praia" },
    { q: "Centrafrique", a: "Bangui" },
    { q: "Chili", a: "Santiago" },
    { q: "Chine", a: "Pékin" },
    { q: "Chypre", a: "Nicosie" },
    { q: "Colombie", a: "Bogota" },
    { q: "Comores", a: "Moroni" },
    { q: "Congo (Brazzaville)", a: "Brazzaville" },
    { q: "Congo (Kinshasa)", a: "Kinshasa" },
    { q: "Corée du Nord", a: "Pyongyang" },
    { q: "Corée du Sud", a: "Séoul" },
    { q: "Costa Rica", a: "San José" },
    { q: "Côte d'Ivoire", a: "Yamoussoukro" },
    { q: "Croatie", a: "Zagreb" },
    { q: "Cuba", a: "La Havane" },
    { q: "Danemark", a: "Copenhague" },
    { q: "Djibouti", a: "Djibouti" },
    { q: "Dominique", a: "Roseau" },
    { q: "Égypte", a: "Le Caire" },
    { q: "Émirats arabes unis", a: "Abou Dabi" },
    { q: "Équateur", a: "Quito" },
    { q: "Érythrée", a: "Asmara" },
    { q: "Espagne", a: "Madrid" },
    { q: "Estonie", a: "Tallinn" },
    { q: "États-Unis", a: "Washington" },
    { q: "Éthiopie", a: "Addis-Abeba" },
    { q: "Fidji", a: "Suva" },
    { q: "Finlande", a: "Helsinki" },
    { q: "France", a: "Paris" },
    { q: "Gabon", a: "Libreville" },
    { q: "Gambie", a: "Banjul" },
    { q: "Géorgie", a: "Tbilissi" },
    { q: "Ghana", a: "Accra" },
    { q: "Grèce", a: "Athènes" },
    { q: "Grenade", a: "Saint-Georges" },
    { q: "Guatemala", a: "Guatemala" },
    { q: "Guinée", a: "Conakry" },
    { q: "Guinée-Bissau", a: "Bissau" },
    { q: "Guinée équatoriale", a: "Malabo" },
    { q: "Guyana", a: "Georgetown" },
    { q: "Haïti", a: "Port-au-Prince" },
    { q: "Honduras", a: "Tegucigalpa" },
    { q: "Hongrie", a: "Budapest" },
    { q: "Inde", a: "New Delhi" },
    { q: "Indonésie", a: "Jakarta" },
    { q: "Irak", a: "Bagdad" },
    { q: "Iran", a: "Téhéran" },
    { q: "Irlande", a: "Dublin" },
    { q: "Islande", a: "Reykjavik" },
    { q: "Israël", a: "Jérusalem" },
    { q: "Italie", a: "Rome" },
    { q: "Jamaïque", a: "Kingston" },
    { q: "Japon", a: "Tokyo" },
    { q: "Jordanie", a: "Amman" },
    { q: "Kazakhstan", a: "Astana" },
    { q: "Kenya", a: "Nairobi" },
    { q: "Kirghizistan", a: "Bichkek" },
    { q: "Kiribati", a: "Tarawa-Sud" },
    { q: "Koweït", a: "Koweït" },
    { q: "Laos", a: "Vientiane" },
    { q: "Lesotho", a: "Maseru" },
    { q: "Lettonie", a: "Riga" },
    { q: "Liban", a: "Beyrouth" },
    { q: "Liberia", a: "Monrovia" },
    { q: "Libye", a: "Tripoli" },
    { q: "Liechtenstein", a: "Vaduz" },
    { q: "Lituanie", a: "Vilnius" },
    { q: "Luxembourg", a: "Luxembourg" },
    { q: "Macédoine du Nord", a: "Skopje" },
    { q: "Madagascar", a: "Antananarivo" },
    { q: "Malaisie", a: "Kuala Lumpur" },
    { q: "Malawi", a: "Lilongwe" },
    { q: "Maldives", a: "Malé" },
    { q: "Mali", a: "Bamako" },
    { q: "Malte", a: "La Valette" },
    { q: "Maroc", a: "Rabat" },
    { q: "Marshall", a: "Majuro" },
    { q: "Maurice", a: "Port-Louis" },
    { q: "Mauritanie", a: "Nouakchott" },
    { q: "Mexique", a: "Mexico" },
    { q: "Micronésie", a: "Palikir" },
    { q: "Moldavie", a: "Chisinau" },
    { q: "Monaco", a: "Monaco" },
    { q: "Mongolie", a: "Oulan-Bator" },
    { q: "Monténégro", a: "Podgorica" },
    { q: "Mozambique", a: "Maputo" },
    { q: "Namibie", a: "Windhoek" },
    { q: "Nauru", a: "Yaren" },
    { q: "Népal", a: "Katmandou" },
    { q: "Nicaragua", a: "Managua" },
    { q: "Niger", a: "Niamey" },
    { q: "Nigeria", a: "Abuja" },
    { q: "Norvège", a: "Oslo" },
    { q: "Nouvelle-Zélande", a: "Wellington" },
    { q: "Oman", a: "Mascate" },
    { q: "Ouganda", a: "Kampala" },
    { q: "Ouzbékistan", a: "Tachkent" },
    { q: "Pakistan", a: "Islamabad" },
    { q: "Palaos", a: "Ngerulmud" },
    { q: "Palestine", a: "Ramallah" },
    { q: "Panama", a: "Panama" },
    { q: "Papouasie-Nouvelle-Guinée", a: "Port Moresby" },
    { q: "Paraguay", a: "Asuncion" },
    { q: "Pays-Bas", a: "Amsterdam" },
    { q: "Pérou", a: "Lima" },
    { q: "Philippines", a: "Manille" },
    { q: "Pologne", a: "Varsovie" },
    { q: "Portugal", a: "Lisbonne" },
    { q: "Qatar", a: "Doha" },
    { q: "République dominicaine", a: "Saint-Domingue" },
    { q: "République tchèque", a: "Prague" },
    { q: "Roumanie", a: "Bucarest" },
    { q: "Royaume-Uni", a: "Londres" },
    { q: "Russie", a: "Moscou" },
    { q: "Rwanda", a: "Kigali" },
    { q: "Saint-Christophe-et-Niévès", a: "Basseterre" },
    { q: "Sainte-Lucie", a: "Castries" },
    { q: "Saint-Marin", a: "Saint-Marin" },
    { q: "Saint-Vincent-et-les-Grenadines", a: "Kingstown" },
    { q: "Salomon", a: "Honiara" },
    { q: "Salvador", a: "San Salvador" },
    { q: "Samoa", a: "Apia" },
    { q: "Sao Tomé-et-Principe", a: "Sao Tomé" },
    { q: "Sénégal", a: "Dakar" },
    { q: "Serbie", a: "Belgrade" },
    { q: "Seychelles", a: "Victoria" },
    { q: "Sierra Leone", a: "Freetown" },
    { q: "Singapour", a: "Singapour" },
    { q: "Slovaquie", a: "Bratislava" },
    { q: "Slovénie", a: "Ljubljana" },
    { q: "Somalie", a: "Mogadiscio" },
    { q: "Soudan", a: "Khartoum" },
    { q: "Soudan du Sud", a: "Djouba" },
    { q: "Sri Lanka", a: "Sri Jayawardenapura Kotte" },
    { q: "Suède", a: "Stockholm" },
    { q: "Suisse", a: "Berne" },
    { q: "Suriname", a: "Paramaribo" },
    { q: "Syrie", a: "Damas" },
    { q: "Tadjikistan", a: "Douchanbé" },
    { q: "Tanzanie", a: "Dodoma" },
    { q: "Tchad", a: "N'Djaména" },
    { q: "Thaïlande", a: "Bangkok" },
    { q: "Timor oriental", a: "Dili" },
    { q: "Togo", a: "Lomé" },
    { q: "Tonga", a: "Nuku'alofa" },
    { q: "Trinité-et-Tobago", a: "Port-d'Espagne" },
    { q: "Tunisie", a: "Tunis" },
    { q: "Turkménistan", a: "Achgabat" },
    { q: "Turquie", a: "Ankara" },
    { q: "Tuvalu", a: "Funafuti" },
    { q: "Ukraine", a: "Kiev" },
    { q: "Uruguay", a: "Montevideo" },
    { q: "Vanuatu", a: "Port-Vila" },
    { q: "Vatican", a: "Vatican" },
    { q: "Venezuela", a: "Caracas" },
    { q: "Viêt Nam", a: "Hanoï" },
    { q: "Yémen", a: "Sanaa" },
    { q: "Zambie", a: "Lusaka" },
    { q: "Zimbabwe", a: "Harare" }
];

function loadSampleData() {
    // Generate quiz questions dynamically from pairs to get "Shuffle Mode" with random distractors
    const questions = generateQuizFromSimpleData(SAMPLE_PAIRS);
    validateAndStart(questions);
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    let questions = [];

    // Detect Format
    // 1. Full Format: Question, Opt1, Opt2, Opt3, Opt4, Answer
    // 2. Simple Format: Question, Answer (Dynamic distractor generation)

    // Naive detection: check comma count of valid line
    // Filter empty lines first
    const validLines = lines.filter(l => l.trim().length > 0);
    if (validLines.length === 0) return [];

    const firstLineCols = validLines[0].split(',').length;

    if (firstLineCols === 2) {
        // Simple Format Mode (e.g., Country, Capital)
        const contentPairs = [];
        validLines.forEach(line => {
            const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length === 2) {
                contentPairs.push({ q: cols[0], a: cols[1] }); // q=Country, a=City
            }
        });
        return generateQuizFromSimpleData(contentPairs);
    } else {
        // Full Format Mode
        let startIndex = 0;
        const firstLineLower = validLines[0].toLowerCase();
        if (firstLineLower.includes('question') && firstLineLower.includes('answer')) {
            startIndex = 1;
        }

        for (let i = startIndex; i < validLines.length; i++) {
            const cols = validLines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length >= 6) {
                questions.push({
                    question: cols[0],
                    options: [cols[1], cols[2], cols[3], cols[4]],
                    answer: parseInt(cols[5])
                });
            }
        }
        return questions;
    }
}

function generateQuizFromSimpleData(pairs) {
    // pairs = [{q: "Canada", a: "Ottawa"}, ...]
    // Goal: Transform into [{question: "Quelle est la capitale de Canada ?", options: [...], answer: index}]
    // Note: We need a pool of answers for distractors.

    const allAnswers = pairs.map(p => p.a); // Pool of potential answers (distractors)
    const generatedQuestions = [];

    pairs.forEach(pair => {
        // Select 3 random distractors from other answers
        const otherAnswers = allAnswers.filter(ans => ans !== pair.a);
        const distractors = shuffleArray(otherAnswers).slice(0, 3);

        // Combine with correct answer
        let options = [...distractors, pair.a];
        options = shuffleArray(options); // Shuffle position

        const correctIndex = options.indexOf(pair.a);

        generatedQuestions.push({
            question: `Quelle est la capitale de ${pair.q} ?`, // Customize prefix if needed, or just show Key
            options: options,
            answer: correctIndex
        });
    });

    return generatedQuestions;
}

// Fisher-Yates Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function validateAndStart(data) {
    if (!Array.isArray(data) || data.length === 0) {
        alert("Aucune question trouvée.");
        return;
    }
    // Basic validation
    if (!data[0].hasOwnProperty('question') || !data[0].hasOwnProperty('options')) {
        alert("Format des données incorrect.");
        return;
    }

    allQuestions = data;
    startQuiz();
}

function startQuiz() {
    // SHUFFLE QUESTIONS ON START
    currentQuestions = shuffleArray([...allQuestions]);

    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    showSection(quizSection);
    renderQuestion();
}

function restartQuiz() {
    startQuiz();
}

function renderQuestion() {
    isAnswered = false;
    const q = currentQuestions[currentQuestionIndex];

    // Update UI
    questionText.textContent = q.question;
    questionCount.textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;

    // Progress Bar (Relative to Checkpoint of 10)
    // Shows progress towards the next "Pause Café" (or end of quiz)
    // 1 question = 10%, 10 questions = 100%
    const progressInBlock = (currentQuestionIndex % 10) + 1;
    const percent = progressInBlock * 10;
    progressFill.style.width = `${percent}%`;

    // Clear and fill choices
    choicesContainer.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(index, btn);
        choicesContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex, btnElement) {
    if (isAnswered) return;
    isAnswered = true;

    const currentQ = currentQuestions[currentQuestionIndex];
    const correctIndex = currentQ.answer;

    // Visual Feedback
    const allBtns = choicesContainer.querySelectorAll('.choice-btn');

    if (selectedIndex === correctIndex) {
        btnElement.classList.add('correct');
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        btnElement.classList.add('wrong');
        // Highlight correct answer
        allBtns[correctIndex].classList.add('correct');
    }

    // Next Question Delay
    setTimeout(() => {
        currentQuestionIndex++;

        // CHECKPOINT LOGIC: Every 10 questions (but not at the very end)
        if (currentQuestionIndex > 0 && currentQuestionIndex % 10 === 0 && currentQuestionIndex < currentQuestions.length) {
            showCheckpoint();
        } else if (currentQuestionIndex < currentQuestions.length) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

function showCheckpoint() {
    checkpointScore.textContent = `${score}/${currentQuestionIndex}`;
    showSection(checkpointSection);
}

function endQuiz() {
    // Update Progress to 100%
    progressFill.style.width = '100%';

    finalScore.textContent = `${score}/${currentQuestionIndex}`; // Show actual attempts count

    // Feedback Message
    const percentage = (score / currentQuestionIndex) * 100 || 0;
    if (percentage === 100) feedbackMsg.textContent = "Parfait ! Tu es un génie ! 🏆";
    else if (percentage >= 80) feedbackMsg.textContent = "Excellent travail ! 👏";
    else if (percentage >= 50) feedbackMsg.textContent = "Bien joué ! Encore un petit effort. 💪";
    else feedbackMsg.textContent = "Ne lâche rien, réessaie ! 📚";

    showSection(resultSection);
}
