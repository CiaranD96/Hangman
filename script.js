const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const correctWord = document.getElementById('correct-word');
const figureParts = document.querySelectorAll('.figure-part');

let selectedWord;
const correctLetters = [];
const wrongLetters = [];
let gameOver = false;

// get a random word from a random word generator api
const getWords = async () => {
  const response = await fetch(
    'https://random-word-api.herokuapp.com/word?number=10'
  );
  const resData = await response.json();
  selectedWord = resData[Math.floor(Math.random() * resData.length)];
  displayWord();
};

getWords();

// show hidden word
const displayWord = () => {
  wordEl.innerHTML = `
  ${selectedWord
    .split('')
    .map(
      (letter) =>
        `<span class="letter"> ${correctLetters.includes(letter) ? letter : ''} 
    </span>`
    )
    .join('')}
  `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');

  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulations, You won!';
    popup.style.display = 'flex';
    gameOver = true;
  }
};

// update the wrong letters array
const updateWrongLettersEl = () => {
  // display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;
  // display body parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });
  // check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'Unlucky, you lost!';
    correctWord.innerText = `The correct word was "${selectedWord}"`;
    popup.style.display = 'flex';
    gameOver = true;
  }
};

// show notification
const showNotification = () => {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

// keydown letter press
window.addEventListener('keydown', (e) => {
  if (!gameOver && e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

// restart the game and play again
playAgainBtn.addEventListener('click', () => {
  // empty the correct and wrong letter arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);
  correctWord.innerText = '';
  gameOver = false;
  getWords();
  updateWrongLettersEl();
  popup.style.display = 'none';
});
