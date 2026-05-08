export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum UserRole {
  CUSTOMER = 'customer',
  PHARMACIST = 'pharmacist',
  ADMIN = 'admin',
  DELIVERY = 'delivery'
}

export enum PaymentMethod {
  COD = 'COD',
  MOBILE = 'Mobile',
  CARD = 'Card'
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiryDate?: string;
  company?: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  description?: string;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: any;
  updatedAt: any;
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  medicineName?: string;
  quantity: number;
  priceAtTime: number;
}

export interface Prescription {
  id: string;
  userId: string;
  orderId?: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  createdAt: any;
}
