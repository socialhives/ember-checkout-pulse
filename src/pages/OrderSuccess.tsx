
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IndianRupee } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state || {};
  
  const orderNumber = `MAD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString();
  const paymentAmount = paymentData.paymentAmount ? parseFloat(paymentData.paymentAmount).toFixed(2) : "0.00";
  const paymentMethod = paymentData.paymentMethod || "Airtel Money";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-fade-in">
        <Card className="shadow-lg border-purple-200">
          <CardHeader className="text-center bg-purple-700 text-white rounded-t-lg">
            <div className="mx-auto mb-4 bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <svg className="h-10 w-10 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl md:text-3xl">Payment Successful!</CardTitle>
            <CardDescription className="text-white opacity-90">
              Thank you for your payment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-gray-600">We've sent a payment confirmation to your email address.</p>
              <p className="mt-2 text-sm">Transaction Date: <span className="font-medium">{orderDate}</span></p>
              <p className="text-sm">Transaction ID: <span className="font-medium">{orderNumber}</span></p>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payment Summary</h3>
              
              <div className="bg-purple-50 p-4 rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-lg flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {paymentAmount}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
              </div>
              
              {paymentData.customerName && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p className="text-sm text-gray-600">
                    {paymentData.customerName}<br />
                    {paymentData.customerEmail}<br />
                    {paymentData.customerPhone}
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-center pt-4">
              <p className="mb-2">Need help with your payment?</p>
              <a href="mailto:support@madapet.com" className="text-purple-700 hover:underline">
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
              Go to Dashboard
            </Button>
            <Button 
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800"
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
