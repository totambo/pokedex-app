import React, { useEffect, useState } from "react";
import "./Header.css";
import arrowImage from "../Images/Arrow.svg";
import pokeballImage from "../Images/Pokeball.png";

const Header = ({ handleSortChange, handleInputChange }) => {
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const handleInputOnChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    handleInputChange(value);
  };

  const handleSortClick = () => {
    setSortBy((prevSortBy) => {
      if (prevSortBy === "name") {
        return "id";
      } else {
        return "name";
      }
    });
    handleSortChange();
  };

  const getSortButtonText = () => {
    return sortBy === "name" ? "#" : <span>AZ</span>;
  };

  useEffect(() => {
    handleSortChange();
  }, []);

  return (
    <header>
      <nav>
        <div className="headNav">
          <div className="logo">
            <img
              src={pokeballImage}
              width="50px"
              height="50px"
              alt="pokeball"
            />
            <h1>Pokedex</h1>
            <button onClick={handleSortClick}>
            {getSortButtonText()} <img src={arrowImage} alt="arrow" />
          </button>
          </div>
        </div>
        <input
          type="text"
          value={filterValue}
          onChange={handleInputOnChange}
          placeholder="Search"
        />
      </nav>
    </header>
  );
};

export default Header;
