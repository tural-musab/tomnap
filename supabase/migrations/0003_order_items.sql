-- Order items for multi-vendor split

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor ON order_items(vendor_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read their own order items (via order ownership)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Users can view own order_items'
  ) THEN
    EXECUTE 'DROP POLICY "Users can view own order_items" ON public.order_items';
  END IF;
END $$;

CREATE POLICY "Users can view own order_items"
ON order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
));

-- Users can insert order_items only for their own orders
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Users can add own order_items'
  ) THEN
    EXECUTE 'DROP POLICY "Users can add own order_items" ON public.order_items';
  END IF;
END $$;

CREATE POLICY "Users can add own order_items"
ON order_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
));


