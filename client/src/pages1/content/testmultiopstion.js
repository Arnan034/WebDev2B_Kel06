import React, { useState } from 'react';
import Select from 'react-select';

const SearchWithMultiSelectDropdown = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "Fruit", label: "Fruit" },
    { value: "Vegetable", label: "Vege" },
    { value: "Clothes", label: "Baju" },
    { value: "Jeans", label: "Celana" },
    { value: "Chair", label: "Kursi" },
    { value: "Bag", label: "Tas" },
  ];

  const MAX_SELECTION = 5;

  const handleSelectChange = (selected) => {
    if (selected.length <= MAX_SELECTION) {
      setSelectedOptions(selected);
    } else {
      alert(`You can only select up to ${MAX_SELECTION} options.`);
    }
  };

  return (
    <div>
      <h1>Search with Multi-Select Dropdown (Max 5)</h1>

      {/* Dropdown Multi-Select */}
      <Select
        isMulti
        value={selectedOptions}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select categories"
      />
    </div>
  );
};

export default SearchWithMultiSelectDropdown;
