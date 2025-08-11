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
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
      else alert("Could not fetch weather for this city.");
      setWeather(null);
    }
  };

  const getAnimationSpeed = () => {
    if (!weather) return "8s";
    const temp = weather.current?.temp_c ?? 20;
    if (temp < 10) return "12s";
    if (temp < 25) return "8s";
    return "4s";
  }

  const getMultiGradient = () => {
  if (!weather) return "animate-gradient-multi";
  
  const temp = weather.current?.temp_c ?? 20;
  if (temp < 10) {
    return "bg-cold-gradient";
  } else if (temp < 25) {
    return "bg-mild-gradient";
  } else {
    return "bg-hot-gradient";
  }
};


  // Pick a readable color for the heading based on the background
  const getHeadingColor = () => {
    if (!weather) return '#222'; // default: dark for light bg
    const temp = weather.current?.temp_c ?? 20;
    if (temp < 10) return '#ffe066'; // yellow for blue bg
    if (temp < 25) return '#222'; // dark for light bg
    return '#fffbe6'; // pale yellow for hot bg
  };

  return (
    <div 
      style={ { animationDuration: getAnimationSpeed() } }
      className={`h-screen w-screen ${getMultiGradient()} flex flex-col items-center justify-center`}>
        <h1 className="text-3xl font-bold mb-6" style={{ color: getHeadingColor(), textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Weathering Heights</h1>
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