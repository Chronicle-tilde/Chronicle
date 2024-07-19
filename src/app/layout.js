/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Inter } from 'next/font/google';
import '../styles/styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chronicle',
  description: "Blazin' Fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
