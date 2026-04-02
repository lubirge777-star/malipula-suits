'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
}

interface UseApiReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData, autoFetch = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'An error occurred');
      }
      
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for products
export function useProducts(filters?: {
  category?: string;
  featured?: boolean;
  new?: boolean;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.featured) params.set('featured', 'true');
  if (filters?.new) params.set('new', 'true');
  if (filters?.limit) params.set('limit', filters.limit.toString());
  
  const queryString = params.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;
  
  return useApi<{ products: any[] }>(url);
}

// Hook for single product
export function useProduct(id: string) {
  return useApi<{ product: any }>(`/api/products/${id}`, { autoFetch: !!id });
}

// Hook for cart
export function useCart() {
  const { data, loading, error, refetch } = useApi<{ cart: any[]; total: number }>('/api/cart');
  
  const addToCart = async (item: {
    product_id: string;
    product_item_id?: string;
    fabric_id?: string;
    quantity?: number;
    customization?: string;
  }) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };
  
  const updateCartItem = async (id: string, updates: { quantity?: number; customization?: string }) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };
  
  const removeFromCart = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }
      
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };
  
  return {
    cart: data?.cart || [],
    total: data?.total || 0,
    loading,
    error,
    refetch,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}

// Hook for orders
export function useOrders(filters?: { status?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  
  const queryString = params.toString();
  const url = `/api/orders${queryString ? `?${queryString}` : ''}`;
  
  const { data, loading, error, refetch } = useApi<{ orders: any[] }>(url);
  
  const createOrder = async (orderData: {
    delivery_method: string;
    delivery_address_id?: string;
    delivery_notes?: string;
    payment_method: string;
    discount_code?: string;
  }) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error);
      }
      
      refetch();
      return { success: true, order: result.order };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };
  
  return {
    orders: data?.orders || [],
    loading,
    error,
    refetch,
    createOrder,
  };
}

// Hook for appointments
export function useAppointments(filters?: { status?: string; upcoming?: boolean }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.upcoming) params.set('upcoming', 'true');
  
  const queryString = params.toString();
  const url = `/api/appointments${queryString ? `?${queryString}` : ''}`;
  
  const { data, loading, error, refetch } = useApi<{ appointments: any[] }>(url);
  
  const createAppointment = async (appointmentData: {
    type: string;
    scheduled_at: string;
    duration?: number;
    location?: string;
    address_id?: string;
    is_virtual?: boolean;
    notes?: string;
  }) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error);
      }
      
      refetch();
      return { success: true, appointment: result.appointment };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };
  
  return {
    appointments: data?.appointments || [],
    loading,
    error,
    refetch,
    createAppointment,
  };
}

// Hook for categories
export function useCategories() {
  return useApi<{ categories: any[] }>('/api/categories');
}

// Hook for fabrics
export function useFabrics(filters?: { quality?: string; premium?: boolean }) {
  const params = new URLSearchParams();
  if (filters?.quality) params.set('quality', filters.quality);
  if (filters?.premium) params.set('premium', 'true');
  
  const queryString = params.toString();
  const url = `/api/fabrics${queryString ? `?${queryString}` : ''}`;
  
  return useApi<{ fabrics: any[] }>(url);
}
