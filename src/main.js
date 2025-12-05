import { parseISO, set } from "date-fns";
import { getForecast } from "./forecast";
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
  amCommute: null,
  pmCommute: null,

  async init() {
    try {
      this.loading = true;

      const location = await getLocation();
      const data = await getForecast(location.latitude, location.longitude);

      this.allData = data;
      this.current = data.current;
      this.daily = data.daily[this.dailyIndex];

      const selectedDate = parseISO(this.daily.date);

      // could this go in its own thing?
      const amCommuteTime = set(selectedDate, {
        hours: 7,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      this.amCommute = data.hourly.find((d) => {
        return d.time.getTime() === amCommuteTime.getTime();
      });

      const pmCommuteTime = set(selectedDate, {
        hours: 17,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      this.pmCommute = data.hourly.find((d) => {
        return d.time.getTime() === pmCommuteTime.getTime();
      });
    } catch (e) {
      this.error = "Unable to retrieve weather data.";
      console.error(e);
    } finally {
      this.loading = false;
    }
  },

  setDay(index) {
    // don't let index go out of bounds
    if (index < 0 || index >= this.allData.daily.length) {
      return;
    }

    this.dailyIndex = index;
    this.daily = this.allData.daily[this.dailyIndex];

    const selectedDate = parseISO(this.daily.date);

    const amCommuteTime = set(selectedDate, {
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    this.amCommute = this.allData.hourly.find((d) => {
      return d.time.getTime() === amCommuteTime.getTime();
    });

    const pmCommuteTime = set(selectedDate, {
      hours: 17,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    this.pmCommute = this.allData.hourly.find((d) => {
      return d.time.getTime() === pmCommuteTime.getTime();
    });
  },

  nextDay() {
    this.setDay(this.dailyIndex + 1);
  },

  previousDay() {
    this.setDay(this.dailyIndex - 1);
  },
}));

Alpine.directive("temperature", (el, { expression }, { evaluate }) => {
  const value = evaluate(expression);
  el.textContent = `${Math.round(value)}°`;
});

Alpine.start();
