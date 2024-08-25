import React, { useState } from "react";
import ReusableForm from "./ReusableForm";
import ReusableTable from "./ReusableTable";

function Genres() {
  const [genres, setGenres] = useState([
    { no: 1, genre: "Romance" },
    { no: 2, genre: "Action" },
    { no: 3, genre: "Thriller" },
  ]);

  const handleAddGenre = (data) => {
    const newGenre = { no: genres.length + 1, genre: data.genre };
    setGenres([...genres, newGenre]);
  };

  const handleEditGenre = (index, newData) => {
    const updatedGenres = genres.map((item, idx) =>
      idx === index ? { ...item, genre: newData.genre } : item
    );
    setGenres(updatedGenres);
  };

  const handleDeleteGenre = (index) => {
    const updatedGenres = genres
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, no: idx + 1 }));
    setGenres(updatedGenres);
  };

  return (
    <div>
      <h3>Genres</h3>
      <ReusableForm
        fields={[{ name: "genre", label: "Genre" }]}
        onSubmit={handleAddGenre}
      />
      <ReusableTable
        data={genres}
        onEdit={handleEditGenre}
        onDelete={handleDeleteGenre}
      />
    </div>
  );
}

export default Genres;
