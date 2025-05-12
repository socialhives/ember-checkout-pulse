
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { IndianRupee, CreditCard } from "lucide-react";
import { TranslatedText, useTranslate } from "@/components/TranslatedText";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const translate = useTranslate();
  
  const [paymentAmount, setPaymentAmount] = useState("");

  // Credit card form schema
  const cardSchema = z.object({
    cardNumber: z.string()
      .min(13, translate("Card number must be at least 13 digits"))
      .max(19, translate("Card number cannot exceed 19 digits"))
      .regex(/^[0-9]+$/, translate("Card number must contain only digits")),
    cardName: z.string().min(3, translate("Cardholder name is required")),
    expiryDate: z.string()
      .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, translate("Expiry date must be in MM/YY format")),
    cvv: z.string()
      .length(3, translate("CVV must be 3 digits"))
      .regex(/^[0-9]+$/, translate("CVV must contain only digits")),
  });

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      cardName: currentUser?.displayName || "",
      expiryDate: "",
      cvv: "",
    },
  });

  const [billingInfo, setBillingInfo] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers with up to 2 decimal places
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  const validatePaymentDetails = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: translate("Invalid Amount"),
        description: translate("Please enter a valid payment amount"),
        variant: "destructive"
      });
      return false;
    }
    
    if (!billingInfo.name || !billingInfo.email || !billingInfo.phone) {
      toast({
        title: translate("Missing Information"),
        description: translate("Please fill in all required fields"),
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const initiateCyberSourcePayment = async (cardData: z.infer<typeof cardSchema>) => {
    // This would be replaced with actual CyberSource API integration via Visanet
    console.log("Initiating CyberSource payment for amount:", paymentAmount);
    console.log("Card details:", {
      cardNumber: cardData.cardNumber.slice(-4).padStart(cardData.cardNumber.length, '*'),
      cardName: cardData.cardName,
      expiryDate: cardData.expiryDate,
    });
    
    // Simulate payment processing
    setTimeout(() => {
      navigate("/order-success", { 
        state: { 
          paymentAmount, 
          paymentMethod: "CyberSource (Visanet)",
          customerName: billingInfo.name,
          customerEmail: billingInfo.email,
          customerPhone: billingInfo.phone,
          lastFourDigits: cardData.cardNumber.slice(-4)
        } 
      });
      setLoading(false);
    }, 2000);
  };

  const onSubmit = async (cardData: z.infer<typeof cardSchema>) => {
    if (!validatePaymentDetails()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await initiateCyberSourcePayment(cardData);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: translate("Payment Failed"),
        description: translate("An error occurred during payment processing. Please try again."),
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-700">
            <TranslatedText text="MADAPET-PAYMENT" />
          </h1>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            ← <TranslatedText text="Back to Dashboard" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Amount Card */}
          <Card className="border-purple-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <CreditCard className="mr-2 h-5 w-5" />
                <TranslatedText text="CyberSource Payment" />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Enter amount and complete your payment" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount" className="font-medium">
                  <TranslatedText text="Payment Amount" />
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="paymentAmount"
                    name="paymentAmount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={handleAmountChange}
                    className="pl-10 text-lg font-medium"
                    required
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span><TranslatedText text="Amount to Pay:" /></span>
                  <span className="text-lg text-purple-700">
                    ₹ {paymentAmount ? parseFloat(paymentAmount).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500 text-center">
                  <TranslatedText text="Secured by CyberSource via Visanet" />
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Form */}
          <Card className="shadow-md border-purple-200">
            <CardHeader>
              <CardTitle><TranslatedText text="Complete Your Payment" /></CardTitle>
              <CardDescription>
                <TranslatedText text="Fill in your details to process the payment" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      <TranslatedText text="Customer Information" />
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="name"><TranslatedText text="Full Name" /></Label>
                        <Input
                          id="name"
                          name="name"
                          value={billingInfo.name}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email"><TranslatedText text="Email Address" /></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={billingInfo.email}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone"><TranslatedText text="Phone Number" /></Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={billingInfo.phone}
                          onChange={handleBillingChange}
                          placeholder={translate("e.g., +91 9876543210")}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      <TranslatedText text="Payment Method" />
                    </h3>
                    <Tabs defaultValue="card">
                      <TabsList className="w-full">
                        <TabsTrigger value="card" className="flex-1">
                          <div className="flex items-center justify-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span><TranslatedText text="CyberSource (Visanet)" /></span>
                          </div>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card" className="space-y-4 pt-4">
                        {/* Credit Card Form */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel><TranslatedText text="Card Number" /></FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="1234 5678 9012 3456" 
                                    {...field} 
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '');
                                      if (value.length <= 19) {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel><TranslatedText text="Cardholder Name" /></FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel><TranslatedText text="Expiry Date" /></FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="MM/YY" 
                                      {...field} 
                                      onChange={(e) => {
                                        let value = e.target.value.replace(/[^\d/]/g, '');
                                        if (value.length === 2 && !value.includes('/') && field.value.length !== 3) {
                                          value += '/';
                                        }
                                        if (value.length <= 5) {
                                          field.onChange(value);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel><TranslatedText text="CVV" /></FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password" 
                                      maxLength={3} 
                                      placeholder="123" 
                                      {...field} 
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 3) {
                                          field.onChange(value);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-md">
                          <p className="text-sm">
                            <TranslatedText text="Your payment is processed securely through CyberSource via Visanet. All card details are encrypted with industry-standard security measures." />
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-700 hover:bg-purple-800"
                    disabled={loading}
                  >
                    {loading ? 
                      <TranslatedText text="Processing..." /> : 
                      <TranslatedText text={`Pay ₹${paymentAmount ? parseFloat(paymentAmount).toFixed(2) : "0.00"}`} />
                    }
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      <TranslatedText text="Your payment information is secured with 256-bit encryption." />
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"
                        />
                      </svg>
                      <span className="text-xs text-gray-500">
                        <TranslatedText text="Protected by CyberSource via Visanet" />
                      </span>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
