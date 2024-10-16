import { Router } from "express";
import { Film } from "./types"; // Importation du type Film
import fs from "fs";
import path from "path";

const router = Router();

// Chemin du fichier JSON
const filePath = path.join(__dirname, "../data/films.json");

// Fonction pour lire les films à partir du fichier JSON
const readFilmsFromFile = (): Film[] => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
};

// Fonction pour écrire les films dans le fichier JSON
const writeFilmsToFile = (films: Film[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(films, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};

// Route pour lire tous les films
// GET http://localhost:3000/films
// GET http://localhost:3000/films?minimum-duration=150
router.get("/", (req, res) => {
  const films = readFilmsFromFile();
  const minDuration = Number(req.query['minimum-duration']);
  if (!minDuration) {
    return res.status(200).json(films);
  }
  if (minDuration < 0) {
    return res.status(400).json({ message: "Duration must be > 0" });
  }
  const filteredFilms = films.filter(film => film.duration >= minDuration);
  return res.status(200).json(filteredFilms);
});

// Route pour lire un seul film par ID
// GET http://localhost:3000/films/1
router.get("/:id", (req, res) => {
  const films = readFilmsFromFile();
  const id = Number(req.params.id);
  const film = films.find(f => f.id === id);
  if (!film) {
    return res.status(404).json({ message: "Film not found" });
  }
  return res.status(200).json(film);
});

// Route pour créer un nouveau film
/* POST http://localhost:3000/films
Content-Type: application/json
{
    "title": "New Film",
    "director": "Some Director",
    "duration": 120
}
*/
router.post("/", (req, res) => {
  const { title, director, duration } = req.body;
  if (!title || !director || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ message: "Invalid film data" });
  }
  const films = readFilmsFromFile();
  const existingFilm = films.find(film => film.title === title && film.director === director && film.duration === duration);
  if (existingFilm) {
    return res.status(409).json({ message: "Film already exists" });
  }
  const newFilm = {
    id: films.length + 1,
    title,
    director,
    duration
  };
  films.push(newFilm);
  writeFilmsToFile(films);
  return res.status(201).json(newFilm);
});

// Route pour supprimer un film par ID
// DELETE http://localhost:3000/films/1
router.delete("/:id", (req, res) => {
  const films = readFilmsFromFile();
  const id = Number(req.params.id);
  const filmIndex = films.findIndex(f => f.id === id);
  if (filmIndex === -1) {
    return res.status(404).json({ message: "Film not found" });
  }
  films.splice(filmIndex, 1);
  writeFilmsToFile(films);
  return res.status(204).send();
});

// Route pour mettre à jour partiellement un film par ID
/* PATCH http://localhost:3000/films/999
Content-Type: application/json
{
  "title": "Updated Film"
}
*/
router.patch("/:id", (req, res) => {
  const films = readFilmsFromFile();
  const id = Number(req.params.id);
  const film = films.find(f => f.id === id);
  if (!film) {
    return res.status(404).json({ message: "Film not found" });
  }
  const { title, director, duration, budget, description, imageUrl } = req.body;
  if (title !== undefined) {
    film.title = title;
  }
  if (director !== undefined) {
    film.director = director;
  }
  if (duration !== undefined && typeof duration === 'number' && duration > 0) {
    film.duration = duration;
  }
  if (budget !== undefined && typeof budget === 'number' && budget > 0) {
    film.budget = budget;
  }
  if (description !== undefined) {
    film.description = description;
  }
  if (imageUrl !== undefined) {
    film.imageUrl = imageUrl;
  }
  writeFilmsToFile(films);
  return res.status(200).json(film);
});

// Route pour mettre à jour ou créer un film avec PUT
router.put("/:id", (req, res) => {
  const films = readFilmsFromFile();
  const id = Number(req.params.id);
  const { title, director, duration, budget, description, imageUrl } = req.body;
  if (!title || !director || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ message: "Invalid data. Title, director, and duration are required and duration must be a positive number." });
  }
  const existingFilmIndex = films.findIndex(film => film.id === id);
  if (existingFilmIndex !== -1) {
    films[existingFilmIndex] = {
      id,
      title,
      director,
      duration,
      budget,
      description,
      imageUrl
    };
    writeFilmsToFile(films);
    return res.status(200).json(films[existingFilmIndex]);
  }
  const newFilm = {
    id,
    title,
    director,
    duration,
    budget,
    description,
    imageUrl
  };
  films.push(newFilm);
  writeFilmsToFile(films);
  return res.status(201).json(newFilm);
});

export default router;