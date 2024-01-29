// Variáveis relacionadas ao DOM
const playerModal = document.getElementById('playerModal');
const playerNameInput = document.getElementById('playerName');
const submitNameButton = document.getElementById('submitName');
const startRaceButton = document.getElementById('startRace');
const resetButton = document.getElementById('resetbtn');
const topTimes = JSON.parse(localStorage.getItem('playerTimes')) || [];
const minutesEl = document.querySelector('#minutes');
const secondsEl = document.querySelector('#seconds');
const millesecondsEl = document.querySelector('#milleseconds');
const resetbtn = document.querySelector('#resetbtn');

// Função para envio do nome
function submitName() {
  const playerName = playerNameInput.value.trim();

  if (playerName !== '') {
    localStorage.setItem('playerName', playerName);
    playerNameInput.disabled = true;

    const playerModal = document.getElementById('playerModal');

    if (playerModal) {
      playerModal.style.display = 'none';
    }
  }
}

// Função para iniciar o modal
function startGameModal() {
  console.log('Exibindo modal');
  playerModal.style.display = 'block';

  submitNameButton.addEventListener('click', () => {
    submitName();
    startGame();
  });

  startRaceButton.addEventListener('click', () => {
    playerModal.style.display = 'none';
    startGame();
  });
}

// Funções relacionadas ao jogo
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const start = document.querySelector('.start');
const gameOver = document.querySelector('.game-over');
const audioStart = new Audio('./audio_audio_theme.mp3');
const audioGameOver = new Audio('./audio_audio_gameover.mp3');

function startGame() {
  pipe.classList.add('pipe-animation');
  start.style.display = 'none';
  audioStart.play();
  loop();
  startTimer();
  console.log('Cronômetro iniciado');
}

function restartGame() {
  gameOver.style.display = 'none';
  pipe.style.left = '';
  pipe.style.right = '0';
  mario.src = './img/mario.gif';
  mario.style.width = '150px';
  mario.style.bottom = '0';
  start.style.display = 'none';
  audioGameOver.pause();
  audioGameOver.currentTime = 0;
  audioStart.play();
  audioStart.currentTime = 0;
  pipe.classList.remove('pipe-animation');
  setTimeout(() => {
    pipe.classList.add('pipe-animation');
  }, 10);
  loop();
}

function jump() {
  mario.classList.add('jump');
  setTimeout(() => {
    mario.classList.remove('jump');
  }, 800);
}

function loop() {
  const intervalId = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseInt(window.getComputedStyle(mario).bottom);

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      pipe.classList.remove('pipe-animation');
      pipe.style.left = `${pipePosition}px`;
      mario.classList.remove('jump');
      mario.style.bottom = `${marioPosition}px`;
      mario.src = './img/mario-game-over.png';
      mario.style.width = '80px';
      mario.style.marginLeft = '50px';

      function stopAudioStart() {
        audioStart.pause();
      }
      stopAudioStart();

      audioGameOver.play();

      function stopAudio() {
        audioGameOver.pause();
      }
      setTimeout(stopAudio, 7000);

      gameOver.style.display = 'flex';

      clearInterval(intervalId);
      pauseTime();
    }
  }, 10);
}

// Adicionando ouvinte de evento de clique para o botão de início do jogo
start.addEventListener('click', startGame);

document.addEventListener('keypress', (e) => {
  const tecla = e.key;
  if (tecla === ' ' || tecla === 'Enter') {
    startGame();
  }
});

document.addEventListener('keypress', (e) => {
  const tecla = e.key;
  if (tecla === ' ') {
    jump();
  }
});

document.addEventListener('touchstart', (e) => {
  if (e.touches.length) {
    jump();
  }
});

document.addEventListener('keypress', (e) => {
  const tecla = e.key;
  if (tecla === 'Enter') {
    startGame();
  }
});

let interval;
let minutes = 0;
let seconds = 0;
let milleseconds = 0;
let isPaused = false;
let pauseStartTime;

resetbtn.addEventListener('click', resetGame);

function startTimer() {
  let startTime;
  let lastUpdateTime;

  function update() {
    if (!isPaused) {
      const currentTime = new Date().getTime();

      if (!startTime) {
        startTime = currentTime;
      }

      if (!lastUpdateTime) {
        lastUpdateTime = currentTime;
      }

      const deltaTime = currentTime - lastUpdateTime;

      if (pauseStartTime) {
      
        const pauseDuration = currentTime - pauseStartTime;
        pauseStartTime = null;
        startTime += pauseDuration;
      }

      milleseconds += deltaTime;

      if (milleseconds >= 1000) {
        seconds += Math.floor(milleseconds / 1000);
        milleseconds %= 1000;
      }

      if (seconds >= 60) {
        minutes += Math.floor(seconds / 60);
        seconds %= 60;
      }

      lastUpdateTime = currentTime;

      minutesEl.textContent = formatTime(minutes);
      secondsEl.textContent = formatTime(seconds);
      millesecondsEl.textContent = formatMilleseconds(milleseconds);

      requestAnimationFrame(update);
    }
  }

  update();
}

function resumeTime() {
  isPaused = false;
  pauseStartTime = null;
}

function pauseTime() {
  isPaused = true;
  pauseStartTime = new Date().getTime();
}


function resetGame() {
  restartGame();
  resetTime();
}

function resetTime() {
  clearInterval(interval);
  minutes = 0;
  seconds = 0;
  milleseconds = 0;

  minutesEl.textContent = '00';
  secondsEl.textContent = '00';
  millesecondsEl.textContent = '000';

  start.style.display = 'block';
  restartGame();
  isPaused = false;
}

function pauseTime() {
  isPaused = true;
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

function formatMilleseconds(time) {
  return time < 100 ? `${time}`.padStart(3, '0') : time;
}
