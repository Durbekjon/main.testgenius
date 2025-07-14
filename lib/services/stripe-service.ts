import { api } from "../api";

export async function getStripePublicKey(): Promise<string> {
  const res = await api.get<{ publicKey: string }>("api/v1/stripe/public-key");
  return res.data.publicKey;
}

export async function createPaymentIntent(packId: string): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  pack: any;
}> {
  const res = await api.post("api/v1/stripe/create-payment-intent", { packId });
  return res.data;
}

export async function confirmPayment(paymentIntentId: string): Promise<any> {
  const res = await api.post("api/v1/stripe/confirm-payment", {
    paymentIntentId,
  });
  return res.data;
} 