import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2"; // Remove Swal import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; 

const API_URL = import.meta.env.VITE_API_URL;

const AddProductFormContent = ({ onClose, onProductAdded, initialData, categories }) => {

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    imageUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      // Trim category value to ensure exact match with SelectItem values
      const trimmedCategory = initialData.category ? initialData.category.trim() : "";
      console.log("Initial Data Category:", initialData.category); // For debugging
      console.log("Setting form category to:", trimmedCategory); // For debugging

      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price ? initialData.price.toString() : "",
        category: trimmedCategory,
        image: null,
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        imageUrl: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Authentication Required", { // Use toast.error for destructive variant
        description: "Please log in to perform this action.",
      });
      onClose(); // Close dialog immediately
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (key !== "image" && key !== "imageUrl") {
        formData.append(key, form[key]);
      }
    }
    formData.set("price", parseFloat(form.price));

    if (form.image) {
      formData.append("image", form.image);
    }

    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `${API_URL}/api/product/update/${initialData._id}` : `${API_URL}/api/product/create`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${initialData ? 'update' : 'add'} product.`);
      }

      toast.success("Success", {
        description: data.message || `Product ${initialData ? 'updated' : 'added'} successfully!`,
      });
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        imageUrl: "",
      }); 
      onProductAdded();
      onClose();
    } catch (err) {
      console.error(`Error ${initialData ? 'updating' : 'adding'} product:`, err);
      toast.error("Error", { 
        description: err.message || `An unexpected error occurred while ${initialData ? 'updating' : 'adding'} the product.`,
      });
      onClose(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      {" "}
      <div>
        <label htmlFor="name">Product Name</label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="e.g., Crystal Clear Ice Cubes"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          name="description"
          placeholder="A detailed description of the product..."
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price (AED)</label>
        <Input
          type="number"
          id="price"
          name="price"
          placeholder="e.g., 25.00"
          value={form.price}
          onChange={handleChange}
          required
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <Select
          name="category"
          value={form.category}
          onValueChange={handleSelectChange}
          required
          key={initialData ? initialData._id : "add-new-product-key"}
        >
          <SelectTrigger className="w-full">
            {form.category ? (
              <SelectValue>{form.category}</SelectValue>
            ) : (
              <SelectValue placeholder="Select Category" />
            )}
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="image">Product Image</label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required={!initialData || !initialData.imageUrl}
        />
        {form.imageUrl && !form.image && (
          <div className="mt-2">
            <span className="block text-sm text-gray-700 mb-1">Current Image:</span>
            <a href={form.imageUrl} target="_blank" rel="noopener noreferrer" 
               className="inline-block border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={form.imageUrl}
                alt="Current Product Image"
                className="w-24 h-24 object-cover object-center rounded-md"
              />
            </a>
            <p className="text-sm text-gray-500 mt-1">Upload new to replace</p>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {" "}
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddProductFormContent;
