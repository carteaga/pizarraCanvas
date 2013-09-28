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
				this.dejarDeDibujar(evt);
			}.bind(this), false);
		} else {
			this.elemento.innerHTML = "Su navegador no es compatible con CANVAS";
		}
	},

	click: function (evt) {
		this.dibujando = true;
		this.contexto.beginPath();
		this.contexto.moveTo(evt.clientX - pizarra.elemento.offsetLeft, 
			evt.clientY - pizarra.elemento.offsetTop);
	},

	dejarDeDibujar: function (evt) {
		this.contexto.closePath();
		this.dibujando = false;
	},

	dibujarLienzo: function (evt) {
		
		// verifica si hizo clic
		if(this.dibujando) {
			this.contexto.strokeStyle = this.colorLapiz;
			this.contexto.lineTo(evt.clientX - pizarra.elemento.offsetLeft, 
				evt.clientY - pizarra.elemento.offsetTop);
			this.contexto.stroke();
		}
	},

	setColorLapiz: function (color) {
		this.colorLapiz = color;
	},

	limpiarPizarra: function () {
		this.dibujaRectanguloInicial();
	},

	dibujaRectanguloInicial: function () {
		var width = this.elemento.width || 300,
			height = this.elemento.height || 300;
		this.contexto.fillStyle = this.colorPizarra;
		this.contexto.fillRect(0, 0, width, height);
	}
}