import { formatForecast, getForecast } from "./forecast";
import { getLocation } from "./location";
import "./style.css";
import Alpine from "alpinejs";

window.Alpine = Alpine;
Alpine.start();

getLocation()
  .then((location) => {
    return getForecast(location.latitude, location.longitude);
  })
  .then((forecast) => {
    return formatForecast(forecast);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error.message);
  });
