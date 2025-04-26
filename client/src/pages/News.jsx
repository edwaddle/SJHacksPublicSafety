import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

const News = () => {
  const newsItems = [
    {
      title: "California Wildfire Season: What to Expect in 2024",
      date: "March 15, 2024",
      link: "#",
    },
    {
      title: "New Fire Prevention Measures Announced for San Jose",
      date: "March 14, 2024",
      link: "#",
    },
    {
      title: "Wildfire Risk Assessment Technology Advances",
      date: "March 13, 2024",
      link: "#",
    },
    {
      title: "Community Preparedness: How to Stay Safe During Fire Season",
      date: "March 12, 2024",
      link: "#",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Wildfire News
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            {newsItems.map((item, index) => (
              <ListItem key={index} divider={index !== newsItems.length - 1}>
                <ListItemText
                  primary={
                    <Link href={item.link} color="primary" underline="hover">
                      {item.title}
                    </Link>
                  }
                  secondary={item.date}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default News;
