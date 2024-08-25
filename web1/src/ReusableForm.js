import React, { useState } from "react";

function ReusableForm({ fields, onSubmit }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="mb-3">
          <label className="form-label">{field.label}</label>
          <input
            type="text"
            name={field.name}
            className="form-control"
            value={formData[field.name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}

export default ReusableForm;
