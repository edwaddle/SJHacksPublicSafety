import { Upload, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="bg-slate-900 min-h-screen py-10 px-4 sm:px-6 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-amber-400">
          Image Analysis
        </h1>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Image Upload Section */}
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Upload Image
              </h2>
              <div 
                className="h-48 border-2 border-dashed border-amber-500 rounded-lg flex flex-col items-center justify-center mb-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload size={48} className="mb-4 text-amber-400" />
                <p className="text-slate-300">Drag and drop an image here</p>
                <p className="text-sm text-slate-400 my-1">or</p>
                <button className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                  Browse Files
                </button>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Image Preview
                </h2>
                <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center text-slate-400">
                      <ImageIcon size={40} className="mr-2" />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Analysis Results
                </h2>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-200">Wildfire Risk</h3>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-orange-500">6/10</p>
                    <div className="ml-auto h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
                      <span className="text-2xl font-bold">6</span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-200">Confidence Level</h3>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-blue-400">85%</p>
                    <div className="w-full max-w-[200px] ml-4 h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-200">Analysis</h3>
                  <p className="text-slate-300">
                    The image shows moderate risk factors for wildfire, including
                    dry vegetation and high temperatures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center mt-4">
            <button 
              className="w-full max-w-md py-4 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!selectedFile}
            >
              Analyze Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;