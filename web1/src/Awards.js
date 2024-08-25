import React, { useState } from "react";
import ReusableForm from "./ReusableForm";
import ReusableTable from "./ReusableTable";

function Awards() {
  const [awards, setAwards] = useState([
    { no: 1, country: "South Korea", year: 2022, award: "Best Drama" },
    { no: 2, country: "Japan", year: 2021, award: "Best Actor" },
    { no: 3, country: "China", year: 2023, award: "Best Director" },
  ]);

  const handleAddAward = (data) => {
    const newAward = { 
      no: awards.length ? awards[awards.length - 1].no + 1 : 1, 
      ...data 
    };
    setAwards([...awards, newAward]);
  };

  const handleEditAward = (index, newData) => {
    const updatedAwards = awards.map((item, idx) =>
      idx === index ? { ...item, ...newData } : item
    );
    setAwards(updatedAwards);
  };

  const handleDeleteAward = (index) => {
    const updatedAwards = awards
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, no: idx + 1 }));
    setAwards(updatedAwards);
  };

  return (
    <div>
      <h3>Awards</h3>
      <ReusableForm
        fields={[
          { name: "country", label: "Country" },
          { name: "year", label: "Year" },
          { name: "award", label: "Award" },
        ]}
        onSubmit={handleAddAward}
      />
      <ReusableTable
        data={awards}
        onEdit={handleEditAward}
        onDelete={handleDeleteAward}
      />
    </div>
  );
}

export default Awards;
