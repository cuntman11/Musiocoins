export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIAgentProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  apiEndpoint?: string;
  agentName?: string;
}



export interface CoinPredictiveAnalysis {
  opportunities?: string[],
  prediction_type?:string,
  riskFactors?: string[],
  timeframe?: string,
  successProbability?: string;
}

export interface CoinAnalysis {
  analysisAspects?: string[],
  coinPotential?:string,
  strengths?: string[],
  weaknesses?: string,
}

export interface CreateCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name?: string;
    symbol?: string;
    description?: string;
    image?: File | null;
    assetType?: string;
    links?: Array<{platform: string, url: string}>;
  };
  coinPredictiveAnalysis?: CoinPredictiveAnalysis;
  coinAnalysis?: CoinAnalysis;
  trigger?: React.ReactNode;
}
