import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { Upload, Image as ImageIcon } from "lucide-react";

const Camera = () => {
  return (
    <Box sx={{ p: 3, pb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Image Upload Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Image
              </Typography>
              <Box
                sx={{
                  height: 200,
                  border: "2px dashed",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Upload size={48} style={{ marginBottom: 16 }} />
                <Typography>Drag and drop an image here</Typography>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
                <Button variant="contained" sx={{ mt: 1 }}>
                  Browse Files
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Preview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Image Preview
              </Typography>
              <Box
                sx={{
                  height: 300,
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <ImageIcon size={48} />
                <Typography sx={{ ml: 1 }}>No image selected</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Wildfire Risk</Typography>
                <Typography variant="h4" color="warning.main">
                  6/10
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Confidence Level</Typography>
                <Typography variant="h4" color="primary.main">
                  85%
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Analysis</Typography>
                <Typography>
                  The image shows moderate risk factors for wildfire, including
                  dry vegetation and high temperatures.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analyze Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: "100%", maxWidth: 400 }}
            >
              Analyze Image
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Camera;
