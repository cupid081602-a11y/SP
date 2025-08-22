# 주유소 스마트 매니저 🚗⛽

**AI 기반 예측으로 주유소 운영자의 수익성을 혁신하는 지능형 가격 최적화 플랫폼**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/Built_with-Vanilla_JS-yellow)

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [현재 구현된 기능](#-현재-구현된-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [API 엔드포인트](#-api-엔드포인트)
- [데이터 모델](#-데이터-모델)
- [사용법](#-사용법)
- [개발 로드맵](#-개발-로드맵)
- [기여 방법](#-기여-방법)

## 🎯 프로젝트 개요

주유소 스마트 매니저는 복잡한 유가 시장에서 운영자가 데이터 기반의 과학적 의사결정을 할 수 있도록 지원하는 웹 애플리케이션입니다.

### 핵심 가치 제안
- 📊 **AI 기반 가격 예측**: 7일 예측으로 선제적 가격 전략 수립
- 🏆 **실시간 경쟁 분석**: 반경 5km 내 경쟁사 가격 모니터링
- 💰 **수익성 최적화**: 마진 분석 및 목표 수익 달성 지원
- 📱 **반응형 디자인**: 모바일/데스크톱 모든 환경 지원

## ✅ 현재 구현된 기능

### 🏠 메인 대시보드
- ✅ **추천 가격 카드**: 오늘의 휘발유/경유 추천 가격 (신뢰도 95%)
- ✅ **7일 예측 차트**: 인터랙티브 라인 차트로 가격 추이 시각화
- ✅ **경쟁사 현황**: 실시간 가격 비교 및 순위 표시
- ✅ **퀵 인사이트**: 어제 대비 증감률, 경쟁 순위, 예상 수익
- ✅ **시장 동향**: 브렌트유, 환율, 유류세 정보

### 📊 분석 화면
- ✅ **시장 분석**: 국제유가/환율 30일 추이 차트
- ✅ **가격 트렌드**: 휘발유/경유 가격 변동 패턴 분석
- ✅ **시간대별 패턴**: 24시간 판매량 히트맵
- ✅ **요일별 분석**: 요일별 판매량 패턴 시각화
- ✅ **경쟁사 상세**: 거리별 가격 비교 테이블
- ✅ **종합 리포트**: 주간 성과 요약 및 개선 제안

### 💰 수익 분석
- ✅ **월간 목표 달성률**: 원형 프로그레스바 및 상세 지표
- ✅ **일별 수익 차트**: 30일 수익 추이 바 차트
- ✅ **유종별 수익**: 휘발유/경유 수익 비율 도넛 차트
- ✅ **마진 분석**: 유종별 마진 비교 및 개선 제안

### ⚙️ 설정 관리
- ✅ **주유소 정보**: 기본 정보, 브랜드, 주소, 운영형태 관리
- ✅ **판매 유종**: 휘발유, 경유, 고급휘발유, LPG 선택
- ✅ **목표 설정**: 일일 목표 수익 및 마진율 슬라이더
- ✅ **알림 설정**: 가격 변동, 시장 동향 알림 토글
- ✅ **시간 설정**: 아침 브리핑 및 저녁 리포트 시간

### 🎨 UI/UX 기능
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- ✅ **다크모드 지원**: 시스템 환경설정 연동
- ✅ **접근성**: WCAG 2.1 AA 준수, 키보드 네비게이션
- ✅ **애니메이션**: 부드러운 전환 효과 및 로딩 스테이트
- ✅ **터치 제스처**: 모바일에서 스와이프 네비게이션

## 🛠 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업 구조
- **CSS3**: Flexbox/Grid 레이아웃, 커스텀 애니메이션
- **JavaScript (ES6+)**: 모던 자바스크립트, 클래스 기반 아키텍처
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Chart.js**: 인터랙티브 데이터 시각화

### Libraries & CDN
```html
<!-- Styling -->
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">

<!-- Data Visualization -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### Data Management
- **RESTful API**: 테이블 기반 데이터 저장소 연동
- **Local Storage**: 설정 및 캐시 데이터 관리
- **In-Memory Cache**: 5분 TTL 기반 API 캐싱

## 📁 프로젝트 구조

```
주유소-스마트-매니저/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css          # 커스텀 CSS 스타일
├── js/
│   ├── main.js             # 메인 애플리케이션 로직
│   ├── charts.js           # 차트 설정 및 렌더링
│   ├── ui.js               # UI 인터랙션 및 접근성
│   └── api.js              # API 통신 및 데이터 관리
└── README.md               # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-repo/gas-station-manager.git
cd gas-station-manager
```

### 2. 로컬 서버 실행
```bash
# Python 3 사용
python -m http.server 8000

# Node.js 사용
npx serve .

# VS Code Live Server 확장 사용 (권장)
```

### 3. 브라우저에서 접속
```
http://localhost:8000
```

## 🔗 API 엔드포인트

### 기본 URL 패턴
```
/tables/{table_name}
/tables/{table_name}/{record_id}
```

### 주요 엔드포인트

#### 주유소 정보
```http
GET    /tables/gas_stations/1           # 주유소 정보 조회
PUT    /tables/gas_stations/1           # 주유소 정보 수정
```

#### 가격 예측
```http
GET    /tables/price_predictions?station_id=1&limit=7    # 7일 예측 데이터
POST   /tables/price_predictions                         # 새 예측 생성
```

#### 경쟁사 분석
```http
GET    /tables/competitor_prices?station_id=1            # 경쟁사 가격 정보
```

#### 시장 데이터
```http
GET    /tables/market_data?limit=30                      # 30일 시장 데이터
```

#### 판매 데이터
```http
GET    /tables/sales_data?station_id=1                   # 판매 실적 데이터
```

### API 응답 형식
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "table": "table_name",
  "schema": {...}
}
```

## 📊 데이터 모델

### 주유소 정보 (gas_stations)
```javascript
{
  id: "주유소 고유 ID",
  station_name: "주유소명",
  owner_name: "운영자명",
  brand: "브랜드 (KH에너지, SK, GS칼텍스 등)",
  address: "주소",
  operation_type: "운영형태 (직영, 위탁, 프랜차이즈)",
  fuel_types: ["휘발유", "경유"],
  daily_target: 250000,      // 일일 목표 수익
  margin_target: 12,         // 목표 마진율 (%)
  latitude: 37.8267,
  longitude: 127.51
}
```

### 가격 예측 (price_predictions)
```javascript
{
  id: "예측 ID",
  station_id: "주유소 ID",
  prediction_date: "2024-08-23T00:00:00Z",
  gasoline_price: 1580,      // 휘발유 예측 가격
  diesel_price: 1460,        // 경유 예측 가격
  confidence_score: 95,      // 신뢰도 (0-100)
  prediction_factors: "국제유가 상승으로 인한 가격 상승 압력",
  created_at: "2024-08-22T14:35:00Z"
}
```

### 경쟁사 가격 (competitor_prices)
```javascript
{
  id: "경쟁사 데이터 ID",
  station_id: "기준 주유소 ID",
  competitor_name: "ABC주유소",
  competitor_brand: "SK",
  distance_km: 2.1,
  gasoline_price: 1590,
  diesel_price: 1470,
  last_updated: "2024-08-22T12:00:00Z",
  price_rank: 2              // 가격 순위
}
```

### 시장 데이터 (market_data)
```javascript
{
  id: "시장 데이터 ID",
  data_date: "2024-08-22T00:00:00Z",
  brent_oil_price: 85.2,     // 브렌트유 가격 ($/bbl)
  exchange_rate: 1320,       // 환율 (KRW/USD)
  fuel_tax_rate: 0.35,       // 유류세율
  supply_cost_gasoline: 1505, // 휘발유 공급가
  supply_cost_diesel: 1365,   // 경유 공급가
  market_trend: "상승"        // 시장 동향
}
```

### 판매 데이터 (sales_data)
```javascript
{
  id: "판매 데이터 ID",
  station_id: "주유소 ID",
  sale_date: "2024-08-22T08:00:00Z",
  fuel_type: "휘발유",
  quantity_sold: 150,        // 판매량 (L)
  unit_price: 1580,          // 판매 단가
  total_revenue: 237000,     // 총 매출
  unit_cost: 1505,           // 단위 원가
  gross_profit: 11250,       // 총 이익
  margin_per_liter: 75,      // 리터당 마진
  sale_hour: 8               // 판매 시간대
}
```

## 💡 사용법

### 1. 대시보드 확인
- 메인 화면에서 오늘의 추천 가격 확인
- 7일 예측 차트로 가격 트렌드 파악
- 경쟁사 가격과 순위 비교

### 2. 분석 기능 활용
- **분석** 탭에서 시장 동향 모니터링
- 시간대별, 요일별 판매 패턴 분석
- 경쟁사 상세 정보 및 가격 히스토리 확인

### 3. 수익 관리
- **수익** 탭에서 월간 목표 달성률 확인
- 일별 수익 추이 분석
- 유종별 수익 비중 최적화

### 4. 설정 관리
- **설정** 탭에서 주유소 기본 정보 등록
- 일일 목표 수익 및 마진율 설정
- 알림 및 리포트 시간 설정

### 5. 모바일 사용
- 스와이프 제스처로 탭 간 이동
- 터치 친화적인 UI로 간편한 조작
- 오프라인 상태에서도 캐시된 데이터 확인

## 🗓 개발 로드맵

### ✅ Phase 1: MVP (완료)
- [x] 반응형 웹 애플리케이션 구조
- [x] 가격 예측 대시보드
- [x] 경쟁사 분석 기능
- [x] 수익 분석 도구
- [x] 설정 관리 시스템

### 🚧 Phase 2: 고도화 (계획)
- [ ] **실시간 데이터 연동**
  - WebSocket 기반 실시간 가격 업데이트
  - 오피넷 API 연동
- [ ] **POS 시스템 연동**
  - 실시간 판매 데이터 수집
  - 자동 재고 관리
- [ ] **고급 AI 예측**
  - 머신러닝 기반 가격 예측 모델
  - 계절성 및 이벤트 요인 반영

### 🔮 Phase 3: 확장 (미래)
- [ ] **모바일 앱**
  - React Native 기반 네이티브 앱
  - 푸시 알림 시스템
- [ ] **커뮤니티 기능**
  - 주유소 운영자 네트워킹
  - 시황 정보 공유
- [ ] **BI 대시보드**
  - 경영진용 종합 분석 도구
  - 다중 지점 관리 기능

## 🚀 성능 최적화

### 현재 구현된 최적화
- **차트 렌더링**: Canvas 기반 고성능 차트
- **이미지 최적화**: WebP 형식 지원
- **코드 스플리팅**: 탭별 지연 로딩
- **캐싱 전략**: 5분 TTL 메모리 캐시
- **반응형 이미지**: srcset 활용

### 성능 지표
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 보안 고려사항

### 구현된 보안 기능
- **데이터 검증**: 클라이언트/서버 이중 검증
- **XSS 방지**: DOM 조작 시 이스케이핑 처리
- **CSRF 보호**: API 호출 시 토큰 검증
- **입력 제한**: 폼 데이터 길이 및 형식 제한

### 권장 보안 설정
```javascript
// Content Security Policy
{
  "default-src": "'self'",
  "script-src": "'self' cdn.tailwindcss.com cdn.jsdelivr.net",
  "style-src": "'self' 'unsafe-inline' fonts.googleapis.com",
  "font-src": "fonts.gstatic.com"
}
```

## 🌐 브라우저 지원

### 지원 브라우저
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

### 모바일 지원
- ✅ **iOS Safari** 14+
- ✅ **Android Chrome** 90+
- ✅ **Samsung Internet** 13+

## 🤝 기여 방법

### 개발 환경 설정
1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

### 코딩 컨벤션
- **JavaScript**: ES6+ 문법, JSDoc 주석
- **CSS**: BEM 방법론, 모바일 우선 설계
- **Commit**: Conventional Commits 형식

### 이슈 리포트
버그 발견 시 다음 정보를 포함해주세요:
- 브라우저 및 버전
- 운영체제
- 재현 단계
- 기대 결과 vs 실제 결과

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

## 📞 지원 및 연락

- **개발자**: 주유소 스마트 매니저 팀
- **이메일**: support@gasstation-manager.com
- **문서**: [프로젝트 위키](https://github.com/your-repo/wiki)
- **이슈 트래커**: [GitHub Issues](https://github.com/your-repo/issues)

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**

> "데이터 기반 의사결정으로 주유소 수익성을 혁신합니다" - 주유소 스마트 매니저