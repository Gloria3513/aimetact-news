# aimetaedu News

AI 시대의 교육 뉴스를 전하는 인터넷 신문사입니다.

## 프로젝트 개요

유치원 교사, 학부모, 교육 관계자를 위한 AI 교육 뉴스 플랫폼입니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **UI 라이브러리**: React 19
- **언어**: TypeScript
- **스타일**: Tailwind CSS
- **아이콘**: Lucide React
- **데이터베이스**: Supabase

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 페이지 (뉴스 목록)
│   ├── article/[id]/page.tsx # 기사 상세 페이지
│   ├── category/[slug]/page.tsx # 카테고리별 목록
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # 전역 스타일
└── lib/
    └── supabase.ts           # Supabase 클라이언트
```

## 카테고리

- AI교육
- 정책
- 유치원
- 학부모
- 인터뷰

## 데이터베이스

Supabase를 사용하여 기사 데이터를 관리합니다.

### articles 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | number | 기사 ID |
| title | string | 제목 |
| content | string | 본문 |
| summary | string | 요약 |
| category | string | 카테고리 |
| author | string | 작성자 |
| tags | string[] | 태그 |
| published | boolean | 게시 여부 |
| created_at | string | 생성일 |
| updated_at | string | 수정일 |

## 라이선스

© 2026 aimetaedu. All rights reserved.
