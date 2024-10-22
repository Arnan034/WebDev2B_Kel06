import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';


const NewDrama = () => {
  const [country, setCountry] = useState([]);
  const [award, setAward] = useState([]);
  const [genre, setGenres] = useState([]);
  const [actor, setActor] = useState([]);

  const [results, setResults] = useState([]);
  const [valueActor, setValueActor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedAward, setSelectedAward] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  
  useEffect(() => {
    const fetchCountries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/countries/');
            setCountry(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchAward = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/awards/name');
            const options = response.data.map(award => ({ value: award.name, label: award.name }));
            setAward(options);
        } catch (error) {
            console.error(error);
        }
    };

    fetchAward();
  }, []);

  useEffect(() => {
    const fetchGenre = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/genres');
            const options = response.data.map(genre => ({ value: genre.id_genre, label: genre.genre }));
            setGenres(options);
        } catch (error) {
            console.error(error);
        }
    };

    fetchGenre();
  }, []);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/actors/all');
        const options = response.data.map(actor => ({
          key: actor.id,
          title: actor.name,
          image: `data:image/jpeg;base64,${actor.picture}`,
          country: actor.country,
          birthdate: actor.birthdate,
        }));
        setActor(options);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActor();
  }, []);

  // const MAX_SELECTION_ACTOR = 9;
  const MAX_SELECTION_AWARD = 3;

  const handleResultSelect = (e, { result }) => {
    // Cek apakah aktor sudah dipilih
    const isActorSelected = selectedActors.some(actor => actor.key === result.key);

    // Hanya tambahkan jika belum dipilih dan jumlah kurang dari 9
    if (!isActorSelected && selectedActors.length < 9) {
      setValueActor(''); // Reset value pencarian
      setSelectedActors(prevActors => [...prevActors, result]); // Tambahkan aktor yang dipilih ke array
    }
  };

  const handleSearchChange = (e, { value }) => {
    setValueActor(value);
    setIsLoading(true);

    setTimeout(() => {
      // Hanya cari jika panjang input lebih dari 1
      if (value.length < 1) {
        setIsLoading(false);
        setResults([]);
        return;
      }

      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = (actor) => re.test(actor.title);

      setResults(_.filter(actor, isMatch));
      setIsLoading(false);
    }, 300);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setImage(file);
    }
  };

  const handleSelectAward = (selected) => {
    if (selected.length <= MAX_SELECTION_AWARD) {
      setSelectedAward(selected);
    } else {
      alert(`You can only select up to ${MAX_SELECTION_AWARD} options.`);
    }
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

  const resultRenderer = ({ title, image }) => (
    <div className='auto-cmplt-actor-search-cms'>
      <img src={image} alt={title}/>
      <span>{title}</span>
    </div>
  );

  const handleCloseCard = (actorToRemove) => {
    setSelectedActors(prevActors => prevActors.filter(actor => actor.key !== actorToRemove.key)); // Hapus aktor dari array
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "CMSValidate.html";
  };

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
                <input type="text" className="form-control" placeholder="Netflix" id="availability" name="availability" required />
              </div>

              <div className="col-md-6 mb-3">
                <h6 htmlFor="alterTitle" className="form-label">Alternative Title</h6>
                <input type="text" className="form-control" placeholder="Type alternative title here..." id="alterTitle" name="alterTitle" required />

                <h6 htmlFor="country" className="form-label">Country</h6>
                <select className="form-select" id="country" name="country" required>
                  <option disabled selected value="">Select country</option>
                  {country.map((countries) => (
                    <option key={countries.id_country} value={countries.id_country}>{countries.country_name} </option>
                  ))}
                </select>
                
                <h6 htmlFor="status" className="form-label">Status</h6>
                <select className="form-select" id="status" name="status" required>
                  <option disabled selected value="">Status</option>
                  <option value="On-Going">On Going</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <h6 htmlFor="award" className="form-label">Award:</h6>
                <span>Max 3 Award</span>
                <Select
                  isMulti
                  value={selectedAward}
                  onChange={handleSelectAward}
                  options={award}
                  placeholder="Select categories"
                />
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
                {genre.map(genre => (
                  <div className="col-md-3 mb-3" key={genre}>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value={genre.value} id={genre.value} name="genres[]" />
                      <label className="form-check-label" htmlFor={genre.genre}>{genre.label}</label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row mt-4">
                  <h6 htmlFor="actors" className="form-label">Add Actors (Up to 9)</h6>
                  <div className="col-12 d-flex flex-wrap justify-content-center">
                    <Search
                      fluid
                      input={{ icon: 'search', iconPosition: 'right', style: { width: '80%'} }}
                      loading={isLoading}
                      onResultSelect={handleResultSelect}
                      onSearchChange={_.debounce(handleSearchChange, 500, {
                        leading: true,
                      })}
                      results={results.slice(0, 5)}
                      value={valueActor}
                      resultRenderer={resultRenderer}
                      placeholder='Search Actor Here'
                    />
                    {selectedActors.map((actor) => (
                      <div key={actor.key} className="card-actor-cms">
                        <button className="close-btn" onClick={() => handleCloseCard(actor)}>
                          &times;
                        </button>
                        <img src={actor.image} alt={`${actor.title}`} />
                        <h4>{actor.title}</h4>
                        <div className="info-actor-cms">
                          <p><span>{actor.country}, {actor.birthdate}</span></p>
                          <div className="input-actor-cms-group">
                            <label htmlFor={`cast-${actor.key}`}>Cast:</label>
                            <input type="text" id={`cast-${actor.key}`} placeholder="Enter cast name..." required />
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedActors.length >= 9 && <p>You can only select up to 9 actors.</p>}
                  </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewDrama;
