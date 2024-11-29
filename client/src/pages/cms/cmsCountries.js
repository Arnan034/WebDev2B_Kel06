import React, { useState, useEffect } from 'react';
import { Button, Loader, Modal } from 'semantic-ui-react';
import PaginationComponent from '../components/pagination';
import { apiServicePublic, apiServiceAdmin } from '../../services/api';

const CMSCountries = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCountry, setNewCountry] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedCountries, setEditedCountries] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(country => 
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCountries.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await apiServicePublic.getAllCountry();
      setCountries(response.data.data);
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

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await apiServiceAdmin.createCountry({
        country_name: newCountry
      });
      console.log(newCountry);
      setNewCountry('');
      setMessage(`Country "${response.data.data.country_name}" berhasil ditambahkan!`);
    } catch (error) {
      console.error("Error adding country:", error);
      setError("Failed to add country");
    } finally {
      setModalOpen(false);  
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
      
      await apiServiceAdmin.updateCountry(id, {
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
  
  const handleDelete = async (id) => {
    if (!id) {
        console.error("No country ID provided to delete.");
        return;
    }
    
    const countryToDelete = countries.find(country => country.id_country === id);
    if (!countryToDelete) {
        console.error("Country not found.");
        return;
    }

    const { country_name } = countryToDelete;
    
    console.log("ID to delete:", id);
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${country_name}"?`);
    if (!confirmDelete) return;

    try {
        await apiServiceAdmin.deleteCountry(id);
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
      <form id="countryForm" className="mb-4" onSubmit={handleSubmitClick}>
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

      <div className="d-flex justify-content-end mb-4">
        <div className="row align-items-center" style={{ width: 'auto' }}>
          <label htmlFor="search-country" className="col-auto me-2">Search Country</label>
          <div className="col-auto" style={{ width: '400px' }}>
            <input
              type="text"
              className="form-control"
              id="search-country"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
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
          <div className="text-center">
            <Loader active inline='centered' />
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <tbody>
            {currentItems.map((country, index) => (
                <tr key={country.id_country}>
                    <td className="text-center no-column">{startIndex + index + 1}</td>
                    <td className="country-column" onDoubleClick={() => handleEdit(country.id_country, country.country_name)}>
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
                        <Button color="red" size="tiny" onClick={() => handleDelete(country.id_country)} disabled={country.have_film}>Delete</Button>
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

      <Modal open={modalOpen} className='confirm-film-modal-validate'>
        <Modal.Header>Confirm Input Country</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to input country <span style={{ color: 'green', fontWeight: 'bold' }}>{newCountry}</span></p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color='green' onClick={handleSubmit}>Confirm</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default CMSCountries;