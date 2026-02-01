const grid = document.getElementById("grid");
const weatherDiv = document.getElementById("weatherData");

let streams = [];

function loadStreams(list) {
  grid.innerHTML = "";
  streams = [];

  list.forEach(id => {
    const div = document.createElement("div");
    div.className = "stream";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${id}?enablejsapi=1`;
    iframe.allow = "autoplay";

    const controls = document.createElement("div");
    controls.className = "audio-controls";

    const mute = document.createElement("button");
    mute.textContent = "🔇";
    mute.onclick = () => iframe.contentWindow.postMessage(
      '{"event":"command","func":"mute","args":""}', '*'
    );

    const solo = document.createElement("button");
    solo.textContent = "🎧";
    solo.onclick = () => soloStream(iframe);

    controls.append(mute, solo);
    div.append(iframe, controls);
    grid.append(div);

    streams.push(iframe);
  });
}

function soloStream(active) {
  streams.forEach(f => {
    const cmd = f === active ? "unMute" : "mute";
    f.contentWindow.postMessage(
      `{"event":"command","func":"${cmd}","args":""}`, '*'
    );
  });
}

function refreshStreams() {
  streams.forEach(f => {
    const src = f.src;
    f.src = "";
    setTimeout(() => f.src = src, 200);
  });
}

/* Auto-refresh every 30 minutes */
setInterval(refreshStreams, 1800000);

/* Theme */
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.className);
}
document.body.className = localStorage.getItem("theme") || "";

/* GPS Weather */
navigator.geolocation.getCurrentPosition(pos => {
  fetchWeather(pos.coords.latitude, pos.coords.longitude);
}, () => {
  weatherDiv.textContent = "Location denied.";
});

async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  );
  const data = await res.json();
  const w = data.current_weather;
  weatherDiv.innerHTML = `🌡 ${w.temperature}°C | 💨 ${w.windspeed} km/h`;
}

/* Presets */
function setPreset(type) {
  const presets = {
    aviation: [
      "21X5lGlDOfg", // LiveATC
      "w0YyJt5aVwM",
      "ezp-7eLXBVs"
    ],
    weather: [
      "VjqKog3XwZ8",
      "UQaSS4_VAV4"
    ],
    news: [
      "QYO-tNjkQO8"
    ],
    space: [
      "21X5lGlDOfg",
      "yqTzV4JzO3M"
    ]
  };
  loadStreams(presets[type]);
}

/* Default load */
loadStreams([
  "ezp-7eLXBVs",
  "QYO-tNjkQO8",
  "VjqKog3XwZ8",
  "UQaSS4_VAV4"
]);
