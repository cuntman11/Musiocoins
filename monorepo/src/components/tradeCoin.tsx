"use client";
import React, { useState, useEffect } from "react";
import { tradeCoin } from "@/lib/zora";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface CoinTradeProps {
  defaultCoinAddress?: `0x${string}`;
  coinDecimals?: number;
}

export default function CoinTradeComponent({
  defaultCoinAddress = `0x${"0".repeat(40)}`,
  coinDecimals = 18,
}: CoinTradeProps) {
  const [coinAddress, setCoinAddress] = useState<string>(defaultCoinAddress);
  const [amount, setAmount] = useState<string>("0.01");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address: account } = useAccount();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (txHash) {
      alert("Transaction submitted successfully!");
      toast.success("Transaction submitted successfully!");
    }
  }, [txHash]);

  const parseToBigInt = (value: string, decimals: number): bigint => {
    try {
      return parseUnits(value, decimals);
    } catch {
      return BigInt(0);
    }
  };

  const handleTrade = async () => {
    if (!walletClient || !publicClient || !account) {
      setError("Please connect your wallet");
      return;
    }
    if (!coinAddress || !coinAddress.startsWith("0x") || coinAddress.length !== 42) {
      setError("Please enter a valid contract address");
      return;
    }
    setIsTrading(true);
    setError(null);
    setTxHash(null);

    try {

         if (!walletClient || !publicClient || !account) {
            setError("Please connect your wallet");
            return;
        }
        console.log("details");
        console.log("walletClient",walletClient);
        console.log("publicClient",publicClient);
        console.log("account",account);
  
      const tradeParameters = tradeType === "buy" 
        ? {
            sell: { type: "eth" as const },
            buy: { 
              type: "erc20" as const, 
              address: coinAddress as `0x${string}` 
            },
            amountIn: parseEther(amount),
            slippage: 0.05, 
            sender: account,
          }
        : {
            sell: { 
              type: "erc20" as const, 
              address: coinAddress as `0x${string}` 
            },
            buy: { type: "eth" as const },
            amountIn: parseToBigInt(amount, coinDecimals),
            slippage: 0.05,
            sender: account,
          };

      const result = await tradeCoin({
        tradeParameters,
        walletClient,
        account: walletClient.account,
        publicClient,
      });
      
      setTxHash(result.hash);
    } catch (e: any) {
      setError(e?.message || "Trade failed");
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Trade Character Coin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coin-address">Coin Contract Address</Label>
          <Input
            id="coin-address"
            type="text"
            value={coinAddress}
            onChange={(e) => setCoinAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">
            Amount ({tradeType === "buy" ? "ETH" : "Coin"})
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={tradeType === "buy" ? "ETH to spend" : "Coin to sell"}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Label htmlFor="trade-toggle">Trade Type:</Label>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${tradeType === "buy" ? "font-semibold" : "text-gray-500"}`}>
              Buy
            </span>
            <button
              type="button"
              onClick={() => setTradeType(tradeType === "buy" ? "sell" : "buy")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                tradeType === "sell" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  tradeType === "sell" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${tradeType === "sell" ? "font-semibold" : "text-gray-500"}`}>
              Sell
            </span>
          </div>
        </div>
        
        <Button
          type="button"
          onClick={handleTrade}
          disabled={isTrading}
          className="w-full"
        >
          {isTrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isTrading
            ? tradeType === "buy"
              ? "Buying..."
              : "Selling..."
            : tradeType === "buy"
            ? "Buy Coin"
            : "Sell Coin"}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {txHash && (
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <span className="font-medium">Transaction Hash:</span>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
