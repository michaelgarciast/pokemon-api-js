// API endpoints
const API = {
  pokemons: 'https://pokeapi.co/api/v2/pokemon/',
  types: 'https://pokeapi.co/api/v2/type/',
  species: 'https://pokeapi.co/api/v2/pokemon-species/'
};

// Image URLs
const IMAGES = {
  detail: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/',
  full: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'
};

// DOM elements - Inicializar después de que el DOM esté completamente cargado
let elements;

// Cargar tipos de Pokémon
const loadPokemonTypes = async () => {
  try {
    const response = await fetch(API.types);
    const data = await response.json();
    
    // Agregar cada tipo como opción en el select
    data.results.forEach(type => {
      const option = document.createElement('option');
      option.value = type.name;
      option.textContent = type.name;
      elements.typeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading Pokemon types:', error);
  }
};

// Inicializar elementos DOM cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  elements = {
    navNext: document.querySelector('#navegation__next'),
    navBack: document.querySelector('#navegation__back'),
    message: document.querySelector('.text'),
    mainContainer: document.querySelector('.main'),
    searchInput: document.querySelector('#idPokemon'),
    typeSelect: document.querySelector('#search__select')
  };
  
  // Cargar tipos de Pokémon después de inicializar los elementos
  loadPokemonTypes();
});
