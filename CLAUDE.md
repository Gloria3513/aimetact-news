# aimetact-news - Claude 작업 가이드

## 프로젝트 개요
AI 교육 뉴스를 전하는 인터넷 신문사 웹사이트입니다.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **UI**: React 19
- **언어**: TypeScript
- **스타일**: Tailwind CSS
- **아이콘**: Lucide React
- **데이터베이스**: Supabase

## 📁 주요 파일

| 파일 | 설명 |
|------|------|
| `src/app/page.tsx` | 메인 페이지 (뉴스 목록, 헤드라인) |
| `src/app/article/[id]/page.tsx` | 기사 상세 페이지 |
| `src/app/category/[slug]/page.tsx` | 카테고리별 기사 목록 |
| `src/lib/supabase.ts` | Supabase 클라이언트 설정 |

## 🚀 실행 방법

```bash
cd /Users/jojin-yeong/aimetact-news
npm run dev
```

http://localhost:3000

## 📋 구현된 기능 (2026-02-07 기준)

### ✅ 완료
- 메인 페이지 (헤드라인 + 서브 기사 + 사이드바)
- 기사 상세 페이지 (관련 기사 추천)
- 카테고리별 필터링
- 반응형 디자인 (모바일/데스크톱)
- 뉴스레터 구독 UI
- 스마택트 배너 링크

### 🔄 다음에 할 것
- [ ] Supabase 실제 데이터 연동
- [ ] 검색 기능
- [ ] 관리자 페이지 (기사 작성/수정)
- [ ] 댓글 기능
- [ ] SEO 최적화

## 🎨 디자인
- **메인 컬러**: Teal (teal-600)
- **폰트**: 시스템 기본 폰트
- **스타일**: 깔끔한 뉴스 사이트 스타일

## 📞 연락처
- 이메일: smatact@gmail.com
- 전화: 010-4782-3513
