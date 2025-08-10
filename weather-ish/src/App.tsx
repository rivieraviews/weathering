
import { useState } from "react";

type WeatherData = {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
};

export default function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);


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
    } catch (e) {
      alert("Could not fetch weather for this city.");
      setWeather(null);
    }
  };

  const getBackground = () => {
    if (!weather) return "from-blue-400 to-indigo-600";
    const temp = weather.current?.temp_c ?? 20;
    if (temp < 10) return "from-cyan-500 to-blue-700";
    if (temp < 25) return "from-green-400 to-blue-500";
    return "from-orange-400 to-pink-600";
  };

  return (
    <div className={`h-screen w-screen bg-gradient-to-br ${getBackground()} flex flex-col items-center justify-center text-white`}>
      <h1 className="text-3xl font-bold mb-6">Weathering Heights</h1>
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