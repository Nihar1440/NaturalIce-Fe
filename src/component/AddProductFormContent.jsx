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
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/features/category/categorySlice";
import { Loader2 } from "lucide-react"; // Import Loader2 icon

const API_URL = import.meta.env.VITE_API_URL;

const AddProductFormContent = ({ onClose, onProductAdded, initialData }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Load categories when component mounts
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    // Only process initialData if we have categories loaded OR if it's not edit mode
    if (!initialData || (initialData && categories?.length > 0)) {
      if (initialData) {
        // Determine category ID
        let categoryToSet = "";

        if (initialData.category) {
          if (
            typeof initialData.category === "object" &&
            initialData.category._id
          ) {
            // Category is an object with _id
            categoryToSet = initialData.category._id;
          } else if (typeof initialData.category === "string") {
            // Category is a string (could be ID or name)
            const existingCategoryById = categories.find(
              (cat) => cat._id === initialData.category
            );
            if (existingCategoryById) {
              categoryToSet = initialData.category;
            } else {
              // Try to find by name
              const existingCategoryByName = categories.find(
                (cat) =>
                  cat.name.toLowerCase() === initialData.category.toLowerCase()
              );
              if (existingCategoryByName) {
                categoryToSet = existingCategoryByName._id;
              }
            }
          }
        }

        setForm({
          name: initialData.name || "",
          description: initialData.description || "",
          price: initialData.price ? initialData.price.toString() : "",
          category: categoryToSet,
          image: initialData.image || "",
        });
      } else {
        // New product form
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
        });
      }
    }
  }, [initialData, categories]);

  useEffect(() => {
    if (form.image) {
      if (typeof form.image === "string") {
        setImagePreviewUrl(form.image);
      } else if (form.image instanceof File) {
        const objectUrl = URL.createObjectURL(form.image);
        setImagePreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setImagePreviewUrl(null);
    }
  }, [form.image]);

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
      toast.error("Authentication Required", {
        description: "Please log in to perform this action.",
      });
      onClose();
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (key !== "image") {
        formData.append(key, form[key]);
      }
    }
    formData.set("price", parseFloat(form.price));

    if (form.image) {
      formData.append("image", form.image);
    }

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `${API_URL}/api/product/update/${initialData._id}`
      : `${API_URL}/api/product/create`;

    try {
      setIsSubmitting(true);
      setFormError(null);
      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || `Failed to ${initialData ? "update" : "add"} product.`
        );
      }

      toast.success("Success", {
        description:
          data.message ||
          `Product ${initialData ? "updated" : "added"} successfully!`,
      });
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      onProductAdded();
      onClose();
    } catch (err) {
      console.error(
        `Error ${initialData ? "updating" : "adding"} product:`,
        err
      );
      setFormError(
        err.message ||
          `An unexpected error occurred while ${
            initialData ? "updating" : "adding"
          } the product.`
      );
      toast.error("Error", {
        description:
          err.message ||
          `An unexpected error occurred while ${
            initialData ? "updating" : "adding"
          } the product.`,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelectOpenChange = (open) => {
    if (open && categories?.length === 0) {
      dispatch(getCategories());
    }
  };

  // Get the selected category name for display
  const selectedCategoryName =
    categories?.find((cat) => cat._id === form.category)?.name || "";

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-2 overflow-y-auto hide-scrollbar"
      >
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
            onOpenChange={handleCategorySelectOpenChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category">
                {selectedCategoryName || "Select Category"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={String(category._id)} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {imagePreviewUrl && (
            <div className="mt-2">
              <span className="block text-sm text-gray-700 mb-1">
                Current Image:
              </span>
              <a
                href={imagePreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={imagePreviewUrl}
                  alt="Current Product Image"
                  className="w-24 h-24 object-cover object-center rounded-md"
                />
              </a>
              <p className="text-sm text-gray-500 mt-1">
                Upload new to replace
              </p>
            </div>
          )}
          <label htmlFor="image">
            {imagePreviewUrl ? "Update image" : "Add Image"}
          </label>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required={!initialData || !initialData.image}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                  </div>
                </div>
                {initialData ? "Updating..." : "Adding..."}
              </span>
            ) : initialData ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </Button>
        </div>
        {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
      </form>
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
           <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading...</p>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AddProductFormContent;
