import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentPage from "./PaymentPage";

// Uncomment this if you want to use the API for fetching

// const API_URL = "http://localhost:5000";


const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([
    {
      _id: "prod1",
      name: "Premium Ice Cubes",
      description: "Perfectly clear, slow-melting ice cubes for drinks.",
      price: "15.00",
      image: "image_2_1.jpeg",
    },
    {
      _id: "prod2",
      name: "Artisanal Ice Balls",
      description: "Spherical ice for sophisticated cocktails.",
      price: "25.00",
      image: "Ice Balls.jpg",
    },
    {
      _id: "prod3",
      name: "Crushed Ice Bag",
      description: "Ideal for mojitos, mint juleps, and other crushed ice drinks.",
      price: "10.00",
      image: "extracted_img_6_1.jpeg",
    },
    {
      _id: "prod4",
      name: "Ice Block",
      description: "Large block of ice for carving or cooling large batches.",
      price: "30.00",
      image: "extracted_img_3_1.jpeg",
    },
  ]);

  // Commented out dynamic fetching logic
  /*
  useEffect(() => {
    const fetchWishlistItems = async () => {
      // Retrieve product IDs from localStorage
      const storedWishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
      
      const fetchedItems = await Promise.all(
        storedWishlistIds.map(async (productId) => {
          try {
            const res = await fetch(`${API_URL}/api/products/${productId}`);
            if (!res.ok) {
              // Log error if fetch was not successful (e.g., 404, 500)
              console.error(`Failed to fetch product ${productId}:`, res.status, res.statusText);
              return null; // Return null to filter out later
            }
            return await res.json();
          } catch (error) {
            // Log network errors or other exceptions
            console.error(`Error fetching product ${productId}:`, error);
            return null; // Return null to filter out later
          }
        })
      );
      // Filter out any nulls (failed fetches) before setting the wishlist
      setWishlist(fetchedItems.filter(Boolean)); 
    };

    fetchWishlistItems();
  }, []); // The empty dependency array ensures this effect runs only once on mount
  */

  // Helper function for image paths, assuming images are in `src/assets/images`
  const getImageUrl = (imageName) => `/src/assets/images/${imageName}`;

  return (
    <div className="px-2">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg bg-white shadow p-4"
            >
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-40 object-cover mb-3 rounded"
                onError={(e) => (e.currentTarget.src = "/src/assets/images/image_22_3.jpeg")}
              />
              <h4 className="text-lg font-semibold mb-1">{product?.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <p className="font-bold text-blue-600 mb-2">
                {product.price} AED
              </p>
              <Button>Add to Cart</Button>
            </div>
          ))}
        </div>
      )}
    {/* <PaymentPage/> */}
    </div>

  );
};

export default WishlistPage;
