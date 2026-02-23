import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import axios from "../../../auth/axios";
import Alert from "../../../components/ui/Alert";
import Loader from "../../../components/ui/Loader";

const EditUser = () => {
    const { id } = useParams();

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "shop_manager", label: "Shop Manager" },
        { value: "seo_manager", label: "SEO Manager" },
        { value: "customer", label: "Customer" },
        { value: "subscriber", label: "Subscriber" },
        { value: "user", label: "User" },
    ];

    const [validationErrors, setValidationErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/users/${id}`,
                );
                const user = res.data;

                console.log(user);

                setValue("name", user.name);
                setValue("email", user.email);
                setValue("role", user.role);
                setValue("password", user.password);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }

            setLoading(false);
        };
        fetchUser();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        setValidationErrors({});
        const formData = new FormData();

        // Handle form fields - only append if they have meaningful values
        const userFields = ["name", "email", "role", "password"];

        userFields.forEach((field) => {
            if (
                data[field] !== undefined &&
                data[field] !== null &&
                data[field] !== ""
            ) {
                formData.append(field, data[field]);
            }
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
                `http://localhost:8000/api/users/${id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            console.log("User updated successfully:", response.data);
            setSuccess(true);

            // Optional: Navigate back to users list after successful update
            // setTimeout(() => navigate("/dashboard/users"), 2000);
        } catch (err) {
            setSuccess(false);
            console.error("User update error:", err);

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
                to="/dashboard/users"
                className="text-brandGreen-900  mb-3 flex items-center"
            >
                <img
                    src="/icons/chevron-left.svg"
                    alt="Back"
                    width={18}
                    height={18}
                />
                Users
            </Link>

            <div className="users-form bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                <h2 className="block text-2xl font-bold p-3 mb-2">Edit User</h2>
                <form
                    className="add-user-form p-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label
                        htmlFor="name"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Name</span>
                        <input
                            id="name"
                            type="text"
                            className="input bg-base-light w-full"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p style={{ color: "red" }}>
                                {errors.name.message}
                            </p>
                        )}
                    </label>
                    <label
                        htmlFor="email"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Email</span>
                        <input
                            id="email"
                            type="email"
                            className="input bg-base-light w-full"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        {errors.email && (
                            <p style={{ color: "red" }}>
                                {errors.email.message}
                            </p>
                        )}
                    </label>
                    <label
                        htmlFor="role"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Role</span>
                        <select
                            id="role"
                            className="select bg-base-light w-full"
                            {...register("role", {
                                required: "Role is required",
                            })}
                            defaultValue="user"
                        >
                            {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p style={{ color: "red" }}>
                                {errors.role.message}
                            </p>
                        )}
                    </label>
                    <label
                        htmlFor="password"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Password</span>
                        <input
                            id="password"
                            type="password"
                            className="input bg-base-light w-full"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p style={{ color: "red" }}>
                                {errors.password.message}
                            </p>
                        )}
                    </label>
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
                        value={loading ? "Processing..." : "Update User"}
                        disabled={loading}
                    />
                </form>
                {loading && <Loader />}
                {success && (
                    <Alert
                        type="success"
                        message="User updated successfully!"
                    />
                )}
            </div>
        </>
    );
};

export default EditUser;
