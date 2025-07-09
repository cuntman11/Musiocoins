import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Target, 
  Zap, 
  Shield,
  Brain,
  BarChart3,
  ChevronRight,
  Sparkles,
  Activity
} from "lucide-react";

interface CoinPredictiveAnalysis {
  opportunities?: string[];
  prediction_type?: string;
  riskFactors?: string[];
  timeframe?: string;
  successProbability?: string;
}

interface CoinAnalysis {
  analysisAspects?: string[];
  coinPotential?: string;
  strengths?: string[];
  weaknesses?: string;
}

interface AIAnalysisProps {
  coinPredictiveAnalysis?: CoinPredictiveAnalysis;
  coinAnalysis?: CoinAnalysis;
}

export const AIAnalysisComponent: React.FC<AIAnalysisProps> = ({ 
  coinPredictiveAnalysis, 
  coinAnalysis 
}) => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Stagger card animations
  useEffect(() => {
    const cards = [];
    if (coinPredictiveAnalysis) cards.push(0);
    if (coinAnalysis) cards.push(1);
    
    cards.forEach((cardIndex, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, cardIndex]);
      }, index * 200);
    });

    setTimeout(() => {
      setLoadingComplete(true);
    }, cards.length * 200 + 500);
  }, [coinPredictiveAnalysis, coinAnalysis]);

  // Don't render if no analysis data is provided
  if (!coinPredictiveAnalysis && !coinAnalysis) {
    return null;
  }

  const AnimatedBadge: React.FC<{
    children: React.ReactNode;
    variant?: "secondary" | "default" | "destructive" | "outline";
    className?: string;
    delay?: number;
  }> = ({ children, variant = "secondary", className = "", delay = 0 }) => (
    <div 
      className={`transform transition-all duration-500 ${loadingComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Badge 
        variant={variant} 
        className={`${className} hover:scale-105 transition-transform duration-200 cursor-default`}
      >
        {children}
      </Badge>
    </div>
  );

  interface AnimatedListItemProps {
    children: React.ReactNode;
    index: number;
    borderColor?: string;
  }

  const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ children, index, borderColor = "border-gray-400" }) => (
    <div 
      className={`transform transition-all duration-500 hover:scale-[1.02] ${
        loadingComplete ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border-l-4 ${borderColor} 
        hover:shadow-md transition-all duration-300 hover:from-gray-100 hover:to-gray-50 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent 
          -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      {/* Animated Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 via-black to-gray-300 
          rounded-lg blur opacity-20 animate-pulse"></div>
        <div className="relative flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 
          shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative">
            <Brain className="h-6 w-6 text-gray-800 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              AI Analysis
              <Sparkles className="h-4 w-4 text-gray-600 animate-bounce" />
            </h3>
            <p className="text-sm text-gray-600 mt-1">Powered by advanced algorithms</p>
          </div>
          <div className="ml-auto">
            <Activity className="h-5 w-5 text-gray-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Predictive Analysis Card */}
        {coinPredictiveAnalysis && (
          <div 
            className={`transform transition-all duration-700 ${
              visibleCards.includes(0) ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Card className={`border-gray-200 bg-white transition-all duration-300 hover:shadow-xl 
              hover:shadow-gray-200/50 relative overflow-hidden group ${
                hoveredCard === 0 ? 'border-gray-400' : ''
              }`}>
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-black/5 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg flex items-center gap-3 text-gray-900 group-hover:text-black transition-colors">
                  <div className="relative">
                    <BarChart3 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gray-400 rounded-full blur-sm opacity-0 
                      group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  Predictive Analysis
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                    hoveredCard === 0 ? 'translate-x-1' : ''
                  }`} />
                </CardTitle>
                {coinPredictiveAnalysis.prediction_type && (
                  <CardDescription className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    {coinPredictiveAnalysis.prediction_type}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                {/* Success Probability */}
                {coinPredictiveAnalysis.successProbability && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Success Probability</span>
                    </div>
                    <AnimatedBadge 
                      className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 text-base px-4 py-2"
                      delay={200}
                    >
                      {coinPredictiveAnalysis.successProbability}
                    </AnimatedBadge>
                  </div>
                )}

                {/* Timeframe */}
                {coinPredictiveAnalysis.timeframe && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Timeframe</span>
                    </div>
                    <AnimatedBadge 
                      variant="outline" 
                      className="border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50 text-base px-4 py-2"
                      delay={300}
                    >
                      {coinPredictiveAnalysis.timeframe}
                    </AnimatedBadge>
                  </div>
                )}

                {/* Opportunities */}
                {coinPredictiveAnalysis.opportunities && coinPredictiveAnalysis.opportunities.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Opportunities</span>
                    </div>
                    <div className="space-y-3">
                      {coinPredictiveAnalysis.opportunities.map((opportunity, index) => (
                        <AnimatedListItem key={index} index={index} borderColor="border-green-400">
                          {opportunity}
                        </AnimatedListItem>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Factors */}
                {coinPredictiveAnalysis.riskFactors && coinPredictiveAnalysis.riskFactors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Risk Factors</span>
                    </div>
                    <div className="space-y-3">
                      {coinPredictiveAnalysis.riskFactors.map((risk, index) => (
                        <AnimatedListItem key={index} index={index} borderColor="border-red-400">
                          {risk}
                        </AnimatedListItem>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Coin Analysis Card */}
        {coinAnalysis && (
          <div 
            className={`transform transition-all duration-700 ${
              visibleCards.includes(1) ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Card className={`border-gray-200 bg-white transition-all duration-300 hover:shadow-xl 
              hover:shadow-gray-200/50 relative overflow-hidden group ${
                hoveredCard === 1 ? 'border-gray-400' : ''
              }`}>
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-gray-50/50 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg flex items-center gap-3 text-gray-900 group-hover:text-black transition-colors">
                  <div className="relative">
                    <Zap className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gray-400 rounded-full blur-sm opacity-0 
                      group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  Coin Analysis
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                    hoveredCard === 1 ? 'translate-x-1' : ''
                  }`} />
                </CardTitle>
                {coinAnalysis.coinPotential && (
                  <CardDescription className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    {coinAnalysis.coinPotential}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                {/* Analysis Aspects */}
                {coinAnalysis.analysisAspects && coinAnalysis.analysisAspects.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Analysis Aspects</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {coinAnalysis.analysisAspects.map((aspect, index) => (
                        <AnimatedBadge 
                          key={index}
                          variant="outline" 
                          className="border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50"
                          delay={index * 100}
                        >
                          {aspect}
                        </AnimatedBadge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {coinAnalysis.strengths && coinAnalysis.strengths.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Strengths</span>
                    </div>
                    <div className="space-y-3">
                      {coinAnalysis.strengths.map((strength, index) => (
                        <AnimatedListItem key={index} index={index} borderColor="border-green-400">
                          {strength}
                        </AnimatedListItem>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weaknesses */}
                {coinAnalysis.weaknesses && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Weaknesses</span>
                    </div>
                    <AnimatedListItem index={0} borderColor="border-red-400">
                      {coinAnalysis.weaknesses}
                    </AnimatedListItem>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Animated Separator */}
      <div className="relative my-8">
        <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent h-px 
          animate-pulse opacity-50"></div>
      </div>
    </div>
  );
};

