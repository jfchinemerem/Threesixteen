import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  Save,
  User,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Gift,
  CreditCard,
  Camera,
  Cake,
} from "lucide-react";

interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    joinDate: string;
    birthday?: string;
    activeWishlists?: number;
    grantedWishlists?: number;
  };
  onSave?: (userData: any) => void;
}

const UserProfile = ({
  user = {
    id: "user123",
    name: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
    bio: "Gift enthusiast and wishlist curator. I love finding the perfect gifts for friends and family.",
    location: "San Francisco, CA",
    website: "janesmith.com",
    joinDate: "January 2023",
    birthday: "1990-06-15",
    activeWishlists: 3,
    grantedWishlists: 1,
  },
  onSave = () => console.log("Profile saved"),
}: UserProfileProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [userData, setUserData] = React.useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate days until birthday
  const getDaysUntilBirthday = () => {
    if (!userData.birthday) return null;

    const today = new Date();
    const birthDate = new Date(userData.birthday);
    const currentYear = today.getFullYear();

    // Set birthday for this year
    const birthdayThisYear = new Date(
      currentYear,
      birthDate.getMonth(),
      birthDate.getDate(),
    );

    // If birthday has passed this year, calculate for next year
    if (today > birthdayThisYear) {
      birthdayThisYear.setFullYear(currentYear + 1);
    }

    // Calculate difference in days
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysUntilBirthday = getDaysUntilBirthday();

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(userData);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>
                  {userData.firstName?.charAt(0)}
                  {userData.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-4 right-0 rounded-full"
                  onClick={handleImageUpload}
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              )}
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={14} />
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleSave}
              >
                <Save size={14} />
                Save Changes
              </Button>
            )}
          </div>

          <div className="flex-1">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
                <p className="text-gray-700">{userData.bio}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>{userData.location}</span>
                  </div>
                  {userData.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LinkIcon size={16} />
                      <a
                        href={`https://${userData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {userData.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                  {userData.birthday && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Cake size={16} />
                      <span>
                        Birthday:{" "}
                        {new Date(userData.birthday).toLocaleDateString()}
                      </span>
                      {daysUntilBirthday !== null && (
                        <Badge variant="outline" className="ml-2">
                          {daysUntilBirthday} days until birthday
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Active Wishlists: {userData.activeWishlists}
                        </span>
                      </div>
                      <Progress
                        value={
                          userData.activeWishlists
                            ? (userData.activeWishlists / 5) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Granted Wishlists: {userData.grantedWishlists}
                        </span>
                      </div>
                      <Progress
                        value={
                          userData.grantedWishlists
                            ? (userData.grantedWishlists / 5) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full md:w-auto flex items-center gap-2"
                  >
                    <CreditCard size={16} />
                    Payment Settings
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        value={userData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="website"
                        name="website"
                        value={userData.website}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <div className="flex items-center">
                      <Cake className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={userData.birthday}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleChange}
                    className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="wishlists" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="wishlists">My Wishlists</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="wishlists" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View and manage your wishlists here. You can create new
                  wishlists, edit existing ones, or share them with friends.
                </p>
                <Button className="mt-4" variant="outline">
                  Go to My Wishlists
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="friends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with friends to see their wishlists and share yours.
                  Find new friends or manage your existing connections.
                </p>
                <Button className="mt-4" variant="outline">
                  Manage Friends
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See your recent activity, including wishlist updates, friend
                  connections, and gift purchases.
                </p>
                <Button className="mt-4" variant="outline">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
