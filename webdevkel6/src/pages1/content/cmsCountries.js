import React, { useState } from 'react';

const CMSCountries = () => {
  const [countries, setCountries] = useState([
    { no: 1, country: "Indonesia" },
    { no: 2, country: "Japan" },
    { no: 3, country: "South Korea" }
  ]);
  const [newCountry, setNewCountry] = useState('');
  const [notification, setNotification] = useState('');

  const showAlert = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddCountry = (event) => {
    event.preventDefault();
    if (!newCountry) return;

    const newCountryObj = {
      no: countries.length ? countries[countries.length - 1].no + 1 : 1,
      country: newCountry,
    };

    setCountries([...countries, newCountryObj]);
    setNewCountry('');
    showAlert("Country added successfully!", "success");
  };

  const handleEditCountry = (index) => {
    const newCountryName = prompt("Enter new country name:", countries[index].country);
    if (newCountryName) {
      const updatedCountries = countries.map((item, idx) =>
        idx === index ? { ...item, country: newCountryName } : item
      );
      setCountries(updatedCountries);
      showAlert("Country updated successfully!", "success");
    }
  };

  const handleDeleteCountry = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this country?");
    if (confirmed) {
      const updatedCountries = countries.filter((_, idx) => idx !== index)
                                         .map((item, idx) => ({ ...item, no: idx + 1 }));
      setCountries(updatedCountries);
      showAlert("Country deleted successfully!", "danger");
    }
  };

  return (
    <div className="col p-4">
      <h3>Add Country</h3>
      <hr className="text-black my-2" />
      <br />
      <form id="countryForm" className="mb-4" onSubmit={handleAddCountry}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="country" className="form-label col-sm-3">Country</label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              placeholder="Type country here..."
              id="country"
              name="country"
              required
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
      </form>
      {notification && (
        <div className={`alert alert-${notification.type} mt-3`}>
          {notification.message}
        </div>
      )}
      <br />

      <h3>List of Countries</h3>
      <table className="table table-striped table-hover" id="countriesTable">
        <thead>
          <tr>
            <th className="text-center no-column table-warning">No</th>
            <th className="text-center country-column table-warning">Countries</th>
            <th className="text-center action-column table-warning">Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((item, index) => (
            <tr key={item.no}>
              <td className="text-center no-column">{item.no}</td>
              <td className="country-column">{item.country}</td>
              <td className="text-center actions-column">
                <button className="btn btn-edit" onClick={() => handleEditCountry(index)}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDeleteCountry(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CMSCountries;
