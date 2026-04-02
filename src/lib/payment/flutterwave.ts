/**
 * Flutterwave Payment Integration for Malipula Suits
 * Supports: M-Pesa (Tanzania), Tigo Pesa, Airtel Money, Cards
 */

interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  encryptionKey: string;
  baseUrl: string;
}

interface PaymentPayload {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name: string;
    phone_number?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  meta?: Record<string, any>;
  phone_number?: string;
  network?: 'MPESA' | 'TIGOPESA' | 'AIRTELMONEY';
}

interface MobileMoneyPayload {
  phone_number: string;
  amount: number;
  currency: string;
  email: string;
  tx_ref: string;
  network: 'MPESA' | 'TIGOPESA' | 'AIRTELMONEY';
}

interface PaymentResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    created_at: string;
    link?: string;
  };
}

interface VerifyResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    created_at: string;
    customer: {
      id: number;
      name: string;
      email: string;
      phone_number: string;
    };
  };
}

class FlutterwaveService {
  private config: FlutterwaveConfig;

  constructor() {
    this.config = {
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
      encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || '',
      baseUrl: 'https://api.flutterwave.com/v3',
    };
  }

  generateTxRef(prefix: string = 'MLP'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  async initializePayment(payload: PaymentPayload): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          public_key: this.config.publicKey,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Flutterwave payment initialization error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Payment initialization failed',
      };
    }
  }

  async chargeMobileMoney(payload: MobileMoneyPayload): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/charges`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: payload.tx_ref,
          amount: payload.amount,
          currency: payload.currency,
          email: payload.email,
          phone_number: payload.phone_number,
          network: payload.network,
          type: 'mobile_money_tanzania',
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
          meta: {
            network: payload.network,
          },
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Mobile money charge error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Mobile money charge failed',
      };
    }
  }

  async verifyPayment(transactionId: number): Promise<VerifyResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/transactions/${transactionId}/verify`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Payment verification failed',
      };
    }
  }

  async verifyPaymentByRef(txRef: string): Promise<VerifyResponse> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/transactions/verify_by_reference?tx_ref=${txRef}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification by ref error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Payment verification failed',
      };
    }
  }

  async refundPayment(transactionId: number, amount?: number, reason?: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/transactions/${transactionId}/refund`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            reason,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Refund error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }

  async createPaymentLink(orderDetails: {
    orderId: string;
    amount: number;
    currency: string;
    customer: {
      email: string;
      name: string;
      phone?: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }): Promise<{ success: boolean; link?: string; txRef?: string; error?: string }> {
    const txRef = this.generateTxRef('MLP');
    
    const payload: PaymentPayload = {
      tx_ref: txRef,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id=${orderDetails.orderId}`,
      customer: {
        email: orderDetails.customer.email,
        name: orderDetails.customer.name,
        phone_number: orderDetails.customer.phone,
      },
      customizations: {
        title: 'Malipula Suits',
        description: `Payment for Order #${orderDetails.orderId}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/malipula/m.png`,
      },
      meta: {
        order_id: orderDetails.orderId,
        items: orderDetails.items,
      },
    };

    const response = await this.initializePayment(payload);

    if (response.status === 'success' && response.data?.link) {
      return {
        success: true,
        link: response.data.link,
        txRef,
      };
    }

    return {
      success: false,
      error: response.message,
    };
  }

  async processMpesaPayment(details: {
    amount: number;
    phone: string;
    email: string;
    orderId: string;
  }): Promise<{ success: boolean; txRef?: string; message?: string; error?: string }> {
    const txRef = this.generateTxRef('MPESA');
    
    const response = await this.chargeMobileMoney({
      tx_ref: txRef,
      amount: details.amount,
      currency: 'TZS',
      email: details.email,
      phone_number: details.phone,
      network: 'MPESA',
    });

    if (response.status === 'success') {
      return {
        success: true,
        txRef,
        message: 'Payment initiated. Please check your phone for the M-Pesa prompt.',
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to initiate M-Pesa payment',
    };
  }

  async processTigoPesaPayment(details: {
    amount: number;
    phone: string;
    email: string;
    orderId: string;
  }): Promise<{ success: boolean; txRef?: string; message?: string; error?: string }> {
    const txRef = this.generateTxRef('TIGO');
    
    const response = await this.chargeMobileMoney({
      tx_ref: txRef,
      amount: details.amount,
      currency: 'TZS',
      email: details.email,
      phone_number: details.phone,
      network: 'TIGOPESA',
    });

    if (response.status === 'success') {
      return {
        success: true,
        txRef,
        message: 'Payment initiated. Please check your phone for the Tigo Pesa prompt.',
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to initiate Tigo Pesa payment',
    };
  }

  async processAirtelMoneyPayment(details: {
    amount: number;
    phone: string;
    email: string;
    orderId: string;
  }): Promise<{ success: boolean; txRef?: string; message?: string; error?: string }> {
    const txRef = this.generateTxRef('AIRTEL');
    
    const response = await this.chargeMobileMoney({
      tx_ref: txRef,
      amount: details.amount,
      currency: 'TZS',
      email: details.email,
      phone_number: details.phone,
      network: 'AIRTELMONEY',
    });

    if (response.status === 'success') {
      return {
        success: true,
        txRef,
        message: 'Payment initiated. Please check your phone for the Airtel Money prompt.',
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to initiate Airtel Money payment',
    };
  }
}

export const flutterwaveService = new FlutterwaveService();

export type {
  PaymentPayload,
  MobileMoneyPayload,
  PaymentResponse,
  VerifyResponse,
};
