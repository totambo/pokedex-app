import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Cards.css";

// Definición de colores por tipo
export const colorsByType = {
  normal: { borderColor: "#AAA67F", backgroundColor: "#AAA67F", color: "#AAA67F" },
  fighting: { borderColor: "#C12239", backgroundColor: "#C12239", color: "#C12239" },
  flying: { borderColor: "#A891EC", backgroundColor: "#A891EC", color: "#A891EC" },
  poison: { borderColor: "#A43E9E", backgroundColor: "#A43E9E", color: "#A43E9E" },
  ground: { borderColor: "#DEC16B", backgroundColor: "#DEC16B", color: "#DEC16B" },
  rock: { borderColor: "#B69E31", backgroundColor: "#B69E31", color: "#B69E31" },
  bug: { borderColor: "#A7B723", backgroundColor: "#A7B723", color: "#A7B723" },
  ghost: { borderColor: "#70559B", backgroundColor: "#70559B", color: "#70559B" },
  steel: { borderColor: "#B7B9D0", backgroundColor: "#B7B9D0", color: "#B7B9D0" },
  fire: { borderColor: "#F57D31", backgroundColor: "#F57D31", color: "#F57D31" },
  water: { borderColor: "#6493EB", backgroundColor: "#6493EB", color: "#6493EB" },
  grass: { borderColor: "#74CB48", backgroundColor: "#74CB48", color: "#74CB48" },
  electric: { borderColor: "#F9CF30", backgroundColor: "#F9CF30", color: "#F9CF30" },
  psychic: { borderColor: "#F85888", backgroundColor: "#FA92B2", color: "#F85888" },
  ice: { borderColor: "#9AD6DF", backgroundColor: "#9AD6DF", color: "#9AD6DF" },
  dragon: { borderColor: "#7037FF", backgroundColor: "#7037FF", color: "#7037FF" },
  dark: { borderColor: "#75574C", backgroundColor: "#75574C", color: "#75574C" },
  fairy: { borderColor: "#E69EAC", backgroundColor: "#E69EAC", color: "#E69EAC" },
  unknown: { borderColor: "#68A090", backgroundColor: "#68A090", color: "#68A090" },
  shadow: { borderColor: "#444444", backgroundColor: "#444444", color: "#444444" },
};

function Cards({ filterValue, sortBy }) {
  const [pokemones, setPokemones] = useState([]); // Estado para almacenar los pokemones
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar si está cargando
  const [hasMore, setHasMore] = useState(true); // Estado para controlar si hay más pokemones para cargar
  const [offset, setOffset] = useState(0); // Estado para almacenar el desplazamiento actual
  const containerRef = useRef(null); // Referencia al contenedor de los pokemones

  // Función para obtener los pokemones de la API
  const fetchPokemones = async (offset) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=30&offset=${offset}`
    );
    const listaPokemones = await response.json();
    const { results, count } = listaPokemones;

    const newPokemones = await Promise.all(
      results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const poke = await response.json();

        return {
          id: poke.id,
          name: poke.name,
          img: poke.sprites.other.dream_world.front_default,
          url: pokemon.url,
          type: poke.types[0].type.name,
        };
      })
    );

    return {
      pokemones: newPokemones,
      count,
    };
  };

   // Función para cargar más pokemones
  const loadMorePokemones = async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      const newOffset = offset + 30;
      const { pokemones, count } = await fetchPokemones(newOffset);
      if (pokemones.length > 0) {
        setPokemones((prevPokemones) => [...prevPokemones, ...pokemones]);
        setOffset(newOffset);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }
  };

  // Función para obtener los primeros pokemones al cargar el componente
  useEffect(() => {
    const getPokemones = async () => {
      const { pokemones, count } = await fetchPokemones(0);
      setPokemones(pokemones);
      setOffset(30);
      setHasMore(count > 30);
    };

    getPokemones();
  }, []);

  // Función para manejar el evento de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        loadMorePokemones();
      }
    };
  
    window.addEventListener("scroll", handleScroll); // Agrega el event listener al evento de scroll
    return () => {
      window.removeEventListener("scroll", handleScroll); // Remueve el event listener al desmontar el componente
    };
  }, [isLoading, hasMore]);    

  // Filtrar los pokemones y eliminar duplicados
  const filteredPokemones = pokemones
    .filter((pokemon) => pokemon.name.toLowerCase().includes(filterValue.toLowerCase()))
    .reduce((uniquePokemones, pokemon) => {
      if (!uniquePokemones.some((uniquePokemon) => uniquePokemon.id === pokemon.id)) {
        uniquePokemones.push(pokemon);
      }
      return uniquePokemones;
    }, []);

    // Ordenar los pokemones según el criterio de clasificación
    const sortedPokemones = filteredPokemones.slice().sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "id") {
        return a.id - b.id;
      } else {
        return 0;
      }
    });

  return (
    <div className="cardsContainer" style={{ borderColor: "#000000" }} ref={containerRef}>
      {sortedPokemones.map((pokemon) => {
        const { borderColor, backgroundColor, color } =
          colorsByType[pokemon.type] || {};

        return (
          <Link
            key={pokemon.id}
            to={`/pokemons/${pokemon.id}`}
            className="pokemonCards"
            style={{ borderColor }}
          >
            <h2 style={{ color }}>#{pokemon.id}</h2>
            <img src={pokemon.img} alt={pokemon.name} />
            <h1 style={{ backgroundColor }}>{pokemon.name}</h1>
          </Link>
        );
      })}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !hasMore && <div>No hay más pokémones para cargar</div>}
    </div>
  );
}

export default Cards;
