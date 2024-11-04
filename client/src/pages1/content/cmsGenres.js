import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Loader, Modal } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent';

const CMSGenre = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGenre, setNewGenre] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedGenres, setEditedGenres] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(genres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = genres.slice(startIndex, endIndex);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/genres/');
        setGenres(response.data || []);
    } catch (error) {
        console.error("Fetch Error: ", error);
        setError("Failed to fetch genres");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleInputChange = (e) => {
    setNewGenre(e.target.value);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/genres', {
        genre: newGenre
      });
      setGenres([response.data, ...genres]);
      setNewGenre('');
      setMessage(`Genre "${response.data.genre}" berhasil ditambahkan!`);
    } catch (error) {
      console.error("Error adding genre:", error);
      setError("Failed to add genre");
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditedGenres({ ...editedGenres, [id]: currentName });
  };

  const handleEditedGenreChange = (e, id) => {
    setEditedGenres({ ...editedGenres, [id]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
        const editedName = editedGenres[id];
        if (!editedName) {
            setError("Please enter a valid genre");
            return;
        }
        
        const oldGenre = genres.find(genre => genre.id_genre === id)?.genre;
        
        await axios.put(`http://localhost:5000/api/genres/${id}`, {
            name: editedName, 
        });
        
        setGenres(genres.map((genre) => 
            genre.id_genre === id ? { ...genre, genre: editedName } : genre
        ));
        
        setEditingId(null);
        setMessage(`Genre "${oldGenre}" berhasil diperbarui menjadi "${editedName}"!`);
        fetchGenres();
    } catch (error) {
        console.error("Error updating genre:", error);
        setError("Failed to update genre");
    }
  };
  
  const handleDelete = async (id_genre) => {
    if (!id_genre) {
        console.error("No genre ID provided to delete.");
        return;
    }
    
    const genreToDelete = genres.find(genre => genre.id_genre === id_genre);
    if (!genreToDelete) {
        console.error("Genre not found.");
        return;
    }

    const { genre } = genreToDelete;
    
    console.log("ID to delete:", id_genre);
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${genre}"?`);
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:5000/api/genres/${id_genre}`);
        setMessage(`Genre "${genre}" berhasil dihapus.`);
        fetchGenres();
    } catch (error) {
        console.error("Error deleting genre:", error);
        if (error.response && error.response.status === 400) {
            setError("Cannot delete genre as it is still referenced in other tables.");
        } else {
            setError("Failed to delete genre");
        }
    }
  };

  return (
    <div className="col p-4">
      <h3>Add Genre</h3>
      <hr className="text-black my-2" />
      <br />
      <form id="genreForm" className="mb-4" onSubmit={handleSubmitClick}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="genre" className="form-label col-sm-3">Genre</label>
          <div className="col-sm-9"> 
            <input
              type="text"
              className="form-control"
              placeholder="Type genre here..."
              id="genre"
              name="genre"
              value={newGenre}
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

      <h3>List of Genres</h3>
      <table className="table table-striped table-hover" id="genresTable">
        <thead>
          <tr>
            <th className="text-center no-column table-warning">No</th>
            <th className="text-center genre-column table-warning">Genres</th>
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
            {currentItems.map((genre, index) => (
              <tr key={genre.id_genre}>
                <td className="text-center no-column">{startIndex + index + 1}</td>
                <td className="genre-column" onDoubleClick={() => handleEdit(genre.id_genre, genre.genre)}>
                  {editingId === genre.id_genre ? (
                      <input
                          type="text"
                          value={editedGenres[genre.id_genre] || ''}
                          onChange={(e) => handleEditedGenreChange(e, genre.id_genre)}
                      />
                  ) : (
                      genre.genre
                  )}
                </td>
                <td className="text-center actions-column">
                    {editingId === genre.id_genre ? (
                        <Button color="green" size="tiny" onClick={() => handleUpdate(genre.id_genre)}>Save</Button>
                    ) : (
                        <Button color="blue" size="tiny" onClick={() => handleEdit(genre.id_genre, genre.genre)}>Edit</Button>
                    )}
                    <Button color="red" size="tiny" onClick={() => handleDelete(genre.id_genre)}>Delete</Button>
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
          <p>Are you sure you want to input genre "<span style={{ color: 'green', fontWeight: 'bold' }}>{newGenre}</span>"</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color='green' onClick={handleSubmit}>Confirm</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default CMSGenre;