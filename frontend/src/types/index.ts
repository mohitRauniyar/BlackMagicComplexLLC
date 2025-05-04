export interface ProductType {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
}

export interface UserType {
  _id: string;
  email: string;
  isAdmin: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderType {
  _id: string;
  user: UserType;
  items: {
    product: ProductType;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}