import { getLocation } from "./location";
import "./style.css";
import Alpine from "alpinejs";

window.Alpine = Alpine;
Alpine.start();

getLocation()
  .then((location) => {
    console.log("User location:", location);
  })
  .catch((error) => {
    console.error(error.message);
  });
