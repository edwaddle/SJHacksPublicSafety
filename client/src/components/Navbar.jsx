import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Home, Camera, MessageSquare, Newspaper } from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentPath}
        sx={{
          bgcolor: "background.paper",
          height: 64,
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<Home />}
          component={RouterLink}
          to="/"
        />
  
        <BottomNavigationAction
          label="Chat"
          value="/chat"
          icon={<MessageSquare />}
          component={RouterLink}
          to="/chat"
        />
        <BottomNavigationAction
          label="News"
          value="/news"
          icon={<Newspaper />}
          component={RouterLink}
          to="/news"
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar;
