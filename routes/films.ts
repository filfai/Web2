import { Router } from "express";
import { getAllFilms, getFilmById, createFilm, updateFilm, deleteFilm } from "../services/films";
import { Film } from "../types";

const router = Router();

// Route pour lire tous les films
router.get("/", (req, res) => {
  const minDuration = Number(req.query['minimum-duration']);
  const films = getAllFilms(minDuration);
  return res.status(200).json(films);
});

// Route pour lire un film par ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const film = getFilmById(id);
  if (!film) {
    return res.status(404).json({ message: "Film not found" });
  }
  return res.status(200).json(film);
});

// Route pour créer un nouveau film
router.post("/", (req, res) => {
  const { title, director, duration } = req.body;
  if (!title || !director || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ message: "Invalid film data" });
  }
  const newFilm: Film = {
    id: 0, // Temp ID, will be replaced in service
    title,
    director,
    duration
  };
  const createdFilm = createFilm(newFilm);
  return res.status(201).json(createdFilm);
});

// Route pour mettre à jour un film
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedFields = req.body;
  const updatedFilm = updateFilm(id, updatedFields);
  if (!updatedFilm) {
    return res.status(404).json({ message: "Film not found" });
  }
  return res.status(200).json(updatedFilm);
});

// Route pour supprimer un film
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const success = deleteFilm(id);
  if (!success) {
    return res.status(404).json({ message: "Film not found" });
  }
  return res.status(204).send();
});

export default router;
