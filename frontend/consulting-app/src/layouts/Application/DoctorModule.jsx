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
export const DoctorVisits = (props) => {
  const [canceled, setCanceled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visitsUpdated, setVisitsUpdated] = useState(false);
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

  useEffect(() => {
    if (!visitsUpdated) {
      return () => {};
    }
    setVisitsUpdated(false);
    setIsLoaded(false);
  }, [isLoaded, visitsUpdated]);

  const getDate = (dateString) => {
    let b = dateString.split(/\D/);
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
  };

  const isAfterVisit = (dateString) => {
    let visitDate = getDate(dateString);
    console.log(!!(new Date(+new Date() + 1000 * 60 * 60 * 3) >= visitDate));
    return !!(new Date(+new Date() + 1000 * 60 * 60 * 3) >= visitDate);
  };

  const cancelVisit = async (props) => {
    try {
      let res = await authAxios.patch(`/api/doctor/visits/${props}`, {
        status: "CANCELED",
      });
    } catch (err) {}
    setVisitsUpdated(true);

    console.log("cancel", props);
  };

  const confirmVisit = async (props) => {
    try {
      let res = await authAxios.patch(`/api/doctor/visits/${props}`, {
        status: "CONFIRMED",
      });
    } catch (err) {}
    setVisitsUpdated(true);
    console.log("confirmed", props);
  };

  return (
    <main>
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
            Zarządzaj wizytami
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
                      {visit.requested_doctor.id === authState.userId
                        ? visit.atendees.map((a) =>
                            a.id === authState.userId ? "" : ""
                          )
                        : visit.requested_doctor.doctors_id.specializations.map(
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
                    {visit.requested_doctor.id === authState.userId ? (
                      visit.status === "CONFIRMED" ? (
                        <Button
                          onClick={() => {
                            confirmVisit(visit.id);
                          }}
                          size="small"
                          variant="outlined"
                          color="success"
                          disabled={true}
                          sx={{
                            gridColumn: "1/2",
                          }}
                        >
                          Potwierdź
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            confirmVisit(visit.id);
                          }}
                          size="small"
                          variant="outlined"
                          color="success"
                          sx={{
                            gridColumn: "1/2",
                          }}
                        >
                          Potwierdź
                        </Button>
                      )
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        disabled={true}
                        sx={{
                          gridColumn: "1/2",
                        }}
                      >
                        Potwierdź
                      </Button>
                    )}
                    {isAfterVisit(visit.visit_date) ||
                    visit.status === "CANCELED" ? (
                      <Button
                        disabled={true}
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          gridColumn: "2/3",
                        }}
                      >
                        Odwołaj
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          cancelVisit(visit.id);
                        }}
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          gridColumn: "2/3",
                        }}
                      >
                        Odwołaj
                      </Button>
                    )}
                  </CardActions>
                </Hidden>
                {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
                <Hidden smUp>
                  <CardContent sx={{ gridColumn: "1/3" }}>
                    <Typography gutterBottom variant="h5" component="h2">
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
                      {visit.requested_doctor.id === authState.userId
                        ? visit.atendees.map((a) =>
                            a.id === authState.userId ? "" : ""
                          )
                        : visit.requested_doctor.doctors_id.specializations.map(
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
                    {visit.requested_doctor.id === authState.userId ? (
                      visit.status === "CONFIRMED" ? (
                        <Button
                          onClick={() => {
                            confirmVisit(visit.id);
                          }}
                          size="small"
                          variant="outlined"
                          color="success"
                          disabled={true}
                          sx={{
                            gridColumn: "1/2",
                          }}
                        >
                          Potwierdź
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            confirmVisit(visit.id);
                          }}
                          size="small"
                          variant="outlined"
                          color="success"
                          sx={{
                            gridColumn: "1/2",
                          }}
                        >
                          Potwierdź
                        </Button>
                      )
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        disabled={true}
                        sx={{
                          gridColumn: "1/2",
                        }}
                      >
                        Potwierdź
                      </Button>
                    )}
                    {isAfterVisit(visit.visit_date) ||
                    visit.status === "CANCELED" ? (
                      <Button
                        disabled={true}
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          gridColumn: "2/3",
                        }}
                      >
                        Odwołaj
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          cancelVisit(visit.id);
                        }}
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          gridColumn: "2/3",
                        }}
                      >
                        Odwołaj
                      </Button>
                    )}
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
