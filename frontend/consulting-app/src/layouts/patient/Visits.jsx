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
import { useSelector } from "react-redux";
import { style } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import authAxios from "../../Auth/auth-axios";

let visits = { data: [] };
export const Visits = (props) => {
  const [canceled, setCanceled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const authState = useSelector((state) => state.account);
  useEffect(() => {
    if (isLoaded) {
      return () => {};
    }
    const getVisits = async () => {
      try {
        visits = await authAxios.get("/api/patient/visits/details/");

        console.log(visits);
      } catch (err) {
      } finally {
        setIsLoaded(true);
      }
    };
    getVisits();
  }, [isLoaded]);

  const getDate = (dateString) => {
    let b = dateString.split(/\D/);
    console.log(b);
    console.log(b[0], b[1] - 1, b[2]);
    console.log(new Date(+new Date(b[0], b[1] - 1, b[2]) + 1000 * 60 * 60));
    console.log(new Date(dateString));
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
  };

  const isAfterVisit = (dateString) => {
    let visitDate = getDate(dateString);
    console.log(!!(new Date(+new Date() + 1000 * 60 * 60 * 3) >= visitDate));
    return !!(new Date(+new Date() + 1000 * 60 * 60 * 3) >= visitDate);
  };

  const jointVisit = (props) => {
    console.log("join", props);
  };

  const cancelVisit = (props) => {
    console.log("cancel", props);
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
            Twoje spotkania
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
                      {/* {visit.atendees[0].doctors_id
                        ? visit.atendees[0].doctors_id.academic_title
                        : ""}{" "}
                      {visit.atendees[0].first_name}{" "}
                      {visit.atendees[0].last_name} */}
                      {/* {visit.requested_doctor.doctors_id.academic_title === authState.userId? }{" "}
                      {visit.requested_doctor.first_name}{" "}
                      {visit.requested_doctor.last_name} */}
                      {visit.requested_doctor.id === authState.userId
                        ? visit.atendees.map((a) =>
                            a.id === authState.userId
                              ? ""
                              : `Pacjent ${a.first_name} ${a.last_name}`
                          )
                        : `${visit.requested_doctor.doctors_id.academic_title} ${visit.requested_doctor.first_name} ${visit.requested_doctor.last_name}`}
                    </Typography>
                    <Grid
                      container
                      sx={{
                        paddingBottom: "5px",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridGap: "5px",
                      }}
                    >
                      {visit.requested_doctor.doctors_id.specializations.map(
                        (spec) => (
                          <Paper elevation={3} sx={{ padding: "8px" }}>
                            {spec.specialization}
                          </Paper>
                        )
                      )}
                    </Grid>
                    <Grid
                      container
                      sx={{
                        marginTop: "20px",
                        display: "grid",
                        gridTemplateColumns: "1fr 3fr",
                        gridTemplateRows: "1fr 1fr 1fr",
                        gridGap: "6px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          gridRow: "1 / 2",
                          gridColumn: "1 / 2",
                        }}
                      >
                        Termin konsultacji:
                      </Typography>
                      <Typography
                        sx={{
                          gridRow: "1 / 2",
                          gridColumn: "2 / 3",
                        }}
                      >
                        {visit.visit_date.split("T")[0]}{" "}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          gridRow: "2 / 3",
                          gridColumn: "1 / 2",
                        }}
                      >
                        Godzina:{" "}
                      </Typography>
                      <Typography
                        sx={{
                          gridRow: "2 / 3",
                          gridColumn: "2 / 3",
                        }}
                      >
                        {visit.visit_date.split("T")[1].substring(0, 5)}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          gridRow: "3 / 3",
                          gridColumn: "1 / 2 ",
                        }}
                      >
                        Status:
                      </Typography>
                      <Typography
                        sx={{
                          gridRow: "3 / 4",
                          gridColumn: "2 / 3",
                        }}
                      >
                        {visit.status}
                      </Typography>
                    </Grid>
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
                    {visit.status != "CONFIRMED" ||
                    isAfterVisit(visit.visit_date) ? (
                      <Button
                        onClick={() => {
                          jointVisit(visit);
                        }}
                        disabled={true}
                        size="small"
                      >
                        Dołącz
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          jointVisit(visit);
                        }}
                        size="small"
                      >
                        Dołącz
                      </Button>
                    )}
                    <Button
                      disabled={isAfterVisit(visit.visit_date)}
                      size="small"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Hidden>
                <Hidden smUp>
                  <CardMedia
                    component="img"
                    sx={{
                      alignSelf: "center",
                      gridRow: "1/3",
                      gridColumn: "1/3",
                    }}
                    image="https://source.unsplash.com/random"
                  />
                  <CardContent sx={{ gridColumn: "1/3" }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {visit.atendees[0].doctors_id
                        ? visit.atendees[0].doctors_id.academic_title
                        : ""}{" "}
                      {visit.atendees[0].first_name}{" "}
                      {visit.atendees[0].last_name}
                    </Typography>
                    <Grid
                      container
                      sx={{
                        paddingBottom: "5px",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridGap: "5px",
                      }}
                    >
                      {visit.atendees[0].doctors_id
                        ? visit.atendees[0].doctors_id.specializations
                          ? visit.atendees[0].doctors_id.specializations.map(
                              (spec) => (
                                <Paper elevation={3} sx={{ padding: "8px" }}>
                                  {spec.specialization}
                                </Paper>
                              )
                            )
                          : "N"
                        : ""}
                    </Grid>

                    <Grid
                      container
                      sx={{
                        marginTop: "20px",
                        display: "grid",
                        gridTemplateColumns: "1fr 3fr",
                        gridTemplateRows: "1fr 1fr 1fr",
                        gridGap: "6px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          gridRow: "1 / 2",
                          gridColumn: "1 / 2",
                        }}
                      >
                        Termin:
                      </Typography>
                      <Typography
                        sx={{
                          gridRow: "1 / 2",
                          gridColumn: "2 / 3",
                        }}
                      >
                        {visit.visit_date.split("T")[0]}{" "}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          gridRow: "2 / 3",
                          gridColumn: "1 / 2",
                        }}
                      >
                        Godzina:{" "}
                      </Typography>
                      <Typography
                        sx={{
                          gridRow: "2 / 3",
                          gridColumn: "2 / 3",
                        }}
                      >
                        {visit.visit_date.split("T")[1].substring(0, 5)}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          gridRow: "3 / 3",
                          gridColumn: "1 / 2 ",
                        }}
                      >
                        Status:
                      </Typography>
                      <Typography
                        sx={{
                          gridRow: "3 / 4",
                          gridColumn: "2 / 3",
                        }}
                      >
                        {visit.status}
                      </Typography>
                    </Grid>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridColumn: "1/3",
                    }}
                  >
                    {visit.status != "CONFIRMED" ||
                    isAfterVisit(visit.visit_date) ? (
                      <Button
                        onClick={() => {
                          jointVisit(visit);
                        }}
                        disabled={true}
                        size="small"
                        variant="outlined"
                        sx={{
                          gridColumn: "1/2",
                        }}
                      >
                        Dołącz
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          jointVisit(visit);
                        }}
                        size="small"
                        variant="outlined"
                        sx={{
                          gridColumn: "1/2",
                        }}
                      >
                        Dołącz
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        cancelVisit(visit);
                      }}
                      disabled={isAfterVisit(visit.visit_date)}
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{
                        gridColumn: "2/3",
                      }}
                    >
                      Cancel
                    </Button>
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
