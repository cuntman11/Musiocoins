'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProfile, getProfileBalances } from '@zoralabs/coins-sdk';
import { isAddress } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Wallet, Coins, TrendingUp, Calendar, ArrowLeft, RefreshCw, ExternalLink, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface ProfileData {
  address?: string;
  handle?: string;
  displayName?: string;
  bio?: string;
  joinedAt?: string;
  profileImage?: {
    small?: string;
    medium?: string;
    blurhash?: string;
  };
  linkedWallets?: Array<{
    type?: string;
    url?: string;
  }>;
}

interface CoinBalance {
  id?: string;
  coin?: {
    id?: string;
    name?: string;
    symbol?: string;
    address?: string;
    chainId?: number;
    totalSupply?: string;
    marketCap?: string;
    volume24h?: string;
    createdAt?: string;
    uniqueHolders?: number;
    media?: {
      previewImage?: string;
      medium?: string;
      blurhash?: string;
    };
  };
  amount?: {
    amountRaw?: string;
    amountDecimal?: number;
  };
  valueUsd?: string;
  timestamp?: string;
}

export default function ProfilePage({ userAddress }: { userAddress: string }) {

  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [balances, setBalances] = useState<CoinBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balancesError, setBalancesError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);

  console.log("profie",profile);



  const isValidIdentifier = userAddress && (isAddress(userAddress) || userAddress.length > 0);
  const fetchProfile = async () => {
    if (!isValidIdentifier) {
      setError('Invalid address or handle format');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getProfile({
        identifier: userAddress,
      });

      const profileData: any = response?.data?.profile;
      
      if (profileData) {
        setProfile({
          address: profileData.address,
          handle: profileData.handle,
          displayName: profileData.displayName,
          bio: profileData.bio,
          joinedAt: profileData.joinedAt,
          profileImage: profileData.avatar ? {
            small: profileData.avatar.small,
            medium: profileData.avatar.medium,
            blurhash: profileData.avatar.blurhash,
          } : undefined,
          linkedWallets: profileData.linkedWallets?.edges?.map((edge: any) => ({
            type: edge.node.walletType,
            url: edge.node.walletAddress,
          })),
        });
      } else {
        setError('Profile not found or user has not set up a profile');
      }
    } catch (err: any) {
      setError(`Error fetching profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  const fetchBalances = async () => {
    if (!isValidIdentifier) return;

    setBalancesLoading(true);
    setBalancesError(null);
    
    try {
      const response = await getProfileBalances({
        identifier: userAddress,
        count: 20,
      });

      const profileData: any = response.data?.profile;
      
      if (profileData && profileData.coinBalances) {
        const balanceData = profileData.coinBalances.edges.map((edge: any) => edge.node);
        setBalances(balanceData);
        
        // Calculate total USD value
        const total = balanceData.reduce((sum: number, balance: any) => {
          const value = parseFloat(balance.valueUsd || '0');
          return sum + value;
        }, 0);
        setTotalValue(total);
      }
    } catch (err: any) {
      setBalancesError(`Error fetching balances: ${err.message}`);
    } finally {
      setBalancesLoading(false);
    }
  };

  // Fetch all balances with pagination
  const fetchAllBalances = async () => {
    if (!isValidIdentifier) return;

    setBalancesLoading(true);
    setBalancesError(null);
    
    try {
      let allBalances: any[] = [];
      let cursor = undefined;
      const pageSize = 20;

      do {
        const response = await getProfileBalances({
          identifier: userAddress,
          count: pageSize,
          after: cursor,
        });

        const profileData: any = response.data?.profile;
        
        if (profileData && profileData.coinBalances) {
          const pageBalances = profileData.coinBalances.edges.map((edge: any) => edge.node);
          allBalances = [...allBalances, ...pageBalances];
          
          cursor = profileData.coinBalances.pageInfo?.endCursor;
          
          if (!cursor || profileData.coinBalances.edges?.length === 0) {
            break;
          }
        } else {
          break;
        }
      } while (true);

      setBalances(allBalances);
      const total = allBalances.reduce((sum: number, balance: any) => {
        const value = parseFloat(balance.valueUsd || '0');
        return sum + value;
      }, 0);
      setTotalValue(total);
    } catch (err: any) {
      setBalancesError(`Error fetching all balances: ${err.message}`);
    } finally {
      setBalancesLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [userAddress]);

  useEffect(() => {
    if (profile) {
      fetchBalances();
    }
  }, [profile]);

  if (!isValidIdentifier) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">Invalid Identifier</h1>
            <p className="text-muted-foreground">The provided address or handle is not valid</p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>
            Please provide a valid Ethereum address or Zora handle in the URL path.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            {profile?.displayName || profile?.handle || 'User Profile'}
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {userAddress}
          </p>
        </div>
        <Button onClick={fetchProfile} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      )}

      {/* Profile Details */}
      {profile && !loading && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                {profile.profileImage?.medium ? (
                  <img 
                    src={profile.profileImage.medium} 
                    alt={profile.displayName || profile.handle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">
                    {profile.displayName || profile.handle || 'Anonymous User'}
                  </CardTitle>
                  {profile.handle && (
                    <Badge variant="secondary">@{profile.handle}</Badge>
                  )}
                </div>
                {profile.bio && (
                  <CardDescription className="text-base mb-4">
                    {profile.bio}
                  </CardDescription>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {profile.joinedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinedAt}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-1">
                      <Wallet className="w-4 h-4" />
                      <span className="font-mono">{profile.address.slice(0, 6)}...{profile.address.slice(-4)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          {profile.linkedWallets && profile.linkedWallets.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Linked Wallets</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.linkedWallets.map((wallet, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {wallet.type}: {wallet.url}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Portfolio Overview */}
      {profile && balances.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Coins Held</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  {balances.length}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unique Tokens</p>
                <p className="text-2xl font-bold">
                  {new Set(balances.map(b => b.coin?.symbol)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coin Holdings */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Coin Holdings
            </CardTitle>
            <CardDescription>
              View all coins held by this user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {balancesError && (
              <Alert variant="destructive">
                <AlertDescription>{balancesError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button onClick={fetchBalances} disabled={balancesLoading} variant="outline">
                {balancesLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Load Balances
              </Button>
              <Button onClick={fetchAllBalances} disabled={balancesLoading}>
                {balancesLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Load All Balances
              </Button>
            </div>
            
            {balancesLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading coin balances...</p>
                </div>
              </div>
            )}
            
            {balances.length > 0 && !balancesLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4" />
                  <span>{balances.length} coins found</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {balances.map((balance, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                {balance.coin?.media?.previewImage ? (
                                  <img 
                                    src={balance.coin.media.previewImage} 
                                    alt={balance.coin.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white text-xs font-medium">
                                    {balance.coin?.symbol?.slice(0, 2)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{balance.coin?.name}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {balance.coin?.symbol}
                                </Badge>
                              </div>
                            </div>
                            <Link href={`/coin/${balance.coin?.address}`}>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Balance</span>
                              <span className="text-sm font-medium">
                                {balance.amount?.amountDecimal?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Value (USD)</span>
                              <span className="text-sm font-medium">
                                ${parseFloat(balance.valueUsd || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Market Cap</span>
                              <span className="text-sm font-medium">
                                {balance.coin?.marketCap || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {balances.length === 0 && !balancesLoading && !balancesError && (
              <div className="text-center py-8">
                <Coins className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No coin holdings found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This user doesn't hold any coins yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}