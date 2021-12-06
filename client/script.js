// IMPORTS
import axios from "axios";
import { format } from "date-fns";

// Get user location
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(coords.latitude, coords.longitude);
}

// If Location permission denied
function positionError() {
  alert(
    "There is an error getting your location. Please allow us to use your location and refresh the page."
  );
}

function getWeather(lat, lon) {
  axios
    .get("http://localhost:3001/weather", { params: { lat, lon } })
    .then((res) => renderWeather(res.data))
    .catch((e) => {
      console.log(e);
      alert("ERROR. Please Try Again!");
    });
}

function renderWeather({ current, daily, hourly }) {
  document.body.classList.remove("blurred"); // Remove blur once data loaded

  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(icon, { large = false } = {}) {
  const size = large ? "@2x" : "";
  return `http://openweathermap.org/img/wn/${icon}${size}.png`;
}

function formatDate(timestamp) {
  return format(new Date(timestamp), "eeee");
}

function formatTime(timestamp) {
    return format((new Date(timestamp)), "ha")
}


const currentIcon = document.querySelector("[data-current-icon]");
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.icon, { large: true });
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
  setValue("current-description", current.description);
}

const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""; // Clear default daily section
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.temp, { parent: element });
    setValue("date", formatDate(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.icon);
    dailySection.append(element);
  });
}

const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", formatDate(hour.timestamp), { parent: element });
    setValue("time", formatTime(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.icon);
    hourlySection.append(element);
  });
}
