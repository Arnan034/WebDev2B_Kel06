import React, { useState } from 'react';

const CMSAward = () => {
  const [awards, setAwards] = useState([
    { no: 1, country: "USA", year: 2020, award: "Best Film" },
    { no: 2, country: "UK", year: 2021, award: "Best Director" },
    { no: 3, country: "Canada", year: 2022, award: "Best Actor" }
  ]);
  const [formData, setFormData] = useState({ country: '', year: '', award: '' });
  const [notification, setNotification] = useState('');

  const showAlert = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAward = (event) => {
    event.preventDefault();
    const newAward = {
      no: awards.length ? awards[awards.length - 1].no + 1 : 1,
      country: formData.country,
      year: parseInt(formData.year, 10),
      award: formData.award
    };

    setAwards([...awards, newAward]);
    setFormData({ country: '', year: '', award: '' });
    showAlert("Award added successfully!", "success");
  };

  const handleEditAward = (index) => {
    const award = awards[index];
    const newCountry = prompt("Enter new country:", award.country);
    const newYear = prompt("Enter new year:", award.year);
    const newAward = prompt("Enter new award name:", award.award);
    
    if (newCountry !== null && newYear !== null && newAward !== null) {
      awards[index] = {
        ...awards[index],
        country: newCountry || award.country,
        year: newYear || award.year,
        award: newAward || award.award
      };
      setAwards([...awards]); // Trigger re-render
      showAlert("Award updated successfully!", "success");
    }
  };

  const handleDeleteAward = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this award?");
    if (confirmed) {
      const updatedAwards = awards.filter((_, idx) => idx !== index)
                                   .map((award, idx) => ({ ...award, no: idx + 1 }));
      setAwards(updatedAwards);
      showAlert("Award deleted successfully!", "danger");
    }
  };

  return (
    <div className="col p-4">
      <h3>Add Award</h3>
      <hr className="text-black my-2" /><br />
      <form id="awardForm" className="mb-4" onSubmit={handleAddAward}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="country" className="form-label col-sm-3">Country</label>
          <div className="col-sm-9">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Type country here..." 
              id="country" 
              name="country" 
              value={formData.country}
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        <div className="mb-3 row align-items-center">
          <label htmlFor="year" className="form-label col-sm-3">Year</label>
          <div className="col-sm-9">
            <input 
              type="number" 
              className="form-control" 
              placeholder="Type year here..." 
              id="year" 
              name="year" 
              value={formData.year}
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        <div className="mb-3 row align-items-center">
          <label htmlFor="award" className="form-label col-sm-3">Award</label>
          <div className="col-sm-9">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Type award here..." 
              id="award" 
              name="award" 
              value={formData.award}
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
      </form>
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <br />

      <h3>List of Awards</h3>
      <table className="table table-striped table-hover" id="awardsTable">
        <thead>
          <tr>
            <th className="text-center no-column table-warning">No</th>
            <th className="text-center country-column table-warning">Country</th>
            <th className="text-center year-column table-warning">Year</th>
            <th className="text-center award-column table-warning">Award</th>
            <th className="text-center action-column table-warning">Actions</th>
          </tr>
        </thead>
        <tbody>
          {awards.map((item, index) => (
            <tr key={item.no}>
              <td className="text-center no-column">{item.no}</td>
              <td className="country-column">{item.country}</td>
              <td className="year-column">{item.year}</td>
              <td className="award-column">{item.award}</td>
              <td className="text-center actions-column">
                <button className="btn btn-primary" onClick={() => handleEditAward(index)}>Edit</button>
                <button className="btn btn-warning" onClick={() => handleDeleteAward(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CMSAward;
