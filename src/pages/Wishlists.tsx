import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, PlusCircle, Menu, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getUserWishlists,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  Wishlist,
  WishlistItem,
} from "@/services/wishlistService";

const Wishlists = () => {
  const { wishlistId } = useParams<{ wishlistId: string }>();
  const [isCreating, setIsCreating] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    }
  }, []);
  const [selectedWishlist, setSelectedWishlist] = React.useState<string | null>(
    wishlistId || null,
  );

  // Update selectedWishlist when wishlistId changes (for shared links)
  React.useEffect(() => {
    if (wishlistId) {
      // Clean the wishlistId to handle potential URL encoding issues
      const cleanWishlistId = decodeURIComponent(wishlistId).trim();
      console.log("Original wishlistId:", wishlistId);
      console.log("Cleaned wishlistId:", cleanWishlistId);
      setSelectedWishlist(cleanWishlistId);

      // Check if this is a shared view
      const isShared =
        new URLSearchParams(window.location.search).get("shared") === "true";
      if (isShared) {
        console.log("Viewing shared wishlist:", cleanWishlistId);
      }
    }
  }, [wishlistId]);

  // Load wishlists from Supabase on component mount
  const [wishlists, setWishlists] = React.useState<Wishlist[]>([]);

  // Fetch wishlists from Supabase
  const fetchWishlists = async () => {
    setIsLoading(true);
    try {
      const fetchedWishlists = await getUserWishlists();
      setWishlists(fetchedWishlists);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load wishlists on component mount
  React.useEffect(() => {
    fetchWishlists();
  }, []);

  // Function to add a new wishlist when created
  const addNewWishlist = async (wishlistData: any) => {
    setIsSubmitting(true);
    try {
      // Create wishlist in Supabase
      const newWishlistId = await createWishlist({
        title: wishlistData.title,
        description: wishlistData.description,
        isPrivate: wishlistData.isPrivate,
        items: wishlistData.items || [],
      });

      if (!newWishlistId) {
        throw new Error("Failed to create wishlist");
      }

      // Refresh wishlists
      await fetchWishlists();

      return newWishlistId;
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to create wishlist. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
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

  const handleCreateWishlist = async (data: any) => {
    console.log("Create wishlist:", data);
    const newWishlistId = await addNewWishlist(data);

    if (newWishlistId) {
      setIsCreating(false);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      // Navigate to the newly created wishlist with clean URL
      const baseUrl = window.location.origin;
      window.location.href = `${baseUrl}/wishlist/${newWishlistId.trim()}`;
    }
  };

  const handleEditWishlist = (id: string) => {
    setSelectedWishlist(id);
  };

  const handleBackToOverview = () => {
    setSelectedWishlist(null);
  };

  // Check if this is a shared view from URL parameters
  const [isSharedView, setIsSharedView] = React.useState(false);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isShared = urlParams.get("shared") === "true";
    setIsSharedView(isShared);
  }, []);

  // Find the current wishlist by ID
  const [currentWishlist, setCurrentWishlist] = React.useState<Wishlist | null>(
    null,
  );
  const [isLoadingWishlist, setIsLoadingWishlist] = React.useState(false);

  // Fetch specific wishlist when ID changes
  React.useEffect(() => {
    const fetchWishlist = async () => {
      if (!selectedWishlist) {
        setCurrentWishlist(null);
        return;
      }

      setIsLoadingWishlist(true);
      try {
        console.log("Attempting to fetch wishlist with ID:", selectedWishlist);

        // First check if it's in our already loaded wishlists
        const existingWishlist = wishlists.find(
          (w) => w.id === selectedWishlist,
        );

        if (existingWishlist) {
          console.log("Found wishlist in local cache:", existingWishlist.id);
          setCurrentWishlist(existingWishlist);
        } else {
          // If not found locally, fetch from Supabase
          console.log("Fetching wishlist from Supabase:", selectedWishlist);
          const fetchedWishlist = await getWishlistById(selectedWishlist);

          if (fetchedWishlist) {
            console.log(
              "Successfully fetched wishlist from Supabase:",
              fetchedWishlist.id,
            );
            setCurrentWishlist(fetchedWishlist);
          } else {
            console.log("No wishlist found with ID:", selectedWishlist);
            setCurrentWishlist(null);
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setCurrentWishlist(null);
      } finally {
        setIsLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [selectedWishlist, wishlists]);

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
                    onSave={async (updatedWishlist) => {
                      try {
                        // Update the wishlist in Supabase
                        const success = await updateWishlist(
                          updatedWishlist.id,
                          {
                            title: updatedWishlist.title,
                            description: updatedWishlist.description,
                            is_private: updatedWishlist.is_private,
                          },
                        );

                        if (success) {
                          // Refresh wishlists
                          await fetchWishlists();
                          toast({
                            title: "Success",
                            description: "Wishlist updated successfully",
                          });
                        } else {
                          throw new Error("Failed to update wishlist");
                        }
                      } catch (error) {
                        console.error("Error updating wishlist:", error);
                        toast({
                          title: "Error",
                          description: "Failed to update wishlist",
                          variant: "destructive",
                        });
                      }
                    }}
                    onAddItem={async (newItem) => {
                      try {
                        if (!currentWishlist) return;

                        // Add the item to Supabase
                        const itemId = await addItemToWishlist(
                          currentWishlist.id,
                          {
                            name: newItem.name,
                            price: newItem.price,
                            image: newItem.image,
                            url: newItem.url,
                            notes: newItem.notes,
                          },
                        );

                        if (itemId) {
                          // Refresh the current wishlist
                          const refreshedWishlist = await getWishlistById(
                            currentWishlist.id,
                          );
                          if (refreshedWishlist) {
                            setCurrentWishlist(refreshedWishlist);
                          }

                          toast({
                            title: "Success",
                            description: "Item added to wishlist",
                          });
                        } else {
                          throw new Error("Failed to add item");
                        }
                      } catch (error) {
                        console.error("Error adding item:", error);
                        toast({
                          title: "Error",
                          description: "Failed to add item to wishlist",
                          variant: "destructive",
                        });
                      }
                    }}
                    onRemoveItem={async (itemId) => {
                      try {
                        // Remove the item from Supabase
                        const success = await removeItemFromWishlist(itemId);

                        if (success && currentWishlist) {
                          // Refresh the current wishlist
                          const refreshedWishlist = await getWishlistById(
                            currentWishlist.id,
                          );
                          if (refreshedWishlist) {
                            setCurrentWishlist(refreshedWishlist);
                          }

                          toast({
                            title: "Success",
                            description: "Item removed from wishlist",
                          });
                        } else {
                          throw new Error("Failed to remove item");
                        }
                      } catch (error) {
                        console.error("Error removing item:", error);
                        toast({
                          title: "Error",
                          description: "Failed to remove item from wishlist",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                ) : isLoadingWishlist ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-300">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-gray-500">Loading wishlist...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Wishlist not found
                    </h3>
                    <p className="text-gray-500 mb-4 text-center max-w-md">
                      The wishlist you're looking for doesn't exist or you don't
                      have permission to view it.
                    </p>
                    <Button
                      onClick={() => navigate("/wishlists")}
                      className="flex items-center gap-2"
                    >
                      Back to My Wishlists
                    </Button>
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
