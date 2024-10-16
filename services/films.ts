import fs from "fs";
import path from "path";
import { Film } from "../types";

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

// Service pour obtenir tous les films
export const getAllFilms = (minDuration?: number): Film[] => {
  const films = readFilmsFromFile();
  if (minDuration) {
    return films.filter(film => film.duration >= minDuration);
  }
  return films;
};

// Service pour obtenir un film par ID
export const getFilmById = (id: number): Film | undefined => {
  const films = readFilmsFromFile();
  return films.find(f => f.id === id);
};

// Service pour créer un nouveau film
export const createFilm = (newFilm: Film): Film => {
  const films = readFilmsFromFile();
  newFilm.id = films.length + 1;
  films.push(newFilm);
  writeFilmsToFile(films);
  return newFilm;
};

// Service pour mettre à jour un film existant
export const updateFilm = (id: number, updatedFields: Partial<Film>): Film | undefined => {
  const films = readFilmsFromFile();
  const filmIndex = films.findIndex(f => f.id === id);
  if (filmIndex === -1) {
    return undefined;
  }
  const updatedFilm = { ...films[filmIndex], ...updatedFields };
  films[filmIndex] = updatedFilm;
  writeFilmsToFile(films);
  return updatedFilm;
};

// Service pour supprimer un film
export const deleteFilm = (id: number): boolean => {
  const films = readFilmsFromFile();
  const filmIndex = films.findIndex(f => f.id === id);
  if (filmIndex === -1) {
    return false;
  }
  films.splice(filmIndex, 1);
  writeFilmsToFile(films);
  return true;
};
