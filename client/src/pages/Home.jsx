import React from "react";
import { Thermometer, Droplet, Wind, AlertTriangle, Map, Cloud, Clock } from "lucide-react";
import "../index.css";
import { Button } from "@/components/ui/button";
import WeatherWildfireInfo from "../components/WeatherWildfireInfo";

const Home = () => {
  const safetyTips = [
    "Create an evacuation plan for your family",
    "Keep a 72-hour emergency kit ready",
    "Clear vegetation within 30 feet of your home",
    "Stay informed about local fire conditions",
    "Know your evacuation routes",
  ];

  return (
    <div className="bg-slate-900 min-h-screen py-10 px-4 sm:px-6 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-amber-400">
          EmbrAlrt - Wildfire Monitoring
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
          Downtown San Jose, CA
        </h2>

        {/* Real-time Weather and Wildfire Data from API */}
        <div className="mb-8">
          <WeatherWildfireInfo />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Air Quality */}
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Air Quality
              </h3>
              <p className="text-3xl font-bold text-yellow-500 mb-2">85 AQI</p>
              <p className="text-gray-300">
                Moderate: Acceptable; however, there may be a risk for some
                people.
              </p>
            </div>
          </div>

          {/* Drought Status */}
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Drought Status
              </h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-xl font-semibold text-white">
                    Moderate Drought
                  </p>
                  <p className="text-amber-400">(D2 Level)</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">D2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fire Weather Alert */}
        <div className="mb-8 bg-red-600 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 flex items-center">
            <AlertTriangle size={28} className="mr-3 text-white" />
            <h3 className="text-xl font-semibold text-white">
              Red Flag Warning: Critical Fire Conditions
            </h3>
          </div>
        </div>

        {/* Wildfire Risk */}
        <div className="mb-8 bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Wildfire Risk
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-500 mb-1">6/10</p>
                <p className="text-orange-400 font-medium">Moderate Risk</p>
                <p className="text-gray-300 mt-2">
                  Moderate risk of wildfire due to current weather conditions.
                </p>
              </div>
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
                <span className="text-3xl font-bold">6</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Historical Wildfire Map */}
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Past Wildfire Locations
              </h3>
              <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Map Placeholder</p>
              </div>
            </div>
          </div>

          {/* Fire Response Tips */}
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Fire Response Tips
              </h3>
              <ul className="space-y-2">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-300">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Forecast and Risk Time */}
        <div className="mb-8 bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Forecast
            </h3>
            <div className="flex items-center mb-4">
              <Cloud className="mr-3 text-blue-400" size={24} />
              <p className="text-gray-300">
                AQI forecast: <span className="text-yellow-500 font-medium">90 tomorrow</span>
              </p>
            </div>
            <div className="flex items-center">
              <Clock className="mr-3 text-gray-400" size={24} />
              <p className="text-gray-300">
                Highest Fire Risk expected at <span className="text-red-400 font-medium">3PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Authorities Button */}
        <div className="flex justify-center mt-6 mb-10">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Contact Authorities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
