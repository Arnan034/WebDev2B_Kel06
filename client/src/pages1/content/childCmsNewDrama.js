import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import imageCompression from 'browser-image-compression';

const ImageUpload = ({ formData, image, handleImageChange }) => {
  const ImageChange = async (e) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
  
          const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
          };
  
          try {
              const compressedFile = await imageCompression(file, options);
              const reader = new FileReader();
              reader.onloadend = () => {
                  handleImageChange(reader.result, compressedFile);
              };
              reader.readAsDataURL(compressedFile);
          } catch (error) {
              console.error('Error during image compression:', error);
          }
      }
  };

  return (
    <div className="mb-3">
      <h6 htmlFor="picture" className="form-label">Upload Poster</h6>
      <input 
        type="file" 
        className="form-control" 
        id="picture" 
        name="picture" 
        accept="image/*"
        required 
        onChange={ImageChange} 
      />
      {image && (
        <img 
          src={image} 
          alt="ImagePreview" 
          style={{ marginTop: '20px', width: '100%', maxHeight: '400px', objectFit: 'contain' }} 
        />
      )}
    </div>
  )
};
  
const InputForm = ({formData, handleInputChange}) => {
      const [country, setCountry] = useState([]);
      
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
  
      return (
          <>
              <div className="col-md-6 mb-3">
                  <h6 htmlFor="title" className="form-label">Title</h6>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Type title here..."
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                  />
                  
                  <h6 htmlFor="year" className="form-label">Year</h6>
                  <input
                      type="number"
                      className="form-control"
                      placeholder="Type year here..."
                      id="year"
                      name="year"
                      value={formData.year ? formData.year : ''}
                      onChange={handleInputChange}
                      required
                  />
                  
                  <h6 htmlFor="availability" className="form-label">Availability</h6>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Netflix"
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      required
                  />
              </div>
  
              <div className="col-md-6 mb-3">
                  <h6 htmlFor="alterTitle" className="form-label">Alternative Title</h6>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Type alternative title here..."
                      id="alterTitle"
                      name="alterTitle"
                      value={formData.alterTitle}
                      onChange={handleInputChange}
                      required
                  />
  
                  <h6 htmlFor="country" className="form-label">Country</h6>
                  <select
                      className="form-select"
                      id="country"
                      name="country"
                      required
                      value={formData.country ? formData.country : ""}
                      onChange={handleInputChange}
                  >
                      <option disabled selected value="">Select Country</option>
                      {country.map((countries) => (
                          <option key={countries.id_country} value={countries.id_country}>
                              {countries.country_name}
                          </option>
                      ))}
                  </select>
                  
                  <h6 htmlFor="status" className="form-label">Status</h6>
                  <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status ? formData.status : ""}
                      onChange={handleInputChange}
                      required
                  >
                      <option disabled selected value="">Status</option>
                      <option value="On Going">On Going</option>
                      <option value="Completed">Completed</option>
                  </select>
              </div>
          </>
      );
};

const AwardSelection = ({ selectedAward, setSelectedAward, idFilm }) => {
    const MAX_SELECTION_AWARD = 3;
    const [award, setAward] = useState([]);
    
    useEffect(() => {
        const fetchAward = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/awards/unselected');
                const options = response.data.map(award => ({
                  value: award.id_award, 
                  label: `${award.year} - ${award.institution} - ${award.name}` 
                }));
                setAward(options);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchAward();
    }, []);

    const handleSelectAward = (selected) => {
        if (selected.length <= MAX_SELECTION_AWARD) {
          setSelectedAward(selected);
        } else {
          alert(`You can only select up to ${MAX_SELECTION_AWARD} options.`);
        }
    };

    return (
      <div className="col-md-12 mb-3">
        <h6 htmlFor="award" className="form-label">Award:</h6>
        <span>Max 3 Award</span>
        <Select
          isMulti
          value={selectedAward}
          onChange={handleSelectAward}
          options={award}
          placeholder="Select categories"
          isDisabled={idFilm}
        />
      </div>
    );
};
  
