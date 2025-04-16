let time1 = 600; // 10 分鐘
let time2 = 600;
let currentPlayer = null;
let timerInterval = null;

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
}

function updateDisplay() {
  document.getElementById('time1').innerText = formatTime(time1);
  document.getElementById('time2').innerText = formatTime(time2);
}

function switchPlayer(player) {
  clearInterval(timerInterval);

  if ((player === 1 && time1 <= 0) || (player === 2 && time2 <= 0)) return;

  currentPlayer = player;
  timerInterval = setInterval(() => {
    if (player === 1) {
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
  time1 = 600;
  time2 = 600;
  currentPlayer = null;
  updateDisplay();
}

updateDisplay();
