import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useState } from "react";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileChange = (event) => {
    setError(null);
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResults(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setError(null);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResults(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Function to determine color gradient based on risk level
  const getRiskGradient = (riskScore) => {
    if (riskScore <= 3) return "from-green-400 to-green-600"; // Low risk
    if (riskScore <= 6) return "from-yellow-400 to-orange-500"; // Moderate risk
    if (riskScore <= 8) return "from-orange-400 to-red-500"; // High risk
    return "from-red-500 to-red-700"; // Extreme risk
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        "http://localhost:4000/api/upload/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysisResults(response.data);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(
        err.response?.data?.error ||
          "Failed to analyze image. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
                onClick={() => document.getElementById("file-upload").click()}
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

                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
                    <p className="text-slate-300">Analyzing image...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-64 px-4">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-red-400 text-center">{error}</p>
                  </div>
                ) : analysisResults ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-slate-200">
                        Wildfire Risk
                      </h3>
                      <div className="flex items-center">
                        <p className="text-3xl font-bold text-orange-500">
                          {analysisResults.riskScore}/10
                        </p>
                        <div
                          className={`ml-auto h-16 w-16 rounded-full bg-gradient-to-br ${getRiskGradient(
                            analysisResults.riskScore
                          )} flex items-center justify-center`}
                        >
                          <span className="text-2xl font-bold">
                            {analysisResults.riskScore}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mt-2">
                        Risk Level:{" "}
                        <span className="font-semibold">
                          {analysisResults.riskLevel}
                        </span>
                      </p>
                      <p className="text-sm text-slate-300 mt-2">
                        Detection:{" "}
                        <span className="font-semibold">
                          {analysisResults.detection}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-200">
                        Analysis
                      </h3>
                      <p className="text-slate-300">
                        {analysisResults.analysis}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-slate-300">
                      Upload and analyze an image to see results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center mt-4">
            <button
              className="w-full max-w-md py-4 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!selectedFile || loading}
              onClick={handleAnalyzeImage}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
