import { useState, useEffect } from "react";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Flame, 
  AlertTriangle, 
  Cloud
} from "lucide-react";
import { fetchWeather, fetchWildfires, checkApiStatus } from "../utils/api";

const WeatherWildfireInfo = () => {
  const [weather, setWeather] = useState(null);
  const [wildfires, setWildfires] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiActive, setApiActive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    console.log('WeatherWildfireInfo component mounted');

    const checkAndFetchData = async () => {
      try {
        setLoading(true);
        
        // First check if the API is running
        try {
          await checkApiStatus();
          if (isMounted) setApiActive(true);
        } catch (statusError) {
          console.error('API status check failed:', statusError);
          if (isMounted) {
            setApiActive(false);
            setError('Backend server is not reachable. Please make sure the server is running.');
            setLoading(false);
            return;
          }
        }
        
        // If API is active, fetch data
        if (isMounted) {
          if (apiActive) {
            try {
              // Fetch both weather and wildfire data in parallel
              const [weatherData, wildfireData] = await Promise.all([
                fetchWeather(),
                fetchWildfires()
              ]);
              
              if (isMounted) {
                setWeather(weatherData);
                setWildfires(wildfireData);
                setError(null);
              }
            } catch (dataError) {
              console.error('Error fetching data:', dataError);
              if (isMounted) {
                setError('Failed to load data. Please try again later.');
              }
            } finally {
              if (isMounted) {
                setLoading(false);
              }
            }
          } else {
            // Make sure loading is set to false if API is not active
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        if (isMounted) {
          setError('An unexpected error occurred. Please try again later.');
          setLoading(false);
        }
      }
    };

    checkAndFetchData();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, [apiActive]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
        <AlertTriangle className="mt-1 mr-2 flex-shrink-0" size={20} />
        <div>
          <p className="font-bold">Error</p>
          <p>{error}</p>
          {!apiActive && (
            <p className="mt-2 text-sm">
              Please check that the server is running on port 3001 and refresh the page.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Temperature conversion function from Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  // Wind speed conversion from m/s to mph
  const msToMph = (ms) => {
    return Math.round(ms * 2.237);
  };

  return (
    <div className="space-y-6">
      {/* Weather Card */}
      {weather && (
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Current Conditions
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="mr-3 text-amber-400">
                  <Thermometer size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Temperature</p>
                  <p className="text-gray-300">{celsiusToFahrenheit(weather.temperature)}°F</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="mr-3 text-blue-400">
                  <Droplets size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Humidity</p>
                  <p className="text-gray-300">{weather.humidity}%</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="mr-3 text-gray-400">
                  <Wind size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Wind Speed</p>
                  <p className="text-gray-300">{msToMph(weather.windSpeed)} mph</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-4 py-2 px-3 bg-slate-700 rounded-lg text-center">
              <span className="text-white capitalize">{weather.description}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Wildfires Card */}
      {wildfires && (
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <Flame className="mr-2 text-red-500" />
              Active Wildfires ({wildfires.count || 0})
            </h3>
          
            <div className="space-y-3">
              {wildfires.data && wildfires.data.length > 0 ? (
                wildfires.data.slice(0, 3).map((fire, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-700 p-3 rounded-lg"
                  >
                    <div className="flex justify-between">
                      <div className="text-white">
                        <div className="font-medium">Latitude: {fire.latitude}</div>
                        <div className="font-medium">Longitude: {fire.longitude}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-300">Date: {fire.acq_date}</div>
                        <span 
                          className={`text-xs px-2 py-1 rounded ${
                            fire.confidence === 'high' 
                              ? 'bg-red-900 text-red-100' 
                              : 'bg-amber-800 text-amber-100'
                          }`}
                        >
                          {fire.confidence} confidence
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-300 py-4">
                  No active wildfires detected in the area
                </div>
              )}
              
              {wildfires.data && wildfires.data.length > 3 && (
                <div className="text-center text-gray-400 text-sm mt-2">
                  Showing 3 of {wildfires.data.length} wildfires
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWildfireInfo; 