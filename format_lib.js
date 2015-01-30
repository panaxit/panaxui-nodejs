/**
 * Sample formatting library
 */

/**
 * Format money
 * Source: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
 * 
 * @param  {[type]} n [description]
 * @param  {[type]} c [description]
 * @param  {[type]} d [description]
 * @param  {[type]} t [description]
 * @return {[type]}   [description]
 */
exports.formatMoney = function(n, c, d, t) {
	var c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

/**
 * Money To Words
 * Source: https://eglador.wordpress.com/2013/02/27/conversion-de-numeros-a-letras-con-javascript/
 */
exports.moneyToWords = function(num) {

	var Unidades = function(num) {

		switch (num) {
			case 1:
				return "UN";
			case 2:
				return "DOS";
			case 3:
				return "TRES";
			case 4:
				return "CUATRO";
			case 5:
				return "CINCO";
			case 6:
				return "SEIS";
			case 7:
				return "SIETE";
			case 8:
				return "OCHO";
			case 9:
				return "NUEVE";
		}

		return "";
	}

	var Decenas = function(num) {

		decena = Math.floor(num / 10);
		unidad = num - (decena * 10);

		switch (decena) {
			case 1:
				switch (unidad) {
					case 0:
						return "DIEZ";
					case 1:
						return "ONCE";
					case 2:
						return "DOCE";
					case 3:
						return "TRECE";
					case 4:
						return "CATORCE";
					case 5:
						return "QUINCE";
					default:
						return "DIECI" + Unidades(unidad);
				}
			case 2:
				switch (unidad) {
					case 0:
						return "VEINTE";
					default:
						return "VEINTI" + Unidades(unidad);
				}
			case 3:
				return DecenasY("TREINTA", unidad);
			case 4:
				return DecenasY("CUARENTA", unidad);
			case 5:
				return DecenasY("CINCUENTA", unidad);
			case 6:
				return DecenasY("SESENTA", unidad);
			case 7:
				return DecenasY("SETENTA", unidad);
			case 8:
				return DecenasY("OCHENTA", unidad);
			case 9:
				return DecenasY("NOVENTA", unidad);
			case 0:
				return Unidades(unidad);
		}
	}

	var DecenasY = function(strSin, numUnidades) {
		if (numUnidades > 0)
			return strSin + " Y " + Unidades(numUnidades)

		return strSin;
	}

	var Centenas = function(num) {

		centenas = Math.floor(num / 100);
		decenas = num - (centenas * 100);

		switch (centenas) {
			case 1:
				if (decenas > 0)
					return "CIENTO " + Decenas(decenas);
				return "CIEN";
			case 2:
				return "DOSCIENTOS " + Decenas(decenas);
			case 3:
				return "TRESCIENTOS " + Decenas(decenas);
			case 4:
				return "CUATROCIENTOS " + Decenas(decenas);
			case 5:
				return "QUINIENTOS " + Decenas(decenas);
			case 6:
				return "SEISCIENTOS " + Decenas(decenas);
			case 7:
				return "SETECIENTOS " + Decenas(decenas);
			case 8:
				return "OCHOCIENTOS " + Decenas(decenas);
			case 9:
				return "NOVECIENTOS " + Decenas(decenas);
		}

		return Decenas(decenas);
	}

	var Seccion = function(num, divisor, strSingular, strPlural) {
		cientos = Math.floor(num / divisor)
		resto = num - (cientos * divisor)

		letras = "";

		if (cientos > 0)
			if (cientos > 1)
				letras = Centenas(cientos) + " " + strPlural;
			else
				letras = strSingular;

		if (resto > 0)
			letras += "";

		return letras;
	}

	var Miles = function(num) {
		divisor = 1000;
		cientos = Math.floor(num / divisor)
		resto = num - (cientos * divisor)

		strMiles = Seccion(num, divisor, "UN MIL", "MIL");
		strCentenas = Centenas(resto);

		if (strMiles == "")
			return strCentenas;

		return strMiles + " " + strCentenas;

		//return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
	}

	var Millones = function(num) {
		divisor = 1000000;
		cientos = Math.floor(num / divisor)
		resto = num - (cientos * divisor)

		strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
		strMiles = Miles(resto);

		if (strMillones == "")
			return strMiles;

		return strMillones + " " + strMiles;

		//return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
	}

	var data = {
		numero: num,
		enteros: Math.floor(num),
		centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
		letrasCentavos: "",
		letrasMonedaPlural: "PESOS",
		letrasMonedaSingular: "PESO"
	};

	if (data.centavos > 0)
		data.letrasCentavos = "CON " + data.centavos + "/100";

	if (data.enteros == 0)
		return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
	if (data.enteros == 1)
		return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
	else
		return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}
