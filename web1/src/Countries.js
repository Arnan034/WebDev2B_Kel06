import React, { useState } from "react";
import ReusableForm from "./ReusableForm";
import ReusableTable from "./ReusableTable";

function Countries() {
  const [countries, setCountries] = useState([
    { no: 1, country: "Indonesia" },
    { no: 2, country: "Japan" },
    { no: 3, country: "South Korea" },
  ]);

  const handleAddCountry = (data) => {
    const newCountry = { 
      no: countries.length ? countries[countries.length - 1].no + 1 : 1, 
      ...data 
    };
    setCountries([...countries, newCountry]);
  };

  const handleEditCountry = (index, newData) => {
    const updatedCountries = countries.map((item, idx) =>
      idx === index ? { ...item, country: newData.country } : item
    );
    setCountries(updatedCountries);
  };

  const handleDeleteCountry = (index) => {
    const updatedCountries = countries
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, no: idx + 1 }));
    setCountries(updatedCountries);
  };

  return (
    <div>
      <h3>Countries</h3>
      <ReusableForm
        fields={[{ name: "country", label: "Country Name" }]}
        onSubmit={handleAddCountry}
      />
      <ReusableTable
        data={countries}
        onEdit={handleEditCountry}
        onDelete={handleDeleteCountry}
      />
    </div>
  );
}

export default Countries;
