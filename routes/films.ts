import { Router } from "express";
import { Film } from "./types"; // Importa il tipo Film

const router = Router();

const films: Film[] = [
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

// Route per cancellare un film per ID
// DELETE http://localhost:3000/films/1
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const filmIndex = films.findIndex(f => f.id === id);
  if (filmIndex === -1) {
    return res.status(404).json({ message: "Film not found" });
  }
  films.splice(filmIndex, 1);
  return res.status(204).send();
})

// Route per creare un nuovo film
/* POST http://localhost:3000/films
Content-Type: application/json
{
    "title": "New Film",
    "director": "Some Director",
    "duration": 120
}
*/
router.patch("/", (req, res) => {
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

// Route per aggiornare parzialmente un film per ID
/* PATCH http://localhost:3000/films/999
Content-Type: application/json

{
  "title": "Should Not Work"
}
*/
router.patch("/:id", (req, res) => {
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
  return res.status(200).json(film);
});

// Route per aggiornare o creare una risorsa tramite PUT
router.put("/:id", (req, res) => {
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
    return res.status(200).json(films[existingFilmIndex]);
  }
  const existingFilmWithSameId = films.find(film => film.id === id);
  if (existingFilmWithSameId) {
    return res.status(409).json({ message: "A resource with this ID already exists." });
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
  return res.status(201).json(newFilm);
});


export default router;