import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Shield, Zap } from "lucide-react";

export default function ConnectWallet() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          <div className="relative mb-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <Wallet className="h-10 w-10 text-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-primary-foreground rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Connect your wallet to start creating your coin and access all features
          </p>
          <div className="mb-8 flex justify-center">
            <ConnectButton />
          </div>
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure connection</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Fast transactions</span>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          By connecting, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}