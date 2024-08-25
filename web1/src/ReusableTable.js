import React, { useState } from "react";

function ReusableTable({ data, onEdit, onDelete }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditData(data[index]);
  };

  const submitEdit = () => {
    onEdit(editingIndex, editData);
    setEditingIndex(null);
    setEditData({});
  };

  return (
    <table className="table">
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {Object.keys(item).map((key) => (
              <td key={key}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    name={key}
                    value={editData[key]}
                    onChange={handleEditChange}
                  />
                ) : (
                  item[key]
                )}
              </td>
            ))}
            <td>
              {editingIndex === index ? (
                <>
                  <button className="btn btn-success me-2" onClick={submitEdit}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingIndex(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-warning me-2" onClick={() => startEditing(index)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => onDelete(index)}>
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReusableTable;
