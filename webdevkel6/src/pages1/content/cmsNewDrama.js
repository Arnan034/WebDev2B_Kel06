import React, { useState, useEffect } from 'react';

const NewDrama = () => {
  const [image, setImage] = useState(null);
  const [actors, setActors] = useState([
    { id: 1, name: 'Leonardo DiCaprio', img: '../img/leo.jpg' },
    { id: 2, name: 'Benedict C.', img: '../img/benedict.jpg' },
    { id: 3, name: 'Ryan Reynolds', img: '../img/ryan.jpg' },
  ]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setImage(file);
    }
  };

  const handleDeleteActor = (id) => {
    setActors(actors.filter(actor => actor.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to cmsvalidate.html
    window.location.href = "CMSValidate.html";
  };

  useEffect(() => {
    const dramasToggle = document.getElementById("dramasToggle");
    const dramasSubmenu = document.getElementById("dramasSubmenu");

    const toggleDramasSubmenu = (event) => {
      event.preventDefault();
      const isVisible = dramasSubmenu.style.display === "block";
      dramasSubmenu.style.display = isVisible ? "none" : "block";
    };

    if (dramasToggle) {
      dramasToggle.addEventListener("click", toggleDramasSubmenu);
    }
    
    // Cleanup event listener on unmount
    return () => {
      if (dramasToggle) {
        dramasToggle.removeEventListener("click", toggleDramasSubmenu);
      }
    };
  }, []);

  return (
    <div className="col p-4">
      <h3>Input New Drama</h3>
      <hr className="text-black my-2" /><br />
      <form id="dramaForm" className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="mb-3">
              <h6 htmlFor="picture" className="form-label">Upload Poster</h6>
              <input 
                type="file" 
                className="form-control" 
                id="picture" 
                name="picture" 
                accept="image/*" 
                required 
                onChange={handleImageChange} 
              />
              {image && <img src={image} alt="ImagePreview" style={{ marginTop: '20px', width: '100%', maxHeight: '400px', objectFit: 'contain' }} />}
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-success" id="submitButton">Submit</button>
            </div>
          </div>

          <div className="col-md-8 mb-3">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 htmlFor="title" className="form-label">Title</h6>
                <input type="text" className="form-control" placeholder="Type title here..." id="title" name="title" required />
                <h6 htmlFor="year" className="form-label">Year</h6>
                <input type="number" className="form-control" placeholder="Type year here..." id="year" name="year" required />
                <h6 htmlFor="availability" className="form-label">Availability</h6>
                <input type="text" className="form-control" placeholder="Fansub: @aoihub on X" id="availability" name="availability" required />
              </div>

              <div className="col-md-6 mb-3">
                <h6 htmlFor="alterTitle" className="form-label">Alternative Title</h6>
                <input type="text" className="form-control" placeholder="Type alternative title here..." id="alterTitle" name="alterTitle" required />
                <h6 htmlFor="country" className="form-label">Country</h6>
                <input type="text" className="form-control" placeholder="Type country here..." id="country" name="country" required />
                <h6 htmlFor="award" className="form-label">Award</h6>
                <select className="form-select" id="award" name="award" required>
                  <option disabled selected value="">Select</option>
                  <option value="1">Best Drama</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <h6 htmlFor="linkTrailer" className="form-label">Link Trailer</h6>
                <input type="text" className="form-control" placeholder="Type link here..." id="linkTrailer" name="linkTrailer" required />
              </div>

              <div className="col-12 mb-3">
                <h6 htmlFor="synopsis" className="form-label">Synopsis</h6>
                <textarea className="form-control" placeholder="Type synopsis here..." id="synopsis" name="synopsis" rows="4" required></textarea>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <h6 className="form-label">Add Genres</h6>
                </div>
                {['Action', 'Adventure', 'Sci-Fi', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery'].map(genre => (
                  <div className="col-md-3 mb-3" key={genre}>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value={genre} id={`genre${genre}`} name="genres[]" />
                      <label className="form-check-label" htmlFor={`genre${genre}`}>{genre}</label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-list-actor row mt-4">
                <div className="col-12">
                  <h6 htmlFor="actors" className="form-label">Add Actors (Up to 9)</h6>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search Actor Name..." aria-label="Search Actor" aria-describedby="button-addon2" />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
                  </div>
                </div>

                {actors.map(actor => (
                  <div className="col-md-4 mb-3" key={actor.id}>
                    <div className="card d-flex flex-row">
                      <img src={actor.img} className="card-img-left" alt={actor.name} />
                      <div className="card-body">
                        <h6 className="card-title">{actor.name}</h6>
                        <button 
                          type="button" 
                          className="btn btn-warning btn-sm float-end delete-btn" 
                          aria-label="Delete"
                          onClick={() => handleDeleteActor(actor.id)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewDrama;
