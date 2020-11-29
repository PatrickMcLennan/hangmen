type Letters = Vec<char>;
//
//// Guesses
//
const GUESS_COUNT: usize = 6;
struct Guesses {
    correct: Letters,
    incorrect: Letters
}

impl Guesses {
    fn new() -> Guesses {
        Guesses {
            correct: vec![],
            incorrect: vec![]
        }
    } 
}

struct Answers {
    won: bool,
    lost: bool
}

fn check_answer(letters: Letters, guesses: Guesses) -> Answers {
    Answers {
        won: guesses.correct.len() == letters
            .sort_unstable()
            .dedup()
            .len(),
        lost: true,
    }
}

//
//// Messages
//
fn intro(letters: Letters) -> String {
    format!("
        Welcome to hangman!\n
        {:?}\n
        Please guess a letter between A-Z\n
    ", letters.iter().map(|_| String::from("__ ").to_string()))
}

fn nextQuestion(letters: Letters, guesses: Guesses, correct_guess: bool) -> String {
    let results = if correct_guess { "Correct!"} else { "Incorrect!" };
    let remaining_guesses = GUESS_COUNT - guesses.incorrect.len();
    let remaining_letters = letters.iter().map(|letter| 
        if guesses.correct.contains(letter) { letter.to_string() } else { "__ ".to_string() } 
    );
    return format!("
        {}\n
        {} / {} Body Lumbs Left\n
        {:?}\n
        Please guess a letter between A-Z
    ", results, remaining_guesses, GUESS_COUNT, remaining_letters)
}


fn main() {
    println!("Hello, world!");
}
