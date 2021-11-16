import { AppBar, Card, CardContent, Container, Grid } from "@mui/material";
import { Toolbar } from "@mui/material";
import MedService from "@mui/icons-material/MedicalServices";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import MyCarousel from "../../components/NavigationBar/Carousel";
const LandingPage = () => {
  return (
    <>
      <Box
        alignSelf="center"
        sx={{
          bgcolor: "background.paper",
          pt: 0,
          pb: 8,
        }}
      >
        <Container maxwidth="sm">
          <Typography align="center" gutterBottom>
            <MyCarousel />
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ paddingTop: 5 }}>
        <Grid container spacing={6}>
          <Grid xs={6} sm={6} md={2}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent>XDDDDDDDD</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LandingPage;
