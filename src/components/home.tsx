import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bell, Gift, Search, User, Menu, X } from "lucide-react";
import Logo from "./layout/Logo";
import WishlistsOverview from "./dashboard/WishlistsOverview";
import FriendActivityFeed from "./dashboard/FriendActivityFeed";
import GiftRecommendations from "./dashboard/GiftRecommendations";
import Sidebar from "./layout/Sidebar";
import CreateWishlistForm from "./wishlist/CreateWishlistForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface HomeProps {
  username?: string;
}

const Dashboard = ({ username }: HomeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Unified sidebar for both mobile and desktop */}
      <Sidebar
        isMobile={true}
        onClose={() => setIsSidebarOpen(false)}
        className={isSidebarOpen ? "translate-x-0" : ""}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
          <div className="flex items-center justify-between w-full">
            <Logo size="small" />

            {/* Search removed as requested */}

            <div className="flex items-center gap-4">
              {/* Notifications and cart removed as requested */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content with Centered Create Wishlist Button */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hi,{" "}
              {username && username !== "John Doe"
                ? username.split(" ")[0]
                : localStorage.getItem("firstName") || ""}
              !
            </h1>
            <p className="text-gray-600">
              Start by creating your first wishlist.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Create Your First Wishlist
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start adding items you'd love to receive and share with friends
                and family.
              </p>
            </div>
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-medium flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Gift className="h-5 w-5" />
              Create Wishlist
            </Button>
          </div>
        </main>
      </div>

      {/* Create Wishlist Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Create a new wishlist to start collecting items you'd love to
              receive.
            </DialogDescription>
          </DialogHeader>
          <CreateWishlistForm
            onSubmit={(formData) => {
              setIsDialogOpen(false);
              // Show success toast
              const successMessage = document.createElement("div");
              successMessage.className =
                "fixed top-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg z-50 flex items-center";
              successMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Awesome, your wishlist has been created!</span>
              `;
              document.body.appendChild(successMessage);

              // Remove after 3 seconds
              setTimeout(() => {
                successMessage.classList.add(
                  "opacity-0",
                  "transition-opacity",
                  "duration-500",
                );
                setTimeout(
                  () => document.body.removeChild(successMessage),
                  500,
                );
                // Store the wishlist data in localStorage to simulate persistence
                localStorage.setItem(
                  "newWishlistData",
                  JSON.stringify(formData),
                );
                window.location.href = "/wishlists?fromCreation=true";
              }, 2000);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

const NavItem = ({
  href = "#",
  label = "Nav Item",
  isActive = false,
}: NavItemProps) => {
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {label}
    </a>
  );
};

interface FriendItemProps {
  name: string;
  avatar: string;
  isOnline?: boolean;
}

const FriendItem = ({
  name = "Friend Name",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  isOnline = false,
}: FriendItemProps) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
      <div className="relative">
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
        )}
      </div>
      <span className="text-sm font-medium truncate">{name}</span>
    </div>
  );
};

export default Dashboard;
