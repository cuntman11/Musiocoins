
'use client';
import { useEffect } from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import CreateCoinModal from '@/components/addCoinComponent';

interface CoinData {
  name?: string;
  symbol?: string;
  description?: string;
  assetType?: string;
  links?: Array<{platform: string, url: string}>;
  image?: File | null;
  currency?: string;
  initialPurchaseAmount?: string;
}
interface CoinPredictiveAnalysis {
  opportunities?: string[],
  prediction_type?:string,
  riskFactors?: string[],
  timeframe?: string,
  successProbability?: string;
}

interface CoinAnalysis {
  analysisAspects?: string[],
  coinPotential?:string,
  strengths?: string[],
  weaknesses?: string,
}

interface ModalContextType {
  openCreateCoinModal: (data?: CoinData, coinPredictiveAnalysis?: CoinPredictiveAnalysis, coinAnalysis?: CoinAnalysis) => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinData, setCoinData] = useState<CoinData>({});
  const [coinPredictiveAnalysis, setCoinPredictiveAnalysis] = useState<CoinPredictiveAnalysis>({});
  const [coinAnalysis, setCoinAnalysis] = useState<CoinAnalysis>({});



  const openCreateCoinModal = (data: CoinData = {}, coinPredictiveAnalysis?: CoinPredictiveAnalysis, coinAnalysis?: CoinAnalysis) => {
    setCoinData(data);
    setCoinPredictiveAnalysis(coinPredictiveAnalysis || {});
    setCoinAnalysis(coinAnalysis || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCoinData({});
  };

  return (
    <ModalContext.Provider value={{ openCreateCoinModal, closeModal, isModalOpen }}>
      {children}
      <CreateCoinModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={coinData}
        coinPredictiveAnalysis={coinPredictiveAnalysis}
        coinAnalysis={coinAnalysis}
        trigger={undefined}
      />
    </ModalContext.Provider>
  );
};