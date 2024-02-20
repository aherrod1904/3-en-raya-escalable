import Tablero from './tablero';
import './style.scss';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const buttonCreateTable = document.getElementById('createTable');
const inputDimensions = document.getElementById('dimension');
const resetButton = document.getElementById('resetGame');
const round = document.getElementById('rondas');
const clearButtons = document.querySelectorAll('.clearGameButton');
const preGame = document.querySelector('.preGame');
const inGame = document.querySelector('.inGame');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');


let tablero;
buttonCreateTable.addEventListener('click', (e) => {
  if (!inputDimensions.value) {
    Toastify({
      text: "Debe indicar una dimensión válida",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();

    inputDimensions.classList.add('error');
    inputDimensions.focus();
    return false;
  }
    if (!round.value) {
      Toastify({
        text: "Debe indicar un numero de rondas válidas",
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "red",
        },
        onClick: function(){} // Callback after click
      }).showToast();
  
      round.classList.add('error');
      round.focus();
      return false;
    }

  if (isNaN(inputDimensions.value)) {
    Toastify({
      text: "Debe introducir un número válido",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();

    inputDimensions.classList.add('error');
    inputDimensions.focus();
    return false;
  }

  if (isNaN(round.value)) {
    Toastify({
      text: "Debe introducir un número de rondas válido",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      onClick: function(){} // Callback after click
    }).showToast();

    round.classList.add('error');
    round.focus();
    return false;
  }

  let checkMachine = document.getElementById('machine');
  tablero = new Tablero(parseInt(inputDimensions.value),checkMachine.checked, parseInt(round.value));
  tablero.imprimir('tablero');

  preGame.classList.toggle('hide');
  inGame.classList.toggle('hide');
  
  img1.style.display = 'block';
  img2.style.display = 'block';
});

inputDimensions.addEventListener('keydown', () => {
  inputDimensions.classList.remove('error');
});

for (let button of clearButtons) {
  button.addEventListener('click', () => {
    tablero.limpiar();
  });
}



resetButton.addEventListener('click', (e) => {
  document.getElementById(tablero.elementID).innerHTML = '';
  document.getElementById('marcador').innerHTML = '';

  tablero = null;

  preGame.classList.toggle('hide');
  inGame.classList.toggle('hide');
  inputDimensions.value = '';
  inputDimensions.focus();
  round.value = '';
  round.focus();
  img1.style.display = 'none';
  img2.style.display = 'none';

  let mov = document.getElementById('movimientos');
  if (mov.hasChildNodes){
    while (mov.childNodes.length >=1){
      mov.removeChild(mov.firstChild)
    }
  }
});