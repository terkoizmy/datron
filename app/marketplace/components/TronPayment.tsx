import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTronWeb } from '@/hooks/useTronWeb';
import { purchaseDataset } from '@/utils/tronContract';

interface TronPaymentProps {
  datasetId: number;
  price: number;
}

export function TronPayment({ datasetId, price }: TronPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { tronWeb } = useTronWeb();

  const handlePurchase = async () => {
    if (!tronWeb) {
      toast({
        title: "TronLink not connected",
        description: "Please connect your TronLink wallet to make a purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const transaction = await purchaseDataset(tronWeb, datasetId, price);
      await tronWeb.trx.getTransaction(transaction);
      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased the dataset.",
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? 'Processing...' : `Purchase for ${price} TRX`}
    </Button>
  );
}