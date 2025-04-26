import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';

const Camera = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Camera Feed
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <VideocamIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                Camera Feed 1
              </Typography>
              <Typography color="text.secondary">
                Live feed will be displayed here
              </Typography>
            </Box>
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
            Camera Status
          </Typography>
          <Typography color="text.secondary">
            All cameras are operational and streaming
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Camera; 