import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// const inter = Inter({ subsets: ['latin'] });
const inter = { className: 'font-sans' };

export const metadata: Metadata = {
    title: 'ArwaEduc',
    description: 'Système de gestion scolaire',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
