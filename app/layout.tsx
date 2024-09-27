// app/layout.tsx
import "./globals.css";

// @ts-ignore
import ClientProviders from "./ClientProviders";

export const metadata = {
  title: 'Datron AI Marketplace',
  description: 'AI dataset marketplace powered by TRON blockchain',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}