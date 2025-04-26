import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent, Button, Alert, CircularProgress } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const API_BASE_URL = 'http://localhost:4000/api';

const Camera = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Fetch camera status on component mount
    const fetchCameraStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/camera/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch camera status');
        }

        const data = await response.json();
        setCameraStatus(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching camera status:', err);
        setError('Unable to connect to the server. Please ensure the server is running.');
        
        // Retry logic
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      }
    };

    fetchCameraStatus();
  }, [retryCount]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setSelectedFile(null);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG and PNG images are allowed');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/camera/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze image');
      }

      setAnalysisResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Please try again.');
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" gutterBottom>
        Image Analysis
      </Typography>
      
      <Paper sx={{ 
        p: 4, 
        width: '100%',
        maxWidth: '600px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 4
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <VideocamIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Upload Image for Analysis
          </Typography>
          {cameraStatus && (
            <Typography variant="body2" color="text.secondary">
              System Status: {cameraStatus.status}
            </Typography>
          )}
        </Box>
        <input
          accept=".jpg,.jpeg,.png"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Image
          </Button>
        </label>
        {selectedFile && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected: {selectedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
        </Button>
      </Paper>
      
      <Card sx={{ 
        width: '100%',
        maxWidth: '600px'
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {analysisResult && (
            <>
              <Alert 
                severity={analysisResult.detection === 'YES' ? 'error' : analysisResult.detection === 'NO' ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              >
                Wildfire Detection: {analysisResult.detection}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Confidence: {analysisResult.confidence}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Timestamp: {new Date(analysisResult.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                File: {analysisResult.details.fileName}
              </Typography>
            </>
          )}
          <Typography color="text.secondary">
            {!analysisResult && !error && !loading && 'Upload an image to analyze for wildfire detection'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Camera; 