CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  url TEXT,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlists
CREATE POLICY "Users can view their own wishlists" 
  ON wishlists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public wishlists" 
  ON wishlists FOR SELECT 
  USING (is_private = false);

CREATE POLICY "Users can insert their own wishlists" 
  ON wishlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlists" 
  ON wishlists FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlists" 
  ON wishlists FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for wishlist items
CREATE POLICY "Users can view items in their wishlists" 
  ON wishlist_items FOR SELECT 
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view items in public wishlists" 
  ON wishlist_items FOR SELECT 
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE is_private = false
    )
  );

CREATE POLICY "Users can insert items to their wishlists" 
  ON wishlist_items FOR INSERT 
  WITH CHECK (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their wishlists" 
  ON wishlist_items FOR UPDATE 
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their wishlists" 
  ON wishlist_items FOR DELETE 
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );
