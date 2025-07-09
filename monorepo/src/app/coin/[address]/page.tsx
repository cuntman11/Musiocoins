'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCoin, getCoinComments } from '@zoralabs/coins-sdk';
import { base, baseSepolia } from 'viem/chains';
import { Address, isAddress } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageCircle, Users, TrendingUp, Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
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

export default function CoinDetailsPage() {
  const params = useParams();
  const coinAddress = params.address as string;
  
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  const isValidAddress = coinAddress && isAddress(coinAddress);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  const fetchCoinData = async () => {
    if (!isValidAddress) {
      setError('Invalid coin address format');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getCoin({
        address: coinAddress as Address,
        chain: CHAIN,
      });

      const coinData = response.data?.zora20Token;
      
      if (coinData) {
        setCoin({
          name: coinData.name,
          symbol: coinData.symbol,
          description: coinData.description,
          totalSupply: coinData.totalSupply,
          marketCap: coinData.marketCap,
          volume24h: coinData.volume24h,
          creatorAddress: coinData.creatorAddress ?? '',
          createdAt: coinData.createdAt ?? '',
          uniqueHolders: coinData.uniqueHolders,
          mediaContent: coinData.mediaContent
            ? {
                previewImage: coinData.mediaContent.previewImage?.small || coinData.mediaContent.previewImage?.medium || undefined,
              }
            : undefined,
        });
      } else {
        setError('Coin not found');
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
    if (!isValidAddress) return;

    setCommentsLoading(true);
    setCommentsError(null);
    
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
      setCommentsError(`Error fetching comments: ${err.message}`);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchAllComments = async () => {
    if (!isValidAddress) return;

    setCommentsLoading(true);
    setCommentsError(null);
    
    try {
      let allComments: CommentData[] = [];
      let cursor: string | undefined;
      const pageSize = 20;

      do {
        const response = await getCoinComments({
          address: coinAddress as Address,
          chain: base.id,
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
    } catch (err: any) {
      setCommentsError(`Error fetching all comments: ${err.message}`);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Load coin data on component mount
  useEffect(() => {
    fetchCoinData();
  }, [coinAddress]);

  // Auto-load comments when coin data is loaded
  useEffect(() => {
    if (coin) {
      fetchCoinComments();
    }
  }, [coin]);

  if (!isValidAddress) {
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
            <h1 className="text-4xl font-bold">Invalid Address</h1>
            <p className="text-muted-foreground">The provided address is not a valid Ethereum address</p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>
            Please provide a valid Ethereum address in the URL path.
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
          <h1 className="text-4xl font-bold">{coin?.name || 'Coin Details'}</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {(coinAddress)}
          </p>
        </div>
        <Button onClick={fetchCoinData} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading coin data...</p>
          </div>
        </div>
      )}

      {coin && !loading && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {coin.mediaContent?.previewImage && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={coin.mediaContent.previewImage} 
                      alt={coin.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <CardTitle className="text-2xl">{coin.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">{coin.symbol}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            {coin.description && (
              <CardDescription className="mt-4 text-base">
                {coin.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
                <p className="text-xl font-bold">{coin.marketCap}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                <p className="text-xl font-bold">{coin.volume24h}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Supply</p>
                <p className="text-xl font-bold">{coin.totalSupply}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unique Holders</p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {coin.uniqueHolders.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Creator</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {formatAddress(coin.creatorAddress)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {coin.createdAt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {coin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Community Comments and Trade
            </CardTitle>
            <CardDescription>
              View community discussions about {coin.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {commentsError && (
              <Alert variant="destructive">
                <AlertDescription>{commentsError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button onClick={fetchCoinComments} disabled={commentsLoading} variant="outline">
                {commentsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Load Comments
              </Button>
              <Button onClick={fetchAllComments} disabled={commentsLoading}>
                {commentsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                <Link href={`/trade-coin/${coinAddress}`}>
                Trade
                </Link>
              </Button>
            </div>
            
            {commentsLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading comments...</p>
                </div>
              </div>
            )}
            
            {comments.length > 0 && !commentsLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments.length} comments found</span>
                </div>
                
                <div className="space-y-4">
                  {comments.map((edge, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {edge.node?.userProfile?.handle?.[0]?.toUpperCase() || 
                                   edge.node?.userAddress?.slice(2, 4).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-sm">
                                {edge.node?.userProfile?.handle || 
                                 `${edge.node?.userAddress?.slice(0, 6)}...${edge.node?.userAddress?.slice(-4)}`}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {edge.node?.timestamp}
                            </span>
                          </div>
                          
                          <p className="text-sm leading-relaxed">{edge.node?.comment}</p>
                          
                          {edge.node?.replies?.edges && edge.node.replies.edges.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <Separator />
                              <div className="space-y-3">
                                {edge.node.replies.edges.map((reply, replyIndex) => (
                                  <div key={replyIndex} className="flex items-start gap-2 ml-6 p-2 bg-muted/50 rounded">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                      <span className="text-white text-xs">↳</span>
                                    </div>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {comments.length === 0 && !commentsLoading && !commentsError && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No comments found for this coin</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to start a discussion!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}