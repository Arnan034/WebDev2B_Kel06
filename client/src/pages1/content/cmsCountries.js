import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent'; // Import komponen pagination

const CMSCountries = () => {
  
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = countries.slice(startIndex, endIndex);

  useEffect(() => {
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

    fetchCountries();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="col p-4">
      <h3>Add Country</h3>
      <hr className="text-black my-2" />
      <form id="countryForm" className="mb-4">
        <div className="mb-3 row align-items-center">
          <label htmlFor="country" className="form-label col-sm-3">Country</label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              placeholder="Type country here..."
              id="country"
              name="country"
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
      </form>

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
              <tr key={country.id}>
                <td className="text-center no-column">{startIndex + index + 1}</td>
                <td className="country-column">{country.country_name}</td>
                <td className="text-center actions-column">
                  <Button color='blue' size='tiny'>Edit</Button>
                  <Button color='red' size='tiny'>Delete</Button>
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
