const startMin = $('#startMinutes'),
      startSec = $('#startSeconds'),
      applyBtn = $('#applyBtn'),
      warningInput = $('#warningThreshold'),
      incrementInput = $('#incrementSeconds'),
      players = {1: $('#player1'), 2: $('#player2')},
      times = {1:0,2:0},
      display = {1: $('#time1'), 2: $('#time2')},
      pauseBtn = $('#pauseBtn'), resetBtn = $('#resetBtn'),
      toggleFontBtn = $('#toggleFontBtn'),
      beep = $('#beep-sound')[0];

let startTime = 600, currentPlayer = null, timerId = null,
    isPaused = false, incrementSec = 0, warningSec = 10;

// 初始化下拉選單
for(let i=0;i<=60;i++){
  startMin.append(new Option(i,i));
  if(i<60) startSec.append(new Option(i,i));
}
startMin.val(10);

// 事件綁定
applyBtn.on('click', applySettings);
players[1].add(players[2]).on('click', function(){
  switchPlayer(this.id.slice(-1));
});
pauseBtn.on('click', togglePause);
resetBtn.on('click', resetTimers);
toggleFontBtn.on('click', ()=> $('body').toggleClass('big-font'));
$(document).on('keydown', handleKey);

// 手機觸控：左右半屏切換玩家
document.body.addEventListener('touchstart', e => {
  const x = e.touches[0].clientX;
  const w = window.innerWidth;
  const target = x < w/2 ? 1 : 2;
  switchPlayer(target);
});
// 雙擊暫停／繼續
document.body.addEventListener('dblclick', togglePause);
// 長按一秒重設
let pressTimer;
document.body.addEventListener('touchstart', () => {
  pressTimer = setTimeout(resetTimers, 1000);
});
document.body.addEventListener('touchend', () => {
  clearTimeout(pressTimer);
});

// 核心函式
function formatTime(sec){
  const m=Math.floor(sec/60), s=sec%60;
  return `${m}:${String(s).padStart(2,'0')}`;
}
function updateDisplay(){
  [1,2].forEach(i=>{
    display[i].text(formatTime(times[i]));
    players[i].toggleClass('active', currentPlayer==i);
    display[i].toggleClass('red', times[i]<=warningSec);
    if(times[i]===warningSec) beep.play();
  });
}
function tick(){
  if(isPaused||!currentPlayer) return;
  times[currentPlayer]--;
  if(times[currentPlayer]<0){ clearInterval(timerId); return; }
  updateDisplay();
}
function switchPlayer(p){
  if(isPaused) return;
  clearInterval(timerId);
  // 永遠加時
  if(currentPlayer) {
    times[currentPlayer]+=incrementSec;
  }
  currentPlayer = Number(p);
  updateDisplay();
  timerId = setInterval(tick,1000);
}
function applySettings(){
  const m=+startMin.val(), s=+startSec.val();
  startTime = m*60+s;
  incrementSec = +incrementInput.val();
  warningSec = +warningInput.val();
  localStorage.setItem('chessClockSettings', JSON.stringify({m,s,incrementSec,warningSec}));
  resetTimers();
}
function resetTimers(){
  clearInterval(timerId);
  times[1]=times[2]=startTime;
  currentPlayer=null; isPaused=false;
  pauseBtn.text('暫停');
  updateDisplay();
}
function togglePause(){
  isPaused = !isPaused;
  pauseBtn.text(isPaused?'繼續':'暫停');
}
function handleKey(e){
  switch(e.code){
    case 'Space': e.preventDefault(); switchPlayer(currentPlayer===1?2:1); break;
    case 'KeyP': togglePause(); break;
    case 'KeyR': resetTimers(); break;
  }
}

// 載入快取設定
$(function(){
  const saved = JSON.parse(localStorage.getItem('chessClockSettings')||'{}');
  if(saved.m!=null){
    startMin.val(saved.m);
    startSec.val(saved.s);
    incrementInput.val(saved.incrementSec);
    warningInput.val(saved.warningSec);
  }
  applySettings();
});
