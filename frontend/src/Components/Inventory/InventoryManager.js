import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InventoryManager.css";

const API_URL = "http://localhost:5000/stock";

function InventoryManager() {
  const [stock, setStock] = useState([]);
  const [formData, setFormData] = useState({
    boardType: "",
    serialNo: "",
    status: "Available",
    purchaseDate: "",
    warrantyExpiry: "",
    assignedToBooking: null,
  });

  // Track stock being edited
  const [editingStockId, setEditingStockId] = useState(null);

  // Fetch all stock items
  const fetchStock = async () => {
    try {
      const res = await axios.get(API_URL);
      setStock(res.data.stock);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update stock
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      if (editingStockId) {
        // Update existing stock
        await axios.put(`${API_URL}/${editingStockId}`, formData);
        setEditingStockId(null); // reset after update
      } else {
        // Add new stock
        await axios.post(API_URL, formData);
      }

      // Reset form
      setFormData({
        boardType: "",
        serialNo: "",
        status: "Available",
        purchaseDate: "",
        warrantyExpiry: "",
        assignedToBooking: null,
      });

      fetchStock(); // refresh table
    } catch (err) {
      console.error(err);
    }
  };

  // Delete stock
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStock();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit stock: prefill form
  const handleEdit = (item) => {
    setEditingStockId(item._id);
    setFormData({
      boardType: item.boardType,
      serialNo: item.serialNo,
      status: item.status,
      purchaseDate: item.purchaseDate.split("T")[0], // yyyy-mm-dd
      warrantyExpiry: item.warrantyExpiry.split("T")[0],
      assignedToBooking: item.assignedToBooking || null,
    });
  };

  return (
    <div className="inventory-container">
      <h1>Inventory Manager</h1>

      <form onSubmit={handleAddStock} className="inventory-form">
        <input
          type="text"
          name="boardType"
          placeholder="Board Type"
          value={formData.boardType}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="serialNo"
          placeholder="Serial No"
          value={formData.serialNo}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="purchaseDate"
          placeholder="Purchase Date"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="warrantyExpiry"
          placeholder="Warranty Expiry"
          value={formData.warrantyExpiry}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Damaged">Damaged</option>
          <option value="Reserved">Reserved</option>
        </select>

        {/* Button container */}
        <div className="form-buttons">
          <button type="submit">
            {editingStockId ? "Update Stock" : "Add Stock"}
          </button>
          {editingStockId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingStockId(null);
                setFormData({
                  boardType: "",
                  serialNo: "",
                  status: "Available",
                  purchaseDate: "",
                  warrantyExpiry: "",
                  assignedToBooking: null,
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Stock Table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Board Type</th>
            <th>Serial No</th>
            <th>Status</th>
            <th>Purchase Date</th>
            <th>Warranty Expiry</th>
            <th>Assigned Booking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item._id}>
              <td>{item.boardType}</td>
              <td>{item.serialNo}</td>
              <td>{item.status}</td>
              <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
              <td>{new Date(item.warrantyExpiry).toLocaleDateString()}</td>
              <td>{item.assignedToBooking || "-"}</td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
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
  );
}

export default InventoryManager;
