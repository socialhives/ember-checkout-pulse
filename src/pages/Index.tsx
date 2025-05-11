
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the auth page
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">MADAPET-PAYMENT</h1>
        <p className="text-xl text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Index;
