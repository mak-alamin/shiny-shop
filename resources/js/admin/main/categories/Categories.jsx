import { useEffect, useState } from "react";
import Loader from "../../../components/ui/Loader";
import axios from ".././../../auth/axios";
import useCategoryTree from "../../../hooks/useCategoryTree";

const Categories = () => {
    const [name, setName] = useState("");
    const [parentId, setParentId] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const { categoryTree, loadingCategories } = useCategoryTree();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://green-shop.test/api/categories",
                {
                    name,
                    parent_id: parentId,
                },
                {
                    withCredentials: true,
                },
            );

            setSuccess(true);
            setErrors({});
            setName("");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error creating category:", error);
            }
        }
    };

    const renderCategoryTree = (tree, level = 0) => {
        let liClasses = level == 0 ? " parent-cat" : "";
        let itemPaddingLeft = (level + 1) * 5;
        return tree.map((cat) => (
            <li
                key={cat.id}
                style={{ paddingLeft: itemPaddingLeft }}
                className={liClasses}
            >
                <div
                    className="flex items-center gap-2 group px-2 py-1 hover:bg-slate-200"
                    style={{ width: "max-content" }}
                >
                    {level > 0 && "-"}
                    <span>{cat.name}</span>
                    <div className="action-buttons ml-2 hidden group-hover:flex items-center gap-1">
                        <button className="edit mr-2" title="Edit">
                            <img
                                src="/icons/edit.svg"
                                alt="Edit"
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className="delete" title="Delete">
                            <img
                                src="/icons/delete.svg"
                                alt="Delete"
                                width={14}
                                height={14}
                            />
                        </button>
                    </div>
                </div>
                {cat.children && cat.children.length > 0 && (
                    <ul className="sub-cat">
                        {renderCategoryTree(cat.children, level + 1)}
                    </ul>
                )}
            </li>
        ));
    };

    const renderOptions = (cat, prefix = "") => {
        const option = [
            <option key={cat.id} value={cat.id}>
                {prefix + cat.name}
            </option>,
        ];
        if (cat.children && cat.children.length > 0) {
            cat.children.forEach((child) => {
                option.push(...renderOptions(child, prefix + "- "));
            });
        }
        return option;
    };

    return (
        <div className="categories flex gap-x-24">
            <form onSubmit={handleSubmit}>
                <label className="block mb-5">
                    Name:
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input bg-base-light w-full"
                    />
                    {errors.name && (
                        <p style={{ color: "red" }}>{errors.name[0]}</p>
                    )}
                </label>

                <label className="block mb-5">
                    Parent Category (optional):
                    <br />
                    <select
                        value={parentId || ""}
                        onChange={(e) =>
                            setParentId(
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        className="input bg-base-light w-full"
                    >
                        <option value="">None</option>
                        {/* Use flat list for parent selection */}
                        {categoryTree.map((cat) => renderOptions(cat))}
                    </select>
                </label>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 mb-4 rounded"
                >
                    Create Category
                </button>

                {success && <p>Category created successfully!</p>}
            </form>

            <div className="category-list">
                <h2 className="text-xl font-bold">Categories</h2>
                {loadingCategories ? (
                    <Loader />
                ) : (
                    <ul>{renderCategoryTree(categoryTree)}</ul>
                )}
            </div>
        </div>
    );
};

export default Categories;
