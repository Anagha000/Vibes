import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/entities/User";
import { UserPreference } from "@/entities/UserPreference";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Loader2, Save, Settings, Tv, Music, Utensils } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

export default function Preferences() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    // Movie preferences
    subscribed_movie_platforms: [],
    favorite_movie_genres: [],
    
    // Music preferences
    subscribed_music_platforms: [],
    favorite_music_genres: [],
    
    // Food preferences
    preferred_food_platforms: [],
    favorite_cuisines: [],
    dietary_restrictions: []
  });
  
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  
  // Options lists
  const moviePlatforms = [
    { id: "netflix", label: "Netflix" },
    { id: "prime", label: "Amazon Prime Video" },
    { id: "hotstar", label: "Disney+ Hotstar" },
    { id: "hbo", label: "HBO Max" },
    { id: "hulu", label: "Hulu" },
    { id: "apple", label: "Apple TV+" }
  ];
  
  const movieGenres = [
    "action", "comedy", "drama", "romance", "horror", 
    "sci-fi", "thriller", "documentary", "animation", "fantasy"
  ];
  
  const musicPlatforms = [
    { id: "spotify", label: "Spotify" },
    { id: "apple", label: "Apple Music" },
    { id: "youtube", label: "YouTube Music" },
    { id: "amazon", label: "Amazon Music" },
    { id: "gaana", label: "Gaana" }
  ];
  
  const musicGenres = [
    "pop", "rock", "hip-hop", "electronic", "jazz", 
    "classical", "r&b", "indie", "metal", "folk"
  ];
  
  const foodPlatforms = [
    { id: "swiggy", label: "Swiggy" },
    { id: "zomato", label: "Zomato" },
    { id: "uber_eats", label: "Uber Eats" },
    { id: "zepto", label: "Zepto" },
    { id: "blinkit", label: "Blinkit" }
  ];
  
  const cuisines = [
    "italian", "indian", "chinese", "japanese", "mexican", 
    "american", "mediterranean", "thai", "french", "spanish"
  ];
  
  const dietaryRestrictions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "nut-free", label: "Nut-Free" },
    { id: "kosher", label: "Kosher" },
    { id: "halal", label: "Halal" }
  ];
  
  // Fetch user data and preferences
  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Try to get existing preferences
        const existingPreferences = await UserPreference.filter({
          created_by: userData.email
        });
        
        if (existingPreferences.length > 0) {
          setPreferences({
            ...preferences,
            ...existingPreferences[0]
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    fetchUserData();
  }, []);
  
  // Handle checkbox changes for arrays
  const handleCheckboxChange = (category, value) => {
    setPreferences(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };
  
  // Save user preferences
  const savePreferences = async () => {
    setLoading(true);
    setSaveStatus("saving");
    
    try {
      const existingPreferences = await UserPreference.filter({
        created_by: user.email
      });
      
      if (existingPreferences.length > 0) {
        // Update existing preferences
        await UserPreference.update(existingPreferences[0].id, preferences);
      } else {
        // Create new preferences
        await UserPreference.create(preferences);
      }
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    }
    
    setLoading(false);
  };
  
  // Render the save button with different states
  const renderSaveButton = () => {
    if (saveStatus === "saving" || loading) {
      return (
        <Button disabled className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </Button>
      );
    } else if (saveStatus === "success") {
      return (
        <Button className="bg-green-600 hover:bg-green-700 gap-2">
          <Check className="h-4 w-4" />
          Saved!
        </Button>
      );
    } else if (saveStatus === "error") {
      return (
        <Button variant="destructive" className="gap-2">
          Error Saving
        </Button>
      );
    } else {
      return (
        <Button onClick={savePreferences} className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your Preferences</h1>
          </div>
          <p className="mt-1 text-gray-500">
            Customize your recommendation experience by telling us what you like
          </p>
        </div>
        
        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to save your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => User.login()}>Sign In</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="movies" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="movies" className="gap-2">
                  <Tv className="h-4 w-4" />
                  Movies
                </TabsTrigger>
                <TabsTrigger value="music" className="gap-2">
                  <Music className="h-4 w-4" />
                  Music
                </TabsTrigger>
                <TabsTrigger value="food" className="gap-2">
                  <Utensils className="h-4 w-4" />
                  Food
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-8">
                <TabsContent value="movies">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Tv className="h-5 w-5" /> Movie Preferences
                        </CardTitle>
                        <CardDescription>
                          Tell us about your streaming subscriptions and favorite genres
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Streaming Platforms */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Your Streaming Subscriptions</h3>
                          <p className="text-sm text-gray-500">
                            We'll prioritize content available on platforms you subscribe to
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {moviePlatforms.map(platform => (
                              <div key={platform.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={movie-platform-${platform.id}}
                                  checked={preferences.subscribed_movie_platforms?.includes(platform.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleCheckboxChange('subscribed_movie_platforms', platform.id);
                                    } else {
                                      handleCheckboxChange('subscribed_movie_platforms', platform.id);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={movie-platform-${platform.id}}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {platform.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Favorite Movie Genres */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Favorite Movie Genres</h3>
                          <p className="text-sm text-gray-500">
                            Select the genres you enjoy watching the most
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {movieGenres.map(genre => (
                              <Badge
                                key={genre}
                                variant={preferences.favorite_movie_genres?.includes(genre) ? "default" : "outline"}
                                className={`capitalize cursor-pointer ${
                                  preferences.favorite_movie_genres?.includes(genre)
                                    ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                                onClick={() => handleCheckboxChange('favorite_movie_genres', genre)}
                              >
                                {genre.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="music">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5" /> Music Preferences
                        </CardTitle>
                        <CardDescription>
                          Tell us about your music services and favorite genres
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Music Platforms */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Your Music Services</h3>
                          <p className="text-sm text-gray-500">
                            We'll direct you to your preferred music platforms
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {musicPlatforms.map(platform => (
                              <div key={platform.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={music-platform-${platform.id}}
                                  checked={preferences.subscribed_music_platforms?.includes(platform.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleCheckboxChange('subscribed_music_platforms', platform.id);
                                    } else {
                                      handleCheckboxChange('subscribed_music_platforms', platform.id);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={music-platform-${platform.id}}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {platform.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Favorite Music Genres */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Favorite Music Genres</h3>
                          <p className="text-sm text-gray-500">
                            Select the genres you enjoy listening to the most
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {musicGenres.map(genre => (
                              <Badge
                                key={genre}
                                variant={preferences.favorite_music_genres?.includes(genre) ? "default" : "outline"}
                                className={`capitalize cursor-pointer ${
                                  preferences.favorite_music_genres?.includes(genre)
                                    ? "bg-pink-100 text-pink-800 hover:bg-pink-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                                onClick={() => handleCheckboxChange('favorite_music_genres', genre)}
                              >
                                {genre.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="food">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Utensils className="h-5 w-5" /> Food Preferences
                        </CardTitle>
                        <CardDescription>
                          Tell us about your food delivery preferences and dietary restrictions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Food Delivery Platforms */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Your Food Delivery Services</h3>
                          <p className="text-sm text-gray-500">
                            We'll direct you to your preferred food delivery platforms
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {foodPlatforms.map(platform => (
                              <div key={platform.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={food-platform-${platform.id}}
                                  checked={preferences.preferred_food_platforms?.includes(platform.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleCheckboxChange('preferred_food_platforms', platform.id);
                                    } else {
                                      handleCheckboxChange('preferred_food_platforms', platform.id);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={food-platform-${platform.id}}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {platform.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Favorite Cuisines */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Favorite Cuisines</h3>
                          <p className="text-sm text-gray-500">
                            Select the cuisines you enjoy the most
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {cuisines.map(cuisine => (
                              <Badge
                                key={cuisine}
                                variant={preferences.favorite_cuisines?.includes(cuisine) ? "default" : "outline"}
                                className={`capitalize cursor-pointer ${
                                  preferences.favorite_cuisines?.includes(cuisine)
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                                onClick={() => handleCheckboxChange('favorite_cuisines', cuisine)}
                              >
                                {cuisine}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Dietary Restrictions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Dietary Restrictions</h3>
                          <p className="text-sm text-gray-500">
                            Tell us about any dietary preferences or restrictions
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dietaryRestrictions.map(restriction => (
                              <div key={restriction.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={restriction-${restriction.id}}
                                  checked={preferences.dietary_restrictions?.includes(restriction.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleCheckboxChange('dietary_restrictions', restriction.id);
                                    } else {
                                      handleCheckboxChange('dietary_restrictions', restriction.id);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={restriction-${restriction.id}}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {restriction.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </div>
              
              <div className="mt-8 flex justify-end">
                {renderSaveButton()}
              </div>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}