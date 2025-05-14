import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "@/components/profile/UserProfile";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = React.useState(false);

  // In a real app, you would fetch user data based on userId
  // For now, we'll use mock data
  const userData = {
    id: userId || "user123",
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
  };

  const handleSaveProfile = (data: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Profile saved:", data);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header username={userData.name} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              My Profile
            </h1>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading profile...</p>
              </div>
            ) : (
              <UserProfile user={userData} onSave={handleSaveProfile} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
