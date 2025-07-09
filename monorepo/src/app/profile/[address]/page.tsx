

'use client';

import ConnectWallet from "@/components/ConnectWallet";
import ProfilePage from "@/components/profileComponent";
import React from "react";
import { useParams } from 'next/navigation';
import { useAccount } from "wagmi";

export default function Profile () {
   const params = useParams();
    const address = params.address as string;;

    return (
        address ? <ProfilePage userAddress={address.toString()} /> : <ConnectWallet />
    );
};


