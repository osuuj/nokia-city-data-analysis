import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex justify-center">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-l-md focus:outline-none"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-md">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
