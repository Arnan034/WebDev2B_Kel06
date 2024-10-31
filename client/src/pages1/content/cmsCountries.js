import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent';

const CMSCountries = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCountry, setNewCountry] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedCountries, setEditedCountries] = useState({});
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = countries.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/countries/');
      setCountries(response.data || []);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    setNewCountry(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/countries', {
        country_name: newCountry
      });
      setCountries([response.data, ...countries]);
      setNewCountry('');
      setMessage(`Country "${response.data.country_name}" berhasil ditambahkan!`);
    } catch (error) {
      console.error("Error adding country:", error);
      setError("Failed to add country");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditedCountries({ ...editedCountries, [id]: currentName });
  };

  const handleEditedCountryChange = (e, id) => {
    setEditedCountries({ ...editedCountries, [id]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const editedName = editedCountries[id];
      if (!editedName) {
        setError("Please enter a valid country name");
        return;
      }
      
      const oldCountryName = countries.find(country => country.id_country === id)?.country_name;
      
      await axios.put(`http://localhost:5000/api/countries/${id}`, {
        name: editedName,
      });
      
      setCountries(countries.map((country) => 
        country.id_country === id ? { ...country, country_name: editedName } : country
    ));
        
        setEditingId(null);
        setMessage(`Country "${oldCountryName}" berhasil diperbarui menjadi "${editedName}"!`);
        fetchCountries();
    } catch (error) {
        console.error("Error updating country:", error);
        setError("Failed to update country");
    }
  };
  
  const handleDelete = async (id_country) => {
    if (!id_country) {
        console.error("No country ID provided to delete.");
        return;
    }
    
    const countryToDelete = countries.find(country => country.id_country === id_country);
    if (!countryToDelete) {
        console.error("Country not found.");
        return;
    }

    const { country_name } = countryToDelete;
    
    console.log("ID to delete:", id_country);
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${country_name}"?`);
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:5000/api/countries/${id_country}`);
        setMessage(`Country "${country_name}" berhasil dihapus.`);
        fetchCountries();
    } catch (error) {
        console.error("Error deleting country:", error);
        if (error.response && error.response.status === 400) {
            setError("Cannot delete country as it is still referenced in other tables.");
        } else {
            setError("Failed to delete country");
        }
    }
  };

  return (
    <div className="col p-4">
      <h3>Add Country</h3>
      <hr className="text-black my-2" />
      <br />
      <form id="countryForm" className="mb-4" onSubmit={handleSubmit}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="country" className="form-label col-sm-3">Country</label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              placeholder="Type country here..."
              id="country"
              name="country"
              value={newCountry}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
      </form>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      <h3>List of Countries</h3>
      <table className="table table-striped table-hover" id="countriesTable">
        <thead>
          <tr>
            <th className="text-center no-column table-warning">No</th>
            <th className="text-center country-column table-warning">Countries</th>
            <th className="text-center action-column table-warning">Actions</th>
          </tr>
        </thead>
        {loading ? (
          <p>Loading countries...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <tbody>
            {currentItems.map((country, index) => (
                <tr key={country.id_country}>
                    <td className="text-center no-column">{startIndex + index + 1}</td>
                    <td className="country-column">
                        {editingId === country.id_country ? (
                            <input
                                type="text"
                                value={editedCountries[country.id_country] || ''}
                                onChange={(e) => handleEditedCountryChange(e, country.id_country)}
                            />
                        ) : (
                            country.country_name
                        )}
                    </td>
                    <td className="text-center actions-column">
                        {editingId === country.id_country ? (
                            <Button color="green" size="tiny" onClick={() => handleUpdate(country.id_country)}>Save</Button>
                        ) : (
                            <Button color="blue" size="tiny" onClick={() => handleEdit(country.id_country, country.country_name)}>Edit</Button>
                        )}
                        <Button color="red" size="tiny" onClick={() => handleDelete(country.id_country)}>Delete</Button>
                    </td>
                </tr>
            ))}
          </tbody>
        )}
      </table>
      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CMSCountries;
