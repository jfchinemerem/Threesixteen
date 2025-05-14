import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlusCircle, Gift, Share2, Edit, Lock, Globe } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Wishlist {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  items: WishlistItem[];
  itemCount: number;
}

interface WishlistsOverviewProps {
  wishlists?: Wishlist[];
  onCreateWishlist?: () => void;
  onEditWishlist?: (id: string) => void;
  onShareWishlist?: (id: string) => void;
  onSelectWishlist?: (id: string) => void;
}

const WishlistsOverview = ({
  wishlists = [
    {
      id: "1",
      title: "Birthday Wishlist",
      description: "Things I'd love to get for my upcoming birthday",
      isPrivate: false,
      items: [
        {
          id: "item1",
          name: "Wireless Headphones",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
        },
        {
          id: "item2",
          name: "Smart Watch",
          price: 299.99,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
        },
      ],
      itemCount: 2,
    },
    {
      id: "2",
      title: "Home Decor",
      description: "Items for my new apartment",
      isPrivate: true,
      items: [
        {
          id: "item3",
          name: "Throw Pillows",
          price: 49.99,
          image:
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&q=80",
        },
      ],
      itemCount: 1,
    },
    {
      id: "3",
      title: "Tech Gadgets",
      description: "Latest tech I'm interested in",
      isPrivate: false,
      items: [
        {
          id: "item4",
          name: "Drone",
          price: 799.99,
          image:
            "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=300&q=80",
        },
        {
          id: "item5",
          name: "Portable Speaker",
          price: 129.99,
          image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
        },
        {
          id: "item6",
          name: "Tablet",
          price: 399.99,
          image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
        },
      ],
      itemCount: 3,
    },
  ],
  onCreateWishlist = () => console.log("Create wishlist clicked"),
  onEditWishlist = (id: string) => console.log(`Edit wishlist ${id} clicked`),
  onShareWishlist = (id: string) => console.log(`Share wishlist ${id} clicked`),
  onSelectWishlist = (id: string) => console.log(`Wishlist ${id} selected`),
}: WishlistsOverviewProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wishlists</h2>
          <p className="text-gray-500">Create and manage your wishlists</p>
        </div>
        <Button onClick={onCreateWishlist} className="flex items-center gap-2">
          <PlusCircle size={18} />
          Create Wishlist
        </Button>
      </div>

      {wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Gift size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No wishlists yet
          </h3>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            Create your first wishlist to start collecting items you'd love to
            receive as gifts.
          </p>
          <Button
            onClick={onCreateWishlist}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Create Your First Wishlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist) => (
            <Card
              key={wishlist.id}
              className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
              onClick={() => onSelectWishlist(wishlist.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{wishlist.title}</CardTitle>
                  <Badge
                    variant={wishlist.isPrivate ? "outline" : "default"}
                    className="flex items-center gap-1"
                  >
                    {wishlist.isPrivate ? (
                      <>
                        <Lock size={12} />
                        Private
                      </>
                    ) : (
                      <>
                        <Globe size={12} />
                        Public
                      </>
                    )}
                  </Badge>
                </div>
                <CardDescription>{wishlist.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    {wishlist.itemCount} items
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wishlist.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="relative w-20 h-20 rounded-md overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {wishlist.itemCount > 3 && (
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        +{wishlist.itemCount - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditWishlist(wishlist.id)}
                  className="flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShareWishlist(wishlist.id)}
                  className="flex items-center gap-1"
                >
                  <Share2 size={14} />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistsOverview;
