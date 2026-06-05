import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import "../style/CreateEmployee.css"; // Import CSS for styling
import { constituencyMap } from "../data/constituencyMap";


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
    const [employees, setEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        district: "",
        constituencyId: "",
        phone: "",
        place: "",
    });

    const fetchEmployees = async () => {

        try {

            const res = await axiosInstance.get(
                "/admin/employees"
            );

            setEmployees(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // DELETE
    const deleteEmployee = async (id) => {

        try {

            await axiosInstance.delete(
                `/admin/employee/${id}`
            );

            alert("Employee deleted");

            fetchEmployees();

        } catch (err) {
            console.log(err);
        }
    };

    // OPEN EDIT
    const openEdit = (emp) => {

        setEditingEmployee(emp);

        setEditForm({
            name: emp.name || "",
            email: emp.email || "",
            district: emp.district || "",
            constituencyId: emp.constituencyId || "",
            phone: emp.phone || "",
            place: emp.place || "",
        });
    };

    // HANDLE INPUT
    const handleEditChange = (e) => {

        const { name, value } = e.target;

        if (name === "district") {

            setEditForm({
                ...editForm,
                district: value,
                constituencyId: "",
            });

        } else {

            setEditForm({
                ...editForm,
                [name]: value,
            });

        }
    };

    // UPDATE EMPLOYEE
    const updateEmployee = async (e) => {

        e.preventDefault();

        try {

            await axiosInstance.patch(
                `/admin/employee/${editingEmployee._id}`,
                editForm
            );

            alert("Employee updated");

            setEditingEmployee(null);

            fetchEmployees();

        } catch (err) {
            console.log(err);
            alert("Update failed");
        }
    };

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
                    <h1 className="employee-form-title">Create New Employee Record</h1>

                    <form onSubmit={handleSubmit} className="employee-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Account Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="place"
                                placeholder="Assigned Place/Location"
                                value={form.place}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="employeeId"
                                value={form.employeeId}
                                placeholder="System Generated ID"
                                readOnly
                            />
                        </div>

                        {/* District */}
                        <div className="form-group">
                            <select
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Assigned District</option>
                                {Object.keys(constituencyMap).map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Constituency */}
                        <div className="form-group">
                            <select
                                name="constituencyId"
                                value={form.constituencyId}
                                onChange={handleChange}
                                disabled={!form.district}
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
                        </div>

                        <button type="submit" className="form-submit">
                            Provision Employee Account
                        </button>
                    </form>
                </div>
                <h2 className="section-title">Employee Directory Management</h2>

                {/* TABLE DIRECTORY */}
                <div className="table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Employee ID</th>
                                <th>District</th>
                                <th>Constituency</th>
                                <th>Phone</th>
                                <th>Place</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp._id}>
                                    <td className="font-medium">{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td className="mono-text">{emp.employeeId}</td>
                                    <td>{emp.district}</td>
                                    <td>{emp.constituencyId}</td>
                                    <td>{emp.phone}</td>
                                    <td>{emp.place}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="edit-btn"
                                                onClick={() => openEdit(emp)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteEmployee(emp._id)}
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

                {/* EDIT MODAL SECTION */}
                {editingEmployee && (
                    <div className="edit-form-container">
                        <h2>Modify Employee Records</h2>

                        <form onSubmit={updateEmployee} className="edit-form">
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                placeholder="Full Name"
                            />

                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                                placeholder="Email Address"
                            />

                            <select
                                name="district"
                                value={editForm.district}
                                onChange={handleEditChange}
                            >
                                <option value="">Select Assigned District</option>
                                {Object.keys(constituencyMap).map((dist) => (
                                    <option key={dist} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="constituencyId"
                                value={editForm.constituencyId}
                                onChange={handleEditChange}
                                disabled={!editForm.district}
                            >
                                <option value="">Select Constituency</option>
                                {editForm.district &&
                                    constituencyMap[editForm.district]?.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                            </select>

                            <input
                                type="text"
                                name="phone"
                                value={editForm.phone}
                                onChange={handleEditChange}
                                placeholder="Phone Number"
                            />

                            <input
                                type="text"
                                name="place"
                                value={editForm.place}
                                onChange={handleEditChange}
                                placeholder="Place"
                            />

                            <div className="form-buttons">
                                <button type="submit" className="update-btn">
                                    Save Record changes
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setEditingEmployee(null)}
                                >
                                    Dismiss
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateEmployee;