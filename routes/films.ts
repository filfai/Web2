import { Router } from "express";

const router = Router();

const films = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    duration: 148
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    duration: 175
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    duration: 154
  }
];

// Route per leggere tutti i film
// GET http://localhost:3000/films
// GET http://localhost:3000/films?minimum-duration=150
router.get("/", (req, res) => {
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

// Route per leggere un singolo film per ID
// GET http://localhost:3000/films/1
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const film = films.find(f => f.id === id);
  if (!film) {
    return res.status(404).json({ message: "Film not found" });
  }
  return res.status(200).json(film);
});

// Route per creare un nuovo film
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
  return res.status(201).json(newFilm);
});

export default router;
