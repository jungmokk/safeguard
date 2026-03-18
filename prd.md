🛡️ AI-Optimized Master PRD: SafeStay

## 0. AI Agent Operating Guidelines (Crucial)
이 프로젝트를 수행하는 AI 에이전트(Cursor, Lovable, Anti-Gravity 등)는 아래의 작업 원칙을 반드시 준수해야 합니다.

* **[Rule 1] MCP 서버 강제 활용 (Retrieve First):**
  핵심 센서 로직(가속도계, 자기장, 비전 AI)을 구현하거나 iOS/Android 브라우저 제약 사항을 해결할 때, 에이전트의 사전 학습된 지식(Pre-trained knowledge)에만 의존하지 마십시오. 코드를 작성하기 전 반드시 연결된 **NotebookLM MCP 서버에 관련 키워드를 쿼리하여 전문 지식과 최적화 기법을 검색**해야 합니다.
* **[Rule 2] 데이터 기반 임계값 설정 (Evidence-Based Logic):**
  진동 감지(m/s²)나 자기장(μT) 임계값 설정, 카메라 렌즈 반사광 패턴 식별 알고리즘 등을 설계할 때, MCP를 통해 검색한 물리적/기술적 근거를 바탕으로 코드를 작성하고 주석에 그 출처나 이유를 명시하십시오.
* **[Rule 3] 출처 명시 및 승인 (Cite & Confirm):**
  MCP에서 검색된 중요한 해결책(특히 PWA 백그라운드 실행 우회, iOS 권한 해제 등)을 프로젝트에 적용할 때는, 구현 방향을 먼저 사용자에게 브리핑하고 승인을 받은 후 코드를 작성하십시오.

1. Project Overview
Product Name: SafeStay (세이프스테이)

Description: Digital Self-Defense for Solo Travelers (스마트폰 센서를 활용한 공간 안전 점검 및 실시간 침입 감지 PWA)

Tech Stack: Next.js 14 (App Router), React, Vanilla CSS (Glassmorphism), PWA (manifest.json, service worker)

Core APIs: DeviceMotionEvent, Magnetometer API, MediaDevices API, Wake Lock API, Web Audio API, TensorFlow.js (Object Detection)

2. Core Features & Technical Specs
F1. AI Lens Detector & Magnetometer (공간 스캐너)
Data Input: Camera stream (MediaDevices API), Magnetometer sensor data.

Logic: * 실시간 영상에서 고대비 반사광(Specular Highlight) 패턴을 식별하여 렌즈 의심 영역 추적.

자기장 센서 수치가 80μT 이상일 때 시각적 경고 및 Haptic Feedback(진동) 발생.

UI/UX: AR Overlay 적용. 식별된 지점에 Pulsing indicator (Glow Effect) 표시.

F2. Smart Door Guard (가상 도어락 & 모니터링)
Data Input: Accelerometer (x, y, z axes).

Logic:

기준값 대비 가속도 변화량이 0.5m/s² 초과 시 '침입 시도'로 간주.

흔들림이 3초 이상 지속될 시, High-decibel 사이렌 알림 및 미리 설정된 "Who is it?" 보이스 샘플 재생.

Crucial Constraint Handling (AI Agent Must Follow):

Background / Sleep Prevention: 모니터링 모드 작동 시 navigator.wakeLock.request('screen')을 호출하여 화면 꺼짐 및 백그라운드 전환으로 인한 센서 중단을 방지할 것. (절전 모드를 위해 화면은 Black UI로 전환하되 앱은 Active 상태 유지)

F3. Interactive Safety Checklist (안심 체크리스트)
Logic: 카드 스와이프 타입의 UI로 단계별 점검(현관, 화장실, 침실 등) 수행.

Data Persistence: 사용자의 체크리스트 진행률 및 완료 상태는 브라우저 localStorage를 사용하여 저장 (새로고침 시 데이터 유지).

UI/UX: 모든 단계 완료 시 Generated "Safety Badge" 이미지 렌더링.

3. Crucial Browser Permissions & Setup (Important for iOS/Android)
AI Agent는 다음 권한 요청 로직을 반드시 구현해야 함:

Initial User Gesture: 오디오 재생 및 센서 접근 권한을 얻기 위해 반드시 사용자가 직접 클릭하는 'Start Guard' 또는 'Activate' 버튼을 통해 프로세스를 시작할 것 (iOS Safari 정책 대응).

Sensor Permission: iOS 13 이상 기기를 위한 DeviceMotionEvent.requestPermission() 팝업 호출 로직 포함.

AudioContext Unlock: 첫 번째 User Gesture 시점에 빈 음원을 재생하여 Web Audio API의 Mute 상태를 해제할 것.

4. UI / UX Design System
Theme: Premium Dark Mode

Color Palette: * Background: #0A0E1A

Accent (Highlight): #FFD700

Secure (Success): #00FFC2

Alert (Danger): #FF3B30

Styling: Glassmorphism, Soft Glow effects, 부드러운 트랜지션.

5. Acceptance Criteria (QA Test Cases)
Vibration Alarm Sensitivity: 앱 실행 후 '도어 가드' 활성화 상태에서 기기를 톡 건드리면 즉시 화면이 켜지며(Black UI 해제) 사이렌/보이스 알람이 울려야 함.

Camera Scan Feedback: 카메라를 밝은 광원에 비추었을 때 화면상에 렌즈 의심 영역(Glow Effect)이 즉각 렌더링되어야 함.

Persistence Test: 체크리스트를 50% 진행한 후 브라우저 탭을 닫았다 열어도 진행 상태가 유지되어야 함.

6. Future Scope (Not for current MVP)
E2EE를 적용한 위급 상황 사진 클라우드 저장소.

주변 안심 숙소 커뮤니티 평점 서비스 연동.

Prompt for AI Agent:
"Build with the Vibe, Protect with SafeStay. Read the PRD above and generate the exact folder structure and necessary configuration files for the Next.js 14 PWA project first."