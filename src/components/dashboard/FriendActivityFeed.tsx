import React from "react";
import { Avatar } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Gift, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  type: "added" | "updated" | "liked" | "commented" | "purchased";
  item?: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  wishlist?: {
    id: string;
    name: string;
  };
  timestamp: string;
  comment?: string;
}

interface FriendActivityFeedProps {
  activities?: ActivityItem[];
  className?: string;
}

const FriendActivityFeed = ({
  activities = defaultActivities,
  className,
}: FriendActivityFeedProps) => {
  return (
    <Card className={cn("w-full bg-white", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Friend Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity from your friends
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
        {activities.length > 0 && (
          <Button variant="outline" className="w-full mt-2">
            View More
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityCard = ({ activity }: { activity: ActivityItem }) => {
  const getActivityText = () => {
    switch (activity.type) {
      case "added":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> added{" "}
            <span className="font-medium">{activity.item?.name}</span> to their{" "}
            <span className="font-medium">{activity.wishlist?.name}</span>{" "}
            wishlist
          </>
        );
      case "updated":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> updated
            their <span className="font-medium">{activity.wishlist?.name}</span>{" "}
            wishlist
          </>
        );
      case "liked":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> liked{" "}
            <span className="font-medium">{activity.item?.name}</span> in your
            wishlist
          </>
        );
      case "commented":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> commented
            on <span className="font-medium">{activity.item?.name}</span>
          </>
        );
      case "purchased":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> purchased
            an item from{" "}
            <span className="font-medium">{activity.wishlist?.name}</span>{" "}
            wishlist
          </>
        );
      default:
        return "";
    }
  };

  const getActivityIcon = () => {
    switch (activity.type) {
      case "liked":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "commented":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "purchased":
        return <Gift className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-card">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border">
          <img src={activity.user.avatar} alt={activity.user.name} />
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="text-sm">{getActivityText()}</div>
          <div className="text-xs text-muted-foreground">
            {activity.timestamp}
          </div>

          {activity.comment && (
            <div className="mt-2 text-sm bg-muted p-2 rounded-md">
              {activity.comment}
            </div>
          )}

          {activity.item?.image && (
            <div className="mt-2">
              <div className="relative rounded-md overflow-hidden h-32 w-full bg-muted">
                <img
                  src={activity.item.image}
                  alt={activity.item.name}
                  className="object-cover w-full h-full"
                />
                {activity.item.price && (
                  <Badge className="absolute bottom-2 right-2">
                    ${activity.item.price.toFixed(2)}
                  </Badge>
                )}
              </div>
              <div className="mt-2 text-sm font-medium">
                {activity.item.name}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Heart className="h-4 w-4 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <MessageCircle className="h-4 w-4 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    type: "added",
    item: {
      id: "item1",
      name: "Wireless Noise-Cancelling Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      price: 299.99,
    },
    wishlist: {
      id: "wl1",
      name: "Tech Gadgets",
    },
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Samantha Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
    },
    type: "commented",
    item: {
      id: "item2",
      name: "Vintage Leather Jacket",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      price: 189.99,
    },
    timestamp: "5 hours ago",
    comment:
      "This would look amazing on you! I got one similar last year and love it.",
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    type: "updated",
    wishlist: {
      id: "wl3",
      name: "Birthday Wishes",
    },
    timestamp: "Yesterday",
  },
];

export default FriendActivityFeed;
