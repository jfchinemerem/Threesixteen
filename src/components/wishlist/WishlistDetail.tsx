import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  PlusCircle,
  Share2,
  Lock,
  Globe,
  MoreVertical,
  ShoppingCart,
  Copy,
  Check,
  CreditCard,
  Gift,
} from "lucide-react";

import { WishlistItem } from "@/services/wishlistService";

interface WishlistDetailProps {
  wishlist?: {
    id: string;
    title: string;
    description: string;
    isPrivate: boolean;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
  };
  onSave?: (wishlist: any) => void;
  onAddItem?: (item: any) => void;
  onRemoveItem?: (itemId: string) => void;
  onShare?: () => void;
}

const WishlistDetail = ({
  wishlist,

  onSave = () => console.log("Wishlist saved"),
  onAddItem = () => console.log("Add item clicked"),
  onRemoveItem = (id: string) => console.log(`Remove item ${id} clicked`),
  onShare = () => console.log("Share wishlist clicked"),
}: WishlistDetailProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [wishlistData, setWishlistData] = React.useState(
    wishlist || {
      id: "",
      title: "",
      description: "",
      isPrivate: false,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  );
  const [newItem, setNewItem] = React.useState({
    name: "",
    price: 0,
    image: "",
    url: "",
    notes: "",
  });
  const [isAddItemOpen, setIsAddItemOpen] = React.useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = React.useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<WishlistItem[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [checkoutTotal, setCheckoutTotal] = React.useState(0);

  const handleWishlistChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setWishlistData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivacyToggle = () => {
    setWishlistData((prev) => ({ ...prev, isPrivate: !prev.isPrivate }));
  };

  const handleNewItemChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    const item = {
      ...newItem,
      id: `item${Date.now()}`,
      addedAt: new Date().toISOString().split("T")[0],
    };

    // Add item to local state first
    setWishlistData((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    // Also call the parent component's onAddItem
    onAddItem(item);

    setNewItem({
      name: "",
      price: 0,
      image: "",
      url: "",
      notes: "",
    });
    setIsAddItemOpen(false);
  };

  const handleSave = () => {
    // Update the wishlist with current items and data
    onSave({ ...wishlistData });
    setIsEditing(false);
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const handleCheckout = (items: WishlistItem[]) => {
    setSelectedItems(items);
    const total = items.reduce((sum, item) => sum + item.price, 0);
    setCheckoutTotal(total);
    setIsCheckoutDialogOpen(true);
  };

  const initializePaystack = () => {
    setIsPaymentProcessing(true);

    // Load Paystack script dynamically
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore - Paystack is loaded globally
      const paystack = window.PaystackPop.setup({
        key: "pk_live_a10124a88772f724608fedf989afb3c7822debe2", // Paystack public key
        email: "customer@example.com", // In a real app, this would be the user's email
        amount: checkoutTotal * 100, // Paystack amount is in kobo (or cents)
        currency: "NGN", // Change as needed
        ref: `wishlist_${wishlistData.id}_${Date.now()}`,
        onClose: () => {
          setIsPaymentProcessing(false);
        },
        callback: (response: any) => {
          // Handle successful payment
          console.log("Payment successful. Reference: " + response.reference);
          setIsPaymentProcessing(false);
          setIsCheckoutDialogOpen(false);

          // In a real app, you would update the database to mark these items as purchased
          // and notify the wishlist owner
        },
      });

      paystack.openIframe();
    };

    script.onerror = () => {
      console.error("Failed to load Paystack script");
      setIsPaymentProcessing(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocialMedia = (platform: string) => {
    const shareableLink = getShareableLink();
    const encodedLink = encodeURIComponent(shareableLink);
    const encodedText = encodeURIComponent(
      `Check out my wishlist: ${wishlistData.title}`,
    );

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct sharing API, but we can open Instagram
        // Users will need to manually paste the link
        shareUrl = "https://www.instagram.com/";
        copyToClipboard(shareableLink); // Copy to clipboard for convenience
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  const getShareableLink = () => {
    // Create a shareable link that goes directly to the wishlist with a parameter indicating it's a shared view
    // Use /wishlist/ path which we've added to our routes
    const baseUrl = window.location.origin;
    // Use the actual UUID from Supabase
    return `${baseUrl}/wishlist/${wishlistData.id}?shared=true`;
  };

  // Priority function removed

  // Check if this is a shared view from URL parameters
  const [isSharedView, setIsSharedView] = React.useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isShared = urlParams.get("shared") === "true";

    if (isShared) {
      // If this is a shared view, modify the UI accordingly
      console.log("This is a shared wishlist view");
      setIsSharedView(true);

      // Force the component to recognize it's in shared mode
      // This ensures the UI shows the correct options for shared views
      document.title = `Shared Wishlist - ${wishlistData?.title || "View and Purchase Gifts"}`;
    }
  }, [wishlistData?.title]);

  // If no wishlist data is available, show a loading or empty state
  if (!wishlistData) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="py-12">
          <h2 className="text-xl font-semibold mb-4">Wishlist not found</h2>
          <p className="text-gray-500 mb-6">
            The wishlist you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 md:p-8">
        {/* Wishlist Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            {!isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{wishlistData.title}</h1>
                  <Badge
                    variant={wishlistData.isPrivate ? "outline" : "default"}
                    className="flex items-center gap-1"
                  >
                    {wishlistData.isPrivate ? (
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
                <p className="text-gray-600 mt-1">{wishlistData.description}</p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Wishlist Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={wishlistData.title}
                    onChange={handleWishlistChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={wishlistData.description}
                    onChange={handleWishlistChange}
                    className="w-full min-h-[80px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="privacy">Privacy:</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrivacyToggle}
                    className="flex items-center gap-1"
                  >
                    {wishlistData.isPrivate ? (
                      <>
                        <Lock size={14} />
                        Private
                      </>
                    ) : (
                      <>
                        <Globe size={14} />
                        Public
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                {!isSharedView && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleShare}
                >
                  <Share2 size={14} />
                  Share
                </Button>
                {isSharedView && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleCheckout(wishlistData.items)}
                  >
                    <Gift size={14} />
                    Purchase Gifts
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Wishlist Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Items ({wishlistData.items.length})
            </h2>
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PlusCircle size={16} />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>
                    Add details about the item you want to add to your wishlist.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      name="name"
                      value={newItem.name}
                      onChange={handleNewItemChange}
                      placeholder="e.g., Wireless Headphones"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price</Label>
                    <Input
                      id="item-price"
                      name="price"
                      type="number"
                      value={newItem.price}
                      onChange={handleNewItemChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-image">Image URL</Label>
                    <Input
                      id="item-image"
                      name="image"
                      value={newItem.image}
                      onChange={handleNewItemChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-url">Product URL</Label>
                    <Input
                      id="item-url"
                      name="url"
                      value={newItem.url}
                      onChange={handleNewItemChange}
                      placeholder="https://example.com/product"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-notes">Notes</Label>
                    <textarea
                      id="item-notes"
                      name="notes"
                      value={newItem.notes}
                      onChange={handleNewItemChange}
                      placeholder="Any specific details about this item..."
                      className="w-full min-h-[80px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddItemOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlistData.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-1/3 h-[150px] overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Gift size={48} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 p-4 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-primary font-semibold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!isSharedView && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onRemoveItem(item.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Remove</span>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleCheckout([item])}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Purchase Gift</span>
                            </DropdownMenuItem>
                            {item.url && (
                              <DropdownMenuItem>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full"
                                >
                                  View Product
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-2 flex-1">
                        {item.notes && (
                          <p className="text-sm text-gray-600">{item.notes}</p>
                        )}
                      </div>
                      <div className="mt-auto flex justify-end items-center">
                        <span className="text-xs text-gray-500">
                          Added {new Date(item.added_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {wishlistData.items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <PlusCircle size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items in this wishlist yet
              </h3>
              <p className="text-gray-500 mb-4 text-center max-w-md">
                Start adding items to your wishlist by clicking the "Add Item"
                button above.
              </p>
              <Button
                onClick={() => setIsAddItemOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Your First Item
              </Button>
            </div>
          )}

          {wishlistData.items.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => handleCheckout(wishlistData.items)}
                className="flex items-center gap-2"
                variant="default"
              >
                <Gift size={18} />
                Purchase All Items
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Wishlist</DialogTitle>
            <DialogDescription>
              Share your wishlist with friends and family.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-link">Shareable Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="share-link"
                  value={getShareableLink()}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(getShareableLink())}
                  className="h-10 w-10"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Share to</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => shareToSocialMedia("whatsapp")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#25D366"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => shareToSocialMedia("instagram")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#E4405F"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => shareToSocialMedia("x")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#000000"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Privacy Setting</Label>
              <div className="flex items-center gap-2">
                <Badge
                  variant={wishlistData.isPrivate ? "outline" : "default"}
                  className="flex items-center gap-1"
                >
                  {wishlistData.isPrivate ? (
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
                <span className="text-sm text-gray-500">
                  {wishlistData.isPrivate
                    ? "Only you can see this wishlist"
                    : "Anyone with the link can view this wishlist"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog
        open={isCheckoutDialogOpen}
        onOpenChange={setIsCheckoutDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your purchase for the selected items.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-[300px] overflow-y-auto mb-4">
              <h3 className="font-medium mb-2">Selected Items:</h3>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-lg">
                ${checkoutTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCheckoutDialogOpen(false)}
              disabled={isPaymentProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={initializePaystack}
              disabled={isPaymentProcessing}
              className="flex items-center gap-2"
            >
              {isPaymentProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay with Paystack
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WishlistDetail;
