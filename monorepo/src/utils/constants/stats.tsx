import React from "react";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Sparkles, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Star,
  Play,
  Award,
  Globe,
  Clock
} from "lucide-react";


export const stats = [
    { value: "50K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
    { value: "99.9%", label: "Uptime", icon: <Clock className="w-5 h-5" /> },
    { value: "120+", label: "Countries", icon: <Globe className="w-5 h-5" /> },
    { value: "24/7", label: "Support", icon: <Award className="w-5 h-5" /> }
  ];