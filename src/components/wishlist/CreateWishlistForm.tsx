import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Lock,
  Upload,
  Link,
  Store,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  url?: string;
  notes?: string;
  vendor?: string;
}

interface CreateWishlistFormProps {
  onSubmit?: (data: {
    title: string;
    description: string;
    isPrivate: boolean;
    items?: WishlistItem[];
  }) => void;
  onCancel?: () => void;
}

const CreateWishlistForm = ({
  onSubmit = () => console.log("Form submitted"),
  onCancel = () => console.log("Form cancelled"),
}: CreateWishlistFormProps) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    isPrivate: false,
    items: [] as WishlistItem[],
  });

  const [currentItem, setCurrentItem] = React.useState({
    name: "",
    price: 0,
    image: "",
    url: "",
    notes: "",
    vendor: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // If there's an item in progress with at least a name, add it to the items list
    if (currentItem.name) {
      addItemToWishlist();
    }
    // Make a copy of the data to avoid any reference issues
    const submissionData = JSON.parse(JSON.stringify(formData));
    onSubmit(submissionData);
  };

  const handleItemChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const addItemToWishlist = () => {
    if (!currentItem.name) return;

    const newItem = {
      ...currentItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      image:
        currentItem.image ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    // Reset current item form
    setCurrentItem({
      name: "",
      price: 0,
      image: "",
      url: "",
      notes: "",
      vendor: formData.vendor || "",
    });
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-full"
      id="wishlist-form"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Wishlist Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Birthday Wishlist"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this wishlist is for..."
          className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Items Section */}
      <div className="space-y-4 border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Add Items to Your Wishlist</h3>
          <Badge variant="outline">{formData.items.length} items</Badge>
        </div>

        {/* Item input form */}
        <div className="space-y-3 border p-3 rounded-md bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="item-name" className="text-sm">
                Item Name
              </Label>
              <Input
                id="item-name"
                name="name"
                value={currentItem.name}
                onChange={handleItemChange}
                placeholder="e.g., Wireless Headphones"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="item-price" className="text-sm">
                Price
              </Label>
              <Input
                id="item-price"
                name="price"
                type="number"
                value={currentItem.price}
                onChange={handleItemChange}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="item-url" className="text-sm">
              Product URL
            </Label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                id="item-url"
                name="url"
                value={currentItem.url}
                onChange={handleItemChange}
                placeholder="https://example.com/product"
                className="flex-1 w-full mt-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mt-2 sm:mt-0"
              >
                <Link size={16} />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="item-vendor" className="text-sm">
              Vendor
            </Label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                id="item-vendor"
                name="vendor"
                value={currentItem.vendor}
                onChange={handleItemChange}
                placeholder="e.g., Amazon, Target, etc."
                className="flex-1 w-full mt-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mt-2 sm:mt-0"
              >
                <Store size={16} />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="item-image" className="text-sm">
              Upload Image
            </Label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                id="item-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const fileUrl = URL.createObjectURL(e.target.files[0]);
                    setCurrentItem((prev) => ({ ...prev, image: fileUrl }));
                  }
                }}
                className="flex-1 w-full mt-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mt-2 sm:mt-0"
              >
                <Upload size={16} />
              </Button>
            </div>
            {currentItem.image && (
              <div className="mt-2">
                <img
                  src={currentItem.image}
                  alt="Item preview"
                  className="max-h-32 rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={addItemToWishlist}
              className="flex items-center gap-1"
              disabled={!currentItem.name}
            >
              <PlusCircle size={16} />
              Add Item
            </Button>
          </div>
        </div>

        {/* Items list */}
        {formData.items.length > 0 && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
            {formData.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-2">
                  {item.image && (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto mb-2 sm:mb-0"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          onClick={(e) => {
            console.log("Create Wishlist button clicked");
            // The form's onSubmit will handle the submission
          }}
        >
          Create Wishlist
        </Button>
      </div>
    </form>
  );
};

export default CreateWishlistForm;
