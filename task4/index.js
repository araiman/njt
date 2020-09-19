window.onload = () => {
    renderer.startButton.addEventListener('click', controller.fetchQuestions);
}

const controller = {
    fetchQuestions: async () => {
        try {
            renderer.renderLoading();

            await quizManager.fetch();

            renderer.renderQuiz();
        } catch (e) {
            console.log(e);
            alert('クイズの取得に失敗しました。再度、開始ボタンを押してみてください。');
        }
    },
    turnPage: e => {
        quizManager.judgeAnswer(e.target.value);

        if (quizManager.isLastQuiz()) {
            renderer.renderFinalResult();
            quizManager.reset();
            return;
        }

        renderer.renderQuiz();
    },
}

const quizManager = {
    quizzes: [],
    correctCount: 0,
    currentQuizIndex: 0,
    endOfQuizzes: 10,
    judgeAnswer: (answer) => {
        if (answer === quizManager.currentQuiz().correctAnswer) {
            quizManager.correctCount++;
        }

        quizManager.currentQuizIndex++;
    },
    currentQuiz: () => {
        return quizManager.quizzes[quizManager.currentQuizIndex];
    },
    isLastQuiz: () => {
        return quizManager.currentQuizIndex === quizManager.endOfQuizzes;
    },
    fetch: async () => {
        const result = (await (await fetch('https://opentdb.com/api.php?amount=10&type=multiple')).json()).results;
        quizManager.quizzes = result.map(item => new Quiz(
            item.category,
            item.difficulty,
            item.question,
            item.correct_answer,
            item.incorrect_answers));
    },
    reset: () => {
        quizManager.quizzes = [];
        quizManager.correctCount = 0;
        quizManager.currentQuizIndex = 0;
    },
}

const renderer = {
    headerTitle: document.querySelector('.header-title'),
    headerSupplement: document.querySelector('.header-supplement'),
    description: document.querySelector('.description-contents'),
    contents: document.querySelector('.contents'),
    startButton: document.querySelector('.start-button'),
    renderQuiz: () => {
        const quiz = quizManager.quizzes[quizManager.currentQuizIndex];

        const title = `問題${quizManager.currentQuizIndex + 1}`

        const genre = renderer.generateTag('h2', `[ジャンル] ${quiz.category}`);
        const difficulty = renderer.generateTag('h2', `[難易度] ${quiz.difficulty}`);

        const optionButtons = quiz.options.map(option => renderer.generateButton(option, controller.turnPage));

        renderer.reRender(title, quiz.question, [genre, difficulty], optionButtons);
    },
    renderFinalResult: () => {
        const title = `あなたの正答数は${quizManager.correctCount}です！`;
        const description = '再度チャレンジしたい場合は以下をクリック！！'

        const homeButton = renderer.generateButton('ホームに戻る', renderer.renderTop);

        renderer.reRender(title, description, [], [homeButton]);
    },
    renderTop: () => {
        const title = `ようこそ`;
        const description = '以下のボタンをクリック';

        const startButton = renderer.generateButton('開始', controller.fetchQuestions);

        renderer.reRender(title, description, [], [startButton]);
    },
    renderLoading: () => {
        const title = '取得中';
        const description = '少々お待ちください';

        renderer.reRender(title, description);
    },
    reRender: (title, description, headerSupplementItems = [], contentsItems = []) => {
        renderer.headerTitle.textContent = title;
        renderer.description.textContent = description;

        renderer.headerSupplement.innerHTML = '';
        headerSupplementItems.forEach(item => {
            renderer.headerSupplement.appendChild(item);
        })

        renderer.contents.innerHTML = '';
        contentsItems.forEach(item => {
            renderer.contents.appendChild(item);
        })
    },
    generateTag: (tagName, text) => {
        const element = document.createElement(tagName);
        element.textContent = text;

        return element;
    },
    generateButton: (text, event) => {
        const line = document.createElement('div');
        const button = document.createElement('button');
        button.textContent = text;
        button.value = text;
        button.addEventListener('click', event);
        line.appendChild(button);

        return line;
    },
}

class Quiz {
    constructor(category, difficulty, question, correctAnswer, incorrectAnswers) {
        this._category = category;
        this._difficulty = difficulty;
        this._question = question;
        this._correctAnswer = correctAnswer;
        this._incorrectAnswers = incorrectAnswers;
    }

    get category() {
        return this._category;
    }

    get difficulty() {
        return this._difficulty;
    }

    get question() {
        return this._question;
    }

    get correctAnswer() {
        return this._correctAnswer;
    }

    get options() {
        let answers = this._incorrectAnswers;
        answers.splice(Math.floor(answers.length * Math.random()), 0, this._correctAnswer);

        return answers;
    }
}