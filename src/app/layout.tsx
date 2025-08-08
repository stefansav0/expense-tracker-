// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import BodyWrapper from '@/components/BodyWrapper';
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Manage your income & expenses with ease. Track income, recurring entries, dark mode, PDF export, and more.',
  keywords: ['expense tracker', 'income management', 'budgeting', 'finance app', 'PDF export'],
  authors: [{ name: 'Your Name or Team' }],
  creator: 'Your Name or Brand',
  openGraph: {
    title: 'Expense Tracker',
    description: 'Track income and expenses easily with modern features.',
    siteName: 'Expense Tracker',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors`}>
        <AuthProvider>
          <BodyWrapper>
            {children}
            <Footer /> {/* ✅ Footer added here */}
          </BodyWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
