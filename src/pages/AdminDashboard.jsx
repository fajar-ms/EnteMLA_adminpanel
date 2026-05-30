import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axiosInstance from "../services/axiosInstance";
import "../style/AdminDashboard.css"; // Import CSS for styling
import "../style/AdminSidebar.css";

const AdminDashboard = () => {

  const [employees, setEmployees] = useState([]);

  const constituencyMap = {
    Ernakulam: [
      { value: "Kochi", label: "Kochi" },
      { value: "Thrikkakara", label: "Thrikkakara" },
      { value: "Aluva", label: "Aluva" },
    ],

    Thrissur: [
      { value: "Thrissur", label: "Thrissur" },
      { value: "Ollur", label: "Ollur" },
    ],

    Kozhikode: [
      { value: "Beypore", label: "Beypore" },
      { value: "Balussery", label: "Balussery" },
    ],
  };

  const user = JSON.parse(localStorage.getItem("adminUser"));

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

  return (
  <div className="admin-dashboard">
    <AdminSidebar />

    <div className="dashboard-content">

      <div className="admin-card">
        <h1>Welcome Admin</h1>

        <div className="admin-info">
          <h3>Name:</h3>
          <p>{user?.name}</p>

          <h3>Role:</h3>
          <p>{user?.role}</p>
        </div>
      </div>

      <h1 className="section-title">
        Employee Management
      </h1>

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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.employeeId}</td>
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

      {editingEmployee && (
        <div className="edit-form-container">

          <h2>Edit Employee</h2>

          <form
            onSubmit={updateEmployee}
            className="edit-form"
          >
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Name"
            />

            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              placeholder="Email"
            />

            <select
              name="district"
              value={editForm.district}
              onChange={handleEditChange}
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
              value={editForm.constituencyId}
              onChange={handleEditChange}
              disabled={!editForm.district}
            >
              <option value="">
                Select Constituency
              </option>

              {editForm.district &&
                constituencyMap[
                  editForm.district
                ]?.map((c) => (
                  <option
                    key={c.value}
                    value={c.value}
                  >
                    {c.label}
                  </option>
                ))}
            </select>

            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              placeholder="Phone"
            />

            <input
              type="text"
              name="place"
              value={editForm.place}
              onChange={handleEditChange}
              placeholder="Place"
            />

            <div className="form-buttons">
              <button
                type="submit"
                className="update-btn"
              >
                Update Employee
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setEditingEmployee(null)
                }
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  </div>
);
};

export default AdminDashboard;