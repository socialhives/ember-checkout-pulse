
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample pet products data
const petProducts = [
  {
    id: "1",
    name: "Premium Dog Food",
    description: "High-quality nutrition for your furry friend",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    badge: "Popular"
  },
  {
    id: "2",
    name: "Interactive Cat Toy",
    description: "Keep your cat entertained for hours",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1526336179256-1347bdb255ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0JTIwdG95fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    badge: "New"
  },
  {
    id: "3",
    name: "Comfortable Pet Bed",
    description: "Soft and cozy resting place for your pet",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGV0JTIwYmVkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "4",
    name: "Pet Grooming Kit",
    description: "Complete set for keeping your pet clean",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGV0JTIwZ3Jvb21pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { addItem, totalItems } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-madapet-primary">MADAPET-PAYMENT</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={() => navigate("/checkout")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Cart
                {totalItems > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              
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
        <h2 className="text-2xl font-bold mb-6">Welcome, {currentUser?.displayName || "Pet Lover"}!</h2>
        
        {/* Featured products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Featured Products</h3>
            <Button variant="link" className="text-madapet-primary">View all</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {petProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
                <div className="relative h-48">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge className="absolute top-2 right-2 bg-madapet-primary">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="mt-2 text-lg font-bold text-madapet-secondary">
                    ${product.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-madapet-primary hover:bg-madapet-secondary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Call to action */}
        <section className="bg-madapet-light rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-madapet-dark mb-2">Ready to checkout?</h3>
            <p className="text-gray-600">Review your cart and complete your purchase.</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-madapet-primary hover:bg-madapet-secondary"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-lg text-madapet-dark mb-2">MADAPET-PAYMENT</h3>
              <p className="text-sm text-gray-600">The best payment solution for pet lovers</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h4 className="font-semibold mb-3 text-sm">Help</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Contact Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">FAQs</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Returns</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm">Company</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">About Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm">Legal</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Terms</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Privacy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-madapet-primary">Cookies</a></li>
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
