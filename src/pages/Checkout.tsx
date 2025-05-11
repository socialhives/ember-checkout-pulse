
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
import { IndianRupee } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [paymentAmount, setPaymentAmount] = useState("");
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
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return false;
    }
    
    if (!billingInfo.name || !billingInfo.email || !billingInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const initiateAirtelPayment = async () => {
    // This would be replaced with actual Airtel Payment API integration
    console.log("Initiating Airtel payment for amount:", paymentAmount);
    
    // Simulate payment processing
    setTimeout(() => {
      navigate("/order-success", { 
        state: { 
          paymentAmount, 
          paymentMethod: "Airtel Money",
          customerName: billingInfo.name,
          customerEmail: billingInfo.email,
          customerPhone: billingInfo.phone
        } 
      });
      setLoading(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentDetails()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await initiateAirtelPayment();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "An error occurred during payment processing. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-700">MADAPET-PAYMENT</h1>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Amount Card */}
          <Card className="border-purple-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <IndianRupee className="mr-2 h-5 w-5" />
                Airtel Payment
              </CardTitle>
              <CardDescription>
                Enter amount and complete your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount" className="font-medium">Payment Amount</Label>
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
                  <span>Amount to Pay:</span>
                  <span className="text-lg text-purple-700">
                    ₹ {paymentAmount ? parseFloat(paymentAmount).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500 text-center">
                  Secured by Airtel Payment Gateway
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Form */}
          <Card className="shadow-md border-purple-200">
            <CardHeader>
              <CardTitle>Complete Your Payment</CardTitle>
              <CardDescription>
                Fill in your details to process the payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Customer Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={billingInfo.name}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
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
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={billingInfo.phone}
                        onChange={handleBillingChange}
                        placeholder="e.g., +91 9876543210"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <Tabs defaultValue="airtel">
                    <TabsList className="w-full">
                      <TabsTrigger value="airtel" className="flex-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span>Airtel Money</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="airtel" className="space-y-4 pt-4">
                      <div className="bg-purple-50 p-4 rounded-md">
                        <p className="text-sm">
                          You'll be redirected to Airtel Payment Gateway to complete your payment securely. 
                          Your transaction is protected with end-to-end encryption.
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
                  {loading ? "Processing..." : `Pay ₹${paymentAmount ? parseFloat(paymentAmount).toFixed(2) : "0.00"}`}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    Your payment information is secured with 256-bit encryption.
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">Protected by Airtel Payment Gateway</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
