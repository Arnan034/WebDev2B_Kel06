import React, { useState, useEffect } from 'react';

const CMSAward = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Re-render the table when genres change
  }, [genres]);

  const renderTable = () => {
    return genres.map((item, index) => (
      <tr key={index}>
        <td className="text-center no-column">{item.no}</td>
        <td className="genre-column">{item.genre}</td>
        <td className="text-center actions-column">
          <button className="btn btn-edit" onClick={() => handleEditGenre(index)}>Edit</button>
          <button className="btn btn-delete" onClick={() => handleDeleteGenre(index)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const showAlert = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleAddGenre = (event) => {
    event.preventDefault();
    if (!newGenre) return;

    const newGenreItem = {
      no: genres.length ? genres[genres.length - 1].no + 1 : 1,
      genre: newGenre,
    };

    setGenres([...genres, newGenreItem]);
    setNewGenre("");
    showAlert("Genre added successfully!");
  };

  const handleEditGenre = (index) => {
    const newGenreName = prompt("Enter new genre name:", genres[index].genre);
    if (newGenreName) {
      const updatedGenres = genres.map((item, idx) => 
        idx === index ? { ...item, genre: newGenreName } : item
      );
      setGenres(updatedGenres);
      showAlert("Genre updated successfully!");
    }
  };

  const handleDeleteGenre = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this genre?");
    if (confirmed) {
      const updatedGenres = genres
        .filter((_, idx) => idx !== index)
        .map((item, idx) => ({ ...item, no: idx + 1 }));
      setGenres(updatedGenres);
      showAlert("Genre deleted successfully!");
    }
  };

  return (
    <div>
      <div className="col p-4">
        <h3>Add Genre</h3>
        <hr className="text-black my-2" />
        <br />
        <form id="genreForm" className="mb-4" onSubmit={handleAddGenre}>
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
                onChange={(e) => setNewGenre(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
        {notification && <div className="alert alert-success mt-3">{notification}</div>}
        <br />

        <h3>List of Genres</h3>
        <table className="table table-striped table-hover" id="genresTable">
          <thead>
            <tr>
              <th className="text-center no-column table-warning">No</th>
              <th className="text-center genre-column table-warning">Genres</th>
              <th className="text-center action-column table-warning">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTable()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CMSAward;
