declare module "@/types/admin" {
  export interface Package {
    _id?: string;
    title: string;
    productId: string;
    description?: string;
    price: number;
    totalDays: number;
    limit: number;
    isRecommended?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export type DiscountType = "percentage" | "fixed";

  export interface Coupon {
    _id?: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    startsAt?: string | null;
    expiresAt: string;
    applicablePackages?: string[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled" | "failed";

  export interface Subscription {
    _id?: string;
    user?: any;
    package?: any;
    coupon?: any;
    couponCode?: string;
    originalPrice?: number;
    discountAmount?: number;
    payableAmount?: number;
    tranId?: string;
    startDate?: string;
    endDate?: string;
    status?: SubscriptionStatus;
    isActive?: boolean;
    isExpired?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
  }

  export interface PaymentRecord {
    _id?: string;
    subscription?: string | Subscription;
    user?: string | any;
    package?: string | any;
    tranId?: string;
    provider?: string;
    originalAmount?: number;
    discountAmount?: number;
    paidAmount?: number;
    currency?: string;
    status?: string;
    paidAt?: string;
    gatewayResponse?: any;
    createdAt?: string;
  }
}
