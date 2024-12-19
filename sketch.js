let recognition;
let isEmergencyMode = false; 
const emergencyKeyword = "도와주세요"; 
let listeningMessage, emergencyMessage;

function setup() {
  createCanvas(393, 852);

  // 배경 색상 설정 (그라디언트 효과)
  setGradient(0, 0, width, height, color('#101013'), color('#2b2b2d'), 'y');

  // 상단 타이틀 표시
  displayTitle("긴급 모드");

  // 안내 메시지 요소 생성
  listeningMessage = createP("음성을 듣고 있어요 ...");
  listeningMessage.style('color', 'white');
  listeningMessage.style('font-size', '20px');
  listeningMessage.style('font-weight', '700');
  listeningMessage.style('opacity', '1'); // 초기 투명도 100%
  listeningMessage.position(126, 216);


  emergencyMessage = createP("긴급모드를 활성화할까요?");
  emergencyMessage.style('color', 'white');
  emergencyMessage.style('font-size', '20px');
  emergencyMessage.position(96, 216);
  emergencyMessage.style('font-weight', '700');
  emergencyMessage.style('opacity', '0'); // 초기 투명도 0%

  // 버튼 그리기
  drawButtons();

  // 음성 인식 초기화
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech Recognition is not supported in this browser. Please use Chrome.');
  } else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = false; 
    recognition.lang = 'ko-KR'; 

    recognition.onresult = function (event) {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Recognized Speech:", transcript);
      checkForEmergencyKeyword(transcript);
    };

    recognition.onerror = function (event) {
      console.error("Speech Recognition Error:", event.error);
    };

    recognition.onend = function () {
      console.log("Speech recognition ended. Restarting...");
      recognition.start(); 
    };

    recognition.start();
  }
}

function checkForEmergencyKeyword(transcript) {
  if (transcript.includes(emergencyKeyword)) {
    activateEmergencyMode();
  }
}

function activateEmergencyMode() {
  if (!isEmergencyMode) {
    isEmergencyMode = true;

    listeningMessage.style('transition', 'opacity 0.4s ease-in-out');
    listeningMessage.style('opacity', '0');

    setTimeout(() => {
      emergencyMessage.style('transition', 'opacity 0.4s ease-in-out');
      emergencyMessage.style('opacity', '1');
    }, 200);
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === 'y') {
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  }
}

function displayTitle(title) {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(title, width / 2, 50);

  // 뒤로가기 화살표
  textSize(18);
  textAlign(LEFT, CENTER);
  text("<", 20, 50);
}

function drawButtons() {
  // 버튼 스타일 설정
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);

  // 취소 버튼
  fill('#575760');
  rect(width / 2 - 173, 738, 164, 52, 12);
  fill(255); // 텍스트 색상
  text("취소", 105, 767);
  textSize(18);
  
  // 활성화 버튼
  fill('#FF3B30'); // 빨간색
  rect(width / 2 + 8, 738, 164, 52, 12);
  fill(255); // 텍스트 색상
  text("활성화", 284, 767);
  textSize(18);
}
