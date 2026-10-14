// These interfaces describe the JSON your backend sends back.

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  isHidden: boolean;
  createdAt: string;
}

export interface ProductListResponse {
  total: number;
  page: number;
  pages: number;
  products: Product[];
}

export interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ProductDetails {
  product: Product;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Wishlist {
  count: number;
  products: Product[];
}

// ---- Admin ----

export interface DashboardStats {
  totalProducts: number;
  visibleProducts: number;
  hiddenProducts: number;
  totalUsers: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentProducts: Product[];
}

export interface AdminProductListResponse {
  count: number;
  products: Product[];
}
