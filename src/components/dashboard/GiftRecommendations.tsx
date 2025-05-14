import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Gift, Heart, ShoppingCart, Star, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchShiojaProducts, ShiojaProduct } from "@/services/apiService";

interface GiftItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  forFriend?: string;
  description?: string;
}

interface GiftRecommendationsProps {
  title?: string;
  description?: string;
  items?: GiftItem[];
  useApi?: boolean;
}

const GiftRecommendations = ({
  title = "Gift Recommendations",
  description = "Personalized gift ideas based on your friends' interests",
  items = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
      rating: 4.5,
      category: "Electronics",
      forFriend: "Sarah",
    },
    {
      id: "2",
      name: "Fitness Tracker",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?w=300&q=80",
      rating: 4.2,
      category: "Fitness",
      forFriend: "Mike",
    },
    {
      id: "3",
      name: "Scented Candle Set",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=80",
      rating: 4.8,
      category: "Home",
      forFriend: "Emma",
    },
    {
      id: "4",
      name: "Coffee Subscription",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80",
      rating: 4.6,
      category: "Food & Drink",
      forFriend: "Alex",
    },
  ],
  useApi = true,
}: GiftRecommendationsProps) => {
  const [apiItems, setApiItems] = useState<GiftItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useApi) {
      fetchProducts();
    }
  }, [useApi]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const products = await fetchShiojaProducts();

      // Map API products to GiftItem format
      const mappedItems = products.map(
        (product: ShiojaProduct, index: number) => ({
          ...product,
          forFriend: ["Sarah", "Mike", "Emma", "Alex"][index % 4],
        }),
      );

      setApiItems(mappedItems);
    } catch (err) {
      setError("Failed to load gift recommendations. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Use API items if available and useApi is true, otherwise use default items
  const displayItems = useApi && apiItems.length > 0 ? apiItems : items;
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500">{description}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div className="flex gap-2">
          {useApi && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={fetchProducts}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            View All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">
            Loading gift recommendations...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayItems.map((item) => (
            <GiftCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

interface GiftCardProps {
  item: GiftItem;
}

const GiftCard = ({ item }: GiftCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <Badge className="absolute top-2 right-2 bg-white text-black">
          ${item.price.toFixed(2)}
        </Badge>
        {item.forFriend && (
          <Badge className="absolute bottom-2 left-2 bg-pink-100 text-pink-800">
            For {item.forFriend}
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Badge variant="outline" className="font-normal">
            {item.category}
          </Badge>
          <div className="flex items-center ml-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs ml-1">{item.rating}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        {item.description ? (
          <p className="text-sm text-gray-500">{item.description}</p>
        ) : (
          <p className="text-sm text-gray-500">
            Perfect gift based on {item.forFriend}'s wishlist and interests.
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save to your wishlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button className="flex-1 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GiftRecommendations;
