/**
 * Displays an error message in the main container
 * @param {string} text - Error message to display
 */
const showError = (text) => {
  elements.mainContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>    
      ${text}
    </div>
  `;
};

/**
 * Formats a Pokemon ID to ensure it's 3 digits with leading zeros if needed
 * @param {number|string} id - The Pokemon ID to format
 * @returns {string} - Formatted ID with leading zeros if needed
 */
const formatPokemonId = (id) => {
  id = id.toString();
  if (id.length === 1) return `00${id}`;
  if (id.length === 2) return `0${id}`;
  return id;
};

/**
 * Sets up error handling for Pokemon images
 */
const setupImageErrorHandling = () => {
  document.querySelectorAll('.card img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = './assets/images/nofound.png';
    });
  });
};

/**
 * Sets up event listeners to reset input fields
 */
const resetInputs = () => {
  // Reset event listeners for clearing inputs
  document.querySelectorAll('.header__logo, #navegation__back, #search__button').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector('select').value = 'Tipo de pokemon';
    });
  });
  
  document.querySelectorAll('.header__logo, #navegation__back, #search__button-type').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector('input').value = '';
    });
  });
};
