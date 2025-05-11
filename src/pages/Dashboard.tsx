
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IndianRupee } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMakePayment = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-700">MADAPET-PAYMENT</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={currentUser?.photoURL || undefined} />
                  <AvatarFallback>
                    {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{currentUser?.displayName || "User"}</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-gray-500" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Welcome, {currentUser?.displayName || "User"}!</h2>
        
        {/* Payment Section */}
        <section className="mb-12">
          <Card className="bg-white shadow-md overflow-hidden border-purple-200">
            <CardHeader className="bg-purple-700 text-white">
              <CardTitle className="text-xl flex items-center">
                <IndianRupee className="h-5 w-5 mr-2" />
                Make a Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Ready to make a quick and secure payment? Use our Airtel Money integration for fast and reliable transactions.
                </p>
                <div className="bg-purple-50 p-4 rounded-md">
                  <h3 className="font-medium text-purple-800 mb-2">Why choose Airtel Money?</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fast and secure transactions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>End-to-end encryption</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <Button 
                onClick={handleMakePayment} 
                className="w-full bg-purple-700 hover:bg-purple-800"
              >
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>
        </section>
        
        {/* Recent Transactions (placeholder) */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center py-8">No recent transactions found.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-lg text-purple-700 mb-2">MADAPET-PAYMENT</h3>
              <p className="text-sm text-gray-600">The best payment solution for pet lovers</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h4 className="font-semibold mb-3 text-sm">Help</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-purple-700">Contact Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-purple-700">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm">Company</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-purple-700">About Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-purple-700">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm">Legal</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-purple-700">Terms</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-purple-700">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MADAPET-PAYMENT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
