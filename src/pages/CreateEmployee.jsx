import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import "../style/CreateEmployee.css"; // Import CSS for styling

const constituencyMap = {
    ernakulam: [
        { value: "aluva", label: "Aluva" },
        { value: "kochi", label: "Kochi" }
    ],
    thrissur: [
        { value: "chalakkudy", label: "Chalakkudy" }
    ]
};


const CreateEmployee = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        employeeId: "",
        constituencyId: "",
        district: "",
        phone: "",
        place: ""
    });

    useEffect(() => {
        const id = "EMP-" + Math.floor(1000 + Math.random() * 9000);
        setForm((prev) => ({ ...prev, employeeId: id }));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.post("/admin/create-employee", form);

            toast.success("Employee created successfully");

            setForm({
                name: "",
                email: "",
                password: "",
                employeeId: "",
                constituencyId: "",
                district: "",
                phone: "",
                place: ""
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed");
        }
    };

    return (
        <div className="create-employee-page">

            <AdminSidebar />

            <div className="create-employee-content">

                <div className="employee-form-card">

                    <h1 className="employee-form-title">
                        Create Employee
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="employee-form"
                    >

                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <input
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <input
                            name="place"
                            placeholder="Place"
                            value={form.place}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="employeeId"
                            value={form.employeeId}
                            readOnly
                        />

                        {/* District */}

                        <select
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select District
                            </option>

                            {Object.keys(constituencyMap).map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>

                        {/* Constituency */}

                        <select
                            name="constituencyId"
                            value={form.constituencyId}
                            onChange={handleChange}
                            disabled={!form.district}
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
                            className="form-submit"
                        >
                            Create Employee
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEmployee;