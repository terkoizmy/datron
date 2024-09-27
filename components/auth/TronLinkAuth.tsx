import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
  }
}

interface AuthResponse {
  token: string;
}

const TronLinkAuth: React.FC = () => {
  const [tronWeb, setTronWeb] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const checkTronLink = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        setTronWeb(window.tronWeb);
        const currentAddress = window.tronWeb.defaultAddress.base58;
        setAddress(currentAddress);
        setIsAuthenticated(true)
      }else{
        setIsAuthenticated(false)
      }
    };

    const timer = setInterval(() => {
      checkTronLink();
    }, 1000);

    return () => clearInterval(timer);
  }, [tronWeb]);

  // const connectWallet = async () => {
  //   if (typeof window.tronLink !== 'undefined') {
  //     try {
  //       await window.tronLink.request({ method: 'tron_requestAccounts' });
  //       const tronweb = window.tronWeb;
  //       setTronWeb(tronweb);
  //       const currentAddress = tronweb.defaultAddress.base58;
  //       setAddress(currentAddress);
  //       console.log(window)
        
  //       // After connecting, attempt to login or register
  //       const response = await fetch('/api/auth/login', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ address: currentAddress }),
  //       });

  //       if (response.ok) {
  //         const contentType = response.headers.get("content-type");
  //         if (contentType && contentType.indexOf("application/json") !== -1) {
  //           const data: AuthResponse = await response.json();
  //           localStorage.setItem('token', data.token);
  //           setIsAuthenticated(true);
  //           toast({
  //             title: "Authentication Successful",
  //             description: `Logged in as ${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`,
  //           });
  //         } else {
  //           throw new Error("Received non-JSON response from server");
  //         }
  //       } else {
  //         const errorText = await response.text();
  //         throw new Error(`Server responded with ${response.status}: ${errorText}`);
  //       }
  //     } catch (error) {
  //       console.error('Failed to connect wallet:', error);
  //       toast({
  //         title: "Connection Failed",
  //         description: error instanceof Error ? error.message : "An unexpected error occurred",
  //         variant: "destructive",
  //       });
  //     }
  //   } else {
  //     toast({
  //       title: "TronLink Not Found",
  //       description: "Please install TronLink extension and refresh the page.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const disconnectWallet = () => {
  //   setTronWeb(null);
  //   setAddress(null);
  //   localStorage.removeItem('token');
  //   setIsAuthenticated(false);
  //   toast({
  //     title: "Wallet Disconnected",
  //     description: "Your wallet has been disconnected and you've been logged out.",
  //   });
  //   router.push('/');
  // };

  return (
    <div className="flex items-center space-x-4">
      {!address ? (
        <Button 
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
        >
          Connect TronLink
        </Button>
      ) : (
        <>
          <span className="text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600
           hover:to-pink-600 text-white p-2 rounded-md">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          {/* <Button 
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            Disconnect
          </Button> */}
        </>
      )}
    </div>
  );
};

export default TronLinkAuth;