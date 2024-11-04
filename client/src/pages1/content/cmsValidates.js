import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Loader, Modal } from 'semantic-ui-react';
import Detail from "./detail";
import ListAward from "./listAward";
import ListActor from "./listActor";
import VideoTrailer from "./videoTrailer";
import PaginationComponent from './paginationComponent';

const CMSValidate = () => {
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const navigate = useNavigate();

  // Move fetchMovieData outside useEffect to make it reusable
  const fetchMovieData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/film/validate`, { params: { filter } });
      setMovies(response.data); 
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  },[filter]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const handleDeleteDrama = (index) => {
    setMovieToDelete(movies[index]);
    setConfirmDelete(true);
  };

  const confirmDeleteMovie = async () => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/film/${movieToDelete.id}`);
        if (response.status === 200) {
            alert('Film deleted successfully'); // Beri tahu pengguna
        }
        setConfirmDelete(false);
        fetchMovieData();
    } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete movie. Please try again.'); // Beri tahu pengguna jika ada kesalahan
    } finally {
        setMovieToDelete(null); // Reset movie to delete
    }
  };


  const handlePreviewClick = (index) => {
    setSelectedMovie(movies[index]);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleEditClick = (index) => {
    navigate(`/cms?edit_film=${encodeURIComponent(index)}`);
  }

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = movies.slice(startIndex, endIndex);

  return (
    <div>
      <div className="col p-4">
        <form id="commentForm" className="mb-4">
          <div className="row mb-3 align-items-center">
            <label htmlFor="filter-comm" className="col-sm-2 col-form-label">Filtered by</label>
            <div className="col-sm-4">
              <select className="form-select" id="filter-comm" onChange={(e) => setFilter(e.target.value)}>
                <option selected value="">None</option>
                <option value="true">Approved</option>
                <option value="false">Unapproved</option>
              </select>
            </div>
            <label htmlFor="shows" className="col-sm-2 col-form-label">Shows</label>
            <div className="col-sm-4 d-flex">
              <select className="form-select" id="shows" onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                {[5, 10, 15, 20, 25].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="text-center">
            <Loader active inline='centered' />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <table className="table table-striped table-hover" id="dramasTable">
              <thead>
                <tr>
                  <th className="text-center no-column table-warning">No</th>
                  <th className="text-center table-warning">Title</th>
                  <th className="text-center table-warning">Genres</th>
                  <th className="text-center table-warning">Synopsis</th>
                  <th className="text-center table-warning">Status</th>
                  <th className="text-center action-column table-warning">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((film, index) => (
                  <tr key={index}>
                    <td className="text-center no-column">{startIndex + index + 1}</td>
                    <td className="text-left title-column">{film.title}</td>
                    <td className="text-left genre-column">{film.genres.join(", ")}</td>
                    <td className="text-center synopsis-column">{film.sysnopsis}</td>
                    <td className="text-center">{film.validate ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Approved</span>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Unapprove</span>
                    )}
                    </td>
                    <td className="text-center">
                      <Button color='green' size='tiny' onClick={() => handlePreviewClick(startIndex + index)}>Preview</Button>
                      <Button color='blue' size='tiny' onClick={() => handleEditClick(film.id)}>Edit</Button>
                      <Button color='red' size='tiny' onClick={() => handleDeleteDrama(startIndex + index)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Modal for Edit */}
        {showModal && selectedMovie && (
          <>
            <div className="modal-overlay"></div>
            <div className="modal fade show" style={{ display: 'block' }} id="ModalCenter" tabIndex="-1" aria-labelledby="ModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <div className="title-web mt-1">
                      <h2 className="title orange-peel-color">CINELUX</h2>
                    </div>
                    <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                  </div>
                  <div className="container h-100 mb-2">
                    <Detail movie={selectedMovie} />
                    <ListAward awards={selectedMovie.awards} />
                    <ListActor id={selectedMovie.id} />
                    <VideoTrailer trailer={selectedMovie.link_trailer} />
                    <div className="modal-footer d-flex justify-content-between">
                      <h3 className="mb-0">Posted by: <strong>{selectedMovie.posted_by}</strong></h3>
                      <div>
                        <button type="button" className="btn btn-dark mx-2" onClick={handleCloseModal}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          size='mini'
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          className='confirm-film-modal-validate'
        >
          <Modal.Header>Delete Movie</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete the movie "<span style={{color: 'red'}}>{movieToDelete ? movieToDelete.title : ''}</span>"?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => setConfirmDelete(false)}>
              No
            </Button>
            <Button positive onClick={confirmDeleteMovie}>
              Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    </div>
  );
};

export default CMSValidate;
