/* eslint-disable*/

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
    d = d === undefined ? '.' : d,
    t = t === undefined ? ',' : t,
    s = n < 0 ? '-' : '',
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') + 
         i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + 
         (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

/**
 * Money To Words
 * Source: https://eglador.wordpress.com/2013/02/27/conversion-de-numeros-a-letras-con-javascript/
 * @param  {Int}    num Number
 * @return {String}     Number
 */
exports.moneyToWords = function(num) {

  var unidades = function(num) {

    switch (num) {
      case 1:
        return 'UN';
      case 2:
        return 'DOS';
      case 3:
        return 'TRES';
      case 4:
        return 'CUATRO';
      case 5:
        return 'CINCO';
      case 6:
        return 'SEIS';
      case 7:
        return 'SIETE';
      case 8:
        return 'OCHO';
      case 9:
        return 'NUEVE';
    }

    return '';
  }

  var decenas = function(num) {

    decena = Math.floor(num / 10);
    unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return 'DIEZ';
          case 1:
            return 'ONCE';
          case 2:
            return 'DOCE';
          case 3:
            return 'TRECE';
          case 4:
            return 'CATORCE';
          case 5:
            return 'QUINCE';
          default:
            return 'DIECI' + unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return 'VEINTE';
          default:
            return 'VEINTI' + unidades(unidad);
        }
      case 3:
        return decenasY('TREINTA', unidad);
      case 4:
        return decenasY('CUARENTA', unidad);
      case 5:
        return decenasY('CINCUENTA', unidad);
      case 6:
        return decenasY('SESENTA', unidad);
      case 7:
        return decenasY('SETENTA', unidad);
      case 8:
        return decenasY('OCHENTA', unidad);
      case 9:
        return decenasY('NOVENTA', unidad);
      case 0:
        return unidades(unidad);
    }
  }

  var decenasY = function(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + ' Y ' + unidades(numUnidades)

    return strSin;
  }

  var centenas = function(num) {

    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return 'CIENTO ' + decenas(decenas);
        return 'CIEN';
      case 2:
        return 'DOSCIENTOS ' + decenas(decenas);
      case 3:
        return 'TRESCIENTOS ' + decenas(decenas);
      case 4:
        return 'CUATROCIENTOS ' + decenas(decenas);
      case 5:
        return 'QUINIENTOS ' + decenas(decenas);
      case 6:
        return 'SEISCIENTOS ' + decenas(decenas);
      case 7:
        return 'SETECIENTOS ' + decenas(decenas);
      case 8:
        return 'OCHOCIENTOS ' + decenas(decenas);
      case 9:
        return 'NOVECIENTOS ' + decenas(decenas);
    }

    return decenas(decenas);
  }

  var seccion = function(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = '';

    if (cientos > 0)
      if (cientos > 1)
        letras = centenas(cientos) + ' ' + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += '';

    return letras;
  }

  var miles = function(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = seccion(num, divisor, 'UN MIL', 'MIL');
    strCentenas = centenas(resto);

    if (strMiles === '')
      return strCentenas;

    return strMiles + ' ' + strCentenas;

    //return seccion(num, divisor, "UN MIL", "MIL") + " " + centenas(resto);
  }

  var millones = function(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = seccion(num, divisor, 'UN MILLON', 'MILLONES');
    strMiles = miles(resto);

    if (strMillones === '')
      return strMiles;

    return strMillones + ' ' + strMiles;

    //return seccion(num, divisor, "UN MILLON", "MILLONES") + " " + miles(resto);
  }

  var data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
    letrasCentavos: '',
    letrasMonedaPlural: 'PESOS',
    letrasMonedaSingular: 'PESO',
  };

  if (data.centavos > 0)
    data.letrasCentavos = 'CON ' + data.centavos + '/100';

  if (data.enteros === 0)
    return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  if (data.enteros === 1)
    return millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
  else
    return millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
}