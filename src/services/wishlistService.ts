import { supabase } from "./supabase";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  url?: string;
  notes?: string;
  added_at: string;
}

export interface Wishlist {
  id: string;
  title: string;
  description: string;
  is_private: boolean;
  items: WishlistItem[];
  created_at: string;
  updated_at: string;
}

// Create a new wishlist
export const createWishlist = async (wishlistData: {
  title: string;
  description: string;
  isPrivate: boolean;
  items?: WishlistItem[];
}): Promise<string | null> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    // If no user is logged in, create a demo user ID for testing
    // In production, you would require login
    const userIdToUse =
      userId || "demo-user-" + Math.random().toString(36).substring(2, 15);

    // First, create the wishlist
    const { data: wishlist, error: wishlistError } = await supabase
      .from("wishlists")
      .insert({
        title: wishlistData.title,
        description: wishlistData.description,
        is_private: wishlistData.isPrivate,
        user_id: userIdToUse,
      })
      .select()
      .single();

    if (wishlistError) throw wishlistError;
    if (!wishlist) throw new Error("Failed to create wishlist");

    // If there are items, add them to the wishlist
    if (wishlistData.items && wishlistData.items.length > 0) {
      const itemsToInsert = wishlistData.items.map((item) => ({
        wishlist_id: wishlist.id,
        name: item.name,
        price: item.price,
        image: item.image || "",
        url: item.url || "",
        notes: item.notes || "",
      }));

      const { error: itemsError } = await supabase
        .from("wishlist_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    return wishlist.id;
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return null;
  }
};

// Get all wishlists for the current user
export const getUserWishlists = async (): Promise<Wishlist[]> => {
  try {
    const { data: wishlists, error } = await supabase
      .from("wishlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // For each wishlist, get its items
    const wishlistsWithItems = await Promise.all(
      wishlists.map(async (wishlist) => {
        const { data: items, error: itemsError } = await supabase
          .from("wishlist_items")
          .select("*")
          .eq("wishlist_id", wishlist.id)
          .order("added_at", { ascending: false });

        if (itemsError) throw itemsError;

        return {
          ...wishlist,
          items: items || [],
        };
      }),
    );

    return wishlistsWithItems;
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return [];
  }
};

// Get a single wishlist by ID
export const getWishlistById = async (id: string): Promise<Wishlist | null> => {
  try {
    console.log("Fetching wishlist with ID:", id);
    const { data: wishlist, error } = await supabase
      .from("wishlists")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }

    if (!wishlist) {
      console.log("No wishlist found with ID:", id);
      return null;
    }

    if (error) throw error;
    if (!wishlist) return null;

    // Get the items for this wishlist
    const { data: items, error: itemsError } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("wishlist_id", id)
      .order("added_at", { ascending: false });

    if (itemsError) throw itemsError;

    return {
      ...wishlist,
      items: items || [],
    };
  } catch (error) {
    console.error(`Error fetching wishlist ${id}:`, error);
    return null;
  }
};

// Update a wishlist
export const updateWishlist = async (
  id: string,
  updates: {
    title?: string;
    description?: string;
    is_private?: boolean;
  },
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wishlists")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error updating wishlist ${id}:`, error);
    return false;
  }
};

// Delete a wishlist
export const deleteWishlist = async (id: string): Promise<boolean> => {
  try {
    // Items will be deleted automatically due to CASCADE
    const { error } = await supabase.from("wishlists").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting wishlist ${id}:`, error);
    return false;
  }
};

// Add an item to a wishlist
export const addItemToWishlist = async (
  wishlistId: string,
  item: {
    name: string;
    price: number;
    image?: string;
    url?: string;
    notes?: string;
  },
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .insert({
        wishlist_id: wishlistId,
        name: item.name,
        price: item.price,
        image: item.image || "",
        url: item.url || "",
        notes: item.notes || "",
      })
      .select()
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error(`Error adding item to wishlist ${wishlistId}:`, error);
    return null;
  }
};

// Remove an item from a wishlist
export const removeItemFromWishlist = async (
  itemId: string,
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error removing item ${itemId}:`, error);
    return false;
  }
};
