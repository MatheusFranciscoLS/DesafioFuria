export function playSend() {
  const audio = new Audio('/sounds/send.mp3');
  audio.volume = 0.22;
  audio.play();
}
export function playReceive() {
  const audio = new Audio('/sounds/receive.mp3');
  audio.volume = 0.20;
  audio.play();
}
