'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WishlistContextType {
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  totalWishlisted: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'neo_archive_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAuth, setIsAuth] = useState(false);

  // 1. Initial Load: check session from server and fallback to local storage
  useEffect(() => {
    let localSaved: string[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) localSaved = JSON.parse(stored);
    } catch {}

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setIsAuth(true);
          const serverList: string[] = data.user.wishlist || [];
          // Merge local and server wishlist
          const merged = Array.from(new Set([...serverList, ...localSaved]));
          setWishlist(merged);
          // If local had unsynced items, sync to server
          if (merged.length > serverList.length) {
            fetch('/api/auth/me', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ wishlist: merged }),
            }).catch(() => {});
          }
        } else {
          setIsAuth(false);
          setWishlist(localSaved);
        }
      })
      .catch(() => {
        setWishlist(localSaved);
      });
  }, []);

  // 2. Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      setWishlist((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];

        // If authenticated, sync with server
        if (isAuth) {
          fetch('/api/auth/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wishlist: next }),
          }).catch((err) => console.error('Wishlist sync error:', err));
        }

        return next;
      });
    },
    [isAuth]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        totalWishlisted: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
