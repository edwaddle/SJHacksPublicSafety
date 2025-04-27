import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider, 
  Grid 
} from "@mui/material";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Flame, 
  AlertTriangle, 
  MapPin, 
  Calendar,
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

  return (
    <div className="space-y-4">
      {/* Weather Card */}
      {weather && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-white flex items-center mb-4">
            <Cloud className="mr-2 text-blue-400" />
            Weather in {weather.location}
          </h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700 p-3 rounded-lg">
              <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-semibold text-white">{Math.round(weather.temperature)}°C</div>
              <div className="text-xs text-gray-300">Temperature</div>
            </div>
            
            <div className="bg-slate-700 p-3 rounded-lg">
              <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-semibold text-white">{weather.humidity}%</div>
              <div className="text-xs text-gray-300">Humidity</div>
            </div>
            
            <div className="bg-slate-700 p-3 rounded-lg">
              <Wind className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-semibold text-white">{weather.windSpeed} m/s</div>
              <div className="text-xs text-gray-300">Wind</div>
            </div>
          </div>
          
          <div className="mt-3 text-center text-white">
            <span className="capitalize">{weather.description}</span>
          </div>
        </div>
      )}
      
      {/* Wildfires Card */}
      {wildfires && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-white flex items-center mb-4">
            <Flame className="mr-2 text-red-500" />
            Active Wildfires ({wildfires.count || 0})
          </h2>
          
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
      )}
    </div>
  );
};

export default WeatherWildfireInfo; 