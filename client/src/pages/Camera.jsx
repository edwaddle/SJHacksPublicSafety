import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Camera = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setAnalysisResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setAnalysisResult(data.result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAnalysisResult(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Camera Feed
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <VideocamIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                Camera Feed 1
              </Typography>
            </Box>
            <input
              accept="image/*"
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
              disabled={!selectedFile}
            >
              Analyze Image
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <VideocamIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                Camera Feed 2
              </Typography>
              <Typography color="text.secondary">
                Live feed will be displayed here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Card sx={{ mt: 3 }}>
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
            <Alert 
              severity={analysisResult === 'YES' ? 'error' : analysisResult === 'NO' ? 'success' : 'warning'}
              sx={{ mb: 2 }}
            >
              Wildfire Detection: {analysisResult}
            </Alert>
          )}
          <Typography color="text.secondary">
            {!analysisResult && !error && 'Upload an image to analyze for wildfire detection'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Camera; 