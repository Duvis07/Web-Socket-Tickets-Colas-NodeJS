const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // Muestra el ultimo ticket que se atendio en pantalla
  socket.emit("ultimo-ticket", ticketControl.ultimo);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
  });

  //Notificar que hay un nuevo ticket pendiente de atender en los escritorios
};

module.exports = {
  socketController,
};
