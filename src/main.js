import { formatForecast, getForecast } from "./forecast";
import { getLocation } from "./location";
import "./style.css";
import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.data("weather", () => ({
  loading: false,
  error: null,
  allData: null,
  current: null,
  daily: null,
  dailyIndex: 0,

  async init() {
    try {
      this.loading = true;

      const location = await getLocation();
      const data = await getForecast(location.latitude, location.longitude);
      const formattedData = formatForecast(data);

      this.allData = formattedData;
      this.current = formattedData.current;
      this.daily = formattedData.daily[this.dailyIndex];

      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.error = "Unable to retrieve weather data.";
      console.error(e);
    }
  },
}));

Alpine.start();
