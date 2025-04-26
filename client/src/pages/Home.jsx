import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TimelineIcon from '@mui/icons-material/Timeline';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Wildfire Detection Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Alerts</Typography>
              </Box>
              <Typography variant="h3">0</Typography>
              <Typography color="text.secondary">No active wildfires detected</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CameraAltIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Cameras</Typography>
              </Box>
              <Typography variant="h3">3</Typography>
              <Typography color="text.secondary">Cameras monitoring</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">System Status</Typography>
              </Box>
              <Typography variant="h3">100%</Typography>
              <Typography color="text.secondary">All systems operational</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography color="text.secondary">
          No recent wildfire activity detected
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home; 