import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import WishlistsOverview from "@/components/dashboard/WishlistsOverview";
import WishlistDetail from "@/components/wishlist/WishlistDetail";
import CreateWishlistForm from "@/components/wishlist/CreateWishlistForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, PlusCircle, Menu } from "lucide-react";

const Wishlists = () => {
  const { wishlistId } = useParams<{ wishlistId: string }>();
  const [isCreating, setIsCreating] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Check if coming from wishlist creation
  useEffect(() => {
    const fromCreation = new URLSearchParams(window.location.search).get(
      "fromCreation",
    );
    if (fromCreation === "true") {
      setShowSuccess(true);
      // Remove the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      // Check if there's wishlist data in localStorage
      const savedWishlistData = localStorage.getItem("newWishlistData");
      if (savedWishlistData) {
        try {
          const wishlistData = JSON.parse(savedWishlistData);
          const newWishlistId = addNewWishlist(wishlistData);
          // Clear the data after using it
          localStorage.removeItem("newWishlistData");
          // Select the newly created wishlist
          setSelectedWishlist(newWishlistId);
        } catch (error) {
          console.error("Error parsing wishlist data:", error);
        }
      }
    }
  }, []);
  const [selectedWishlist, setSelectedWishlist] = React.useState<string | null>(
    wishlistId || null,
  );

  // Update selectedWishlist when wishlistId changes (for shared links)
  React.useEffect(() => {
    if (wishlistId) {
      setSelectedWishlist(wishlistId);
    }
  }, [wishlistId]);

  // Load wishlists from localStorage on component mount
  const [wishlists, setWishlists] = React.useState<any[]>(() => {
    const savedWishlists = localStorage.getItem("userWishlists");
    return savedWishlists ? JSON.parse(savedWishlists) : [];
  });

  // Function to add a new wishlist when created
  const addNewWishlist = (wishlistData: any) => {
    // Use items from the form if available
    let items = wishlistData.items || [];

    // If no items were added but we have image/product link, create a default item
    if (
      items.length === 0 &&
      (wishlistData.imageUrl || wishlistData.productLink)
    ) {
      items.push({
        id: `item-${Date.now()}`,
        name: wishlistData.title || "My Wish",
        price: 0,
        image:
          wishlistData.imageUrl ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
        url: wishlistData.productLink || "",
        notes: wishlistData.description || "",
        priority: "medium" as "medium",
        addedAt: new Date().toISOString().split("T")[0],
        vendor: wishlistData.vendor || "",
      });
    }

    // Add addedAt to any items that don't have it
    items = items.map((item) => ({
      ...item,
      addedAt: item.addedAt || new Date().toISOString().split("T")[0],
    }));

    const newWishlist = {
      id: `wishlist-${Date.now()}`,
      title: wishlistData.title,
      description: wishlistData.description,
      isPrivate: wishlistData.isPrivate,
      items: items,
      itemCount: items.length,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setWishlists((prev) => {
      const updatedWishlists = [...prev, newWishlist];
      // Save to localStorage whenever wishlists change
      localStorage.setItem("userWishlists", JSON.stringify(updatedWishlists));
      return updatedWishlists;
    });
    return newWishlist.id;
  };

  // Mock data - in a real app, this would come from an API with user filtering
  // Currently only showing wishlists created by the current user
  // const wishlists = [
  //   // This represents the wishlist created by the current user
  //   {
  //     id: "1",
  //     title: "My New Wishlist",
  //     description: "Items I've added to my personal wishlist",
  //     isPrivate: false,
  //     items: [
  //       {
  //         id: "item1",
  //         name: "Wireless Headphones",
  //         price: 199.99,
  //         image:
  //           "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
  //         url: "https://example.com/headphones",
  //         notes: "I prefer the black color",
  //         priority: "high" as "high",
  //         addedAt: "2023-05-15",
  //       },
  //     ],
  //     itemCount: 1,
  //     createdAt: new Date().toISOString().split('T')[0], // Today's date
  //     updatedAt: new Date().toISOString().split('T')[0],
  //   }
  //   // All other wishlists have been removed as they weren't created by the current user
  // ];

  const handleCreateWishlist = (data: any) => {
    console.log("Create wishlist:", data);
    const newWishlistId = addNewWishlist(data);
    setIsCreating(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // Select the newly created wishlist
    setSelectedWishlist(newWishlistId);

    // Save updated wishlists to localStorage
    localStorage.setItem("userWishlists", JSON.stringify(wishlists));
  };

  const handleEditWishlist = (id: string) => {
    setSelectedWishlist(id);
  };

  const handleBackToOverview = () => {
    setSelectedWishlist(null);
  };

  // Find the current wishlist by ID
  const currentWishlist = wishlists.find((w) => w.id === selectedWishlist);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 relative">
        {/* Mobile menu button */}
        <div className="md:hidden fixed bottom-4 left-4 z-40">
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar for mobile and desktop */}
        <Sidebar
          isMobile={true}
          onClose={() => setIsSidebarOpen(false)}
          className={isSidebarOpen ? "translate-x-0" : ""}
        />
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg z-50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Awesome, your wishlist has been created!</span>
          </div>
        )}
        {/* Sidebar is now handled above */}

        <main className="flex-1 p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            {!selectedWishlist ? (
              <>
                {wishlists.length > 0 ? (
                  <WishlistsOverview
                    wishlists={wishlists}
                    onCreateWishlist={() => setIsCreating(true)}
                    onEditWishlist={handleEditWishlist}
                    onSelectWishlist={handleEditWishlist}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No wishlists yet
                    </h3>
                    <p className="text-gray-500 mb-4 text-center max-w-md">
                      You haven't created any wishlists yet. Create your first
                      wishlist to get started.
                    </p>
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle size={16} />
                      Create Wishlist
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="mb-6 flex items-center gap-2"
                  onClick={handleBackToOverview}
                >
                  <ArrowLeft size={16} />
                  Back to Wishlists
                </Button>

                {currentWishlist ? (
                  <WishlistDetail
                    wishlist={currentWishlist}
                    onSave={(updatedWishlist) => {
                      // Update the wishlist in the wishlists array
                      const updatedWishlists = wishlists.map((w) =>
                        w.id === updatedWishlist.id
                          ? { ...w, ...updatedWishlist }
                          : w,
                      );
                      setWishlists(updatedWishlists);
                      // Save to localStorage
                      localStorage.setItem(
                        "userWishlists",
                        JSON.stringify(updatedWishlists),
                      );
                    }}
                    onAddItem={(newItem) => {
                      // Add the item to the current wishlist
                      const updatedWishlists = wishlists.map((w) => {
                        if (w.id === currentWishlist.id) {
                          return {
                            ...w,
                            items: [...w.items, newItem],
                          };
                        }
                        return w;
                      });
                      setWishlists(updatedWishlists);
                      // Save to localStorage
                      localStorage.setItem(
                        "userWishlists",
                        JSON.stringify(updatedWishlists),
                      );
                    }}
                    onRemoveItem={(itemId) => {
                      // Remove the item from the current wishlist
                      const updatedWishlists = wishlists.map((w) => {
                        if (w.id === currentWishlist.id) {
                          return {
                            ...w,
                            items: w.items.filter((item) => item.id !== itemId),
                          };
                        }
                        return w;
                      });
                      setWishlists(updatedWishlists);
                      // Save to localStorage
                      localStorage.setItem(
                        "userWishlists",
                        JSON.stringify(updatedWishlists),
                      );
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Wishlist not found
                    </h3>
                    <p className="text-gray-500 mb-4 text-center max-w-md">
                      The wishlist you're looking for doesn't exist or you don't
                      have permission to view it.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Create a new wishlist to start collecting items you'd love to
              receive.
            </DialogDescription>
          </DialogHeader>
          <CreateWishlistForm
            onSubmit={handleCreateWishlist}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wishlists;
