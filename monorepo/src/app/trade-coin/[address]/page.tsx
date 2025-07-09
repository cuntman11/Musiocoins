import React from "react";
import CoinTradeComponent from "@/components/tradeCoin";

interface TradeCoinPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function TradeCoinPage({ params }: TradeCoinPageProps) {
  const { address } = await params;

  return <CoinTradeComponent defaultCoinAddress={address as `0x${string}`} />;
}