import React, { useEffect, useRef, useState } from 'react';

const CMSActor = () => {
  const [actors, setActors] = useState([
    { no: 1, country: "USA", actorName: "Leonardo DiCaprio", birthDate: "1974-11-11", picture: "../img/leo.jpg" },
    { no: 2, country: "UK", actorName: "Benedict Cumberbatch", birthDate: "1976-07-19", picture: "../img/benedict.jpg" },
    { no: 3, country: "Canada", actorName: "Ryan Reynolds", birthDate: "1976-10-23", picture: "../img/ryan.jpg" }
  ]);
  const [notification, setNotification] = useState("");
  const formRef = useRef();

  useEffect(() => {
    renderTable();
  }, [actors]);

  const renderTable = () => {
    // Rerender table when actors change
  };

  const showAlert = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleAddActor = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const country = formData.get("country").trim();
    const actorName = formData.get("actorName").trim();
    const birthDate = formData.get("birthDate");
    const pictureFile = formData.get("picture");

    const reader = new FileReader();
    reader.onload = function(e) {
      const pictureURL = e.target.result;
      addActorToList(country, actorName, birthDate, pictureURL);
    };

    if (pictureFile) {
      reader.readAsDataURL(pictureFile);
    } else {
      addActorToList(country, actorName, birthDate, "");
    }
  };

  const addActorToList = (country, actorName, birthDate, picture) => {
    const newActor = {
      no: actors.length ? actors[actors.length - 1].no + 1 : 1,
      country,
      actorName,
      birthDate,
      picture
    };
    setActors([...actors, newActor]);
    formRef.current.reset();
    showAlert("Actor added successfully!", "success");
  };

  const handleEditActor = (index) => {
    const actor = actors[index];
    const newCountry = prompt("Enter new country:", actor.country);
    if (newCountry === null) return;

    const newActorName = prompt("Enter new actor name:", actor.actorName);
    if (newActorName === null) return;

    const newBirthDate = prompt("Enter new birth date (YYYY-MM-DD):", actor.birthDate);
    if (newBirthDate === null) return;

    const updatedActors = actors.map((a, i) => i === index ? { ...a, country: newCountry, actorName: newActorName, birthDate: newBirthDate } : a);
    setActors(updatedActors);
    showAlert("Actor updated successfully!", "success");
  };

  const handleDeleteActor = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this actor?");
    if (confirmed) {
      const updatedActors = actors.filter((_, idx) => idx !== index).map((actor, idx) => ({ ...actor, no: idx + 1 }));
      setActors(updatedActors);
      showAlert("Actor deleted successfully!", "danger");
    }
  };

  return (
    <div>
      <div className="col p-4">
        <h3>Add Actor</h3>
        <hr className="text-black my-2" />
        <br />
        <form ref={formRef} id="actorForm" className="mb-4" onSubmit={handleAddActor}>
          <div className="mb-3 row align-items-center">
            <label htmlFor="country" className="form-label col-sm-3">Country</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" placeholder="Type country here..." id="country" name="country" required />
            </div>
          </div>
          <div className="mb-3 row align-items-center">
            <label htmlFor="actorName" className="form-label col-sm-3">Actor Name</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" placeholder="Type actor name here..." id="actorName" name="actorName" required />
            </div>
          </div>
          <div className="mb-3 row align-items-center">
            <label htmlFor="birthDate" className="form-label col-sm-3">Birth Date</label>
            <div className="col-sm-9">
              <input type="date" className="form-control" id="birthDate" name="birthDate" required />
            </div>
          </div>
          <div className="mb-3 row align-items-center">
            <label htmlFor="picture" className="form-label col-sm-3">Upload Picture</label>
            <div className="col-sm-9">
              <input type="file" className="form-control" id="picture" name="picture" required />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
        <br />

        <h3>List of Actors</h3>
        {notification && (
          <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
            {notification.message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
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
          <tbody>
            {actors.map((actor, index) => (
              <tr key={index}>
                <td className="text-center no-column">{actor.no}</td>
                <td className="country-column">{actor.country}</td>
                <td className="actorName-column">{actor.actorName}</td>
                <td className="birthDate-column">{actor.birthDate}</td>
                <td className="text-center picture-column">
                  {actor.picture ? <img src={actor.picture} alt={actor.actorName} width="100" /> : 'No Image'}
                </td>
                <td className="text-center actions-column">
                  <button className="btn btn-edit" onClick={() => handleEditActor(index)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDeleteActor(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CMSActor;
