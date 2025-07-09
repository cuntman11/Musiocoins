'use client';

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from "wagmi";
import { setApiKey } from "@zoralabs/coins-sdk";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import { 
  DeployCurrency, 
  InitialPurchaseCurrency, 
  createCoinCall,
  getCoinCreateFromLogs,
} from "@zoralabs/coins-sdk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Wallet, CheckCircle, XCircle, Info, AlertCircle, ExternalLink, Plus, Trash2 } from "lucide-react";
import InfoCards from "@/components/InfoCards";
import ConnectWallet from "@/components/ConnectWallet";
import { uploadToIPFS } from "@/utils/pinata/upload";
import { ASSET_TYPES } from "@/utils/constants/add-coin/assetTypes";
import { LINK_PLATFORMS } from "@/utils/constants/add-coin/linkPlatforms";

const ZORA_API_KEY = process.env.NEXT_PUBLIC_ZORA_API_KEY;
const CHAIN = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export default function CreateCoinPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [assetType, setAssetType] = useState("");
  const [links, setLinks] = useState<Array<{platform: string, url: string}>>([]);
  const [currency, setCurrency] = useState<DeployCurrency>(DeployCurrency.ZORA);
  const [initialPurchaseAmount, setInitialPurchaseAmount] = useState("");
  const [isPreparingCoin, setIsPreparingCoin] = useState(false);
  const [contractCallParams, setContractCallParams] = useState<any>(null);
  const [metadataUri, setMetadataUri] = useState<string>("");
  const [deployedCoinAddress, setDeployedCoinAddress] = useState<string>("");
  
  setApiKey(ZORA_API_KEY);
  
  const { data: simulation, error: simulationError } = useSimulateContract(
    contractCallParams ? {
      ...contractCallParams,
      account: address,
    } : undefined
  );

  const { 
    writeContract, 
    isPending: isWritePending, 
    isSuccess: isWriteSuccess, 
    isError: isWriteError, 
    error: writeError, 
    data: txHash 
  } = useWriteContract();

  const { 
    data: receipt, 
    isLoading: isReceiptLoading, 
    isSuccess: isReceiptSuccess 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isReceiptSuccess && receipt) {
      try {
        const coinDeployment = getCoinCreateFromLogs(receipt);
        if (coinDeployment?.coin) {
          setDeployedCoinAddress(coinDeployment.coin);
          toast.success(`🎉 Coin created successfully! Deployed at ${coinDeployment.coin}`);
          resetForm();
        }
      } catch (error) {
        console.error("Error extracting coin address:", error);
        toast.error("❌ Error creating coin");
        resetForm();
      }
    }
  }, [isReceiptSuccess, receipt, txHash]);

  useEffect(() => {
    if (isWriteError && writeError) {
      toast.error(`❌ Transaction failed: ${writeError.message}`);
    }
  }, [isWriteError, writeError]);

  useEffect(() => {
    if (simulationError && contractCallParams) {
      toast.error(`❌ Simulation failed: ${simulationError.message}`);
    }
  }, [simulationError, contractCallParams]);

  useEffect(() => {
    if (isWritePending) {
      toast.loading("📝 Confirm transaction in wallet", {
        duration: 30000,
      });
    }
  }, [isWritePending]);

  useEffect(() => {
    if (isReceiptLoading) {
      toast.loading("⏳ Creating your coin...", {
        duration: 60000,
      });
    }
  }, [isReceiptLoading]);

  const resetForm = () => {
    setName("");
    setSymbol("");
    setDescription("");
    setImage(null);
    setAssetType("");
    setLinks([]);
    setInitialPurchaseAmount("");
    setContractCallParams(null);
    setMetadataUri("");
    setDeployedCoinAddress("");
  };

  const addLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const createCustomMetadata = async () => {
    if (!image) throw new Error("Image is required");
    const imageUrl = await uploadToIPFS(image);
    const linksObject: Record<string, string> = {};
    links.forEach(link => {
      if (link.platform && link.url) {
        linksObject[link.platform] = link.url;
      }
    });
    
    const metadata = {
      name,
      symbol,
      description,
      image: imageUrl,
      type: assetType,
      links: linksObject,
      attributes: [
        {
          trait_type: "Asset Type",
          value: assetType
        },
        {
          trait_type: "Links Count",
          value: Object.keys(linksObject).length
        }
      ]
    };
    
    // Upload metadata to IPFS
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });
    const metadataFile = new File([metadataBlob], 'metadata.json', {
      type: 'application/json'
    });
    
    const metadataUrl = await uploadToIPFS(metadataFile);
    return metadataUrl;
  };

  const handlePrepareCoin = async () => {
    if (!isConnected || !address) {
      toast.error("🔒 Wallet not connected");
      return;
    }
    
    if (!name || !symbol || !description || !image || !assetType) {
      toast.error("📝 Please fill in all required fields");
      return;
    }
    
    const validLinks = links.filter(link => link.platform && link.url);
    if (validLinks.length !== links.length) {
      toast.error("🔗 Please complete all link entries or remove empty ones");
      return;
    }
    
    try {
      setIsPreparingCoin(true);
      
      toast.loading("📤 Uploading to IPFS...", {
        duration: 30000,
      });
    
      const metadataUrl = await createCustomMetadata();
      setMetadataUri(metadataUrl);
      
      const coinParams = {
        name,
        symbol,
        uri: metadataUrl as import("@zoralabs/coins-sdk").ValidMetadataURI,
        payoutRecipient: address as `0x${string}`,
        chainId: chainId || CHAIN,
        currency,
        ...(initialPurchaseAmount && {
          initialPurchase: {
            currency: InitialPurchaseCurrency.ETH,
            amount: parseEther(initialPurchaseAmount),
          },
        }),
      };

      const callParams = await createCoinCall(coinParams);
      setContractCallParams(callParams);
      
      toast.success("✅ Coin prepared successfully!");
    } catch (err) {
      console.error("Error preparing coin creation:", err);
      toast.error(`❌ Preparation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsPreparingCoin(false);
    }
  };

  const handleCreateCoin = () => {
    if (simulation?.request) {
      writeContract(simulation.request);
    } else {
      toast.error("⚠️ Transaction not ready");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("📁 File too large (max 5MB)");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("🖼️ Invalid file type");
        return;
      }
      setImage(file);
      toast.success("🖼️ Image selected");
    }
  };

  const isWrongNetwork = chainId && chainId !== CHAIN;

  return (
    <div className="">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Digitalize Your Asset
            </CardTitle>
            <CardDescription className="text-lg">
              Create a coin representing your digital asset on Base via Zora Protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <ConnectWallet />
            ) : (
              <>
                {isWrongNetwork && (
                  <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Please switch to Base network to create your coin. Current network may not be supported.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Asset Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Digital Asset"
                        required
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symbol">
                        Symbol <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="symbol"
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        placeholder="MDA"
                        required
                        maxLength={10}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assetType">
                      Asset Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={assetType} onValueChange={setAssetType}>
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your digital asset..."
                      required
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Links Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Asset Links</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLink}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                    
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Select 
                            value={link.platform} 
                            onValueChange={(value) => updateLink(index, 'platform', value)}
                          >
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                              {LINK_PLATFORMS.map((platform) => (
                                <SelectItem key={platform} value={platform}>
                                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-2">
                          <Input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLink(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {links.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add links to your asset (YouTube, Instagram, GitHub, etc.)
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Asset Image <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {image && (
                      <div className="mt-3 flex items-center space-x-3">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover rounded-lg border-2 border-blue-200"
                        />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium">{image.name}</p>
                          <p>{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trading Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Trading Currency</Label>
                      <Select value={currency.toString()} onValueChange={(value) => setCurrency(Number(value) as DeployCurrency)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DeployCurrency.ZORA.toString()}>
                            <div className="flex items-center space-x-2">
                              <span>ZORA</span>
                              <span className="text-xs text-muted-foreground">(Recommended)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value={DeployCurrency.ETH.toString()}>ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialPurchase">Initial Purchase (ETH)</Label>
                      <Input
                        id="initialPurchase"
                        type="number"
                        value={initialPurchaseAmount}
                        onChange={(e) => setInitialPurchaseAmount(e.target.value)}
                        placeholder="0.01"
                        min="0"
                        step="0.001"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Seeds initial liquidity
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={handlePrepareCoin}
                      disabled={isPreparingCoin || !isConnected || !!isWrongNetwork}
                      className="flex-1"
                    >
                      {isPreparingCoin ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Preparing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Prepare Coin
                        </>
                      )}
                    </Button>

                    {contractCallParams && simulation && (
                      <Button
                        type="button"
                        onClick={handleCreateCoin}
                        disabled={isWritePending || isReceiptLoading || !simulation.request}
                        className="flex-1"
                      >
                        {isWritePending || isReceiptLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isWritePending ? "Confirming..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Create Coin
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {/* Error Display */}
                  {simulationError && contractCallParams && (
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Transaction simulation failed. Please check your parameters.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Metadata Preview */}
                  {metadataUri && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Metadata uploaded successfully! 
                        <a 
                          href={metadataUri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 underline hover:text-green-900"
                        >
                          View metadata <ExternalLink className="inline h-3 w-3" />
                        </a>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <InfoCards />
      </div>
    </div>
  );
}