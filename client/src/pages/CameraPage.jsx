import React from "react";
import CameraComponent from "../components/CameraComponent";

const CameraPage = () => {
  return (
    <div className="p-4 pb-20 h-full flex flex-col bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
        Camera Analysis
      </h1>
      
      <div className="flex-grow mb-4 flex flex-col bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <p className="text-gray-300">
            Use your camera to capture and analyze images for potential wildfire risks.
          </p>
        </div>
        
        <div className="flex-grow p-4">
          <CameraComponent />
        </div>
      </div>
    </div>
  );
};

export default CameraPage; 