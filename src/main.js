import { format, isBefore, isWeekend, parseISO, set } from "date-fns";
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
  hourly: [],

  async init() {
    this.setTheme();

    try {
      this.loading = true;

      const location = await getLocation();
      const data = await getForecast(location.latitude, location.longitude);

      this.allData = data;
      this.current = data.current;
      this.setDay(this.dailyIndex);
    } catch (e) {
      this.error = "Unable to retrieve weather data.";
      console.error(e);
    } finally {
      this.loading = false;
    }
  },

  setTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  },

  setDay(index) {
    // don't let index go out of bounds
    if (index < 0 || index >= this.allData.daily.length) {
      return;
    }

    this.dailyIndex = index;
    this.daily = this.allData.daily[this.dailyIndex];

    const now = new Date();
    const selectedDate = parseISO(this.daily.date);

    const amCommuteTime = set(selectedDate, {
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    this.amCommute = /*isBefore(now, amCommuteTime) &&*/ !isWeekend(
      selectedDate,
    )
      ? this.allData.hourly.find((d) => {
          return d.time.getTime() === amCommuteTime.getTime();
        })
      : null;

    const pmCommuteTime = set(selectedDate, {
      hours: 17,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    this.pmCommute = /* isBefore(now, pmCommuteTime) && */ !isWeekend(
      selectedDate,
    )
      ? this.allData.hourly.find((d) => {
          return d.time.getTime() === pmCommuteTime.getTime();
        })
      : null;

    // hourly
    const isToday = this.dailyIndex === 0;
    const startIndex = isToday
      ? this.allData.hourly.findIndex((d) => {
          return d.time > now;
        })
      : this.dailyIndex * 24 + 6;
    const endIndex = startIndex + 24;
    this.hourly = this.allData.hourly.slice(startIndex, endIndex);
  },

  nextDay() {
    this.setDay(this.dailyIndex + 1);
  },

  previousDay() {
    this.setDay(this.dailyIndex - 1);
  },

  formatTemperature(value) {
    return `${Math.round(value)}°`;
  },

  formatHumidity(value) {
    return `${Math.round(value)}%`;
  },

  formatWind(value) {
    return `${Math.round(value)} mph`;
  },

  formatLongDate(rawDate) {
    const date = parseISO(rawDate);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  },

  formatProbability(value) {
    return `${Math.round(value)}%`;
  },

  formatHour(date) {
    return date ? format(date, "haaa") : "";
  },
}));

Alpine.start();
