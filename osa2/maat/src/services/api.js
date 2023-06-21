import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherUrl = `https://api.open-meteo.com/v1/forecast?`;

const getAll = () => {
  return axios.get(`${baseUrl}/all`);
};
const getOne = (name) => {
  return axios.get(`${baseUrl}/name/${name}`);
};
const weather = (lat, lon) => {
  return axios.get(
    `${weatherUrl}latitude=${lat}&longitude=${lon}&current_weather=true`
  );
};
export default {
  getAll,
  getOne,
  weather,
};
