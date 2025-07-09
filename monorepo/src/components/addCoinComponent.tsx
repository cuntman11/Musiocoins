'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAccount, useChainId, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from "wagmi";
import { setApiKey } from "@zoralabs/coins-sdk";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import { base, baseSepolia } from "viem/chains";
import { 
  DeployCurrency, 
  InitialPurchaseCurrency, 
  createCoinCall,
  getCoinCreateFromLogs,
} from "@zoralabs/coins-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Upload, CheckCircle, XCircle, AlertCircle, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { uploadToIPFS } from "@/utils/pinata/upload";
import { ASSET_TYPES } from "@/utils/constants/add-coin/assetTypes";
import { LINK_PLATFORMS } from "@/utils/constants/add-coin/linkPlatforms";
import { DEFAULT_IMAGE_DATA_URL } from "@/utils/constants/addCoinConstants";
import { CreateCoinModalProps, CoinPredictiveAnalysis, CoinAnalysis } from "@/utils/interfaces";
import { AIAnalysisComponent } from "./AIAnalysisComponent";

const ZORA_API_KEY = process.env.NEXT_PUBLIC_ZORA_API_KEY;
const CHAIN = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export default function CreateCoinModal({ 
  isOpen, 
  onClose, 
  initialData, 
  trigger, 
  coinPredictiveAnalysis, 
  coinAnalysis 
}: CreateCoinModalProps) {
  useEffect(() => {
    if (ZORA_API_KEY) {
      setApiKey(ZORA_API_KEY);
    }
  }, []);

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
  const [useDefaultImage, setUseDefaultImage] = useState(true);
  
  const toastIds = useRef<{[key: string]: string}>({});
  const hasProcessedReceipt = useRef(false);
  const hasProcessedError = useRef(false);
  const previousSimulationError = useRef<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [CoinPredictionAnalysis, setCoinPredictionAnalysis] = useState<CoinPredictiveAnalysis | null>(null); 
  const [CoinAnalysis, setCoinAnalysis] = useState<CoinAnalysis | null>(null);
  const [successShown, setSuccessShown] = useState(false);
  const simulationConfig = useMemo(() => {
    if (!contractCallParams || !address || !isConnected) {
      return { enabled: false };
    }
    
    return {
      ...contractCallParams,
      account: address,
      enabled: true,
    };
  }, [contractCallParams, address, isConnected]);
  
  const { data: simulation, error: simulationError } = useSimulateContract(simulationConfig);

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
  } = useWaitForTransactionReceipt(
    txHash
      ? {
          hash: txHash,
        }
      : { hash: undefined }
  );

  const addLink = useCallback(() => {
    setLinks(prev => [...prev, { platform: "", url: "" }]);
  }, []);

  const removeLink = useCallback((index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateLink = useCallback((index: number, field: 'platform' | 'url', value: string) => {
    setLinks(prev => {
      const updatedLinks = [...prev];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return updatedLinks;
    });
  }, []);

  const createDefaultImageFile = useCallback(async (): Promise<File> => {
    const response = await fetch(DEFAULT_IMAGE_DATA_URL);
    const blob = await response.blob();
    return new File([blob], 'default-image.svg', { type: 'image/svg+xml' });
  }, []);

  const createCustomMetadata = useCallback(async () => {
    let imageFile: File;
    let imageUrl: string;
    
    if (image) {
      imageFile = image;
      imageUrl = await uploadToIPFS(imageFile);
    } else {
      imageFile = await createDefaultImageFile();
      imageUrl = await uploadToIPFS(imageFile);
    }
    
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
    
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });
    const metadataFile = new File([metadataBlob], 'metadata.json', {
      type: 'application/json'
    });
    
    const metadataUrl = await uploadToIPFS(metadataFile);
    return metadataUrl;
  }, [image, links, name, symbol, description, assetType, createDefaultImageFile]);

  const handlePrepareCoin = useCallback(async () => {
    if (!isConnected || !address) {
      toast.error("🔒 Wallet not connected");
      return;
    }
    
    if (!name || !symbol || !description || !assetType) {
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
      
      const toastId = toast.loading("📤 Uploading to IPFS...");
    
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
      
      toast.dismiss(toastId);
      toast.success("✅ Coin prepared successfully!");
    } catch (err) {
      console.error("Error preparing coin creation:", err);
      toast.error(`❌ Preparation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsPreparingCoin(false);
    }
  }, [isConnected, address, name, symbol, description, assetType, links, createCustomMetadata, chainId, currency, initialPurchaseAmount]);

  const handleCreateCoin = useCallback(() => {
    if (simulation?.request) {
      hasProcessedReceipt.current = false;
      hasProcessedError.current = false;
      writeContract(simulation.request);
    } else {
      toast.error("⚠️ Transaction not ready");
    }
  }, [simulation?.request, writeContract]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
      setUseDefaultImage(false);
      toast.success("🖼️ Image selected");
    }
  }, []);

  const handleClose = useCallback(() => {
    hasProcessedReceipt.current = false;
    hasProcessedError.current = false;
    previousSimulationError.current = null;
    Object.values(toastIds.current).forEach(id => toast.dismiss(id));
    toastIds.current = {};
    onClose();
  }, [onClose]);

  // Optimized input handlers to prevent unnecessary re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleAssetTypeChange = useCallback((value: string) => {
    setAssetType(value);
  }, []);

  const handleCurrencyChange = useCallback((value: string) => {
    setCurrency(Number(value) as DeployCurrency);
  }, []);

  const handleInitialPurchaseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialPurchaseAmount(e.target.value);
  }, []);

  // Effect to handle modal state changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setSymbol(initialData.symbol || "");
        setDescription(initialData.description || "");
        setImage(initialData.image || null);
        setAssetType(initialData.assetType || "");
        setLinks(initialData.links || []);
        setUseDefaultImage(!initialData.image);
      } else {
        // Reset to default values
        setName("");
        setSymbol("");
        setDescription("");
        setImage(null);
        setAssetType("");
        setLinks([]);
        setUseDefaultImage(true);
      }
      setContractCallParams(null);
      setMetadataUri("");
      setDeployedCoinAddress("");
      setIsPreparingCoin(false);
      setCurrency(DeployCurrency.ZORA);
      setInitialPurchaseAmount("");
      hasProcessedReceipt.current = false;
      hasProcessedError.current = false;
      previousSimulationError.current = null;
    }
  }, [isOpen, initialData]);
useEffect(() => {
  if (isReceiptSuccess && receipt && txHash && !hasProcessedReceipt.current) {
    hasProcessedReceipt.current = true;
    
    try {
      const coinDeployment = getCoinCreateFromLogs(receipt);
      if (coinDeployment?.coin) {
        setDeployedCoinAddress(coinDeployment.coin);
        
        // Use toastIds ref to track shown toasts
        const toastId = `success-${txHash}`;
        if (!toastIds.current[toastId]) {
          toastIds.current[toastId] = toast.success(
            `🎉 Coin created successfully! Deployed at ${coinDeployment.coin}`,
            { id: toastId }
          );
        }

        setTimeout(() => handleClose(), 2000);
      }
    } catch (error) {
      console.error("Error extracting coin address:", error);
      toast.error("❌ Error creating coin");
    }
  }
}, [isReceiptSuccess, receipt, txHash, handleClose]);

  useEffect(() => {
    if (isWriteError && writeError && !hasProcessedError.current) {
      hasProcessedError.current = true;
      const errorMessage = writeError.message || "Unknown transaction error";
      toast.error(`❌ Transaction failed: ${errorMessage}`);
    }
  }, [isWriteError, writeError]);

  // Effect to handle simulation errors with deduplication
  useEffect(() => {
    if (simulationError && contractCallParams) {
      const currentErrorMessage = simulationError.message || "Unknown simulation error";
      
      // Only show toast if this is a new error
      if (previousSimulationError.current !== currentErrorMessage) {
        console.error("Simulation error:", simulationError);
        
        // Clear previous simulation error toast
        if (toastIds.current.simulationError) {
          toast.dismiss(toastIds.current.simulationError);
        }
        
        toastIds.current.simulationError = toast.error(`❌ Simulation failed: ${currentErrorMessage}`);
        previousSimulationError.current = currentErrorMessage;
      }
    } else if (!simulationError) {
      // Clear error state when simulation succeeds
      if (toastIds.current.simulationError) {
        toast.dismiss(toastIds.current.simulationError);
        delete toastIds.current.simulationError;
      }
      previousSimulationError.current = null;
    }
  }, [simulationError]);

  // Effect to handle pending transaction state
  useEffect(() => {
    if (isWritePending && !toastIds.current.pending) {
      toastIds.current.pending = toast.loading("📝 Confirm transaction in wallet");
    } else if (!isWritePending && toastIds.current.pending) {
      toast.dismiss(toastIds.current.pending);
      delete toastIds.current.pending;
    }
  }, [isWritePending]);

  // Effect to handle receipt loading state
  useEffect(() => {
    if (isReceiptLoading && !toastIds.current.creating) {
      toastIds.current.creating = toast.loading("⏳ Creating your coin...");
    } else if (!isReceiptLoading && toastIds.current.creating) {
      toast.dismiss(toastIds.current.creating);
      delete toastIds.current.creating;
    }
  }, [isReceiptLoading]);

  // Memoized computed values
  const isWrongNetwork = useMemo(() => 
    chainId && chainId !== CHAIN, 
    [chainId]
  );

  // Memoized Modal Content to prevent unnecessary re-renders
  const ModalContent = useMemo(() => {
    return (
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          {isWrongNetwork && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Please switch to Base network to create your coin. Current network may not be supported.
              </AlertDescription>
            </Alert>
          )}

          <AIAnalysisComponent 
            coinPredictiveAnalysis={coinPredictiveAnalysis}
            coinAnalysis={coinAnalysis}
          />
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Asset Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
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
                onChange={handleSymbolChange}
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
            <Select value={assetType} onValueChange={handleAssetTypeChange}>
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
              onChange={handleDescriptionChange}
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

          <div className="space-y-2">
            <Label htmlFor="image">
              Asset Image {useDefaultImage && <span className="text-sm text-muted-foreground">(Using default image)</span>}
            </Label>
            <Input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
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
            {useDefaultImage && (
              <div className="mt-3 flex items-center space-x-3">
                <img 
                  src={DEFAULT_IMAGE_DATA_URL} 
                  alt="Default Preview" 
                  className="h-20 w-20 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Default placeholder image</p>
                  <p>Will be used if no image is uploaded</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Trading Currency</Label>
              <Select value={currency.toString()} onValueChange={handleCurrencyChange}>
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
                onChange={handleInitialPurchaseChange}
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

          {simulationError && contractCallParams && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Transaction simulation failed. Please check your parameters.
              </AlertDescription>
            </Alert>
          )}
          
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
      </div>
    );
  }, [
    isWrongNetwork,
    coinPredictiveAnalysis,
    coinAnalysis,
    name,
    symbol,
    assetType,
    description,
    links,
    image,
    useDefaultImage,
    currency,
    initialPurchaseAmount,
    isPreparingCoin,
    isConnected,
    contractCallParams,
    simulation,
    isWritePending,
    isReceiptLoading,
    simulationError,
    metadataUri,
    handleNameChange,
    handleSymbolChange,
    handleAssetTypeChange,
    handleDescriptionChange,
    addLink,
    updateLink,
    removeLink,
    handleImageChange,
    handleCurrencyChange,
    handleInitialPurchaseChange,
    handlePrepareCoin,
    handleCreateCoin,
  ]);

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Create Digital Asset Coin
            </DialogTitle>
          </DialogHeader>
          {isConnected ? (
            ModalContent
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Please connect your wallet to create a coin</p>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create Digital Asset Coin
          </DialogTitle>
        </DialogHeader>
        {isConnected ? (
          ModalContent
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Please connect your wallet to create a coin</p>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}