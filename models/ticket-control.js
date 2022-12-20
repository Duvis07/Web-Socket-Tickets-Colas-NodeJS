class TicketControl {
  constructor() {
    this.ultimo = 0;

    this.hoy = new Date().getDate();

    this.tickets = [];

    this.ultimos4 = [];
  }
}
