import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  Button,
  Hidden,
} from "@mui/material";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { style } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import authAxios from "../../Auth/auth-axios";
let visits = { data: [] };
export const Visits = (props) => {
  const [canceled, setCanceled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (isLoaded) {
      return () => {};
    }
    const getVisits = async () => {
      try {
        visits = await authAxios.get("/api/patient/visits/details/");
        console.log(visits.data);
        console.log(visits);
        setIsLoaded(true);
      } catch (err) {}
    };
    getVisits();
  }, []);
  return (
    <main>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Twoje spotkania z lekarzami
          </Typography>

          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          ></Stack>
        </Container>
      </Box>
      <Container sx={{ py: 1 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={2}>
          {visits.data.map((visit) => (
            <Grid item key={visit.id} xs={12} sm={12} md={12}>
              <Card
                sx={{
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: "80% 20%",
                  gridTemplateRows: "auto auto",
                  placeSelf: "center",
                }}
              >
                <Hidden smDown>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {visit.id}
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe
                      the content.
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    place
                    sx={{
                      alignSelf: "center",
                      gridRow: "1/3",
                      gridColumn: "2/3",
                    }}
                    image="https://source.unsplash.com/random"
                  />
                  <CardActions sx={{}}>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Hidden>
                <Hidden smUp>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {visit.id}
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe
                      the content.
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    place
                    sx={{
                      alignSelf: "center",
                      gridRow: "1/3",
                      gridColumn: "1/3",
                    }}
                    image="https://source.unsplash.com/random"
                  />
                  <CardActions sx={{ gridColumn: "1/3" }}>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Hidden>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};
