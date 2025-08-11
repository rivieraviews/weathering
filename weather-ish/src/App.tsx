import { useState, useEffect } from "react";

type WeatherData = {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  //change favicon when weather changes
  useEffect(() => {
    if (!weather) return;

    const vibe = weather.current.condition.text.toLowerCase();
    let iconUrl = "/favicon.ico"; //fallback

    if (vibe.includes("sun")) iconUrl = "/icons/sun.png";
    else if (vibe.includes("cloud")) iconUrl = "/icons/clouds.png";
    else if (vibe.includes("rain")) iconUrl = "/icons/umbrella.png";
    else if (vibe.includes("snow")) iconUrl = "/icons/snowflake.png";
    else if (vibe.includes("thunder")) iconUrl = "/icons/bad-weather.png";

    const link: HTMLLinkElement =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");
    link.rel = "icon";
    link.href = iconUrl;
    document.head.appendChild(link);
  }, [weather]);

  const fetchWeather = async () => {
    if (!city) return;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      alert("API key not set");
      return;
    }
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      setWeather(data);
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
      else alert("Could not fetch weather for this city.");
      setWeather(null);
    }
  };

  const getMultiGradient = () => {
    if (!weather) return "animate-gradient-multi";

    const temp = weather.current.temp_c;
    const vibe = weather.current.condition.text.toLowerCase();

    if (temp < 5) return "bg-cold-gradient";
    if (temp < 20 && vibe.includes("cloud")) return "bg-mild-gradient";
    if (temp >= 20 && vibe.includes("sun")) return "bg-hot-gradient";

    //fallback
    return "animate-gradient-multi";
  };

  const getHeadingColor = () => {
    if (!weather) return "#222";
    const temp = weather.current.temp_c;
    if (temp < 10) return "#ffe066";
    if (temp < 25) return "#222";
    return "#fffbe6";
  };

  return (
    <div
      className={`h-screen w-screen ${getMultiGradient()} flex flex-col items-center justify-center`}
    >
      <h1
        className="text-3xl font-bold mb-6"
        style={{
          color: getHeadingColor(),
          textShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Weathering Heights
      </h1>
      <div className="flex gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="p-2 rounded text-black"
        />
        <button
          onClick={fetchWeather}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded"
        >
          Get Weather
        </button>
      </div>
      {weather && (
        <div className="mt-6 text-center">
          <p className="text-2xl">{weather.location.name}</p>
          <p className="text-lg">{Math.round(weather.current.temp_c)}°C</p>
          <p>{weather.current.condition.text}</p>
        </div>
      )}
    </div>
  );
}
