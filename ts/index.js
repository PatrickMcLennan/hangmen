"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const GUESS_COUNT = 6;
const prompter = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function checkAnswer(letters, guesses) {
    return {
        won: guesses.correct.length === letters.filter((letter, i, lettersArray) => lettersArray.indexOf(letter) === i).length,
        lost: guesses.incorrect.length === GUESS_COUNT
    };
}
function getWord() {
    return new Promise((res) => fs_1.default.readFile(path_1.default.resolve(__dirname, `../words.txt`), `utf8`, (err, data) => {
        if (err) {
            console.error(`There was an issue getting your word.`);
            return process.exit(1);
        }
        const wordsArray = data.split(`\n`);
        return res(wordsArray[Math.floor(wordsArray.length * Math.random())]);
    }));
}
function prompt(question) {
    return new Promise((res) => prompter.question(question, guess => res(guess.split(``)[0])));
}
function playRound(letters, guesses, guess) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield guess;
        letters.includes(result)
            ? guesses.correct.push(result)
            : guesses.incorrect.push(result);
        const { won, lost } = checkAnswer(letters, guesses);
        if (won || lost) {
            const word = letters.join(``);
            console.log(won
                ? `\nCongrats, you win!  The word was ${word}\n`
                : `\nYou've lost.  Your word was ${word}\n`);
            return process.exit(0);
        }
        return playRound(letters, guesses, prompt(nextQuestion(letters, guesses, letters.includes(result))));
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const word = yield getWord();
        const letters = word.split(``);
        const guesses = {
            correct: [],
            incorrect: []
        };
        return playRound(letters, guesses, prompt(intro(letters)));
    });
}
function intro(letters) {
    return `
    Welcome to hangman!\n
    ${letters.map(_ => `__ `)}\n
    Please guess a letter between A-Z\n
  `;
}
;
function nextQuestion(letters, { correct, incorrect }, correctGuess) {
    return `
    ${correctGuess ? `Correct!` : `Incorrect!`}!
    ${GUESS_COUNT - incorrect.length} / ${GUESS_COUNT} Body Limbs left
    ${letters.map(letter => correct.includes(letter) ? letter : `__ `)}\n
    Please guess a letter between A-Z\n
  `;
}
main();
