export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'customer' | 'vendor' | 'influencer' | 'admin'
          follower_count: number
          following_count: number
          is_verified: boolean
          website: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'customer' | 'vendor' | 'influencer' | 'admin'
          follower_count?: number
          following_count?: number
          is_verified?: boolean
          website?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'customer' | 'vendor' | 'influencer' | 'admin'
          follower_count?: number
          following_count?: number
          is_verified?: boolean
          website?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          creator_id: string
          video_url: string
          thumbnail_url: string
          hls_url: string | null
          title: string
          description: string | null
          duration: number
          view_count: number
          like_count: number
          comment_count: number
          share_count: number
          save_count: number
          status: 'processing' | 'active' | 'deleted' | 'banned'
          music_info: Json | null
          hashtags: string[] | null
          is_shoppable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          video_url: string
          thumbnail_url: string
          hls_url?: string | null
          title: string
          description?: string | null
          duration: number
          view_count?: number
          like_count?: number
          comment_count?: number
          share_count?: number
          save_count?: number
          status?: 'processing' | 'active' | 'deleted' | 'banned'
          music_info?: Json | null
          hashtags?: string[] | null
          is_shoppable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          video_url?: string
          thumbnail_url?: string
          hls_url?: string | null
          title?: string
          description?: string | null
          duration?: number
          view_count?: number
          like_count?: number
          comment_count?: number
          share_count?: number
          save_count?: number
          status?: 'processing' | 'active' | 'deleted' | 'banned'
          music_info?: Json | null
          hashtags?: string[] | null
          is_shoppable?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          title: string
          description: string | null
          price: number
          sale_price: number | null
          currency: string
          images: Json
          video_urls: Json | null
          category: string
          subcategory: string | null
          tags: string[] | null
          sku: string | null
          stock_quantity: number
          is_active: boolean
          rating: number
          review_count: number
          sold_count: number
          specs: Json | null
          variants: Json | null
          shipping_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          title: string
          description?: string | null
          price: number
          sale_price?: number | null
          currency?: string
          images: Json
          video_urls?: Json | null
          category: string
          subcategory?: string | null
          tags?: string[] | null
          sku?: string | null
          stock_quantity?: number
          is_active?: boolean
          rating?: number
          review_count?: number
          sold_count?: number
          specs?: Json | null
          variants?: Json | null
          shipping_info?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          title?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          currency?: string
          images?: Json
          video_urls?: Json | null
          category?: string
          subcategory?: string | null
          tags?: string[] | null
          sku?: string | null
          stock_quantity?: number
          is_active?: boolean
          rating?: number
          review_count?: number
          sold_count?: number
          specs?: Json | null
          variants?: Json | null
          shipping_info?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      video_products: {
        Row: {
          id: string
          video_id: string
          product_id: string
          timestamp_start: number | null
          timestamp_end: number | null
          x_position: number | null
          y_position: number | null
          click_count: number
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          product_id: string
          timestamp_start?: number | null
          timestamp_end?: number | null
          x_position?: number | null
          y_position?: number | null
          click_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          product_id?: string
          timestamp_start?: number | null
          timestamp_end?: number | null
          x_position?: number | null
          y_position?: number | null
          click_count?: number
          created_at?: string
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          user_id: string
          video_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          video_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          video_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          video_id: string
          parent_id: string | null
          content: string
          like_count: number
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          parent_id?: string | null
          content: string
          like_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          parent_id?: string | null
          content?: string
          like_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          variant: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          variant?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          variant?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          tax: number
          shipping: number
          total: number
          currency: string
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          billing_address: Json | null
          items: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          tax?: number
          shipping?: number
          total: number
          currency?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          items: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          currency?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          items?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          vendor_id: string
          quantity: number
          unit_price: number
          subtotal: number
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          vendor_id: string
          quantity?: number
          unit_price: number
          subtotal: number
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          vendor_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'vendor' | 'influencer' | 'admin'
      video_status: 'processing' | 'active' | 'deleted' | 'banned'
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
