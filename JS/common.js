import { API_KEY } from "../secret.js";

const url = "https://api.rawg.io/api/games";
const allVideogames = [];

function showData(list) {
  const carrusel = document.getElementById("panel");
  let currentIndex = 0;
  let intervalId;

  // Función para mostrar el juego en el currentIndex
  function showCurrentGame() {
    carrusel.innerHTML = `
        <div class="item">
            <h2>${list[currentIndex].name}</h2>
            <div class="img-container">
                <img alt=${list[currentIndex].slug} src="${list[currentIndex].background_image}"/>
            </div>
            <div class="description">
                <div>
                    <h3>Lanzamiento</h3>
                    <h4>${list[currentIndex].released}</h4>
                </div>
                
                <div>
                    <h3>Valoración</h3>
                    <h4>${list[currentIndex].rating}</h4>
                </div>
            </div>
        </div>
    `;
  }

  // Funciones para los botones
  function showNext() {
    currentIndex = (currentIndex + 1) % list.length;
    showCurrentGame();
  }
  function showPrevious() {
    currentIndex = (currentIndex - 1 + list.length) % list.length;
    showCurrentGame();
  }

  // Función para avanzar automáticamente cada 5 segundos
  intervalId = setInterval(showNext, 5000);

  // Detener el avance automático cuando el cursor está sobre el div del carrusel
  carrusel.addEventListener("mouseover", () => clearInterval(intervalId));

  // Reanudar el avance automático cuando el cursor sale del div del carrusel
  carrusel.addEventListener("mouseout", () => {
    intervalId = setInterval(showNext, 5000);
  });

  // Mostrar el game ubicado en el currentIndex
  showCurrentGame();

  // Darle la acción de cambiar de juego en el carrusel a los botones
  document.getElementById("nextBtn").addEventListener("click", showNext);
  document.getElementById("prevBtn").addEventListener("click", showPrevious);
}

// Función para mostrar una "vista previa" mientras se hace la carga de los datos
function showLoadingView() {
  const carrusel = document.getElementById("panel");
  carrusel.innerHTML = `
        <div class="item">
            <h2>Cargando...</h2>
            <div class="img-container">
                <img alt="cargando" src='../assets/loading.jpg'/>
            </div>
            <div class="description">
                <div>
                    <h3>Lanzamiento</h3>
                    <h4>Cargando...</h4>
                </div>
        
                <div>
                    <h3>Valoración</h3>
                    <h4>Cargando...</h4>
                </div>
            </div>
        </div>
    `;
}

// Función asincrónica para traer los datos de los juegos de la API (100 en total)
async function fetchVideogames() {
  showLoadingView();

  for (let i = 1; i < 6; i++) {
    try {
      const response = await fetch(`${url}?key=${API_KEY}&page=${i}`);
      const data = await response.json();
      allVideogames.push(...data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const sortVideogames = allVideogames.sort((a, b) => b.rating - a.rating);
  const landingList = sortVideogames.slice(0, 5);

  showData(landingList);
}

// Llamamos a la Función fetchVideogames() para que se dispare todo
fetchVideogames();
