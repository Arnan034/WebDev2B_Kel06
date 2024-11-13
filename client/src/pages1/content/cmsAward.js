import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Loader, Modal } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent';

const CMSAward = () => {
  const [awards, setAwards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAward, setNewAward] = useState({
    institution: '',
    year: '',
    name: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedAwards, setEditedAwards] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAwards = awards.filter(award => 
    award.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAwards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAwards.slice(startIndex, endIndex);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/awards');
      setAwards(response.data || []);
    } catch (error) {
      console.error("Fetch Error: ", error);
      setError("Failed to fetch awards");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAward((prevState) => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/awards', {
        institution: newAward.institution,
        year: newAward.year,
        name: newAward.name
      });

      setNewAward({
        institution: '',
        year: '',
        name: ''
      });

      setMessage(`Award "${response.data.institution}", tahun "${response.data.year}", kategori "${response.data.name}" berhasil ditambahkan!`);

      setModalOpen(false);

      await fetchAwards();

    } catch (error) {
      console.error("Error adding award:", error);
      setError("Failed to add award");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, institution, year, name) => {
    setEditingId(id);
    setEditedAwards({ institution, year, name });
  };

  const handleEditedChange = (e) => {
    const { name, value } = e.target;
    setEditedAwards((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/awards/${editingId}`, editedAwards);
      setAwards(awards.map((award) => 
        award.id_award === editingId ? { ...award, ...editedAwards } : award
      ));
      setEditingId(null);
      setMessage(`Award berhasil diperbarui!`);
      fetchAwards();
    } catch (error) {
      console.error("Error updating award:", error);
      setError("Failed to update award");
    }
  };

  const handleDelete = async (id) => {
    const awardToDelete = awards.find(award => award.id_award === id);
    console.log("ID yang akan dihapus:", id);
    if (!awardToDelete) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete "${awardToDelete.institution}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/awards/${id}`);
      setAwards(awards.filter((award) => award.id_award !== id));
      setMessage(`Award "${awardToDelete.institution}" berhasil dihapus.`);
      fetchAwards();
    } catch (error) {
      console.error("Error deleting award:", error);
      setError("Failed to delete award");
    }
  };

  return (
    <div className="col p-4">
      <h3>Add Award</h3>
      <hr className="text-black my-2" />
      <br />
      <form id="awardForm" className="mb-4" onSubmit={handleSubmitClick}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="institution" className="form-label col-sm-3">Institution</label>
          <div className="col-sm-9">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Type institution here..." 
              id="institution" 
              name="institution"
              value={newAward.institution}
              onChange={handleInputChange}
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
              value={newAward.name.year}
              onChange={handleInputChange}
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
              name="name" 
              value={newAward.name}
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


      <div className="d-flex justify-content-end mb-4">
        <div className="row align-items-center" style={{ width: 'auto' }}>
          <label htmlFor="search-award" className="col-auto me-2">Search Institution</label>
          <div className="col-auto" style={{ width: '400px' }}>
            <input
              type="text"
              className="form-control"
              id="search-award"
              placeholder="Search institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <h3>List of Awards</h3>
      <table className="table table-striped table-hover" id="awardsTable">
        <thead>
          <tr>
            <th className="text-center no-column table-warning">No</th>
            <th className="text-center institution-column table-warning">Institution</th>
            <th className="text-center year-column table-warning">Year</th>
            <th className="text-center award-column table-warning">Award</th>
            <th className="text-center action-column table-warning">Actions</th>
          </tr>
        </thead>
        { loading ? (
          <div className="text-center">
            <Loader active inline='centered' />
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <tbody>
            {currentItems.map((award, index) => (
              <tr key={award.id_award}>
                <td className="text-center no-column">{startIndex + index + 1}</td>
                <td className="institution-column" onDoubleClick={() => handleEdit(award.id_award, award.institution, award.year, award.name)}>
                  {editingId === award.id_award ? (
                    <input
                      type="text"
                      name="institution"
                      value={editedAwards.institution}
                      onChange={handleEditedChange}
                      className="form-control"
                    />
                  ) : (
                    award.institution
                  )}
                </td>
                <td className="text-center year-column" onDoubleClick={() => handleEdit(award.id_award, award.institution, award.year, award.name)}>
                  {editingId === award.id_award ? (
                    <input
                      type="number"
                      name="year"
                      value={editedAwards.year}
                      onChange={handleEditedChange}
                      className="form-control"
                    />
                  ) : (
                    award.year
                  )}
                </td>
                <td className="award-column" onDoubleClick={() => handleEdit(award.id_award, award.institution, award.year, award.name)}>
                  {editingId === award.id_award ? (
                    <input
                      type="text"
                      name="name"
                      value={editedAwards.name}
                      onChange={handleEditedChange}
                      className="form-control"
                    />
                  ) : (
                    award.name
                  )}
                </td>
                <td className="text-center actions-column">
                  {editingId === award.id_award ? (
                    <>
                      <Button color='green' size='tiny' onClick={() => handleUpdate(award.id_award)}>Save</Button>
                      <Button color='red' size='tiny' onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button color='blue' size='tiny' onClick={() => handleEdit(award.id_award, award.institution, award.year, award.name)}>Edit</Button>
                      <Button color='red' size='tiny' onClick={() => handleDelete(award.id_award)}>Delete</Button>
                    </>
                  )}
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
        <Modal.Header>Confirm Input Award</Modal.Header>  
        <Modal.Content>
          <p>Are you sure you want to input award:  <br></br>
          Award: <span style={{ color: 'green', fontWeight: 'bold' }}>{newAward.institution}</span> - 
          <span style={{ color: 'green', fontWeight: 'bold' }}>{newAward.year}</span> - 
          <span style={{ color: 'green', fontWeight: 'bold' }}>{newAward.name}</span>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color='green' onClick={handleSubmit}>Confirm</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default CMSAward;