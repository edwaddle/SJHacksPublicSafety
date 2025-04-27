import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Loader, ChevronDown } from "lucide-react";

const MicrophoneComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const languages = [
    { id: "english", name: "English" },
    { id: "spanish", name: "Spanish" },
    { id: "hindi", name: "Hindi" },
    { id: "chinese", name: "Chinese" },
    { id: "vietnamese", name: "Vietnamese" },
    { id: "tagalog", name: "Tagalog" }
  ];

  useEffect(() => {
    // Clean up when unmounting
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setErrorMessage("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    
    try {
      // Create a FormData object to send the audio file and language
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("language", selectedLanguage);
      
      // This endpoint would need to be created on your server
      const response = await fetch("http://localhost:4000/api/transcribe", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }
      
      const data = await response.json();
      setTranscription(data.transcription);
      
      // Send the transcribed text to the chat API
      if (data.transcription) {
        await sendTranscriptionToChat(data.transcription);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setErrorMessage("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
      setAudioBlob(null);
    }
  };

  const sendTranscriptionToChat = async (text) => {
    try {
      const response = await fetch("http://localhost:4000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message to chat");
      }
      
      // You would typically handle the response here, 
      // perhaps adding it to your chat messages
      
    } catch (error) {
      console.error("Error sending to chat:", error);
    }
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguageMenu(false);
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-md">
      <div className="mb-4">
        <div className="relative inline-block w-full">
          <button 
            onClick={toggleLanguageMenu}
            className="flex justify-between items-center w-full px-4 py-2 bg-slate-700 rounded-md text-white"
          >
            <span>{languages.find(lang => lang.id === selectedLanguage)?.name || "Select Language"}</span>
            <ChevronDown size={18} />
          </button>
          
          {showLanguageMenu && (
            <div className="absolute mt-1 w-full z-10 bg-slate-700 rounded-md shadow-lg">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => selectLanguage(language.id)}
                  className={`block w-full text-left px-4 py-2 hover:bg-slate-600 ${
                    selectedLanguage === language.id ? "bg-amber-600" : ""
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="p-4 bg-amber-600 hover:bg-amber-700 rounded-full text-white"
          >
            <Mic size={24} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full text-white animate-pulse"
          >
            <MicOff size={24} />
          </button>
        )}
      </div>
      
      {audioBlob && (
        <div className="mb-4">
          <audio controls className="w-full">
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          
          <button
            onClick={handleProcessAudio}
            disabled={isProcessing}
            className={`mt-2 w-full py-2 rounded-md text-white flex items-center justify-center ${
              isProcessing ? "bg-slate-600" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader size={18} className="animate-spin mr-2" /> Processing...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" /> Send Audio
              </>
            )}
          </button>
        </div>
      )}
      
      {transcription && (
        <div className="p-3 bg-slate-700 rounded-md">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Transcription:</h3>
          <p className="text-white">{transcription}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-sm text-red-300">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default MicrophoneComponent; 