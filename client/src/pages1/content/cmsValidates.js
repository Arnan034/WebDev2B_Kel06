import React, { useState } from 'react';
import Detail from "./detail";
import ListAward from "./listAward";
import ListActor from "./listActor";
import VideoTrailer from "./videoTrailer";

const CMSValidate = () => {
  const [showModal, setShowModal] = useState(false);
  
  const [dramas, setDramas] = useState([
    { no: 1, drama: 'Drama A', actors: 'Actor 1', genres: 'Genre 1', synopsis: 'Amazing storyline and great acting!', status: 'Approved' },
    { no: 2, drama: 'Drama B', actors: 'Actor 2', genres: 'Genre 2', synopsis: 'Good drama but a bit slow in the middle.', status: 'Unapproved' },
    { no: 3, drama: 'Drama C', actors: 'Actor 3', genres: 'Genre 3', synopsis: "One of the best dramas I've ever watched!", status: 'Approved' },
    { no: 4, drama: 'Drama D', actors: 'Actor 4', genres: 'Genre 4', synopsis: "Not up to the mark, expected better.", status: 'Unapproved' },
    { no: 5, drama: 'Drama E', actors: 'Actor 5', genres: 'Genre 5', synopsis: "Good overall but had some predictable moments.", status: 'Approved' }
  ]);

  const [filteredDramas, setFilteredDramas] = useState(dramas);
  const [filter, setFilter] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [setNotification] = useState('');


  const handleSearch = (event) => {
    event.preventDefault();
    const filtered = dramas.filter(drama => filter ? drama.status.toLowerCase() === filter.toLowerCase() : true)
      .slice(0, showCount);
    setFilteredDramas(filtered);
  };

  const handleDeleteDrama = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this drama?");
    if (confirmed) {
      const updatedDramas = dramas.filter((_, idx) => idx !== index);
      setDramas(updatedDramas);
      setFilteredDramas(updatedDramas.slice(0, showCount));
      setNotification("Drama deleted successfully!");
    }
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="col p-4">
        <form id="commentForm" className="mb-4" onSubmit={handleSearch}>
          <div className="row mb-3 align-items-center">
            <label htmlFor="filter-comm" className="col-sm-2 col-form-label">Filtered by</label>
            <div className="col-sm-4">
              <select className="form-select" id="filter-comm" onChange={(e) => setFilter(e.target.value)}>
                <option disabled selected value="">None</option>
                <option value="approved">Approved</option>
                <option value="unapproved">Unapproved</option>
              </select>
            </div>
            <label htmlFor="shows" className="col-sm-2 col-form-label">Shows</label>
            <div className="col-sm-4 d-flex">
              <select className="form-select" id="shows" onChange={(e) => setShowCount(e.target.value)}>
                {[1, 2, 3, 5, 10, 15, 20, 25, 30].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-success ms-3">Search</button>
            </div>
          </div>
        </form>

        <table className="table table-striped table-hover" id="dramasTable">
          <thead>
            <tr>
              <th className="text-center no-column table-warning">No</th>
              <th className="text-center table-warning">Drama</th>
              <th className="text-center table-warning">Actors</th>
              <th className="text-center table-warning">Genres</th>
              <th className="text-center table-warning">Synopsis</th>
              <th className="text-center table-warning">Status</th>
              <th className="text-center action-column table-warning">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDramas.map((drama, index) => (
                <tr key={index}>
                  <td className="text-center no-column">{drama.no}</td>
                  <td className="text-center">{drama.drama}</td>
                  <td className="text-center">{drama.actors}</td>
                  <td className="text-center">{drama.genres}</td>
                  <td className="text-center">{drama.synopsis}</td>
                  <td className="text-center">{drama.status}</td>
                  <td className="text-center">
                    <button className="btn btn-warning" onClick={() => handleEditClick(index)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteDrama(index)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Modal untuk Edit */}
        {showModal && (
          <>
            {/* Overlay di luar modal */}
            <div className="modal-overlay"></div>
            
            <div className="modal fade show" style={{ display: 'block' }} id="ModalCenter" tabIndex="-1" aria-labelledby="ModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="title-web mt-1">
                      <h2 className="title orange-peel-color">DramaKu</h2>
                    </div>
                    <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                  </div>
                  <div className="container h-100 mb-2">
                    <Detail />
                    <ListAward />
                    <ListActor />
                    <VideoTrailer />
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" >Delete</button>
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Approve</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CMSValidate;
