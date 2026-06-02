import React, {
    useEffect,
    useState
} from "react";

import axiosInstance from "../services/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";

import "../style/AdminBanner.css";

const AdminBanner = () => {

    const [banners, setBanners] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
        isActive: true,
    });

    const [editingId, setEditingId] =
        useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res =
                await axiosInstance.get("/banner");

            setBanners(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editingId) {

                await axiosInstance.put(
                    `/banner/${editingId}`,
                    form
                );

                toast.success(
                    "Banner updated successfully"
                );

            } else {

                await axiosInstance.post(
                    "/banner",
                    form
                );

                toast.success(
                    "Banner added successfully"
                );
            }

            setForm({
                title: "",
                description: "",
                imageUrl: "",
                isActive: true,
            });

            setEditingId(null);

            fetchBanners();

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    const handleEdit = (banner) => {

        setForm({
            title: banner.title,
            description: banner.description,
            imageUrl: banner.imageUrl,
            isActive: banner.isActive,
        });

        setEditingId(banner._id);
    };

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this banner?"
            )
        )
            return;

        try {

            await axiosInstance.delete(
                `/banner/${id}`
            );

            toast.success(
                "Banner deleted"
            );

            fetchBanners();

        } catch (err) {

            toast.error(
                "Delete failed"
            );
        }
    };

    return (
        <div className="admin-banner-page">
            <AdminSidebar />

            <div className="admin-banner-content">
                {/* Form Card */}
                <div className="banner-card">
                    <h2 className="banner-title">
                        {editingId ? "Edit Banner" : "Add Banner"}
                    </h2>

                    <form onSubmit={handleSubmit} className="banner-form">
                        <input
                            type="text"
                            name="title"
                            placeholder="Banner Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            rows="1"
                        />

                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={form.imageUrl}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="submit-btn">
                            {editingId ? "Update Banner" : "Add Banner"}
                        </button>

                        {form.imageUrl && (
                            <div className="banner-preview">
                                <img src={form.imageUrl} alt="Preview" />
                            </div>
                        )}
                    </form>
                </div>

                {/* Banners Display Table */}
                <h2 className="table-title">All Banners</h2>

                <div className="table-wrapper">
                    <table className="banner-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((banner) => (
                                <tr key={banner._id}>
                                    <td>
                                        <img
                                            className="banner-thumb"
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                        />
                                    </td>
                                    <td className="text-bold">{banner.title}</td>
                                    <td>{banner.description}</td>
                                    <td>
                                        <div className="action-group">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(banner)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(banner._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBanner;