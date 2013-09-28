var Punto = function (x, y) {
	this.x = x;
	this.y = y;
}

var Trazo = function (puntos, color) {
	this.puntos = (puntos) ? puntos : [];
	this.color = color || null;
} 

Trazo.prototype = {
	agregarPunto: function (punto) {
		this.puntos.push(punto);
	}
}

var Pizarra = function (config) {
	this.id = config.id || 'pizarra';
}

Pizarra.prototype = {
	id: 'pizarra',
	
	elemento: null,

	contexto: null,

	dibujando: false,

	colorLapiz: '#FFFFFF',

	colorPizarra: '#000000',

	trazos: [],

	render: function () {
		this.elemento = document.getElementById(this.id);

		// valida que exista el elemento y su contexto canvas
		if(this.elemento && this.elemento.getContext) {

			// inicia el canvas
			this.contexto = this.elemento.getContext('2d');

			// dibuja el rectangulo 
			this.dibujaRectanguloInicial();

			// asigna el eventos al mouse
			this.elemento.addEventListener('mousedown', function(evt) {
				this.click(evt);
			}.bind(this), false);
			this.elemento.addEventListener('mousemove', function(evt) {
				this.dibujarLienzo(evt);
			}.bind(this), false);
			this.elemento.addEventListener('mouseup', function(evt) {
				this.dejarDeDibujar();
			}.bind(this), false);
		} else {
			this.elemento.innerHTML = "Su navegador no es compatible con CANVAS";
		}
	},

	click: function (evt) {
		this.dibujando = true;
		var punto = new Punto(evt.clientX, evt.clientY);
		this.iniciarTrazo(punto);
		this.trazos.push(new Trazo([punto], this.colorLapiz));
	},

	dejarDeDibujar: function () {
		this.contexto.closePath();
		this.dibujando = false;
	},

	dibujarLienzo: function (evt) {
		var punto;
		if(this.dibujando) {
			punto = new Punto(evt.clientX, evt.clientY);
			this.dibujarTrazo(punto);
			this.trazos[this.trazos.length - 1].agregarPunto(punto);
		}
	},

	setColorLapiz: function (color) {
		this.colorLapiz = color;
	},

	limpiarPizarra: function () {
        this.elemento.width = this.elemento.width;
        this.dibujaRectanguloInicial();
        this.trazos = [];
	},

	dibujaRectanguloInicial: function () {
		var width = this.elemento.width || 300,
			height = this.elemento.height || 300;
		this.contexto.fillStyle = this.colorPizarra;
		this.contexto.fillRect(0, 0, width, height);
	},

	iniciarTrazo: function (punto) {
		this.contexto.beginPath();
		this.contexto.moveTo(punto.x - this.elemento.offsetLeft, 
			punto.y - this.elemento.offsetTop);
	},

	dibujarTrazo: function (punto) {
		if(punto) {
			this.contexto.strokeStyle = this.colorLapiz;
			this.contexto.lineTo(punto.x - this.elemento.offsetLeft, 
				punto.y - this.elemento.offsetTop);
			this.contexto.stroke();
		}
	},

	reproducirTrazo: function (trazo) {
		var puntos = trazo.puntos,
			length = puntos.length;

		// inicia el trazo
		this.colorLapiz = trazo.color;
		this.iniciarTrazo(puntos[0]);

		// dibuja los puntos intermedios
		for(var i = 1; i < length; i++) {
			this.dibujarTrazo(puntos[i]);
		}
		this.dejarDeDibujar();
	},

	exportarTrazos: function () {
		return JSON.stringify(this.trazos);
	},
    
    guardarDibujo: function () {
        if(localStorage) {
            localStorage.setItem(this.id, this.exportarTrazos(this.trazos));
        }
    },
    
    cargarDibujoGuardado: function () {
        var auxTrazos = JSON.parse(localStorage.getItem(this.id)),
        	auxColor = this.colorLapiz;
        if(auxTrazos) {
            this.limpiarPizarra();
            this.trazos = auxTrazos;
            
            // reproducior trazos
            for(var i = 0; i < this.trazos.length; i++) {
                this.reproducirTrazo(this.trazos[i]);
            }

            // devuelve el color del lapiz seleccionado
            this.setColorLapiz(auxColor);
        }
    },
    
    existeDibujoGuardado: function () {
        return localStorage[this.id];
    }
}