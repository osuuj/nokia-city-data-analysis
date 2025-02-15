import React, { useState } from "react";
import Header from "../components/Header";
import Map from "../components/Map";
import SearchForm from "../components/SearchForm";

const Home = () => {
  const [companies, setCompanies] = useState([]);

  const handleSearch = (city) => {
    console.log("Searching for companies in:", city);
    setCompanies([{ name: "Example Co", lat: 60.1695, lng: 24.9354 }]);
  };

  return (
    <div>
      <Header />
      <SearchForm onSearch={handleSearch} />
      <Map companies={companies} />
    </div>
  );
};

export default Home;
