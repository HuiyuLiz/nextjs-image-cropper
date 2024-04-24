"use client";

import { useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";

type CheckoutProps = {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
};

export default function Checkout({
  plan,
  amount,
  buyerId,
  credits,
}: CheckoutProps) {
  const { toast } = useToast();

  const checkout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
    }

    if (query.get("canceled")) {
      toast({
        title: "Order canceled!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, []);

  return (
    <form action={checkout} method="POST">
      <Button type="submit" disabled={plan === "Free" || credits <= 0}>
        Choose
      </Button>
    </form>
  );
}
