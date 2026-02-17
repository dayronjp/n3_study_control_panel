import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'N3 Study Control Panel',
  description: 'Dashboard de controle de estudos para o JLPT N3',
  icons: {
    icon: "data:image/svg+xml,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>\
  <circle cx='50' cy='50' r='50' fill='white'/>\
  <circle cx='50' cy='50' r='28' fill='red'/>\
</svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
