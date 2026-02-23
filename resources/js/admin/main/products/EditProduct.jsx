import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "../../../auth/axios";
import Alert from "../../../components/ui/Alert";
import Loader from "../../../components/ui/Loader";
import useCategoryTree from "../../../hooks/useCategoryTree";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const { categoryTree, loadingCategories } = useCategoryTree();

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [initialGallery, setInitialGallery] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/products/${id}`,
                );
                const product = res.data;

                console.log(product);

                setValue("title", product.title);
                setValue("description", product.description);
                setValue("slug", product.slug);
                setValue("price", product.price);
                setValue("stock", product.stock);
                setValue("status", product.status);

                // Handle images
                if (product.images && product.images.length > 0) {
                    const primary = product.images.find(
                        (img) => img.is_primary,
                    );
                    setImagePreview(
                        primary ? `/storage/${primary.image_url}` : null,
                    );
                    const gallery = product.images
                        .filter((img) => !img.is_primary)
                        .map((img) => `/storage/${img.image_url}`);
                    setInitialGallery(gallery);
                } else {
                    setImagePreview(null);
                    setInitialGallery([]);
                }

                // Set selected categories from product.categories (array of category objects or ids)
                if (product.categories) {
                    setSelectedCategories(
                        product.categories.map((cat) =>
                            cat.id ? cat.id : cat,
                        ),
                    );
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id, setValue]);

    const handleImagePreview = (e, type) => {
        if (type === "primary") {
            const file = e.target.files[0];
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            const files = Array.from(e.target.files);
            const previews = files.map((file) => URL.createObjectURL(file));
            setGalleryPreviews(previews);
        }
    };

    const handleCategoryChange = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id)
                ? prev.filter((catId) => catId !== id)
                : [...prev, id],
        );
    };

    const renderCategoryCheckboxes = (tree, level = 0) =>
        tree.map((cat) => {
            const categoryName = `categories[${cat.id}]`;
            return (
                <div key={cat.id} className="mb-1 ml-6">
                    <input
                        type="checkbox"
                        value={cat.id}
                        id={categoryName}
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                        className="checkbox checkbox-accent"
                    />
                    <label htmlFor={categoryName} className="ml-1 text-base">
                        {cat.name}
                    </label>
                    {cat.children && cat.children.length > 0 && (
                        <div className="sub-cat">
                            {renderCategoryCheckboxes(cat.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });

    const onSubmit = async (data) => {
        setLoading(true);
        setValidationErrors({});
        const formData = new FormData();
        let hasNewImage = false;

        // Handle basic fields - only append if they have meaningful values
        const basicFields = [
            "title",
            "description",
            "slug",
            "price",
            "stock",
            "status",
        ];

        basicFields.forEach((field) => {
            if (
                data[field] !== undefined &&
                data[field] !== null &&
                data[field] !== ""
            ) {
                formData.append(field, data[field]);
            }
        });

        // Handle primary image
        if (
            data.image &&
            data.image.length > 0 &&
            data.image[0] instanceof File
        ) {
            formData.append("image", data.image[0]);
            hasNewImage = true;
        }

        // Handle gallery images
        if (data.gallery && data.gallery.length > 0) {
            const galleryFiles = Array.from(data.gallery).filter(
                (file) => file instanceof File,
            );
            if (galleryFiles.length > 0) {
                galleryFiles.forEach((file) => {
                    formData.append("gallery[]", file);
                });
            }
        }

        // If no new primary image is uploaded but we have an existing one, preserve it
        if (
            !hasNewImage &&
            imagePreview &&
            imagePreview.startsWith("/storage/")
        ) {
            const imagePath = imagePreview.replace(/^\/storage\//, "");
            formData.append("current_image", imagePath);
        }

        // Always append selectedCategories as categories[]
        selectedCategories.forEach((catId) => {
            formData.append("categories[]", catId);
        });

        // Add method spoofing for PUT request
        formData.append("_method", "PUT");

        // Get CSRF token
        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
                withCredentials: true,
            });
        } catch (err) {
            console.error("CSRF token fetch failed", err);
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/products/${id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            console.log("Product updated successfully:", response.data);
            setSuccess(true);

            // Optional: Navigate back to products list after successful update
            // setTimeout(() => navigate("/dashboard/products"), 2000);
        } catch (err) {
            setSuccess(false);
            console.error("Product update error:", err);

            if (err.response?.status === 422) {
                const laravelErrors = err.response.data.errors;
                setValidationErrors(laravelErrors);
                console.error("Backend validation errors:", laravelErrors);
            } else if (err.response?.data?.message) {
                setValidationErrors({ general: [err.response.data.message] });
            } else {
                setValidationErrors({
                    general: ["An unexpected error occurred"],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Link
                to="/dashboard/products"
                className="text-brandGreen-900 mb-3 flex items-center"
            >
                <img
                    src="/icons/chevron-left.svg"
                    alt="Back"
                    width={18}
                    height={18}
                />
                Products
            </Link>
            <div className="products-form bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                <h2 className="block text-2xl font-bold p-3 mb-2">
                    Edit Product
                </h2>
                <form
                    className="item-add-form p-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex gap-6">
                        <fieldset className="fieldset product-info w-1/2">
                            <label htmlFor="title" className="label mb-4">
                                <span className="text-base">
                                    Product Title:
                                </span>
                                <div className="w-3/4">
                                    <input
                                        type="text"
                                        {...register("title", {
                                            required:
                                                "Product title is required",
                                        })}
                                        id="title"
                                        className="input bg-base-light w-full"
                                        placeholder="My Product Title"
                                    />
                                    {errors.title && (
                                        <p style={{ color: "red" }}>
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>
                            </label>

                            <label htmlFor="description" className="label mb-4">
                                <span className="text-base">
                                    Product Description:
                                </span>
                                <div className="w-3/4">
                                    <textarea
                                        id="description"
                                        className="textarea bg-base-light w-full"
                                        placeholder="My product desc"
                                        {...register("description")}
                                    />
                                    {errors.description && (
                                        <p style={{ color: "red" }}>
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>
                            </label>

                            <label htmlFor="slug" className="label mb-4">
                                <span className="text-base">Slug</span>
                                <div className="w-3/4">
                                    <input
                                        type="text"
                                        id="slug"
                                        className="input bg-base-light w-full"
                                        placeholder="my-product-title"
                                        {...register("slug")}
                                    />
                                </div>
                            </label>

                            <label htmlFor="price" className="label mb-4">
                                <span className="text-base">Price ($)</span>
                                <div className="w-3/4">
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="e.g, 40.00"
                                        className="input bg-base-light w-full"
                                        {...register("price")}
                                    />
                                </div>
                            </label>

                            <label htmlFor="stock" className="label mb-4">
                                <span className="text-base">
                                    Stock Quantity
                                </span>
                                <div className="w-3/4">
                                    <input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        placeholder="e.g, 100"
                                        className="input bg-base-light w-full"
                                        {...register("stock")}
                                    />
                                </div>
                            </label>

                            <label htmlFor="status" className="label mb-4">
                                <span className="text-base">Status</span>
                                <select
                                    id="status"
                                    className="select bg-base-light"
                                    {...register("status")}
                                >
                                    <option value="">Select</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>

                            <h3 className="text-base font-semibold mb-1">
                                Product Categories
                            </h3>
                            <div className="product-categories flex flex-col gap-2 mb-4 max-h-[300px] overflow-y-auto">
                                {loadingCategories ? (
                                    <span>Loading categories...</span>
                                ) : (
                                    renderCategoryCheckboxes(categoryTree)
                                )}
                            </div>
                        </fieldset>

                        <fieldset className="fieldset product-image w-1/2 p-4">
                            <label htmlFor="image">
                                Product Image (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("image")}
                                onChange={(e) =>
                                    handleImagePreview(e, "primary")
                                }
                                className="file-input file-input-ghost"
                            />
                            {imagePreview && (
                                <div style={{ marginTop: "10px" }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: "400px",
                                            height: "400px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            )}

                            <label htmlFor="gallery" className="mt-12">
                                Product Gallery (Optional)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                {...register("gallery")}
                                onChange={(e) =>
                                    handleImagePreview(e, "gallery")
                                }
                                className="file-input file-input-ghost"
                            />
                            {(galleryPreviews.length > 0 ||
                                initialGallery.length > 0) && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginTop: "10px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {galleryPreviews.length > 0
                                        ? galleryPreviews.map((src, i) => (
                                              <img
                                                  key={`preview-${i}`}
                                                  src={src}
                                                  alt="Preview"
                                                  style={{
                                                      width: "120px",
                                                      height: "120px",
                                                      objectFit: "cover",
                                                  }}
                                              />
                                          ))
                                        : initialGallery.map((src, i) => (
                                              <img
                                                  key={`current-${i}`}
                                                  src={src}
                                                  alt="Current"
                                                  style={{
                                                      width: "120px",
                                                      height: "120px",
                                                      objectFit: "cover",
                                                  }}
                                              />
                                          ))}
                                </div>
                            )}
                        </fieldset>
                    </div>

                    {Object.keys(validationErrors).length > 0 && (
                        <div className="mb-4">
                            {Object.entries(validationErrors).map(
                                ([field, messages]) => (
                                    <p key={field} style={{ color: "red" }}>
                                        <strong>{field}:</strong>{" "}
                                        {Array.isArray(messages)
                                            ? messages.join(" ")
                                            : messages}
                                    </p>
                                ),
                            )}
                        </div>
                    )}

                    <input
                        type="submit"
                        className="text-white btn btn-soft btn-info my-4 max-w-48"
                        value={loading ? "Updating..." : "Update Product"}
                        disabled={loading}
                    />
                </form>

                {loading && <Loader />}
                {success && (
                    <Alert
                        type="success"
                        message="Product updated successfully!"
                    />
                )}
            </div>
        </>
    );
};

export default EditProduct;
