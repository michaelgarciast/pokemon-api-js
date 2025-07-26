// Wait for the document to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
  // Global state
  let nextPageUrl = null;

  // Function to fetch Pokemon data
  const fetchPokemonData = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      nextPageUrl = data.next;
      
      // Clear the container if it's a new search
      if (!url.includes('offset')) {
        elements.mainContainer.innerHTML = '';
      }
      
      // Create cards for each Pokemon
      for (const pokemon of data.results) {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        createPokemonCard(pokemonData);
      }
      
      // Update navigation buttons
      elements.navNext.style.display = nextPageUrl ? 'flex' : 'none';
      elements.navBack.style.display = 'none';
      elements.message.textContent = '';
      
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      showError('Error al cargar los Pokémon');
    }
  };

  // Function to search Pokemon by type
  const searchByType = async (type) => {
    try {
      const response = await fetch(API.types + type);
      const data = await response.json();
      
      elements.mainContainer.innerHTML = '';
      elements.navNext.style.display = 'none';
      elements.navBack.style.display = 'flex';
      elements.message.textContent = `${data.pokemon.length} pokemones encontrados`;
      
      // Limit to first 20 Pokemon for performance
      const pokemonToShow = data.pokemon.slice(0, 20);
      
      for (const pokemon of pokemonToShow) {
        const pokemonResponse = await fetch(pokemon.pokemon.url);
        const pokemonData = await pokemonResponse.json();
        createPokemonCard(pokemonData);
      }
      
    } catch (error) {
      console.error('Error searching by type:', error);
      showError('Error al buscar por tipo');
    }
  };

  // Function to search Pokemon by ID or name
  const searchById = async (query) => {
    try {
      const response = await fetch(API.pokemons + query.toLowerCase());
      const data = await response.json();
      
      elements.mainContainer.innerHTML = '';
      elements.navNext.style.display = 'none';
      elements.navBack.style.display = 'flex';
      elements.message.textContent = '';
      
      createPokemonCard(data);
      
    } catch (error) {
      console.error('Error searching by ID/name:', error);
      showError('Pokemon no encontrado');
    }
  };

  // Event Listeners
  elements.navNext.addEventListener('click', () => {
    if (nextPageUrl) fetchPokemonData(nextPageUrl);
  });

  elements.navBack.addEventListener('click', () => {
    elements.mainContainer.innerHTML = '';
    fetchPokemonData(API.pokemons);
  });

  // Búsqueda por ID o nombre
  document.querySelector('#search__button').addEventListener('click', () => {
    const searchValue = elements.searchInput.value.trim();
    if (searchValue) {
      searchById(searchValue);
    }
  });

  elements.searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && elements.searchInput.value.trim()) {
      searchById(elements.searchInput.value.trim());
    }
  });

  // Búsqueda por tipo
  document.querySelector('#search__button-type').addEventListener('click', () => {
    const selectedType = elements.typeSelect.value;
    if (selectedType !== 'Tipo de pokemon') {
      searchByType(selectedType);
    }
  });

  elements.typeSelect.addEventListener('change', () => {
    const selectedType = elements.typeSelect.value;
    if (selectedType !== 'Tipo de pokemon') {
      searchByType(selectedType);
    }
  });

  // Initialize
  resetInputs();
  fetchPokemonData(API.pokemons);
});
