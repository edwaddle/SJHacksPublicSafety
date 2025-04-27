import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Thermometer,
  Droplet,
  Wind,
  AlertTriangle,
  Map,
  Cloud,
  Clock,
} from "lucide-react";
import "../index.css";
import { Button } from "@/components/ui/button";

const Home = () => {
  const safetyTips = [
    "Create an evacuation plan for your family",
    "Keep a 72-hour emergency kit ready",
    "Clear vegetation within 30 feet of your home",
    "Stay informed about local fire conditions",
    "Know your evacuation routes",
  ];

  return (
    <Box sx={{ p: 3, pb: 8 }}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-black">LMAOO</div>
        <div className="text-white">LMAOO</div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
      </div>
      <Typography variant="h4" component="h1" gutterBottom color="text.primary">
        Downtown San Jose, CA
      </Typography>

      <Grid container spacing={3}>
        {/* Current Conditions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Current Conditions
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Thermometer color="white" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Temperature"
                    secondary="75°F"
                    primaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Droplet color="white" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Humidity"
                    secondary="55%"
                    primaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Wind color="white" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Wind Speed"
                    secondary="12 mph"
                    primaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Air Quality */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Air Quality
              </Typography>
              <Typography variant="h4" color="secondary.main">
                85 AQI
              </Typography>
              <Typography color="text.primary">
                Moderate: Acceptable; however, there may be a risk for some
                people.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Wildfire Risk */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Wildfire Risk
              </Typography>
              <Typography variant="h4" color="warning.main">
                6/10
              </Typography>
              <Typography color="warning.main">Moderate Risk</Typography>
              <Typography color="text.primary">
                Moderate risk of wildfire due to current weather conditions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Fire Weather Alert */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "error.main" }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AlertTriangle color="white" style={{ marginRight: 8 }} />
                <Typography variant="h6" color="white">
                  Red Flag Warning: Critical Fire Conditions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Historical Wildfire Map */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Past Wildfire Locations
              </Typography>
              <Box
                sx={{
                  height: 200,
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.primary">Map Placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Drought Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Drought Status
              </Typography>
              <Typography variant="h5" color="text.primary">
                Moderate Drought (D2 Level)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Fire Response Tips */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Fire Response Tips
              </Typography>
              <List>
                {safetyTips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ color: "text.primary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Forecast and Risk Time */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Forecast
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Cloud color="white" style={{ marginRight: 8 }} />
                <Typography color="text.primary">
                  AQI forecast: 90 tomorrow
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Clock color="white" style={{ marginRight: 8 }} />
                <Typography color="text.primary">
                  Highest Fire Risk expected at 3PM
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Authorities Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: "100%", maxWidth: 400 }}
            >
              Contact Authorities
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
