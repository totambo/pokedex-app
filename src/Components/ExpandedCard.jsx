import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ExpandedCard.css";
import arrowLeftImage from "../Images/arrow-left.svg";
import arrowRightImage from "../Images/arrow-right.svg";
import Weight from "../Images/Weight.svg";
import Height from "../Images/Height.svg";
import { colorsByType } from "./Cards";

const ExpandedCard = () => {
  const { id } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [speciesDescription, setSpeciesDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemonDetails = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setPokemonDetails(data);
    };

    const getSpeciesDescription = async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      const data = await response.json();
      const flavorTextEntries = data.flavor_text_entries;
      const englishFlavorText = flavorTextEntries.find(
        (entry) => entry.language.name === "en"
      );
      if (englishFlavorText) {
        setSpeciesDescription(englishFlavorText.flavor_text);
      }
    };

    getPokemonDetails();
    getSpeciesDescription();
  }, [id]);

  if (!pokemonDetails) {
    return <div>Loading...</div>;
  }

  const { name, height, weight, types, sprites, stats, abilities } =
    pokemonDetails;

  const handlePreviousCard = () => {
    const previousId = parseInt(id, 10) - 1;
    navigate(`/pokemons/${previousId}`);
  };

  const handleNextCard = () => {
    const nextId = parseInt(id, 10) + 1;
    navigate(`/pokemons/${nextId}`);
  };

  const getTypeColor = (type) => {
    const typeData = colorsByType[type];
    if (typeData) {
      return {
        borderColor: typeData.borderColor,
        backgroundColor: typeData.backgroundColor,
        color: typeData.color,
      };
    }
    return {};
  };

  const abbreviateStatName = (name) => {
    switch (name) {
      case "hp":
        return "HP";
      case "attack":
        return "ATK";
      case "defense":
        return "DEF";
      case "special-attack":
        return "SATK";
      case "special-defense":
        return "SDEF";
      case "speed":
        return "SPD";
      default:
        return name;
    }
  };

  const convertWeightToKg = (weight) => {
    const weightInKg = weight / 10;
    return `${weightInKg} kg`;
  };

  const convertHeightToMeters = (height) => {
    const heightInMeters = height / 10;
    return `${heightInMeters} m`;
  };

  const cleanFlavorText = (flavorText) => {
    const regex = /[\n\f\v]+/g; // Expresión regular para filtrar caracteres especiales
    return flavorText.replace(regex, " ");
  };

  return (
    <div className="expandedCardContainer">
      <div
        className="expandedCard"
        style={{
          backgroundColor: getTypeColor(types[0].type.name).backgroundColor,
        }}
      >
        <div className="expandedCardHeader">
          <div>
            <Link to="/">
              <button className="closeButton">
                <img src={arrowLeftImage} alt="close modal" />
              </button>
            </Link>
            <h2>{name}</h2>
          </div>
          <p className="id">#{id}</p>
        </div>
        <div className="imagePosition">
          {id !== "1" && (
            <button
              className="navButton navButtonLeft"
              onClick={handlePreviousCard}
            >
              <img src={arrowLeftImage} alt="Previous" />
            </button>
          )}
          <img
            src={sprites.other.dream_world.front_default}
            alt={name}
            className="pokemonPhoto"
          />
          <button className="navButton navButtonRight" onClick={handleNextCard}>
            <img src={arrowRightImage} alt="Next" />
          </button>
        </div>
        <section className="infoContainer">
          <h3
            style={{
              color: getTypeColor(types[0].type.name).color,
            }}
          >
            About
          </h3>
          <div className="types">
            {types.map((type) => (
              <p
                key={type.type.name}
                style={{
                  backgroundColor: getTypeColor(type.type.name).backgroundColor,
                }}
              >
                {type.type.name}
              </p>
            ))}
          </div>
          <div className="specs">
            <div className="wheightDivs">
              <div className="weight">
                <img src={Weight} alt="" />
                <p>{convertWeightToKg(weight)}</p>
              </div>
              <p className="bold">Weight</p>
            </div>
            <div className="wheightDivs bordersSpecs">
              <div className="weight">
                <img src={Height} alt="" />
                <p>{convertHeightToMeters(height)}</p>
              </div>
              <p className="bold">Height</p>
            </div>
            <div className="movesDivs">
              {abilities.map((ability, index) => (
                <p key={index}>{ability.ability.name}</p>
              ))}
              <p className="bold">Moves</p>
            </div>
          </div>
          <p className="flavorText">{cleanFlavorText(speciesDescription)}</p>
          <h3
            style={{
              color: getTypeColor(types[0].type.name).color,
            }}
          >
            Base Stats
          </h3>
          <div className="stats">
            <ul>
              {stats.map((stat) => (
                <li key={stat.stat.name}>
                  <p>
                    <span
                      style={{
                        color: getTypeColor(types[0].type.name).color,
                      }}
                    >
                      {" "}
                      {abbreviateStatName(stat.stat.name)}
                    </span>{" "}
                    {stat.base_stat}
                  </p>
                  <div
                    key={stat.base_stat}
                    className="statBarFull"
                    style={{
                      backgroundColor: `${
                        getTypeColor(types[0].type.name).backgroundColor
                      }80`,
                    }}
                  >
                    <div
                      className="statBar"
                      style={{
                        width: `${stat.base_stat}%`,
                        maxWidth: "100%",
                        backgroundColor: getTypeColor(types[0].type.name)
                          .backgroundColor,
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExpandedCard;
