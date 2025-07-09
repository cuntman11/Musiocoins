'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle,
  Mail,
  Phone,
  Rocket,
  Target,
  BarChart3,
  Layers,
  Music,
  Feather,
  Coins,
  Heart,
  Edit3,
  Upload,
  Palette
} from "lucide-react";

const stats = [
  { icon: <Music className="w-6 h-6" />, value: "50K+", label: "Songs Tokenized" },
  { icon: <Feather className="w-6 h-6" />, value: "25K+", label: "Poems Minted" },
  { icon: <Coins className="w-6 h-6" />, value: "10K+", label: "Coins Created" },
  { icon: <Users className="w-6 h-6" />, value: "100+", label: "Countries" }
];

const features = [
  {
    icon: <Edit3 className="w-6 h-6" />,
    title: "Creative Studio",
    description: "Write, edit, and perfect your poems and songs with our intuitive creative tools"
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: "Instant Tokenization",
    description: "Deploy your creative works as tokens seamlessly on the Zora protocol"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Reliable",
    description: "Built with enterprise-grade security on trusted blockchain infrastructure"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Creative Analytics",
    description: "Track performance and monitor the success of your creative tokens"
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Multi-Chain Support",
    description: "Deploy on Ethereum, Base, Polygon, and other major blockchain networks"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Smart Monetization",
    description: "Intelligent pricing and distribution strategies for your creative tokens"
  }
];

const partners = [
  { name: "Zora Protocol", logo: "ZR", color: "bg-purple-100 text-purple-600" },
  { name: "Ethereum", logo: "ETH", color: "bg-blue-100 text-blue-600" },
  { name: "Base", logo: "BASE", color: "bg-blue-100 text-blue-600" },
  { name: "Polygon", logo: "MATIC", color: "bg-purple-100 text-purple-600" },
  { name: "Arbitrum", logo: "ARB", color: "bg-blue-100 text-blue-600" }
];

const testimonials = [
  {
    content: "Musio Coin transformed my poetry into a thriving creative economy. The tokenization process is seamless!",
    name: "Luna Martinez",
    role: "Poet & Creator",
    avatar: "LM",
    rating: 5
  },
  {
    content: "I've never seen anything like this. My song lyrics became valuable tokens in minutes. Revolutionary!",
    name: "David Kim",
    role: "Musician & Producer",
    avatar: "DK",
    rating: 5
  },
  {
    content: "The combination of creative tools and blockchain tokenization is pure genius. My coins are performing amazingly.",
    name: "Aria Thompson",
    role: "Digital Artist",
    avatar: "AT",
    rating: 5
  }
];

export default function MusioCoinLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 border-0 px-6 py-2 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Powered by Zora Protocol & Blockchain
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Create. Tokenize.
            </span>
            <br />
            <span className="text-gray-900">
              Monetize.
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your creative works into valuable tokens with our intuitive platform for poets and musicians. 
            <span className="text-blue-600 font-semibold"> Deploy instantly on blockchain.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Creating Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-semibold"
            >
              <Play className="mr-3 w-6 h-6" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-blue-100">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-12">Trusted by Leading Blockchain Networks</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-16 h-16 ${partner.color} rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm`}>
                  {partner.logo}
                </div>
                <p className="mt-3 text-sm text-gray-600 font-medium">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-20">
            Three simple steps to transform your creative works into valuable blockchain tokens
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold mb-8 mx-auto shadow-lg">
                1
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                <Edit3 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Your Work</h3>
              <p className="text-gray-600 text-lg">
                Write your poems, songs, or other creative content using our intuitive creative studio tools.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold mb-8 mx-auto shadow-lg">
                2
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Upload & Refine</h3>
              <p className="text-gray-600 text-lg">
                Upload your finished creative work and use our tools to add metadata and prepare for tokenization.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold mb-8 mx-auto shadow-lg">
                3
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mint & Monetize</h3>
              <p className="text-gray-600 text-lg">
                Deploy your creative work as tokens on the blockchain and start earning from your creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-20">
            Everything you need to transform creativity into blockchain value
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
                <CardHeader className="pb-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            What Creators Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-20">
            Join thousands of creators who have transformed their ideas into valuable tokens
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white rounded-2xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 text-lg italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mb-4">
                      {testimonial.avatar}
                    </div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-white">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join the creative revolution and turn your poems and songs into valuable blockchain tokens today
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Creating Free
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Have questions? We're here to help you succeed in the creative token economy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold">Discord Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">Join our vibrant community of creators</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  Join Discord
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 rounded-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 mx-auto">
                  <Mail className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold">Email Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">Get direct support from our team</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                  <Phone className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold">Telegram</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">Instant support and updates</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  Open Telegram
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">Musio Coin</span>
              </div>
              <p className="text-gray-400 max-w-md mb-6 text-lg">
                Empowering creators to tokenize their musical and poetic works with seamless blockchain integration and creative tools.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Musio Coin. All rights reserved. Built with ❤️ for creators worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}