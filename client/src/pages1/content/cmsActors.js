import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Loader, Modal } from 'semantic-ui-react';
import PaginationComponent from './paginationComponent';

const CMSActor = () => {
  const [actors, setActors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newActor, setNewActor] = useState({
    country: '',
    name: '',
    birth_date: '',
    picture: null
  })
  const [editingId, setEditingId] = useState(null);
  const [editedActors, setEditedActors] = useState({});
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("");
  
  const fileInputRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(actors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = actors.slice(startIndex, endIndex);

  useEffect(() => {
    fetchActors();
  }, []);  

  const fetchActors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/actors/all');
      // console.log(response.data);
      setActors(response.data || []);
    } catch (error) {
      console.error("Fetch Error: ", error);
      setError("Failed to fetch actors");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActor((prevState) => ({
        ...prevState,
        [name]: value
    }));
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewActor(prevState => ({ ...prevState, picture: reader.result }));
    };

    if (file) {
        reader.readAsDataURL(file);
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:5000/api/actors', { 
        country: newActor.country,
        name: newActor.name,
        birth_date: newActor.birth_date,
        picture: newActor.picture
      });
      setActors([response.data, ...actors]);
      setNewActor({
        country: '',
        name: '',
        birth_date: '',
        picture: null 
      })
      fileInputRef.current.value = '';
      setMessage(`Actor "${newActor.name}" berhasil ditambahkan!`);
      fetchActors();
    } catch (error) {
      console.error("Error adding actor:", error);
      setError("Failed to add actor");
    } finally {
      setLoading(false);
      setOpen(false)
    }
  };

  const handleEdit = (id, country, name, birth_date, picture) => {
    setEditingId(id);
    setEditedActors({ country, name, birth_date, picture });
  };   

  const handleEditFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setEditedActors(prevState => ({ ...prevState, picture: reader.result }));
    };

    if (file) {
        reader.readAsDataURL(file);
    }
  };

  const handleEditedChange = (e) => {
    const { name, value } = e.target;
    setEditedActors((prev) => ({ ...prev, [name]: value }));
  };    

  const handleUpdate = async () => {
    try {
        await axios.put(`http://localhost:5000/api/actors/${editingId}`, editedActors);
        setActors(actors.map((actor) =>
            actor.id_actor === editingId ? { ...actor, ...editedActors } : actor
        ));
        setEditingId(null);
        setMessage(`Actor berhasil diperbarui!`);
        fetchActors();
    } catch (error) {
        console.error("Error updating actor:", error);
        setError("Failed to update actor", error);
    }
  }; 

  const handleDelete = async (id) => {
    const actorToDelete = actors.find(actor => actor.id_actor === id);
    console.log("ID yang akan dihapus:", id);
    // console.log("Actors:", actors);
    if (!actorToDelete) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete "${actorToDelete.name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/actors/${id}`);
      setActors(actors.filter((actor) => actor.id_actor !== id));
      setMessage(`Actor "${actorToDelete.name}" berhasil dihapus.`);
      fetchActors();
    } catch (error) {
      console.error("Error deleting actor:", error);
      setError("Failed to delete actor");
    }
  };

  return (
    <div className="col p-4">
      <h3>Add Actor</h3>
      <hr className="text-black my-2" />
      <br />
      <form id="actorForm" className="mb-4" onSubmit={handleSubmitClick}>
        <div className="mb-3 row align-items-center">
          <label htmlFor="country" className="form-label col-sm-3">Country</label>
          <div className="col-sm-9">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Type country here..." 
              id="country" 
              name="country" 
              value={newActor.country} 
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        <div className="mb-3 row align-items-center">
          <label htmlFor="actorName" className="form-label col-sm-3">Actor Name</label>
          <div className="col-sm-9">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Type actor name here..." 
              id="actorName" 
              name="name" 
              value={newActor.name} 
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        <div className="mb-3 row align-items-center">
          <label htmlFor="birthDate" className="form-label col-sm-3">Birth Date</label>
          <div className="col-sm-9">
            <input 
              type="date" 
              className="form-control" 
              id="birthDate" 
              name="birth_date" 
              value={newActor.birth_date} 
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        <div className="mb-3 row align-items-center">
          <label htmlFor="picture" className="form-label col-sm-3">Upload Picture</label>
          <div className="col-sm-9">
            <input 
              type="file" 
              className="form-control" 
              id="picture" 
              name="picture" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleFileChange}
              required 
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
      </form>
      <br />
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      <h3>List of Actors</h3>
      <table className="table table-striped table-hover" id="actorsTable">
        <thead>
          <tr>
            <th className="text-center no-column table-warning">No</th>
            <th className="text-center country-column table-warning">Country</th>
            <th className="text-center actorName-column table-warning">Actor Name</th>
            <th className="text-center birthDate-column table-warning">Birth Date</th>
            <th className="text-center picture-column table-warning">Picture</th>
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
            {currentItems.map((actor, index) => (
              // console.log("ID actor pada baris:", actor.id_actor),
              <tr key={actor.id_actor}>
                <td className="text-center no-column">{startIndex + index + 1}</td>
                <td className="country-column" onDoubleClick={() => handleEdit(actor.id_actor, actor.country, actor.name, actor.birth_date, actor.picture)}>
                  {editingId === actor.id_actor ? (
                    <input
                      type="text"
                      name="country"
                      value={editedActors.country}
                      onChange={handleEditedChange}
                      className="form-control"
                    />
                  ) : (
                    actor.country
                  )}
                </td>
                <td className="actorName-column" onDoubleClick={() => handleEdit(actor.id_actor, actor.country, actor.name, actor.birth_date, actor.picture)}>
                  {editingId === actor.id_actor ? (
                    <input
                      type="text"
                      name="name"
                      value={editedActors.name}
                      onChange={handleEditedChange}
                      className="form-control"
                    />
                  ) : (
                    actor.name
                  )}
                </td>
                <td className="birthDate-column" onDoubleClick={() => handleEdit(actor.id_actor, actor.country, actor.name, actor.birth_date, actor.picture)}>
                  {editingId === actor.id_actor ? (
                    <input
                      type="date"
                      name="birth_date"
                      value={editedActors.birth_date}
                      onChange={handleEditedChange}
                      className="form-control"
                    />
                  ) : (
                    actor.birth_date
                  )}
                </td>
                <td className="text-center picture-column image-wrapper-cms-actor" onDoubleClick={() => handleEdit(actor.id_actor, actor.country, actor.name, actor.birth_date, actor.picture)}>
                  {editingId === actor.id_actor ? (
                    <input 
                      type="file" 
                      className="form-control" 
                      id="picture" 
                      name="picture" 
                      accept="image/*" 
                      onChange={handleEditFileChange}
                      required 
                    />
                  ) : (
                    actor.picture ? (
                      <img src={`data:image/png;base64,${actor.picture}`} alt={actor.name} width="100" />
                    ) : (
                      'No Image'
                    )
                  )}
                </td>
                <td className="text-center actions-column">
                  {editingId === actor.id_actor ? (
                    <>
                      <Button color='green' size='tiny' onClick={() => handleUpdate(actor.id_actor)}>Save</Button>
                      <Button color='grey' size='tiny' onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button color='blue' size='tiny' onClick={() => handleEdit(actor.id_actor, actor.country, actor.name, actor.birth_date, actor.picture)}>Edit</Button>
                      <Button color='red' size='tiny' onClick={() => handleDelete(actor.id_actor)}>Delete</Button>
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


    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      className='confirm-actor-modal'
    >
      <Modal.Header>Confirm Actor Input</Modal.Header>
      <Modal.Content image>
        <div className='image-wrapper-modal-actor'>
          <img src={newActor.picture} alt='Actor Input'/>
        </div>
        <Modal.Description className='m-2'>
          <h1>Actor Profil</h1>
          <p>Name: &emsp; &emsp;{newActor.name}</p>
          <p>Country: &emsp; {newActor.country}</p>
          <p>Birth Date: &ensp;{newActor.birth_date}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Back
        </Button>
        <Button
          content="Submit"
          labelPosition='right'
          icon='checkmark'
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>

    </div>
  );
};

export default CMSActor;