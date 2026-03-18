# 🛡️ PRD: SafeStay (세이프스테이) - 5단계 분석 및 정의서

본 문서는 `PRDmaker`의 5단계 변환 엔진 로직(Analysis, Prototyping, Growth, Roadmap, Specification)을 따라 작성되었습니다.

---

## 1단계: 아이디어 해상도 높이기 (Analysis)

### 🧐 아이디어 분석
*   **강점 (Strengths):** '디지털 호신술'이라는 명확한 페르소나와 사용자 니즈(여성 1인 여행객의 불안) 해결. 단순 툴이 아닌 '심리적 안심'이라는 감성적 가치 제공.
*   **보완점 (Refinement):** 
    *   **기술적 정확도:** AI 렌즈 탐지는 환경(조명, 조도)에 큰 영향을 받으므로 보조적 수단임을 명시해야 함.
    *   **알람 신뢰도:** 진동 감지의 오작동(충전기 연결 시 진동 등) 최소화 로직 필요.

### 🛠 Lean Tech Stack 제안
*   **Frontend:** Next.js (PWA 지원으로 설치 유도) 또는 React Native (센서 접근성 우위).
*   **Vision AI:** TensorFlow.js (기기 내 실시간 객체 탐지).
*   **Backend:** Firebase (익명 인증, Firestore 데이터 저장, Cloud Functions를 통한 알림).
*   **Sensors:** Web API (Generic Sensor API) 또는 Native 센서 라이브러리.

---

## 2단계: 가설 검증 설계 (Prototyping)

### 💡 핵심 가설
> "사용자는 전용 장비 없이 스마트폰 센서만으로도 숙소의 안전을 확인받고 싶어 하며, 이를 통해 여행의 불안을 80% 이상 해소할 것이다."

### 🧪 저비용 테스트 기법 (Wizard of Oz)
*   **1단계 (커뮤니티 검증):** 여성 여행 커뮤니티(예: '여행에 미치다' 등)에 '안심 숙박 체크리스트 PDF' 배포 후 반응 확인.
*   **2단계 (Concierge MVP):** 기존에 있는 'Camera Detector' 앱과 'Vibration Alarm' 앱을 조합해 사용해 본 뒤, 'SafeStay'처럼 하나로 통합된 앱의 필요성을 인터뷰.

---

## 3단계: 성장 동력 설계 (Growth)

### 🚀 초기 획득 (Acquisition)
*   **Safety Badge:** 입실 체크를 마친 사용자가 "오늘의 내 방은 안심 지수 100%" 이미지를 인스타그램 스토리나 커뮤니티에 공유할 수 있는 기능.

### 🔄 바이럴 루프 (Viral Loop)
*   **지인 안심 리포트:** 숙소 점검 완료 후 지인에게 "OO호텔 점검 완료, 특이사항 없음" 메시지를 카톡으로 자동 전송. 메시지 하단에 '나도 내 숙소 점검하기' 링크 삽입.

---

## 4단계: 구현 로드맵 (3-Step Iteration)

### [Iteration 1] 핵심 가치 검증 (MVP)
*   **입:** 자석 센서 데이터, 카메라 프리뷰.
*   **처:** 자기장 수치 분석, 간단한 광학 반사 시각화.
*   **출:** 안심/의심 결과 표시.
*   **행:** 5분 안심 체크리스트 가이드 제공.
*   **검:** 사용자가 체크리스트를 끝까지 수행하는가?

### [Iteration 2] 심리적 안정 강화
*   **입:** 가속도 센서, 음성 재생 요청.
*   **처:** 문 흔들림 감지 로직, 저음 보이스 가드 엔진.
*   **출:** 경보음 발생, 푸시 알림.

---

## 5단계: AI 에이전트용 PRD 정의 (Specification)

<SystemContext>
  본 앱은 낯선 공간에서 사용자의 개인정보와 신체적 안전을 보호하기 위한 모바일 웹/앱입니다.
</SystemContext>

<CoreFeatures>
  <Feature id="F1">
    <Title>AI 공간 세이프티 스캐너</Title>
    <Requirement>카메라 렌즈의 특유 반사광(Specular Reflection)을 실시간으로 감지하여 강조.</Requirement>
    <Requirement>Wi-Fi 스캐닝을 통해 동일 네트워크 내 호스트 이외의 의심 기기 감지.</Requirement>
  </Feature>
  <Feature id="F2">
    <Title>스마트 도어 모니터링</Title>
    <Requirement>가속도 센서 임계값 설정을 통한 침입 시도 감지.</Requirement>
    <Requirement>잠금 화면에서도 남성 목소리 즉시 재생 위젯 제공.</Requirement>
  </Feature>
</CoreFeatures>

<UserFlow>
  1. 앱 실행 → [룸 스캔] 버튼 클릭 → 렌즈/자기장 점검.
  2. [도어 가드] 활성화 → 스마트폰을 문 옆 선반에 거치.
  3. [취침 모드] 전환 → 상태 상시 감시 및 센서 데이터 기록.
</UserFlow>

<VerificationTests>
  - **Test 1:** 스마트폰을 평평한 곳에 두고 1cm 이내의 이동이 감지될 때 알람이 발생하는지 확인.
  - **Test 2:** Wi-Fi 연결 상태에서 네트워크 기기 리스트가 정상적으로 로드되는지 확인.
</VerificationTests>
