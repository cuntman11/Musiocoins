'use client';

import { useState } from 'react';
import { getCoin, getCoins, getCoinComments } from '@zoralabs/coins-sdk';
import { base, baseSepolia } from 'viem/chains';
import { Address } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, X, MessageCircle, Users, TrendingUp, Calendar, User } from 'lucide-react';


const CHAIN = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
interface CoinData {
  name: string;
  symbol: string;
  description: string;
  totalSupply: string;
  marketCap: string;
  volume24h: string;
  creatorAddress: string;
  createdAt: string;
  uniqueHolders: number;
  mediaContent?: {
    previewImage?: string;
  };
}

interface CommentData {
  node: {
    comment: string;
    timestamp: string;
    userProfile?: {
      handle: string;
    };
    userAddress: string;
    replies?: {
      edges: Array<{
        node: {
          text: string;
        };
      }>;
    };
  };
}

export default function ZoraCoinsPage() {
  const [singleCoin, setSingleCoin] = useState<CoinData | null>(null);
  const [multipleCoins, setMultipleCoins] = useState<CoinData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coinAddress, setCoinAddress] = useState('0x445e9c0a296068dc4257767b5ed354b77cf513de');

  const fetchSingleCoin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCoin({
        address: coinAddress as Address,
        chain: CHAIN,
      });

      const coin = response.data?.zora20Token;
      
      if (coin) {
        setSingleCoin({
          name: coin.name,
          symbol: coin.symbol,
          description: coin.description,
          totalSupply: coin.totalSupply,
          marketCap: coin.marketCap,
          volume24h: coin.volume24h,
          creatorAddress: coin.creatorAddress ?? '',
          createdAt: coin.createdAt ?? '',
          uniqueHolders: coin.uniqueHolders,
          mediaContent: coin.mediaContent
            ? {
                previewImage: coin.mediaContent.previewImage?.small || coin.mediaContent.previewImage?.medium || undefined,
              }
            : undefined,
        });
      }
    } catch (err: any) {
      if (err.status === 404) {
        setError('Coin not found');
      } else if (err.status === 401) {
        setError('API key invalid or missing');
      } else {
        setError(`Error fetching coin: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCoinComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCoinComments({
        address: coinAddress as Address,
        chain: base.id,
        count: 20,
      });

      const commentEdges = response.data?.zora20Token?.zoraComments?.edges || [];
      setComments(
        commentEdges.map((edge: any) => ({
          ...edge,
          node: {
            ...edge.node,
            timestamp: String(edge.node.timestamp),
          },
        }))
      );
    } catch (err: any) {
      setError(`Error fetching comments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all comments with pagination
  const fetchAllComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let allComments: CommentData[] = [];
      let cursor: string | undefined;
      const pageSize = 20;

      do {
        const response = await getCoinComments({
          address: coinAddress as Address,
          count: pageSize,
          after: cursor,
        });

        const edges = response.data?.zora20Token?.zoraComments?.edges;
        
        if (edges && edges.length > 0) {
          allComments = [
            ...allComments,
            ...edges.map((edge: any) => ({
              ...edge,
              node: {
                ...edge.node,
                timestamp: String(edge.node.timestamp),
              },
            })),
          ];
        }

        cursor = response.data?.zora20Token?.zoraComments?.pageInfo?.endCursor;

        if (!cursor || !edges || edges.length === 0) {
          break;
        }
      } while (true);

      setComments(allComments);
      console.log(`Fetched ${allComments.length} total comments`);
    } catch (err: any) {
      setError(`Error fetching all comments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find your next coin </h1>
        <p className="text-muted-foreground">Buy coins that you think can shoot up</p>
      </div>
      
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Single Coin Details
          </CardTitle>
          <CardDescription>
            Fetch detailed information about a specific coin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={coinAddress}
              onChange={(e) => setCoinAddress(e.target.value)}
              placeholder="Enter coin address"
              className="flex-1"
            />
            <Button onClick={fetchSingleCoin} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Fetch Coin
            </Button>
          </div>
          
          {singleCoin && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {singleCoin.mediaContent?.previewImage && (
                        <img src={singleCoin.mediaContent.previewImage} alt="Coin" />

                    )}
                    <div>
                      <CardTitle className="text-xl">{singleCoin.name}</CardTitle>
                      <Badge variant="secondary">{singleCoin.symbol}</Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {singleCoin.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
                    <p className="text-lg font-semibold">{singleCoin.marketCap}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                    <p className="text-lg font-semibold">{singleCoin.volume24h}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Supply</p>
                    <p className="text-lg font-semibold">{singleCoin.totalSupply}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Unique Holders</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {singleCoin.uniqueHolders}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Creator</p>
                    <p className="text-sm font-mono">{singleCoin.creatorAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {singleCoin.createdAt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Multiple Coins Section */}
      

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Coin Comments
          </CardTitle>
          <CardDescription>
            View community comments and discussions about the coin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={fetchCoinComments} disabled={loading} variant="outline">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Fetch Comments (Page 1)
            </Button>
            <Button onClick={fetchAllComments} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Fetch All Comments
            </Button>
          </div>
          
          {comments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>Found {comments.length} comments</span>
              </div>
              
              <div className="space-y-4">
                {comments.map((edge, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
             
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {edge.node?.userProfile?.handle || 
                               `${edge.node?.userAddress?.slice(0, 6)}...${edge.node?.userAddress?.slice(-4)}`}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {edge.node?.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{edge.node?.comment}</p>
                          
                          {edge.node?.replies?.edges && edge.node.replies.edges.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <Separator />
                              <div className="space-y-2">
                                {edge.node.replies.edges.map((reply, replyIndex) => (
                                  <div key={replyIndex} className="flex items-start gap-2 ml-4">
                            
                                    <div className="flex-1">
                                      <p className="text-sm text-muted-foreground">
                                        {reply.node.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}