/*
  # Create Orders and Checkout System

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_name` (text) - Customer name
      - `user_email` (text) - Customer email
      - `user_phone` (text) - Customer phone
      - `shipping_address` (text) - Full shipping address
      - `city` (text) - City
      - `state` (text) - State
      - `pincode` (text) - PIN code
      - `total_amount` (numeric) - Order total
      - `payment_method` (text) - Payment method chosen
      - `payment_status` (text) - pending, completed, failed
      - `order_status` (text) - pending, confirmed, shipped, delivered
      - `created_at` (timestamptz)
      
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (text) - Product ID
      - `product_name` (text) - Product name
      - `product_image` (text) - Product image URL
      - `quantity` (integer) - Quantity ordered
      - `price` (numeric) - Price per item
      - `subtotal` (numeric) - Quantity × Price
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since no auth is implemented)
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text,
  user_phone text NOT NULL,
  shipping_address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  order_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_image text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for orders table (public access for demo)
CREATE POLICY "Allow public to insert orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to update orders"
  ON orders
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for order_items table (public access for demo)
CREATE POLICY "Allow public to insert order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read order items"
  ON order_items
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
