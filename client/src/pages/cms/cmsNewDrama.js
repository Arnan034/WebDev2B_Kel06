import React, { useState, useEffect, useRef } from 'react';
import { apiServiceAuth, apiServiceAdmin } from '../../services/api';
import { useLocation, useNavigate } from "react-router-dom";
import { ImageUpload, InputForm, AwardSelection, TrailerAndSynopsis, GenreSelection, ActorSelection } from './childCmsNewDrama';
import { Modal, Button, Image } from 'semantic-ui-react';

const NewDrama = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmVerified, setConfirmVerified] = useState(false);
  const [image, setImage] = useState(null);
  const [imageSend, setImageSend] = useState(null);
  const [selectedAward, setSelectedAward] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    alterTitle: '',
    year: null,
    country: null,
    availability: '',
    status: '',
    linkTrailer: '',
    synopsis: '',
    posted_by: null,
  });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetCheckboxes, setResetCheckboxes] = useState(false);
  const selectedGenresRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  

  const id_film = new URLSearchParams(location.search).get("edit_film");
  const url_film = useRef();
  url_film.current = id_film

  useEffect(() => {
    const fetchFilmData = async () => {
      if (url_film.current) {
        try { 
          const response = await apiServiceAdmin.getEditFilm(url_film.current);
          const film = response.data.data;
  
          setFormData({
            title: film.title,
            alterTitle: film.alternativeTitle,
            year: parseInt(film.year, 10),
            country: parseInt(film.idCountry, 10),
            availability: film.availability,
            linkTrailer: film.linkTrailer,
            synopsis: film.synopsis,
            status: film.status,
            validate: film.validate,
            posted_by: parseInt(film.postedBy, 10)
          });
  
          if (film.awards && Array.isArray(film.awards)) {
            setSelectedAward(film.awards.map(award => ({
              value: award.id_award,
              label: `${award.year} - ${award.institution} - ${award.name}`
            })));
          }
  
          const toSelectGenre = film.genres.map((genre) => ({
            id: genre.id_genre,
            label: genre.genre,
          }));
  
          selectedGenresRef.current = film.genres.map((genre) => ({
            value: genre.id_genre,
            label: genre.genre,
          }));
  
          setSelectedGenre(toSelectGenre);
  
          setSelectedActors(film.actors.map(actor => ({
            key: actor.id_actor,
            title: actor.name,
            image: `data:image/jpeg;base64,${actor.picture}`,
            cast: actor.cast_as,
            country: actor.country,
            birthdate: actor.birth_date,
          })));
  
          setImage(`data:image/jpeg;base64,${film.picture}`);
        } catch (error) {
          console.error(error);
        }
      } else {
        resetForm();
      }
    };
  
    fetchFilmData();
  }, []);

  const resetForm = () => {
    setResetCheckboxes(prev => !prev);
    setImage(null);
    setSelectedAward([]);
    setSelectedGenre([]);
    setSelectedActors([]);
    setFormData({
      title: '',
      alterTitle: '',
      year: null,
      country: null,
      availability: '',
      status: '',
      linkTrailer: '',
      synopsis: '',
      posted_by: null,
    });
    selectedGenresRef.current = [];
  };

  const handleImageChange = (file, compress) => {
    setImage(file);
    setImageSend(compress);
  };

  const changeSelectedAward = (e) => {
    setSelectedAward(e);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const selectedLabel = event.target.nextSibling.textContent;

    if (checked) {
      setSelectedGenre(prev => [...prev, { id: value, label: selectedLabel }]);
    } else {
      setSelectedGenre(prev => prev.filter(genre => String(genre.id) !== String(value)));
    }
  };

  const chandleSearchChange = (event) => {
    setSelectedActors(event);
  };

  const handleCloseCard = (actorToRemove) => {
    setSelectedActors(prevActors => prevActors.filter(actor => actor.key !== actorToRemove.key));
  };

  const handleCastChange = (actorKey, castValue) => {
    setSelectedActors(prevActors => 
      prevActors.map(actor => 
        actor.key === actorKey ? { ...actor, cast: castValue } : actor
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalOpen(true); // Buka modal untuk konfirmasi
  };

  const handleConfirmSubmit = async () => {
    const formDataToSubmit = new FormData();

    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('picture', imageSend);
    formDataToSubmit.append('alt_title', formData.alterTitle);
    formDataToSubmit.append('year', formData.year);
    formDataToSubmit.append('country', formData.country);
    formDataToSubmit.append('availability', formData.availability);
    formDataToSubmit.append('link_trailer', formData.linkTrailer);
    formDataToSubmit.append('synopsis', formData.synopsis);
    formDataToSubmit.append('status', formData.status);
    formDataToSubmit.append('posted_by', sessionStorage.getItem('id_user'));

    formDataToSubmit.append('award', JSON.stringify(selectedAward));
    formDataToSubmit.append('genre', JSON.stringify(selectedGenre));
    
    // Assuming selectedActors is defined in your component scope

    if (Array.isArray(selectedActors)) {
      selectedActors.forEach(actor => {
          formDataToSubmit.append('actor[]', JSON.stringify({
              id: actor.key,
              cast: actor.cast
          }));
      });
    }

    try {
      const response = await apiServiceAuth.createFilm(formDataToSubmit);

      setSuccessMessage(response.data.message);
      setSuccessModalOpen(true);

      resetForm();
      // Tutup modal konfirmasi setelah berhasil
      setModalOpen(false);

      // Tutup modal sukses setelah 2 detik
      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const saveEdit = async () => {
    const formDataToSubmit = new FormData();
    
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('picture', image); // Ensure image is defined correctly
    formDataToSubmit.append('alt_title', formData.alterTitle);
    formDataToSubmit.append('year', formData.year);
    formDataToSubmit.append('country', formData.country);
    formDataToSubmit.append('availability', formData.availability);
    formDataToSubmit.append('link_trailer', formData.linkTrailer);
    formDataToSubmit.append('synopsis', formData.synopsis);
    formDataToSubmit.append('status', formData.status);

    formDataToSubmit.append('award', JSON.stringify(selectedAward));

    // Ensure selectedGenre is defined and not undefined
    if (selectedGenre) {
        formDataToSubmit.append('genre', JSON.stringify(selectedGenre));
    } else {
        console.error("selectedGenre is undefined");
    }
    
    // Ensure selectedActors is defined and is an array
    if (Array.isArray(selectedActors)) {
        selectedActors.forEach(actor => {
            formDataToSubmit.append('actor[]', JSON.stringify({
                id: actor.key,
                cast: actor.cast
            }));
        });
    } else {
        console.error("selectedActors is not an array or is undefined");
    }

    try {
        console.log(selectedGenre);
        const response = await apiServiceAdmin.saveEditValidate(id_film, formDataToSubmit);

        setSuccessMessage(response.data.message);
        setSuccessModalOpen(true);
        resetForm();

        setTimeout(() => {
            setSuccessModalOpen(false);
        }, 2000);

        navigate('/cms/validate');
    } catch (error) {
        console.error(error);
    }
  };

  const handleVerifiedDrama = () => {
    setConfirmVerified(true);
  };

  const confirmVerifiedMovie = async () => {
    saveEdit();
    try {
        const response = await apiServiceAdmin.updateFilmValidate(id_film);
        if (response.status === 200) {
            alert('Film Already Verified');
        }
        setConfirmVerified(false);
        navigate('/cms/validate');
    } catch (error) {
        console.error('Error Editing movie:', error);
        alert('Failed to delete movie. Please try again.');
    }
  };

  return (
    <>
      <div className="col p-4">
        <h3>Input New Drama</h3>
        <hr className="text-black my-2" /><br />
        <form id="dramaForm" className="mb-4" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <ImageUpload formData={formData} image={image} handleImageChange={handleImageChange}/>
              <div className="d-flex justify-content-center">
                {id_film ? (
                  <div>
                    <button type="button" className="btn btn-dark mx-2" id="backButton" onClick={saveEdit}>Save</button>
                    {!formData.validate && (
                      <button type="button" className="btn btn-success mx-2" id="confirmButton" onClick={handleVerifiedDrama}>Verify</button>
                    )}
                  </div>
                ) : (
                  <button type="submit" className="btn btn-success" id="submitButton">Submit</button>
                )}
              </div>
            </div>

            <div className="col-md-8 mb-3">
              <div className="row">
                <InputForm formData={formData} handleInputChange={handleInputChange}/>
                <AwardSelection selectedAward={selectedAward} setSelectedAward={changeSelectedAward}/>
                <TrailerAndSynopsis formData={formData} handleInputChange={handleInputChange}/>
                <GenreSelection handleCheckboxChange={handleCheckboxChange} resetCheckboxes={resetCheckboxes} selectedGenres={selectedGenresRef.current} />
                <ActorSelection selectedActors={selectedActors} chandleSearchChange={chandleSearchChange} handleCloseCard={handleCloseCard} handleCastChange={handleCastChange} />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal konfirmasi */}
      <Modal
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        className='confirm-film-modal'
      >
        <Modal.Header>Confirm Your Submission</Modal.Header>
        <Modal.Content scrolling>
          <div className="row">
            <div className="col-md-5 mb-3">
              <Image size='medium' src={image} wrapped />
            </div>
            <div className="col-md-7 mb-3">
              <Modal.Description>
                <h1>{formData.title}</h1>
                <p><strong>Alternative Title:</strong> {formData.alt_title}</p>
                <p><strong>Year:</strong> {formData.year}</p>
                <p><strong>Country:</strong> {formData.country}</p>
                <p><strong>Availability:</strong> {formData.availability}</p>
                <p><strong>Trailer Link:</strong> {formData.link_trailer}</p>
                <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%' }}>
                  <strong>Synopsis:</strong> {formData.synopsis}
                </p>
                <p><strong>Status:</strong> {formData.status}</p>
                <p><strong>Genre: </strong>
                  {selectedGenre.map((genre) => (
                    <span key={genre.id}>{genre.label}, </span>
                  ))}
                </p>
              </Modal.Description>
            </div>
          </div>

          <div className='row w-100 mt-3'>
            <h4>Awards:</h4>
            <div className="col">
              {selectedAward.map((award, index) => (
                <p key={index}>{index + 1}. {award.label}</p>
              ))}
            </div>
          </div>

          <div className='row w-100 mt-3'>
            <h4>Actor:</h4>
            {selectedActors.map((actor, index) => (
              <div className="col-2" key={index}>
                <div 
                  className="actor-item" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    margin: '0 5px' 
                  }}
                >
                  <img 
                    src={actor.image} 
                    alt={`${actor.title}`} 
                    style={{ width: '100px', height: 'auto', marginBottom: '10px' }} 
                  />
                  <p style={{ margin: 0 }}>{actor.title}</p>
                  <span style={{ fontSize: '14px', color: '#555' }}>{actor.cast}</span> 
                </div>
              </div>
            ))}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setModalOpen(false)}>
            Back
          </Button>
          <Button
            content="Confirm Submit"
            labelPosition='right'
            icon='checkmark'
            onClick={handleConfirmSubmit}
            positive
          />
        </Modal.Actions>
      </Modal>

      {/* Modal Sukses */}
      <Modal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        basic
        size='small'
        className='confirm-film-modal'
      >
        <Modal.Content>
          <h4>{successMessage}</h4>
        </Modal.Content>
      </Modal>

      <Modal
          size='mini'
          open={confirmVerified}
          onClose={() => setConfirmVerified(false)}
          className='confirm-film-modal-validate'
        >
          <Modal.Header>Verify Movie</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to Verify the movie "<span style={{color: 'green'}}>{formData.title ? formData.title : ''}</span>"?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => setConfirmVerified(false)}>
              No
            </Button>
            <Button positive onClick={confirmVerifiedMovie}>
              Yes
            </Button>
          </Modal.Actions>
      </Modal>
    </>
  );
};

export default NewDrama;
