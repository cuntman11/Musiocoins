'use client';

import ConnectWallet from "@/components/ConnectWallet";
import ProfilePage from "@/components/profileComponent";
import React from "react";
import { useAccount } from "wagmi";

export default function Profile () {
    const { address } = useAccount();

    return (
        address ? <ProfilePage userAddress={address.toString()} /> : <ConnectWallet />
    );
};

