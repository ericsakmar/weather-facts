import { formatForecast, getForecast } from "./forecast";
import { getLocation } from "./location";
import "./style.css";
import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.data("weather", () => ({
  forecast: {},

  async init() {
    const location = await getLocation();
    const forecast = await getForecast(location.latitude, location.longitude);
    this.forecast = formatForecast(forecast);
  },
}));

Alpine.start();
