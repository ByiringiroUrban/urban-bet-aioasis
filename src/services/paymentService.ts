
import { toast } from "@/hooks/use-toast";

// Define payment method types
export type PaymentMethod = 'momo' | 'airtel' | 'irembo' | 'card';

// Interface for payment request data
export interface PaymentRequestData {
  amount: number;
  phoneNumber?: string;
  email?: string;
  description?: string;
  currency: string;
  paymentMethod: PaymentMethod;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}

// Interface for payment response
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
}

// Simulate a payment with MTN Mobile Money
export const processMoMoPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
  console.log('Processing MTN MoMo payment:', data);
  
  // Validate phone number format (Rwanda numbers start with 07)
  if (!data.phoneNumber || !data.phoneNumber.replace(/\s/g, '').match(/^07\d{8}$/)) {
    return {
      success: false,
      message: 'Invalid phone number. Please enter a valid MTN Rwanda phone number starting with 07.'
    };
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a mock transaction ID
  const transactionId = `momo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Simulate successful payment (90% success rate for demo)
  const isSuccessful = Math.random() < 0.9;
  
  if (isSuccessful) {
    return {
      success: true,
      transactionId,
      message: `Payment of ${data.currency} ${data.amount.toLocaleString()} successfully processed. You'll receive an SMS confirmation.`
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please try again or use a different payment method.'
    };
  }
};

// Simulate a payment with Airtel Money
export const processAirtelMoneyPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
  console.log('Processing Airtel Money payment:', data);
  
  // Validate phone number format (Rwanda Airtel numbers also start with 07)
  if (!data.phoneNumber || !data.phoneNumber.replace(/\s/g, '').match(/^07\d{8}$/)) {
    return {
      success: false,
      message: 'Invalid phone number. Please enter a valid Airtel Rwanda phone number starting with 07.'
    };
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a mock transaction ID
  const transactionId = `airtel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Simulate successful payment (90% success rate for demo)
  const isSuccessful = Math.random() < 0.9;
  
  if (isSuccessful) {
    return {
      success: true,
      transactionId,
      message: `Payment of ${data.currency} ${data.amount.toLocaleString()} successfully processed. You'll receive an SMS confirmation.`
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please try again or use a different payment method.'
    };
  }
};

// Simulate a payment with Irembo Pay
export const processIremboPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
  console.log('Processing Irembo Pay payment:', data);
  
  // For Irembo Pay, we need an email
  if (!data.email) {
    return {
      success: false,
      message: 'Email is required for Irembo Pay transactions.'
    };
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a mock transaction ID
  const transactionId = `irembo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Mock redirect URL for Irembo Pay checkout
  const redirectUrl = `https://pay.irembo.rw/checkout/${transactionId}`;
  
  return {
    success: true,
    transactionId,
    message: 'Redirecting to Irembo Pay secure checkout...',
    redirectUrl
  };
};

// Process card payment
export const processCardPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
  console.log('Processing card payment:', data);
  
  if (!data.cardDetails) {
    return {
      success: false,
      message: 'Card details are required.'
    };
  }
  
  // Basic validation
  if (!data.cardDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
    return {
      success: false,
      message: 'Invalid card number. Please enter a valid 16-digit card number.'
    };
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a mock transaction ID
  const transactionId = `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Simulate successful payment (85% success rate for demo)
  const isSuccessful = Math.random() < 0.85;
  
  if (isSuccessful) {
    return {
      success: true,
      transactionId,
      message: `Payment of ${data.currency} ${data.amount.toLocaleString()} successfully processed.`
    };
  } else {
    return {
      success: false,
      message: 'Card payment failed. Please check your details or try a different card.'
    };
  }
};

// Main payment processing function that routes to the appropriate provider
export const processPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
  try {
    switch (data.paymentMethod) {
      case 'momo':
        return await processMoMoPayment(data);
      case 'airtel':
        return await processAirtelMoneyPayment(data);
      case 'irembo':
        return await processIremboPayment(data);
      case 'card':
        return await processCardPayment(data);
      default:
        return {
          success: false,
          message: 'Unsupported payment method.'
        };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    };
  }
};
