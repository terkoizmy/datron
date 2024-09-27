// hooks/useTronWeb.ts
import { useState, useEffect } from 'react';
import TronWeb from 'tronweb';

declare global {
  interface Window {
    tronWeb: any;
  }
}

export function useTronWeb() {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkTronWeb = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        setTronWeb(window.tronWeb);
        const currentAddress = window.tronWeb.defaultAddress.base58;
        setAddress(currentAddress);
      }
    };

    const timer = setInterval(() => {
      checkTronWeb();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { tronWeb, address };
}