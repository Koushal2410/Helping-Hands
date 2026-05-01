import { useState } from 'react';
import toast from 'react-hot-toast';
import { createOrder, verifyPayment, recordDonation } from '../utils/api';

export function usePayment() {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async ({ amount, donationType, donorName, donorEmail, onSuccess, onFailure }) => {
    setLoading(true);
    try {
      const res = await createOrder({ amount, donationType, donorName });
      const { order, key } = res;

      // Demo mode (no real Razorpay keys)
      if (order.demo || key === 'demo_key') {
        await recordDonation({ type: donationType, amount, paymentId: `pay_demo_${Date.now()}`, donorName, donorEmail });
        toast.success('🎉 Donation recorded! (Demo mode)');
        onSuccess?.({ paymentId: `pay_demo_${Date.now()}`, amount, donationType });
        setLoading(false);
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Helping Hands Foundation',
        description: `${donationType} Donation`,
        order_id: order.id,
        prefill: { name: donorName, email: donorEmail },
        theme: { color: '#e11d48' },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await recordDonation({ type: donationType, amount, paymentId: response.razorpay_payment_id, donorName, donorEmail });
            toast.success('✅ Payment successful! Thank you for your donation.');
            onSuccess?.({ paymentId: response.razorpay_payment_id, amount, donationType });
          } catch {
            toast.error('Payment verification failed.');
            onFailure?.();
          }
        },
        modal: { ondismiss: () => { toast('Payment cancelled.'); onFailure?.(); } }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Payment failed');
      onFailure?.();
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
}
