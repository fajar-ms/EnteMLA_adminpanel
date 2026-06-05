import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import "../style/CreateMla.css"; // Import CSS for styling
import "../style/AdminSidebar.css"; // Import CSS for sidebar styling
import { constituencyMap } from "../data/constituencyMap";

const CreateMla = () => {
    useEffect(() => {
        fetchMlas();
    }, []);
    
    const generateMlaId = () => {
        return "MLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    const handleConstituencyChange = async (e) => {

        const constituencyId = e.target.value;

        try {

            const res = await axiosInstance.get(
                `/admin/mla-info/${constituencyId}`
            );

            setForm(prev => ({
                ...prev,

                constituencyId,

                name: res.data?.name || "",

                party: res.data?.party || "",

                phone: res.data?.phone || "",

                photo: res.data?.photo || ""
            }));

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to fetch MLA details"
            );
        }
    };
    const [form, setForm] = useState({
        name: "",
        party: "",
        phone: "",
        photo: "",
        email: "",
        password: "",
        mlaId: generateMlaId(),
        constituencyId: "",
        district: "",
        place: "",
    });
    const [mlas, setMlas] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const fetchMlas = async () => {
        try {
            const res = await axiosInstance.get("/admin/mlas");
            setMlas(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editingId) {

                await axiosInstance.put(
                    `/admin/mla/${editingId}`,
                    form
                );

                toast.success("MLA updated successfully");

            } else {

                await axiosInstance.post(
                    "/admin/create-mla",
                    form
                );

                toast.success("MLA created successfully");
            }

            setForm({
                name: "",
                email: "",
                party: "",
                photo: "",
                password: "",
                mlaId: generateMlaId(),
                constituencyId: "",
                district: "",
                phone: "",
                place: "",
            });

            setEditingId(null);

            fetchMlas();

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message || "Failed"
            );
        }
    };
    const handleEdit = (mla) => {

        setForm({
            name: mla.name,
            party: mla.party || "",
            photo: mla.photo || "",
            email: mla.email,
            password: "",
            mlaId: mla.mlaId,
            constituencyId: mla.constituencyId,
            district: mla.district,
            phone: mla.phone,
            place: mla.place,
        });

        setEditingId(mla._id);
    };
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure?")) return;

        try {

            await axiosInstance.delete(
                `/admin/mla/${id}`
            );

            toast.success("MLA deleted successfully");

            fetchMlas();

        } catch (err) {

            console.log(err);

            toast.error("Failed to delete MLA");
        }
    };
    return (
    <div className="create-mla-page">
        <AdminSidebar />

        <div className="create-mla-content">
            {/* FORM CARD */}
            <div className="mla-card">
                <h1 className="mla-title">
                    {editingId ? "Edit MLA Records" : "Create New MLA Record"}
                </h1>

                <form onSubmit={handleSubmit} className="mla-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        readOnly
                    />

                    <input
                        type="text"
                        name="party"
                        value={form.party}
                        placeholder="Party"
                        readOnly
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="mlaId"
                        placeholder="MLA ID"
                        value={form.mlaId}
                        readOnly
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        placeholder="Phone Number"
                        readOnly
                    />

                    <input
                        type="text"
                        name="place"
                        placeholder="Place / Region"
                        value={form.place}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select District</option>
                        {Object.keys(constituencyMap).map((dist) => (
                            <option key={dist} value={dist}>
                                {dist}
                            </option>
                        ))}
                    </select>

                    <select
                        name="constituencyId"
                        value={form.constituencyId}
                        onChange={handleConstituencyChange}
                        required
                    >
                        <option value="">Select Constituency</option>
                        {form.district &&
                            constituencyMap[form.district]?.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                    </select>

                    {form.photo && (
                        <div className="mla-preview">
                            <img
                                src={form.photo}
                                alt={form.name}
                                className="mla-preview-photo"
                            />
                            <div className="mla-preview-info">
                                <h4>{form.name}</h4>
                                <p>{form.party}</p>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        {editingId ? "Save Changes" : "Register MLA Record"}
                    </button>
                </form>
            </div>

            {/* TABLE */}
            <h2 className="table-title">Active MLA Directory</h2>

            <div className="table-wrapper">
                <table className="mla-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>MLA ID</th>
                            <th>District</th>
                            <th>Constituency</th>
                            <th>Phone</th>
                            <th>Place</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mlas.map((mla) => (
                            <tr key={mla._id}>
                                <td className="font-medium">{mla.name}</td>
                                <td>{mla.email}</td>
                                <td className="mono-text">{mla.mlaId}</td>
                                <td>{mla.district}</td>
                                <td>{mla.constituencyId}</td>
                                <td>{mla.phone}</td>
                                <td>{mla.place}</td>
                                <td>
                                    <div className="action-group">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(mla)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(mla._id)}
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

export default CreateMla;