const TrailerAndSynopsis = ({formData, handleInputChange}) => {
    return (
      <>
        <div className="col-md-12 mb-3">
          <h6 htmlFor="linkTrailer" className="form-label">Link Trailer</h6>
          <input type="text" className="form-control" placeholder="Type link here..." id="linkTrailer" name="linkTrailer" value={formData.linkTrailer} onChange={handleInputChange} required />
        </div>
  
        <div className="col-12 mb-3">
          <h6 htmlFor="synopsis" className="form-label">Synopsis</h6>
          <textarea className="form-control" placeholder="Type synopsis here..." id="synopsis" name="synopsis" rows="4" value={formData.synopsis} onChange={handleInputChange} required></textarea>
        </div>
      </>
    );
};
  
const GenreSelection = ({ handleCheckboxChange, resetCheckboxes, selectedGenres }) => {
    const [genre, setGenres] = useState([]);
    const [selectedGenresState, setSelectedGenresState] = useState({});

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                const options = response.data.map(genre => ({ value: genre.id_genre, label: genre.genre }));
                setGenres(options);

                if (selectedGenres && selectedGenres.length > 0) {
                  const genresToCheck = selectedGenres.reduce((acc, genre) => {
                    acc[genre.value] = true; // Mark as checked
                    return acc;
                  }, {});
                  setSelectedGenresState(genresToCheck);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchGenre();
    },[selectedGenres]);

    useEffect(() => {
      if (resetCheckboxes) {
        setSelectedGenresState({});
      }
    }, [resetCheckboxes]);

    const handleChange = (event) => {
      const { value, checked } = event.target;

      setSelectedGenresState(prev => ({
          ...prev,
          [value]: checked,
      }));

      handleCheckboxChange(event); // Call parent's checkbox change handler
    };

    return (
      <div className="row mt-4">
        <div className="col-12">
          <h6 className="form-label">Add Genres</h6>
        </div>
        {genre.map(genre => (
          <div className="col-md-3 mb-3" key={genre.value}>
            <div className="form-check">
            <input
                className="form-check-input"
                type="checkbox"
                value={genre.value}
                id={genre.label}
                checked={selectedGenresState[genre.value] || false}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={genre.genre}>{genre.label}</label>
            </div>
          </div>
        ))}
      </div>
    );
};
  
const ActorSelection = ({ selectedActors , chandleSearchChange , handleCloseCard, handleCastChange }) => {
    const [actor, setActor] = useState([]);
    
    const [valueActor, setValueActor] = useState('');
    const [results, setResults] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchActor = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/actors/all');
            const options = response.data.map(actor => ({
              key: actor.id_actor,
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

    const handleResultSelect = (e, { result }) => {
        const isActorSelected = selectedActors.some(actor => actor.key === result.key);
    
        if (!isActorSelected && selectedActors.length < 9) {
          setValueActor('');
          chandleSearchChange(prevActors => [...prevActors, result]);
        }
    };

    const handleSearchChange = (e, { value }) => {
        setValueActor(value);
        setIsLoading(true);
    
        setTimeout(() => {
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

    const resultRenderer = ({ title, image }) => (
        <div className='auto-cmplt-actor-search-cms'>
          <img src={image} alt={title}/>
          <span>{title}</span>
        </div>
    );

    return (
      <div className="row mt-4">
        <h6 htmlFor="actors" className="form-label">Add Actors (Up to 9)</h6>
        <div className="col-12 d-flex flex-wrap justify-content-center">
            <Search
                fluid
                input={{ icon: 'search', iconPosition: 'right', style: { width: '100%' }}}
                loading={isLoading}
                onResultSelect={handleResultSelect}
                onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
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
                    <input 
                        type="text" 
                        id={`cast-${actor.key}`} 
                        placeholder="Enter cast name..." 
                        required 
                        value={actor.cast}
                        onChange={(e) => handleCastChange(actor.key, e.target.value)}
                    />
                    </div>
                </div>
                </div>
            ))}
            {selectedActors.length >= 9 && <p>You can only select up to 9 actors.</p>}
        </div>
      </div>
    );
};

export {ImageUpload, InputForm, AwardSelection, TrailerAndSynopsis, GenreSelection, ActorSelection};