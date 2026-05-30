import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import "../style/CreateMla.css"; // Import CSS for styling
import "../style/AdminSidebar.css"; // Import CSS for sidebar styling

const CreateMla = () => {
    useEffect(() => {
        fetchMlas();
    }, []);
    const constituencyMap = {
        ernakulam: [
            { value: "aluva", label: "Aluva" },
            { value: "kochi", label: "Kochi" }
        ],
        thrissur: [
            { value: "chalakkudy", label: "Chalakkudy" }
        ]
    };
    const generateMlaId = () => {
        return "MLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        mlaId: generateMlaId(),
        constituencyId: "",
        district: "",
        phone: "",
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
                        {editingId ? "Edit MLA" : "Create MLA"}
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mla-form"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
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
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="place"
                            placeholder="Place"
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
                            <option value="">
                                Select District
                            </option>

                            {Object.keys(constituencyMap).map((dist) => (
                                <option key={dist} value={dist}>
                                    {dist}
                                </option>
                            ))}
                        </select>

                        <select
                            name="constituencyId"
                            value={form.constituencyId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Constituency
                            </option>

                            {form.district &&
                                constituencyMap[
                                    form.district
                                ]?.map((c) => (
                                    <option
                                        key={c.value}
                                        value={c.value}
                                    >
                                        {c.label}
                                    </option>
                                ))}
                        </select>

                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            {editingId ? "Update MLA" : "Create MLA"}
                        </button>

                    </form>
                </div>

                {/* TABLE */}

                <h2 className="table-title">
                    All MLAs
                </h2>

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
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {mlas.map((mla) => (
                                <tr key={mla._id}>

                                    <td>{mla.name}</td>
                                    <td>{mla.email}</td>
                                    <td>{mla.mlaId}</td>
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
                                                onClick={() =>
                                                    handleDelete(mla._id)
                                                }
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