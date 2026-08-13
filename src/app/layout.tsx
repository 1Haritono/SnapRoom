import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Конструктор Корпусной Мебели 3D',
  description: 'Пробная версия 3D/2D конструктора корпусной мебели',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-950 text-slate-100 antialiased overflow-hidden">{children}</body>
    </html>
  );
}
