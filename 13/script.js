
let startTime = 600;
let time1 = startTime;
let time2 = startTime;
let currentPlayer = null;
let timerInterval = null;
let isPaused = false;
let incrementPerMove = 0;
let warningThreshold = 10;

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
}

function updateDisplay() {
  const time1Elem = document.getElementById('time1');
  const time2Elem = document.getElementById('time2');

  time1Elem.innerText = formatTime(time1);
  time2Elem.innerText = formatTime(time2);

  time1Elem.classList.toggle("red", time1 <= warningThreshold);
  time2Elem.classList.toggle("red", time2 <= warningThreshold);
}

function switchPlayer(player) {
  if (isPaused) return;

  clearInterval(timerInterval);

  if (currentPlayer && document.querySelector('input[name="mode"]:checked').value === 'advanced') {
    if (currentPlayer === 1) time1 += incrementPerMove;
    else time2 += incrementPerMove;
  }

  document.getElementById("player1").classList.remove("active");
  document.getElementById("player2").classList.remove("active");

  if (player === 1) {
    document.getElementById("player1").classList.add("active");
  } else {
    document.getElementById("player2").classList.add("active");
  }

  currentPlayer = player;

  timerInterval = setInterval(() => {
    if (currentPlayer === 1) {
      time1--;
      if (time1 <= 0) clearInterval(timerInterval);
    } else {
      time2--;
      if (time2 <= 0) clearInterval(timerInterval);
    }
    updateDisplay();
  }, 1000);
}

function resetTimers() {
  clearInterval(timerInterval);
  time1 = startTime;
  time2 = startTime;
  currentPlayer = null;
  isPaused = false;
  document.getElementById("pauseBtn").innerText = "暫停";
  document.getElementById("player1").classList.remove("active");
  document.getElementById("player2").classList.remove("active");
  updateDisplay();
}

function applyStartTime() {
  const minutes = parseInt(document.getElementById("startMinutes").value);
  const seconds = parseInt(document.getElementById("startSeconds").value);
  const increment = parseInt(document.getElementById("incrementSeconds").value || "0");
  const warning = parseInt(document.getElementById("warningThreshold").value || "10");

  startTime = (minutes * 60) + seconds;
  incrementPerMove = increment;
  warningThreshold = warning;
  resetTimers();
}

function togglePause() {
  const pauseBtn = document.getElementById("pauseBtn");

  if (!isPaused) {
    clearInterval(timerInterval);
    isPaused = true;
    pauseBtn.innerText = "繼續";
  } else {
    isPaused = false;
    pauseBtn.innerText = "暫停";
    if (currentPlayer) switchPlayer(currentPlayer);
  }
}

function setMode(mode) {
  const adv = document.getElementById("advanced-settings");
  adv.style.display = (mode === "advanced") ? "block" : "none";
}

updateDisplay();
