
let voiceAwakened = false;

function unlockSpeech() {
  if (!voiceAwakened && window.speechSynthesis) {
    const test = new SpeechSynthesisUtterance("語音已啟用");
    test.lang = "zh-TW";
    window.speechSynthesis.speak(test);
    voiceAwakened = true;
  }
}


let startTime = 600;
let time1 = startTime;
let time2 = startTime;
let currentPlayer = null;
let timerInterval = null;
let isPaused = false;
let incrementPerMove = 0;

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

  time1Elem.classList.toggle("red", time1 <= 10);
  time2Elem.classList.toggle("red", time2 <= 10);
}

function switchPlayer(player) {
  unlockSpeech();
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

  startTime = (minutes * 60) + seconds;
  incrementPerMove = increment;
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


const beepSound = new Audio("beep.mp3");

function playBeep() {
  beepSound.currentTime = 0;
  beepSound.play();
}

let lastAnnounced = null;

function speak(text) {
  if (!window.speechSynthesis) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "zh-TW";
  window.speechSynthesis.speak(msg);
}

// 修改 updateDisplay 加上語音與嗶聲警告
const originalUpdateDisplay = updateDisplay;
updateDisplay = function () {
  originalUpdateDisplay();

  // 每秒嗶：剩下 5 秒內
  if (currentPlayer === 1 && time1 > 0 && time1 <= 5) playBeep();
  if (currentPlayer === 2 && time2 > 0 && time2 <= 5) playBeep();

  // 語音倒數：剩 10 秒內開始唸數字
  let remaining = (currentPlayer === 1) ? time1 : time2;
  if (remaining <= 10 && remaining > 0 && lastAnnounced !== remaining) {
    speak(remaining.toString());
    lastAnnounced = remaining;
  }
};

// 修改 switchPlayer 時清空語音提示狀態並播放嗶聲
const originalSwitchPlayer = switchPlayer;
switchPlayer = function (player) {
  lastAnnounced = null;
  playBeep();
  originalSwitchPlayer(player);
};


function getVoiceEnabled() {
  return document.getElementById("enableVoice").checked;
}

function getVoiceThreshold() {
  return parseInt(document.getElementById("voiceThreshold").value) || 10;
}

function getAlertThreshold() {
  return parseInt(document.getElementById("alertThreshold").value) || 5;
}

// 覆蓋 updateDisplay，根據設定的秒數控制
updateDisplay = function () {
  const time1Elem = document.getElementById('time1');
  const time2Elem = document.getElementById('time2');

  time1Elem.innerText = formatTime(time1);
  time2Elem.innerText = formatTime(time2);

  const alertThreshold = getAlertThreshold();

  time1Elem.classList.toggle("red", time1 <= alertThreshold);
  time2Elem.classList.toggle("red", time2 <= alertThreshold);

  if (currentPlayer === 1 && time1 > 0 && time1 <= alertThreshold) playBeep();
  if (currentPlayer === 2 && time2 > 0 && time2 <= alertThreshold) playBeep();

  const voiceThreshold = getVoiceThreshold();
  let remaining = (currentPlayer === 1) ? time1 : time2;
  if (
    getVoiceEnabled() &&
    remaining <= voiceThreshold &&
    remaining > 0 &&
    lastAnnounced !== remaining
  ) {
    speak(remaining.toString());
    lastAnnounced = remaining;
  }
}

// 同步語音選項顯示切換
const originalSetMode = setMode;
setMode = function (mode) {
  originalSetMode(mode);
  document.getElementById("voice-settings").style.display = (mode === "advanced") ? "block" : "none";
}
