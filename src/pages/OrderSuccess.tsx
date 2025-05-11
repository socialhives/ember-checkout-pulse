
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const orderNumber = `MAD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString();

  // Simulate sending an order confirmation email
  useEffect(() => {
    console.log(`Sending order confirmation email for order ${orderNumber}`);
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-fade-in">
        <Card className="shadow-lg border-madapet-accent">
          <CardHeader className="text-center bg-madapet-primary text-white rounded-t-lg">
            <div className="mx-auto mb-4 bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <svg className="h-10 w-10 text-madapet-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl md:text-3xl">Order Successful!</CardTitle>
            <CardDescription className="text-white opacity-90">
              Thank you for your purchase
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-gray-600">We've sent an order confirmation to your email address.</p>
              <p className="mt-2 text-sm">Order Date: <span className="font-medium">{orderDate}</span></p>
              <p className="text-sm">Order Number: <span className="font-medium">{orderNumber}</span></p>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              
              {/* Sample order items - in a real app, this would come from the cart */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                    <span>Premium Dog Food</span>
                  </div>
                  <span className="font-medium">$49.99</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                    <span>Interactive Cat Toy</span>
                  </div>
                  <span className="font-medium">$24.99</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>$74.98</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>$7.50</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$82.48</span>
                </div>
              </div>
            </div>
            
            <div className="bg-madapet-light p-4 rounded-md">
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-600">
                123 Pet Street, Apartment 4<br />
                Pet City, PC 12345<br />
                United States
              </p>
            </div>
            
            <div className="text-center pt-4">
              <p className="mb-2">Need help with your order?</p>
              <a href="mailto:support@madapet.com" className="text-madapet-primary hover:underline">
                Contact our support team
              </a>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => navigate("/dashboard")}
            >
              Continue Shopping
            </Button>
            <Button 
              className="w-full sm:w-auto bg-madapet-primary hover:bg-madapet-secondary"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>© {new Date().getFullYear()} MADAPET-PAYMENT</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
