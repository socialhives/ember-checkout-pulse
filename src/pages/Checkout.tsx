
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate("/order-success");
      setLoading(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>Add some products to your cart to checkout.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full bg-madapet-primary hover:bg-madapet-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-madapet-primary">Checkout</h1>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            ← Back to Shopping
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? "item" : "items"} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center mt-1">
                        <button
                          className="text-gray-500 hover:text-madapet-primary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button
                          className="text-gray-500 hover:text-madapet-primary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>
                  Fill in your details to complete the order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Billing Information</h3>
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
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={billingInfo.address}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={billingInfo.city}
                            onChange={handleBillingChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={billingInfo.zipCode}
                            onChange={handleBillingChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={billingInfo.country}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <Tabs defaultValue="card">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="card">Credit Card</TabsTrigger>
                        <TabsTrigger value="paypal">PayPal</TabsTrigger>
                        <TabsTrigger value="apple-pay">Apple Pay</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card" className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            placeholder="John Smith"
                            value={paymentInfo.cardName}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiration Date</Label>
                            <Input
                              id="expiry"
                              name="expiry"
                              placeholder="MM/YY"
                              value={paymentInfo.expiry}
                              onChange={handlePaymentChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input
                              id="cvc"
                              name="cvc"
                              placeholder="123"
                              value={paymentInfo.cvc}
                              onChange={handlePaymentChange}
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="paypal">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg className="h-12 w-12 text-blue-500 mb-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19.554 9.488c.121.563.106 1.246-.04 2.051-.582 2.978-2.477 4.466-5.683 4.466h-.442c-.413 0-.752.339-.752.732l-.04.2-.261 1.754-.035.177c-.058.374-.392.652-.77.652H8.376c-.374 0-.608-.304-.547-.676l1.232-7.94c.072-.47.484-.826.965-.826h7.017l.372 1.677c-.325-.12-.753-.213-1.282-.213h-5.104l-.34.356c-.378-.034-.678.311-.735.676l-.634 4.182c-.03.201.044.403.193.557.15.154.36.24.574.24h1.534c2.043 0 3.797-1.022 4.251-3.064.24-1.07.012-1.946-.565-2.563a2.12 2.12 0 0 0-.2-.213l2.4-.031M9.552 7.75c.246-1.246 1.157-1.955 2.894-1.895 1.738.06 2.643.975 2.487 2.22-.156 1.247-1.099 2.032-2.856 1.965-1.758-.067-2.722-1.047-2.525-2.29z"
                            />
                          </svg>
                          <p>You'll be redirected to PayPal to complete your purchase.</p>
                          <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                            Continue with PayPal
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="apple-pay">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg className="h-12 w-12 text-black mb-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M17.09 12.632c.033 2.337 2.073 3.117 2.093 3.127-.016.055-.32 1.104-1.058 2.184-.635.928-1.299 1.855-2.338 1.875-1.024.02-1.35-.602-2.52-.602-1.172 0-1.538.583-2.512.622-1.008.04-1.779-.999-2.421-1.924-1.318-1.893-2.333-5.344-1.978-7.689.243-1.308 1.124-2.367 2.201-3.008 1.015-.604 2.36-.65 2.943-.552 1.02.135 1.971.577 2.55.577.58 0 1.643-.52 2.82-.73l.732.019c2.292-.244 3.27 1.348 3.22 1.483-.03.078-1.069.81-1.263 2.618zM14.413 4s.212 1.154-.623 2.256c-.74.976-1.937 1.68-2.948 1.562-.144-1.092.386-2.253.975-2.95.67-.772 1.983-1.31 2.596-.868z"
                            />
                          </svg>
                          <p>You'll be redirected to Apple Pay to complete your purchase.</p>
                          <Button className="mt-4 bg-black hover:bg-gray-800 text-white">
                            Continue with Apple Pay
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-madapet-primary hover:bg-madapet-secondary"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Pay $${(totalPrice * 1.1).toFixed(2)}`}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500">
                    Your payment information is secured with 256-bit encryption.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
