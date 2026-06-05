import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import "../style/CreateMla.css";
import "../style/AdminSidebar.css";
import { constituencyMap } from "../data/constituencyMap";

const CreateCitizen = () => {

    const fetchCitizens = async () => {

        try {

            const res = await axiosInstance.get(
                "/admin/citizens"
            );

            setCitizens(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    useEffect(() => {
        fetchCitizens();
    }, []);


    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        constituencyId: "",
        district: "",
        phone: "",
        place: "",
    });

    const [citizens, setCitizens] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await axiosInstance.patch(
                    `/admin/citizen/${editingId}`,
                    form
                );

                toast.success(
                    "Citizen updated successfully"
                );

            } else {

                await axiosInstance.post(
                    "/admin/create-citizen",
                    {
                        ...form,
                        role: "citizen",
                    }
                );

                toast.success(
                    "Citizen created successfully"
                );
            }

            setForm({
                name: "",
                email: "",
                password: "",
                constituencyId: "",
                district: "",
                phone: "",
                place: "",
            });

            setEditingId(null);

            fetchCitizens();

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message || "Failed"
            );
        }
    };

    const handleEdit = (citizen) => {

        setForm({
            name: citizen.name,
            email: citizen.email,
            password: "",
            constituencyId: citizen.constituencyId,
            district: citizen.district,
            phone: citizen.phone,
            place: citizen.place,
        });

        setEditingId(citizen._id);
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure?")) return;

        try {

            await axiosInstance.delete(
                `/admin/citizen/${id}`
            );

            toast.success(
                "Citizen deleted successfully"
            );

            fetchCitizens();

        } catch (err) {

            console.log(err);

            toast.error(
                "Failed to delete citizen"
            );
        }
    };

    return (
        <div className="create-mla-page">

            <AdminSidebar />

            <div className="create-mla-content">

                {/* FORM */}

                <div className="mla-card">

                    <h1 className="mla-title">
                        {editingId
                            ? "Edit Citizen"
                            : "Create Citizen"}
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
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required={!editingId}
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

                            {Object.keys(
                                constituencyMap
                            ).map((dist) => (
                                <option
                                    key={dist}
                                    value={dist}
                                >
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
                            {editingId
                                ? "Update Citizen"
                                : "Create Citizen"}
                        </button>

                    </form>
                </div>

                {/* TABLE */}

                <h2 className="table-title">
                    All Citizens
                </h2>

                <div className="table-wrapper">

                    <table className="mla-table">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>District</th>
                                <th>Constituency</th>
                                <th>Phone</th>
                                <th>Place</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {citizens.map((citizen) => (

                                <tr key={citizen._id}>

                                    <td>{citizen.name}</td>
                                    <td>{citizen.email}</td>
                                    <td>{citizen.district}</td>
                                    <td>{citizen.constituencyId}</td>
                                    <td>{citizen.phone}</td>
                                    <td>{citizen.place}</td>

                                    <td>
                                        {citizen.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td>

                                        <div className="action-group">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(citizen)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        citizen._id
                                                    )
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

export default CreateCitizen;