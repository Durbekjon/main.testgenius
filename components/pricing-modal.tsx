"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { fetchPacks, Pack } from "@/lib/services/packs-service";
import {
  getStripePublicKey,
  createPaymentIntent,
  confirmPayment,
} from "@/lib/services/stripe-service";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "@/contexts/auth-context";

// Restore the PricingModalProps type
type PricingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Add a PaymentForm component for handling the payment UI and logic
function PaymentForm({
  clientSecret,
  paymentIntentId,
  onSuccess,
  onError,
}: {
  clientSecret: string;
  paymentIntentId: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      onError(stripeError.message || "Payment failed");
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await confirmPayment(paymentIntentId);
        onSuccess();
      } catch (err: any) {
        setError("Failed to confirm payment");
        onError("Failed to confirm payment");
      }
    } else {
      setError("Payment not successful");
      onError("Payment not successful");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{ hidePostalCode: true }}
        className="p-2 border rounded"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading || !stripe} className="w-full">
        {loading ? "Processing..." : "Pay"}
      </Button>
    </form>
  );
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [testAccess, setTestAccess] = useState<{
    code: string;
    qrCode: string;
    link: string;
  } | null>(null);
  const { t } = useLanguage();
  const { refreshUser } = useAuth();

  // Packs state
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe state
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<null | {
    clientSecret: string;
    paymentIntentId: string;
    pack: Pack;
  }>(null);
  const [paymentStep, setPaymentStep] = useState<"select" | "pay" | "success">(
    "select"
  );
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchPacks()
      .then((data) => setPacks(data))
      .catch((err) => setError("Failed to load packs"))
      .finally(() => setLoading(false));
  }, [open]);

  const handleSelectPlan = async (packName: string) => {
    setSelectedPlan(packName);
    setPaymentError(null);
    const pack = packs.find((p) => p.name === packName);
    if (!pack) return;
    try {
      // Get Stripe public key and create payment intent
      if (!stripePromise) {
        const key = await getStripePublicKey();
        setStripePromise(loadStripe(key));
      }
      const intent = await createPaymentIntent(pack.id);
      setPaymentIntent(intent);
      setPaymentStep("pay");
    } catch (err: any) {
      setPaymentError("Failed to start payment");
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("pricing.title")}</DialogTitle>
          <DialogDescription>{t("pricing.subtitle")}</DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {paymentStep === "select" && !selectedPlan ? (
            <motion.div
              key="pricing-tiers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4 md:grid-cols-3"
            >
              {loading ? (
                <div className="col-span-3 text-center py-8">
                  {t("common.loading")}
                </div>
              ) : error ? (
                <div className="col-span-3 text-center text-red-500 py-8">
                  {error}
                </div>
              ) : packs.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  {t("pricing.no_packs")}
                </div>
              ) : (
                packs.map((pack) => (
                  <Card
                    key={pack.id}
                    className={cn(
                      "relative overflow-hidden transition-all hover:shadow-lg",
                      pack.discountPerCent > 0 && "border-primary shadow-md"
                    )}
                  >
                    {pack.discountPerCent > 0 && (
                      <div className="absolute right-0 top-0 h-16 w-16">
                        <div className="absolute right-0 top-0 h-16 w-16 rotate-45 translate-x-1/2 -translate-y-1/2 bg-primary text-xs text-primary-foreground">
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-medium">
                            {t("pricing.popular")}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{pack.name}</CardTitle>
                      <CardDescription>
                        {pack.advantages.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-3xl font-bold">
                        ${pack.price.toFixed(2)}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          {t("pricing.one_time")}
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          {pack.coinsCount} {t("pricing.coins")}
                        </li>
                        {pack.bonusCount > 0 && (
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />+
                            {pack.bonusCount} {t("pricing.bonus_coins")}
                          </li>
                        )}
                        {pack.advantages.map((adv) => (
                          <li key={adv} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            {adv}
                          </li>
                        ))}
                        {pack.disadvantages.map((dis) => (
                          <li
                            key={dis}
                            className="flex items-center text-muted-foreground"
                          >
                            - {dis}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={cn(
                          "w-full",
                          pack.discountPerCent > 0
                            ? "bg-primary"
                            : "bg-primary/90"
                        )}
                        onClick={() => handleSelectPlan(pack.name)}
                      >
                        {t("pricing.select_plan")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </motion.div>
          ) : paymentStep === "pay" && paymentIntent && stripePromise ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: paymentIntent.clientSecret }}
            >
              <div className="py-4">
                <h3 className="text-xl font-bold mb-2">
                  {t("pricing.payment")}
                </h3>
                <PaymentForm
                  clientSecret={paymentIntent.clientSecret}
                  paymentIntentId={paymentIntent.paymentIntentId}
                  onSuccess={async () => {
                    await refreshUser();
                    setPaymentStep("success");
                  }}
                  onError={(msg) => setPaymentError(msg)}
                />
                {paymentError && (
                  <div className="text-red-500 text-sm mt-2">
                    {paymentError}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setPaymentStep("select");
                    setSelectedPlan(null);
                  }}
                >
                  {t("pricing.back_to_plans")}
                </Button>
              </div>
            </Elements>
          ) : paymentStep === "success" ? (
            <div className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                {t("pricing.payment_success")}
              </h3>
              <Button
                onClick={() => {
                  setPaymentStep("select");
                  setSelectedPlan(null);
                  setPaymentIntent(null);
                  onOpenChange(false);
                }}
              >
                {t("common.close")}
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center">{t("common.loading")}</div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
