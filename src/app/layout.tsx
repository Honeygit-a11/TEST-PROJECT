import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: 'NEO-ARCHIVE // High-Fidelity Brutalist Streetwear',
  description: 'Underground architectural streetwear catalog and permanent artifact collection. Est. 2026.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-surface)] text-[var(--text-ink)]">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <CartDrawer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
