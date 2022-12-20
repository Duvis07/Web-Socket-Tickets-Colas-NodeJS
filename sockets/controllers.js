const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // Muestra el ultimo ticket que se atendio en pantalla
  socket.emit("ultimo-ticket", ticketControl.ultimo);
  // Muestra los ultimos 4 tickets que se atendieron en pantalla
  socket.emit("estado-actual", ticketControl.ultimos4);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);

    // Actualizar / notificar cambios en los ultimos 4
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);

    if (!ticket) {
      return callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
