import {
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
  Users,
  TrendingUp,
  Rocket,
  BarChart3,
  Bot,
  Coins,
  Search,
  Brain,
  Lightbulb,
  Activity
} from "lucide-react";

export const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AI-Powered Coin Creation",
    description: "Three specialized AI chatbots - Tokebot Sonnet, Tokebot Mood, and Tokebot Prompt - each designed for different coin creation workflows."
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: "Zora Protocol Integration",
    description: "Seamlessly deploy coins on the Zora protocol with automated smart contract generation and instant minting capabilities."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Predictive Success Analysis",
    description: "AI-powered analysis that predicts coin success potential, providing strengths, weaknesses, and viral opportunity insights."
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Advanced Search & Discovery",
    description: "Explore trending coins, search profiles, and discover emerging opportunities through our intelligent coin explorer."
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Mood-Based Creation",
    description: "Rant, yap, or express yourself - Tokebot Mood transforms your emotions into perfectly crafted coin parameters."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Viral Optimization",
    description: "Tokebot Prompt researches trends and optimizes your coin concept for maximum viral potential and market impact."
  }
];

export const stats = [
  { icon: <Coins className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "25K+", label: "Coins Created" },
  { icon: <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "12K+", label: "Active Creators" },
  { icon: <Bot className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "100K+", label: "AI Interactions" },
  { icon: <Activity className="w-6 h-6 text-gray-600 dark:text-gray-400" />, value: "89%", label: "Success Rate" }
];

export const testimonials = [
  {
    content: "Tokebot Sonnet helped me create my first coin in minutes. The AI analysis was spot-on and my coin performed exactly as predicted!",
    name: "Alex Rivera",
    role: "Crypto Creator, DeFi Ventures",
    avatar: "AR",
    rating: 5
  },
  {
    content: "I was just venting about market trends and Tokebot Mood turned it into a coin that went viral. This platform is pure magic!",
    name: "Jordan Kim",
    role: "Meme Coin Enthusiast",
    avatar: "JK",
    rating: 5
  },
  {
    content: "The Zora protocol integration is seamless. From concept to deployment in under 5 minutes - Tokonomy revolutionized my workflow.",
    name: "Sam Chen",
    role: "Blockchain Developer",
    avatar: "SC",
    rating: 5
  }
];


export const partners = [
  { name: "Zora", logo: "ZR" },
  { name: "Ethereum", logo: "ETH" },
  { name: "Base", logo: "BASE" },
  { name: "Encode Club", logo: "ENC" },
];

export const aiChatbots = [
  {
    name: "Tokebot Sonnet",
    type: "Basic Agent",
    icon: <Bot className="w-8 h-8" />,
    description: "Describe your coin parameters and let Sonnet create, search, and analyze coins with intelligent conversation.",
    features: ["Parameter Description", "Coin Search", "Profile Discovery", "Basic Analysis"],
    color: "from-blue-500 to-blue-600", 
    url: '/chatbot'

  },
  {
    name: "Tokebot Mood",
    type: "Emotion-Based",
    icon: <Sparkles className="w-8 h-8" />,
    description: "Express yourself freely - rant, yap, or share your thoughts. Mood transforms emotions into coin parameters.",
    features: ["Emotion Processing", "Auto-Parameter Generation", "One-Click Minting", "Mood Analysis"],
    color: "from-purple-500 to-pink-600",
    url: '/moodbot'
  },
  {
    name: "Tokebot Prompt",
    type: "Research Agent",
    icon: <Rocket className="w-8 h-8" />,
    description: "Research-driven coin creation optimized for viral potential and market trends analysis.",
    features: ["Trend Research", "Viral Optimization", "Market Analysis", "Competition Study"],
    color: "from-green-500 to-emerald-600",
    url: '/promptbot'
  }
];

export const coinFeatures = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Instant Deployment",
    description: "Deploy on Zora protocol in seconds"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Smart Contract Security",
    description: "Battle-tested contract templates"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Success Prediction",
    description: "AI-powered performance forecasting"
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Community Building",
    description: "Built-in social features"
  }
];