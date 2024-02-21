import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Marcador from './marcador';

class Tablero {
  #casillas;  // Este será el array de arrays donde guardaremos lo que hay en cada posición
  #dimension; // Esta variable determinará el tamaño del tablero
  #turno;     // En esta variable queda guardo a quien le toca, toma valores: X o O
  #elementID;
  #marcador;
  #round;
  #versusMachine;
  #endGame = false;

  constructor(dimension = 3, versusMachine=false, round = 1) {
    this.#casillas = new Array();
    this.#dimension = dimension;
    this.#versusMachine = versusMachine;
    for (let i = 0; i <this.#dimension; i++){
      this.#casillas[i] = new Array();
      for (let j = 0; j < this.#dimension; j++) {
        this.#casillas[i][j] = null;
      }
    }
    this.#turno = 'X';
    this.#marcador = new Marcador();
    this.#round = round;
  }

  imprimir(elementId='tablero') {
    
    let tablero = document.getElementById(elementId);
    this.#elementID = elementId;
    tablero.innerHTML = '';
    
    for (let fila = 0; fila < this.#dimension; fila++){
      for (let columna = 0; columna < this.#dimension; columna++){
        let casilla = document.createElement('div');
        casilla.dataset.fila = fila;
        casilla.dataset.columna = columna;
        casilla.dataset.libre = '';
        if (this.#casillas[fila][columna]) {
          casilla.textContent = this.#casillas[fila][columna];
          casilla.dataset.libre = this.#casillas[fila][columna];
        }
        tablero.appendChild(casilla);
        this.addEventClick(casilla);
      }
    }
    tablero.style.gridTemplateColumns = `repeat(${this.#dimension}, 1fr)`;
  }
  isFree(fila, columna) {
    return true ? this.#casillas[fila][columna] === null : false;
  }

  setCasilla(fila, columna, valor) {
    if (this.isFree(fila, columna)) {
      this.#casillas[fila][columna] = valor;
      return true;
    }
    return false;
  }

  getCasilla(fila, columna) {
    return this.#casillas[fila][columna];
  }

