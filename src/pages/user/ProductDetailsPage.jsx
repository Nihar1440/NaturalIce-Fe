import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Facebook, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../../features/product/productSlice';

const ProductDetailsPage = () => {
  const { id } = useParams();
  console.log('id', id)
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.product);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById({ id, accessToken: null }));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      toast.success(`${quantity} x ${product.name} added to cart!`);
      console.log(`Added ${quantity} of ${product.name} (ID: ${product._id}) to cart.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-700 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
          <div className="lg:w-1/2 relative flex items-center justify-center">
            <img
              src={product.image || "/src/image_22_3.jpeg"}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
            />
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
              BEST SELLING
            </div>
          </div>

          <div className="lg:w-1/2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-blue-600 text-xl sm:text-2xl font-semibold mb-4">
              {product.price} AED
            </p>

            {product.shortDescription && (
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-6 mb-2">
                {product.shortDescription}
              </h2>
            )}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              {product.description}
            </p>
            {product.size && (
              <p className="text-gray-700 text-sm sm:text-base mb-6">
                <strong>Ice Ball Size:</strong> {product.size}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant="outline"
                  className="px-3 py-1 rounded-l-md text-lg h-full"
                  onClick={() => handleQuantityChange('decrement')}
                >
                  -
                </Button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center border-x border-gray-300 text-lg font-medium h-full focus:outline-none"
                />
                <Button
                  variant="outline"
                  className="px-3 py-1 rounded-r-md text-lg h-full"
                  onClick={() => handleQuantityChange('increment')}
                >
                  +
                </Button>
              </div>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors text-base"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                ADD TO CART
              </Button>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="flex items-center text-gray-700 mb-6 text-base">
              <strong>Category:</strong>
              <span className="ml-2 text-blue-600 font-medium">
                {product.category?.name || "Ice"}
              </span>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="flex items-center gap-4 text-gray-700 text-base">
              <strong>Share :</strong>
              <div className="flex gap-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage; 