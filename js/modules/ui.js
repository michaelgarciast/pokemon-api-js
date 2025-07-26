/**
 * Creates a modal with detailed Pokemon information
 */
const createPokemonModal = async (
  formattedId,
  primaryType,
  name,
  height,
  weight,
  stats,
  pokemonId,
  typeIconsHtml
) => {
  try {
    // Fetch Pokemon species data for description
    const response = await fetch(API.species + pokemonId);
    const speciesData = await response.json();
    
    // Get description (with fallback if index 26 doesn't exist)
    const descriptionEntries = speciesData.flavor_text_entries;
    const description = descriptionEntries[26]?.flavor_text || 
                       (descriptionEntries.find(entry => entry.language.name === 'es')?.flavor_text || 
                        'No hay descripción disponible');
    
    // Create modal HTML
    const modalHtml = `
      <div class="modal fade" id="exampleModalCenter${formattedId}" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content ${primaryType}">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenterTitle">#${formattedId}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="modal__info col-12 col-md-6">
                  <h1 class="modal__name">${name}</h1>
                  <div class="modal__pokemon col-12">
                    <img src="${IMAGES.full + formattedId}.png" alt="${name}">
                  </div>
                  <div class="modal__type">
                    ${typeIconsHtml}
                  </div>
                  <div class="modal__features col-12">
                    <p>${height}m</p>
                    <p>${weight}kg</p>
                  </div>
                  <div class="modal__description col-12">
                    <p>${description}</p>
                  </div>
                </div>
                <div class="modal__graphic col-12 col-md-6">
                  <h1>Habilidades</h1>
                  <div id="chartContainer${formattedId}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to DOM
    elements.mainContainer.insertAdjacentHTML('beforeend', modalHtml);
    
    // Create chart for Pokemon stats
    const chart = new CanvasJS.Chart('chartContainer' + formattedId, {
      animationEnabled: true,
      theme: 'light1',
      backgroundColor: 'transparent',
      axisY: { title: '' },
      data: [{
        type: 'column',
        showInLegend: false,
        legendMarkerColor: 'black',
        dataPoints: [
          { y: stats[0].base_stat, label: 'Velocidad' },
          { y: stats[3].base_stat, label: 'Defensa' },
          { y: stats[4].base_stat, label: 'Ataque' },
          { y: stats[5].base_stat, label: 'Puntos de vida' }
        ]
      }]
    });
    
    chart.render();
  } catch (error) {
    console.error('Error creating Pokemon modal:', error);
    showError('Error al cargar los detalles del Pokémon');
  }
};

/**
 * Creates a Pokemon card and adds it to the main container
 */
const createPokemonCard = (pokemonData) => {
  const { id, height, weight, name, stats, types } = pokemonData;
  
  // Format data
  const formattedId = formatPokemonId(id);
  const heightInMeters = height / 10;
  const weightInKg = weight / 10;
  const valueSelect = elements.typeSelect.value;
  
  // Determine Pokemon type for styling
  let primaryType = types.length > 1 ? types[1].type.name : types[0].type.name;
  
  // Generate type icons HTML
  let typeIconsHtml = '';
  if (types.length < 2) {
    typeIconsHtml = `<div class="type__pokemon"><img class="${types[0].type.name}" src="./assets/images/icon/${types[0].type.name}.svg" alt=""></div>`;
  } else {
    typeIconsHtml = `
      <div class="type__pokemon"><img class="${types[1].type.name}" src="./assets/images/icon/${types[1].type.name}.svg" alt=""></div>
      <div class="type__pokemon"><img class="${types[0].type.name}" src="./assets/images/icon/${types[0].type.name}.svg" alt=""></div>
    `;
  }
  
  // Create card HTML
  const cardHtml = `
    <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
      <div class="card h-100">
        <img src="${IMAGES.detail + formattedId}.png" class="card__img" alt="${name}">
        <div class="card__circle"></div>
        <div class="card-body ${primaryType}" id='${valueSelect}'>
          <h5>#${formattedId}</h5>
          <h1 class="card-title">${name}</h1>
          <div class="card__type">
            ${typeIconsHtml}
          </div>
          <button type="button" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#exampleModalCenter${formattedId}">Ver Gráfica</button>
        </div>
      </div>
    </div>
  `;
  
  // Add card to DOM
  elements.mainContainer.insertAdjacentHTML('beforeend', cardHtml);
  
  // Create modal for this Pokemon
  createPokemonModal(
    formattedId,
    primaryType,
    name,
    heightInMeters,
    weightInKg,
    stats,
    id,
    typeIconsHtml
  );
  
  // Setup error handling for images
  setupImageErrorHandling();
};
