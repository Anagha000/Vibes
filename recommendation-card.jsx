import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";

const RecommendationCard = ({
  title,
  subtitle,
  description,
  imageUrl,
  tags = [],
  platforms = [],
  onPlatformClick,
  actionLabel = "View",
  imageHeight = "h-48"
}) => {
  const platformIcons = {
    // Movie platforms
    netflix: {
      name: "Netflix",
      bgColor: "bg-red-600",
      textColor: "text-white"
    },
    prime: {
      name: "Prime",
      bgColor: "bg-blue-700",
      textColor: "text-white"
    },
    hotstar: {
      name: "Hotstar",
      bgColor: "bg-blue-900",
      textColor: "text-white"
    },
    hbo: {
      name: "HBO",
      bgColor: "bg-purple-900",
      textColor: "text-white"
    },
    hulu: {
      name: "Hulu",
      bgColor: "bg-green-600",
      textColor: "text-white"
    },
    apple: {
      name: "Apple TV+",
      bgColor: "bg-gray-800",
      textColor: "text-white"
    },
    
    // Music platforms
    spotify: {
      name: "Spotify",
      bgColor: "bg-green-600",
      textColor: "text-white"
    },
    apple_music: {
      name: "Apple Music",
      bgColor: "bg-pink-600",
      textColor: "text-white"
    },
    youtube: {
      name: "YouTube",
      bgColor: "bg-red-600",
      textColor: "text-white"
    },
    amazon: {
      name: "Amazon Music",
      bgColor: "bg-blue-700",
      textColor: "text-white"
    },
    gaana: {
      name: "Gaana",
      bgColor: "bg-red-500",
      textColor: "text-white"
    },
    
    // Food platforms
    swiggy: {
      name: "Swiggy",
      bgColor: "bg-orange-500",
      textColor: "text-white"
    },
    zomato: {
      name: "Zomato",
      bgColor: "bg-red-500",
      textColor: "text-white"
    },
    uber_eats: {
      name: "Uber Eats",
      bgColor: "bg-green-600",
      textColor: "text-white"
    },
    doordash: {
      name: "DoorDash",
      bgColor: "bg-red-600",
      textColor: "text-white"
    },
    grubhub: {
      name: "Grubhub",
      bgColor: "bg-orange-600",
      textColor: "text-white"
    },
    zepto: {
      name: "Zepto",
      bgColor: "bg-blue-600",
      textColor: "text-white"
    },
    blinkit: {
      name: "Blinkit",
      bgColor: "bg-yellow-500",
      textColor: "text-black"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-200">
        <div 
          className={'${imageHeight} w-full overflow-hidden bg-gray-100 relative'}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No image
            </div>
          )}
          <div className="absolute top-2 right-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-pink-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-0 flex-1">
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="capitalize text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-lg font-bold line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">{subtitle}</CardDescription>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        </CardHeader>
        
        <CardFooter className="p-4 pt-0 mt-auto">
          <div className="w-full space-y-2">
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => {
                const platformInfo = platformIcons[platform] || { 
                  name: platform, 
                  bgColor: "bg-gray-600", 
                  textColor: "text-white" 
                };
                
                return (
                  <Button
                    key={platform}
                    size="sm"
                    className={'${platformInfo.bgColor} ${platformInfo.textColor} text-xs px-2 h-7'}
                    onClick={() => onPlatformClick(platform, title)}
                  >
                    {platformInfo.name}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              className="w-full text-gray-700 hover:text-purple-700 gap-1 mt-2"
              size="sm"
            >
              {actionLabel} <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;