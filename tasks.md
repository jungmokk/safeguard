# Task List (Tasks): SafeStay (SafeGuard)

## 1. 계획 및 분석 (Planning & Analysis)
- [x] PRD(제품 요구서) 확정 및 아키텍처 설계
- [x] 구현 계획서(Implementation Plan) 작성
- [x] **Agent Operating Guidelines (agents.md)** 숙지 및 문서 구조화

## 2. 기본 환경 구축 (Infrastructure)
- [x] Next.js 14 프로젝트 초기화 및 환경 설정
- [x] PWA 설정 (`next-pwa`, `manifest.json`)
- [x] 프리미엄 다크 테마 디자인 시스템 구축 (`globals.css`)

## 3. 핵심 기능 구현 (MVP Core Features)
- [x] Dashboard: 안심 지수 및 위치 카드 UI 구현
- [x] AI Space Scanner: 카메라 프리뷰 및 EMF 시각화 연동
- [x] Smart Door Guard: 가속도계 기반 흔들림 감지 및 알람 로직
- [x] Interactive Checklist: 단계별 점검 및 LocalStorage 저장
- [x] Safety Badge: 결과 페이지 및 배지 생성 기능

## 4. 근거 기반 최적화 (Evidence-Based Optimization)
- [x] NotebookLM MCP 활용 데이터 추출
- [x] EMF 임계값 최적화 (62μT / 192μT) 및 UI 반영
- [x] 진동 감지 임계값 최적화 (0.162m/s²) 및 필터링 강화
- [x] 광학 렌즈 탐지(Luminance Peak) 로직 고도화

## 5. 품질 검증 및 릴리즈 (QA & Release)
- [x] iOS/Android 센서 권한 대응 및 테스트
- [x] PWA 설치 및 오프라인 작동 검증
- [x] 최종 UI/UX 폴리싱 (Glassmorphism 강화)
- [x] 구현 결과 보고서(`walkthrough.md`) 작성

## 6. 향후 과제 (Future Scope)
- [/] TensorFlow.js 원형 객체 인식 모델 통합 (Iteration 2)
- [x] 사이렌 사운드 및 보이스 알람 샘플 추가 (Iteration 2)
- [x] Firebase 백엔드 연동 및 인프라 구축 (Iteration 3)
- [x] 안심 커뮤니티 피드 및 리포팅 기능 (Iteration 3)
- [x] 사용자 인증 및 개인 프로필 시스템 (Iteration 3)
- [x] 데이터 기반 센서 임계값 자동 최적화 (Iteration 4)