  toogleTurno() {
    if (this.#endGame) return false;
    

    if (this.#turno === 'X') {
      this.#turno = 'O';
      //Comprobamos si jugamos contra la máquina
      if (this.#versusMachine) {
        setTimeout(() => {
        let posicionLibre = this.getCasillaFreeRandom();
        this.setCasilla(posicionLibre.i, posicionLibre.j, 'O');
        let mov = document.getElementById('movimientos');
        let movp = document.createElement('p');
        movp.setAttribute('id', 'primero')
        let filas = parseInt(posicionLibre.i) + 1;
        let columnas = parseInt(posicionLibre.j) + 1;
        movp.innerHTML = `el jugador ${this.#turno} a marcado la casilla ${filas}/${columnas}`;
        
        if (!mov.hasChildNodes){
          mov.appendChild(movp);
        }else{
          let child = document.getElementById('primero');
          mov.insertBefore(movp, child);
        }
        
        this.imprimir();
        this.comprobarResultados();
        if (this.#endGame) return false;
        this.toogleTurno();
        },500);
      }

    } else {
      this.#turno = 'X';
    }

  }

  comprobarResultados() {
    // Comprobamos filas
    let fila;
    let columna;
    let ganado = false;
    for (fila = 0; fila < this.#dimension && !ganado; fila++){
      let seguidas = 0;
      for (columna = 0; columna < this.#dimension; columna++){
        if (columna !== 0) {
          if (this.getCasilla(fila, columna) === this.getCasilla(fila, columna - 1)) {
            if (this.getCasilla(fila, columna) !== null) {
              seguidas++;
            }
          }
        }
      }
      if (seguidas === this.#dimension - 1) {
        console.log('Linea');
        ganado = true;
      }
    }

    // Comprobar columnas
    for (columna = 0; columna < this.#dimension && !ganado; columna++){
      let seguidas = 0;
      for (fila = 0; fila < this.#dimension; fila++){
        if (fila !== 0) {
          if (this.getCasilla(fila, columna) === this.getCasilla(fila-1, columna)) {
            if (this.getCasilla(fila, columna) !== null) {
              seguidas++;
            }
          }
        }
      }
      if (seguidas === this.#dimension - 1) {
        console.log('Columna');
        ganado = true;
      }
    }

    // Diagonal de izq a derecha
    let seguidas = 0;
    for (let i = 0; i < this.#dimension; i++){
      if (i !== 0) {
        if ((this.getCasilla(i, i) === this.getCasilla(i - 1, i - 1)) && this.getCasilla(i,i) !== null) {
          seguidas++;
        }
      }
    }

    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de izq a derecha');
      ganado = true;
    }

    // Diagonal de izq a derecha
    seguidas = 0;
    for (let i = this.#dimension-1; i >= 0; i--){
      if (i !== this.#dimension - 1) {
        let j = this.#dimension - 1 - i;
        if ((this.getCasilla(i, j) === this.getCasilla(i + 1, j - 1)) && this.getCasilla(i,j) !== null) {
          seguidas++;
        }
      }
    }

    if (seguidas === this.#dimension - 1) {
      console.log('Diagonal de derecha a izquierda');
      ganado = true;
    }


    if (ganado) {
      this.#endGame = true;
      let libres = document.querySelectorAll('div[data-libre=""]');
      libres.forEach((casillaLibre) => {
        casillaLibre.dataset.libre = '-';
      });
      
      this.#marcador.addPuntos(this.#turno);
      if (this.#round > 1){
      Toastify({
        text: `El jugador ${this.#turno} ha ganado esta ronda`,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "green",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      
        document.querySelector('.clearGame').classList.toggle('show');
      }else{
        document.getElementById('limp').style.display = "none";
        let gana = document.getElementById('ganadorf');
        gana.style.display = "flex";
        gana.style.animation = "ease-in 2s linear";
        gana.innerHTML = `${this.#marcador.ganadorFin()}`;
        
      }
      this.#round--;
      
      
    } else {
      // Si no se ha ganado hay que comprobar si el tablero está petao, si es así son tablas
      if (this.isFull()) {
        this.#endGame = true;
        if (this.#round > 1){
          Toastify({
            text: `Esta ronda han sido tablas`,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "green",
            },
            onClick: function(){} // Callback after click
          }).showToast();
          document.querySelector('.clearGame').classList.toggle('show');

        }else{
          document.getElementById('limp').style.display = "none";
          let gana = document.getElementById('ganadorf');
          gana.style.display = "flex";
          gana.style.animation = "ease-in 2s linear";
          gana.innerHTML = `${this.#marcador.ganadorFin()}`;
        }
        this.#round--;
      }

  }
}


  isFull() {
    return !this.#casillas.some(fila => fila.some(casilla => casilla === null));
  }

  addEventClick(casilla) {
    casilla.addEventListener('click', (e) => {
      let casillaSeleccionada = e.currentTarget;
      if (casillaSeleccionada.dataset.libre === '') {
        casillaSeleccionada.textContent = this.#turno;
        this.setCasilla(
          casillaSeleccionada.dataset.fila,
          casillaSeleccionada.dataset.columna,
          this.#turno
        )
        casillaSeleccionada.dataset.libre = this.#turno;

        let mov = document.getElementById('movimientos');
        let movp = document.createElement('p');
        mov.style.display = 'flex';
        let filas = parseInt(casillaSeleccionada.dataset.fila) + 1;
        let columnas = parseInt(casillaSeleccionada.dataset.columna) + 1;
        movp.setAttribute('id', 'primero')
        movp.innerHTML = `el jugador ${this.#turno} a marcado la casilla ${filas}/${columnas}`;
        setTimeout(() => {
          if (!mov.hasChildNodes){
            mov.appendChild(movp);
          }else{
            let child = document.getElementById('primero');
            mov.insertBefore(movp, child);
          }
        }, 200);
        this.comprobarResultados();
        this.toogleTurno();

      }
    });

    casilla.addEventListener('mouseover', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = this.#turno;
      }
    });

    casilla.addEventListener('mouseleave', (e) => {
      if (e.currentTarget.dataset.libre === '') {
        e.currentTarget.textContent = '';
      }
    })
  }

  get dimension() {
    return this.#dimension;
  }

  get elementID() {
    return this.#elementID;
  }

  limpiar() {
    this.#casillas = this.#casillas.map(casilla => casilla.map(c => null));
    this.#endGame = false;
    this.imprimir();
    document.querySelector('.clearGame').classList.toggle('show');
  }

  getCasillaFreeRandom() {
    let i, j;
    do {
      i = Math.floor(Math.random() * (this.#dimension));
      j = Math.floor(Math.random() * (this.#dimension));
    } while (!this.isFree(i, j))
    return {
      i: i,
      j: j
    }
  }
  
}

export default Tablero;
