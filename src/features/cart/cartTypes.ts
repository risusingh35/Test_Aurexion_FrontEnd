
export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface CartState {
  items: CartItem[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
}
