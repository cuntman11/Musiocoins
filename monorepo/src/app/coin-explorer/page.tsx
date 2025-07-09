'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Volume2, 
  Crown, 
  Sparkles, 
  Activity, 
  Users,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign
} from 'lucide-react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  address: string;
  totalSupply: string;
  totalVolume: string;
  volume24h: string;
  createdAt: string;
  creatorAddress: string;
  marketCap: string;
  marketCapDelta24h?: string;
  chainId: number;
  uniqueHolders: number;
}

interface ExploreResponse {
  data?: {
    exploreList?: {
      edges?: Array<{ node: Coin }>;
      pageInfo?: {
        endCursor?: string;
      };
    };
  };
}

// Import actual SDK functions
import { 
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  getCoinsLastTraded,
  getCoinsLastTradedUnique
} from "@zoralabs/coins-sdk";
import Link from 'next/link';

// Hook for fetching coins data
const useCoinsData = () => {
  const [data, setData] = useState<{
    topGainers: Coin[];
    topVolume: Coin[];
    mostValuable: Coin[];
    newCoins: Coin[];
    lastTraded: Coin[];
    lastTradedUnique: Coin[];
  }>({
    topGainers: [],
    topVolume: [],
    mostValuable: [],
    newCoins: [],
    lastTraded: [],
    lastTradedUnique: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        topGainersRes,
        topVolumeRes,
        mostValuableRes,
        newCoinsRes,
        lastTradedRes,
        lastTradedUniqueRes
      ] = await Promise.all([
        getCoinsTopGainers({ count: 10 }),
        getCoinsTopVolume24h({ count: 10 }),
        getCoinsMostValuable({ count: 10 }),
        getCoinsNew({ count: 10 }),
        getCoinsLastTraded({ count: 10 }),
        getCoinsLastTradedUnique({ count: 10 })
      ]);

      setData({
        topGainers: topGainersRes.data?.exploreList?.edges?.map(edge => ({
          ...edge.node,
          createdAt: edge.node.createdAt ?? '',
          creatorAddress: edge.node.creatorAddress ?? ''
        })) || [],
        topVolume: topVolumeRes.data?.exploreList?.edges?.map(edge => ({
          ...edge.node,
          createdAt: edge.node.createdAt ?? '',
          creatorAddress: edge.node.creatorAddress ?? ''
        })) || [],
        mostValuable: mostValuableRes.data?.exploreList?.edges?.map(edge => ({
          ...edge.node,
          createdAt: edge.node.createdAt ?? '',
          creatorAddress: edge.node.creatorAddress ?? ''
        })) || [],
        newCoins: newCoinsRes.data?.exploreList?.edges?.map(edge => ({
          ...edge.node,
          createdAt: edge.node.createdAt ?? '',
          creatorAddress: edge.node.creatorAddress ?? ''
        })) || [],
        lastTraded: lastTradedRes.data?.exploreList?.edges?.map(edge => ({
          ...edge.node,
          createdAt: edge.node.createdAt ?? '',
          creatorAddress: edge.node.creatorAddress ?? ''
        })) || [],
        lastTradedUnique: lastTradedUniqueRes.data?.exploreList?.edges?.map(edge => ({
          ...edge.node,
          createdAt: edge.node.createdAt ?? '',
          creatorAddress: edge.node.creatorAddress ?? ''
        })) || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// Component for displaying individual coin cards
const CoinCard: React.FC<{ coin: Coin; showDelta?: boolean }> = ({ coin, showDelta = false }) => {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return `${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDeltaColor = (delta?: string) => {
    if (!delta) return 'text-muted-foreground';
    const num = parseFloat(delta);
    return num >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getDeltaIcon = (delta?: string) => {
    if (!delta) return null;
    const num = parseFloat(delta);
    return num >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{coin.name}</h3>
            <p className="text-sm text-muted-foreground">{coin.symbol}</p>
          </div>
          {showDelta && coin.marketCapDelta24h && (
            <Badge variant="outline" className={getDeltaColor(coin.marketCapDelta24h)}>
              <div className="flex items-center gap-1">
                {getDeltaIcon(coin.marketCapDelta24h)}
                {parseFloat(coin.marketCapDelta24h).toFixed(2)}%
              </div>
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Market Cap:</span>
            <span className="font-medium">{formatCurrency(coin.marketCap)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volume 24h:</span>
            <span className="font-medium">{formatCurrency(coin.volume24h)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Holders:</span>
            <span className="font-medium">{coin.uniqueHolders.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">{formatDate(coin.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Creator:</span>
            <span className="font-medium">{coin.creatorAddress}</span>
          </div>
         <div className="flex justify-center">
          <Link href={`/coin/${coin.address}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <span>View details</span>
          </Link>
           <Link href={`/trade-coin/${coin.address}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <span>Trade</span>
          </Link>
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CoinsExplorer: React.FC = () => {
  const { data, loading, error, refetch } = useCoinsData();

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading coins data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const CoinsGrid: React.FC<{ coins: Coin[]; showDelta?: boolean }> = ({ coins, showDelta = false }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        coins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} showDelta={showDelta} />
        ))
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coins Explorer</h1>
          <p className="text-muted-foreground mt-2">
            Discover and explore coins across different categories
          </p>
        </div>
        <Button onClick={refetch} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="top-gainers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="top-gainers" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Top Gainers</span>
          </TabsTrigger>
          <TabsTrigger value="top-volume" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">Volume</span>
          </TabsTrigger>
          <TabsTrigger value="most-valuable" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Valuable</span>
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </TabsTrigger>
          <TabsTrigger value="last-traded" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Traded</span>
          </TabsTrigger>
          <TabsTrigger value="unique-traders" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Unique</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-gainers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Gainers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinsGrid coins={data.topGainers} showDelta={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-volume" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Highest Volume (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinsGrid coins={data.topVolume} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="most-valuable" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Most Valuable (Market Cap)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinsGrid coins={data.mostValuable} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Recently Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinsGrid coins={data.newCoins} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="last-traded" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recently Traded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinsGrid coins={data.lastTraded} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unique-traders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recently Traded (Unique Traders)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinsGrid coins={data.lastTradedUnique} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoinsExplorer;