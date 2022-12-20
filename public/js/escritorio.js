// refencia al html para poder manipularlo

const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblNuevoTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es necesario");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("ultimo-ticket", (ultimo) => {
  /*  lblNuevoTicket.innerText = "Ticket " + ultimo; */
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblNuevoTicket.innerText = "Nadie";
      return (divAlerta.style.display = "");
    }

    lblNuevoTicket.innerText = "Ticket " + ticket.numero;
  }
    );
});
