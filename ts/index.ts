import readline from 'readline';
import fs from 'fs';
import path from 'path';

/**
 * Set up
 */

const GUESS_COUNT = 6; 

type Guesses = {
  correct: string[],
  incorrect: string[]
}

const prompter = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * Prompts + functionality
 */

function checkAnswer(letters: string[], guesses: Guesses): { won: boolean, lost: boolean } {
  return {
    won: guesses.correct.length === letters.length,
    lost: guesses.incorrect.length === GUESS_COUNT
  }
}

function getWord(): Promise<string> {
  return new Promise((res, rej) => 
    fs.readFile(path.resolve(__dirname, `../words.txt`), `utf8`, (err, data) => {
      if (err) return rej(err);
      const wordsArray = data.split(`\n`);
      return res(wordsArray[Math.floor(wordsArray.length * Math.random())])
    })
  )
}

function prompt(question: string): Promise<string> {
  return new Promise((res) => 
    prompter.question(question, guess => res(guess.split(``)[0]))
  )
}

async function nextRound(letters: string[], guesses: Guesses, guess: Promise<string>): Promise<void> {
  const result = await guess();
  letters.includes(result) 
    ? guesses.correct.push(result) 
    : guesses.incorrect.push(result);
  const { won, lost } = checkAnswer(letters, guesses);
  if (won) return console.log(`you've won!`);
  if (lost) return console.log(`you've lost!`);

  return nextRound(letters, guesses, prompt(nextQuestion(letters, guesses, letters.includes(result))))
}

async function main() {
  const word = await getWord();
  const letters = word.split(``);
  const guesses: Guesses = {
    correct: [],
    incorrect: []
  }
  const firstGuess = await prompt(intro(letters));
  return nextRound(letters, guesses, prompt(nextQuestion(letters, guesses, letters.includes(firstGuess))))
}

/**
 * Copy
 */

function intro(letters: string[]): string { 
  return `
    Welcome to hangman!\n
    ${letters.map(_ => `__ `)}\n
    Please guess a letter between A-Z\n
  `
};

function nextQuestion(letters: string[], { correct, incorrect }: Guesses, correctGuess: boolean): string {
  return `
    ${correctGuess ? `Correct!` : `Incorrect!`}!
    ${GUESS_COUNT - incorrect.length} / ${GUESS_COUNT} Body Limbs left
    ${letters.map(letter => correct.includes(letter) ? letter : `__ `)}\n
    Please guess a letter between A-Z\n
  `
}


/**
 * Let 'er rip
 */

 main();