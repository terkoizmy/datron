import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"


declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
  }
}

const TronLinkAuth = () => {
  const [tronWeb, setTronWeb] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  // useEffect(() => {
  //   const checkTronLink = async () => {
  //     if (window.tronWeb && window.tronWeb.ready) {
  //       setTronWeb(window.tronWeb);
  //       const currentAddress = window.tronWeb.defaultAddress.base58;
  //       setAddress(currentAddress);
  //     }
  //   };

  //   const timer = setInterval(() => {
  //     checkTronLink();
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  const connectWallet = async () => {
    if (typeof window.tronLink !== 'undefined') {
      try {
        await window.tronLink.request({ method: 'tron_requestAccounts' });
        const tronweb = window.tronWeb;
        setTronWeb(tronweb);
        const currentAddress = tronweb.defaultAddress.base58;
        setAddress(currentAddress);
        toast({
          title: `Wallet Connected to ${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`,
          // description: `Connected to ${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`,
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to TronLink. Make sure you are logged in.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "TronLink Not Found",
        description: "Please install TronLink extension and refresh the page.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setTronWeb(null);
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-center space-x-4">
      {!address ? (
        <Button 
          onClick={connectWallet}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
        >
          Connect TronLink
        </Button>
      ) : (
        <>
          <span className="text-sm text-gray-300 font-extrabold">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          <Button 
            onClick={disconnectWallet}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            Disconnect
          </Button>
        </>
      )}
    </div>
  );
};

export default TronLinkAuth;