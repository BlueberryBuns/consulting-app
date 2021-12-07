import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  Button,
  Hidden,
  Paper,
} from "@mui/material";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useEffect } from "react";
import { useState } from "react";
import authAxios from "../../Auth/auth-axios";
import { SearchField } from "../../components/NavBar/SearchField";
import { SelectSpecs } from "../../components/NavBar/SpecializationSelect";
let specializations = { data: [] };
let doctors = { data: [] };

export const SelectDoctorPatient = (props) => {
  const [canceled, setCanceled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [specialization, setSpecialization] = useState("brak");
  const [isNameTypedIn, setIsNameTypedIn] = useState(false);
  const [parameters, setParameters] = useState({});

  useEffect(() => {
    if (isLoaded) {
      return () => {};
    }
    const getVisits = async () => {
      try {
        specializations = await authAxios.get("/api/specializations/");
        doctors = await authAxios.get("/api/doctors", {
          params: { ...parameters },
        });
      } catch (err) {
      } finally {
        setIsLoaded(true);
      }
    };
    getVisits();
  }, [isLoaded]);

  useEffect(() => {
    console.log("spec Selected!");
    setIsLoaded(false);
    return () => {};
  }, [specialization]);

  useEffect(() => {
    console.log("nameTypedIn!");
    setIsLoaded(false);
    return () => {};
  }, [isNameTypedIn]);

  console.log("XD");

  const getDate = (dateString) => {
    let b = dateString.split(/\D/);
    console.log(b[0], b[1] - 1, b[2]);
    console.log(new Date(+new Date(b[0], b[1] - 1, b[2]) + 1000 * 60 * 60));
    console.log(new Date(dateString));
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
  };

  const selectSpecialization = (event) => {
    setSpecialization(event.target.value);
    setParameters((prevParams) => ({
      ...prevParams,
      specialization: event.target.value,
    }));
    console.log("SET:", event.target.value);
  };

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
            component="h4"
            variant="h4"
            align="center"
            color="text.primary"
          >
            Lista dostepnych lekarzy
          </Typography>

          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          ></Stack>
          <SearchField />
          <SelectSpecs
            {...{
              selectSpecialization: selectSpecialization,
              specs: specialization,
              list: specializations.data,
            }}
          />
        </Container>
      </Box>
      <Container sx={{ py: 1 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={2}>
          {doctors.data.map((doc) => (
            <Grid item key={doc.id} xs={12} sm={12} md={12}>
              <Hidden smDown>
                <Card
                  sx={{
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "80% 20%",
                    gridTemplateRows: "auto auto",
                    placeSelf: "center",
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {doc.doctors_id.academic_title} {doc.first_name}{" "}
                      {doc.last_name}
                    </Typography>
                    <Grid
                      container
                      sx={{
                        paddingBottom: "5px",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridGap: "5px",
                      }}
                    >
                      {doc.doctors_id.specializations.map((spec) => (
                        <Paper elevation={3} sx={{ padding: "8px" }}>
                          {spec.specialization}
                        </Paper>
                      ))}
                    </Grid>

                    <Typography>XD3</Typography>
                    <Typography>XD4</Typography>
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
                    <Button size="large">Join</Button>
                    <Button size="small" color="error">
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              </Hidden>
              <Hidden smUp>
                <Card
                  sx={{
                    height: "100%",
                    display: "grid",
                    // gridTemplateColumns: "80% 20%",
                    // gridTemplateRows: "auto auto",
                    placeSelf: "center",
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {doc.doctors_id.academic_title} {doc.first_name}{" "}
                      {doc.last_name}
                    </Typography>
                    <Grid
                      container
                      sx={{
                        paddingBottom: "5px",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridGap: "5px",
                      }}
                    >
                      {doc.doctors_id.specializations.map((spec) => (
                        <Paper elevation={3} sx={{ padding: "8px" }}>
                          {spec.specialization}
                        </Paper>
                      ))}
                    </Grid>
                  </CardContent>
                  {/* <CardMedia
                    component="img"
                    place
                    sx={{
                      alignSelf: "center",
                      gridRow: "1/3",
                      gridColumn: "1/3",
                    }}
                    image="https://source.unsplash.com/random"
                  /> */}
                  <CardActions sx={{}}>
                    <Button size="small">Join</Button>
                    <Button size="small" color="error">
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              </Hidden>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};
