const fs = require("fs");
const path = require("path");

//Clase para tener un control de los tickets que se van generando y atendiendo en el sistema
class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

//Clase para manejar los tickets
class TicketControl {
  constructor() {
    this.ultimo = 0;

    this.hoy = new Date().getDate();

    this.tickets = [];

    this.ultimos4 = [];

    this.init();
  }

  //Lo que va a guardar un objeto en la base de datos en este caso un archivo json
  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  //Metodo para inicializar el servidor o la clase
  init = () => {
    const { hoy, tickets, ultimo, ultimos4 } = require("../db/data.json");

    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      //Es otro dia  reiniciar todas las variables
      this.guardarDB();
    }
  };

  //Metodo para guardar en la base de datos los tickets
  guardarDB = () => {
    const dbPath = path.join(__dirname, "../db/data.json");
    // convierte un string a un objeto json
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  };

  //Metodo para obtener el siguiente ticket a atender
  siguiente = () => {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.guardarDB();

    return 'Ticket ' + ticket.numero;
  };

  //Metodo para atender un ticket  y asignarlo a un escritorio
  //Puede retornar null si no hay tickets en la cola o va a retornar el ticket que se esta atendiendo en este momento
  atenderTicket = (escritorio) => {
    //No hay tickets en la cola  no hay tickets para atender
    if (this.tickets.length === 0) {
      return null;
    }
    //shift() saca el primer elemento del arreglo y lo retorna y lo elimina del arreglo
    const ticket = this.tickets.shift();

    //Asignar el escritorio al ticket que se esta atendiendo en este momento
    ticket.escritorio = escritorio;

    // unshift Agrega el ticket al inicio del arreglo de ultimos 4 tickets
    this.ultimos4.unshift(ticket);

    //Verificar que solo existan 4 tickets en el arreglo de ultimos 4 tickets
    if (this.ultimos4.length > 4) {
      //borra el ultimo elemento del arreglo y lo corta en 1 o  el ultimo elemento
      this.ultimos4.splice(-1, 1);
    }

    //Guardar en la base de datos
    this.guardarDB();

    //Retornar el ticket que se esta atendiendo en este momento para que se muestre en el html
    return ticket;
  };
}

module.exports = TicketControl;
