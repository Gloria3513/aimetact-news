import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aimetaedu - AI 시대의 교육 뉴스",
  description: "AI 교육, 유치원, 학부모를 위한 최신 교육 소식",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
