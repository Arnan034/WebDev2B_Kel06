import React, { useState, useEffect } from 'react';
import { Search } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';

const SearchAutocomplete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');
  const [actors, setActors] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]); // State untuk menyimpan aktor yang dipilih

  // Fetch data dari API
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
        setActors(options);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActor();
  }, []);

  const handleResultSelect = (e, { result }) => {
    // Cek apakah aktor sudah dipilih
    const isActorSelected = selectedActors.some(actor => actor.key === result.key);

    // Hanya tambahkan jika belum dipilih dan jumlah kurang dari 9
    if (!isActorSelected && selectedActors.length < 9) {
      setValue(''); // Reset value pencarian
      setSelectedActors(prevActors => [...prevActors, result]); // Tambahkan aktor yang dipilih ke array
    }
  };

  const handleSearchChange = (e, { value }) => {
    setValue(value);
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

      setResults(_.filter(actors, isMatch));
      setIsLoading(false);
    }, 300);
  };

  const handleCloseCard = (actorToRemove) => {
    setSelectedActors(prevActors => prevActors.filter(actor => actor.key !== actorToRemove.key)); // Hapus aktor dari array
  };

  return (
    <div style={{ maxWidth: '600px', position: 'relative' }}>
      <Search
        fluid
        input={{ icon: 'search', iconPosition: 'left', style: { width: '100%' } }}
        loading={isLoading}
        onResultSelect={handleResultSelect}
        onSearchChange={_.debounce(handleSearchChange, 500, { leading: true })}
        results={results.slice(0, 5)}
        value={value}
        resultRenderer={({ title, image }) => (
          <div className='auto-cmplt-actor-search-cms'>
            <img src={image} alt={title}/>
            <span>{title}</span>
          </div>
        )}
      />
      {selectedActors.map((actor) => (
        <div key={actor.key} className="card-actor-cms">
          <button className="close-btn" onClick={() => handleCloseCard(actor)}>
            &times;
          </button>
          <img src={actor.image} alt={`${actor.title}`} />
          <h4>{actor.title}</h4>
          <div className="info-actor-cms">
            <p> <span>{actor.country}, {actor.birthdate}</span></p>
            <div className="input-actor-cms-group">
              <label htmlFor={`cast-${actor.key}`}>Cast:</label>
              <input type="text" id={`cast-${actor.key}`} placeholder="Enter cast name..." required />
            </div>
          </div>
        </div>
      ))}
      {selectedActors.length >= 9 && <p>You can only select up to 9 actors.</p>}
    </div>
  );
};

export default SearchAutocomplete;
