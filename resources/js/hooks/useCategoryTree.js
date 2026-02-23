import { useState, useEffect } from "react";
import axios from "../auth/axios";

function useCategoryTree() {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
                    withCredentials: true,
                });
                const response = await axios.get(
                    "http://localhost:8000/api/categories",
                    {
                        withCredentials: true,
                    },
                );
                setCategories(response.data.data || response.data);
            } catch (error) {
                setCategories([]);
            }
            setLoadingCategories(false);
        };
        fetchCategories();
    }, []);

    const buildTree = (cats, parentId = null) =>
        cats
            .filter((cat) => cat.parent_id === parentId)
            .map((cat) => ({
                ...cat,
                children: buildTree(cats, cat.id),
            }));

    return { categoryTree: buildTree(categories), loadingCategories };
}

export default useCategoryTree;
