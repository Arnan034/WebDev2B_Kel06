import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CMSCountries = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState('');
  const [notification, setNotification] = useState(null); // Initialize as null

  const showAlert = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Set notification to null instead of an empty string
  };

  // Fetch countries when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/country')
      .then((response) => setCountries(response.data))
      .catch((error) => console.error(error));
  }, []);

  
  const createCountries = () => {
    axios.post('http://localhost:5000/country', { country_name: newCountry })
      .then((response) => {
        setCountries([...countries, response.data]);
        showAlert("Country created successfully", "success"); // Success message
      })
      .catch((error) => {
        console.error(error);
        showAlert("Failed to create country", "danger"); // Error message
      });
  };

  return (
    <div className="col p-4">
      <h3>Add Country</h3>
      <hr className="text-black my-2" />
      <form id="countryForm" className="mb-4" onSubmit={createCountries}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="country" className="form-label col-sm-3">Country</label>
          <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            placeholder="Type country here..."
            id="country"
            name="country"
            value={newCountry}  // Value diambil dari state
            onChange={(e) => setNewCountry(e.target.value)}  // Set state saat input berubah
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
          {countries.map((country, index) => (
            <tr key={country.id}>
              <td className="text-center no-column">{index + 1}</td>
              <td className="country-column">{country.country_name}</td>  {/* Akses country_name */}
              <td className="text-center actions-column">
                <button className="btn btn-edit">Edit</button>
                <button className="btn btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CMSCountries;
