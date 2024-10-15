import express, { ErrorRequestHandler } from "express";
import filmRouter from "./routes/films";

const app = express();

// Middleware per loggare il tempo delle richieste
app.use((_req, _res, next) => {
  console.log("Time:", new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" }));
  next();
});

// Middleware per contare le richieste GET
let getRequestCount = 0;
app.use((req, _res, next) => {
  if (req.method === "GET") {
    getRequestCount++;
    console.log(`GET counter: ${getRequestCount}`);
  }
  next();
});

// Middleware per il parsing del JSON nel corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Router per la risorsa "films"
app.use("/films", filmRouter);

// Middleware per la gestione degli errori
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  return res.status(500).send("Something broke!");
};
app.use(errorHandler);

export default app;
