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
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Redirect } from "react-router-dom";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { TextField } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import authAxios from "../../Auth/auth-axios";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { useSelector } from "react-redux";
let specializations = { data: [] };
let doctor = { data: [] };
let doctorVisits = false;

export const SelectDate = (props) => {
  const visitState = useSelector((state) => state.visit);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [visitArray, setVisitArray] = useState(false);
  const [scheduledVisists, setScheduledVisists] = useState();
  const [parameters, setParameters] = useState({});
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const getDoctorData = async () => {
      try {
        let docId = visitState.doctorId;
        doctor = await authAxios.get(`/api/doctors/${docId}/`);
        // doctorVisits = await authAxios.get("/api/patient/doctor/visits");
        console.log(doctor);
      } catch (err) {
      } finally {
        setIsLoaded(true);
      }
    };
    const getVisits = async () => {
      console.log(parameters);
      try {
        doctorVisits = await authAxios.get("/api/patient/doctor/visits", {
          params: { ...parameters },
        });
        console.log(doctorVisits);
      } catch (err) {
      } finally {
        setDataReady(false);
        if (doctorVisits?.data) {
          setScheduledVisists(doctorVisits.data);
        }
      }
    };

    if (dataReady) {
      console.log("inside");
      getVisits();
    }
    if (isLoaded) {
      return () => {};
    }
    getDoctorData();
  }, [isLoaded, parameters, dataReady]);

  useEffect(() => {
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBB");
    if (scheduledVisists && visitArray) {
      checkViableDates(scheduledVisists, visitArray);
    }
  }, [visitArray, scheduledVisists]);

  let meetingDatesArray;

  const getDateArray = (startDate, stopDate) => {
    const dates = [];
    let dateIterator = startDate;
    const addThiryMinutes = (date) => {
      return new Date(+date + 1000 * 60 * 30);
    };
    while (dateIterator < stopDate) {
      dates.push(dateIterator);
      console.log(dateIterator);
      dateIterator = addThiryMinutes(dateIterator);
    }
    console.log("Tu dodawane są daty poniżej");
    console.log(dates);
    return dates;
  };

  let beginningDate;
  let endingDate;

  const handleDateChange = (props) => {
    beginningDate = new Date(
      props.getFullYear(),
      props.getMonth(),
      props.getDate(),
      10,
      0,
      0,
      0
    );
    endingDate = new Date(
      props.getFullYear(),
      props.getMonth(),
      props.getDate(),
      16,
      0,
      0,
      0
    );

    setVisitArray(getDateArray(beginningDate, endingDate));

    setParameters((prevParams) => ({
      ...prevParams,
      datelookup: beginningDate,
      datelookdown: endingDate,
    }));
    console.log("XD");
    setDataReady(true);
  };

  const checkViableDates = (plannedSchedule, defaultSchedule) => {
    let viableTerms = [];
    console.log("AAAAAAAAAAAAAAAAAAAAA");
    console.log(plannedSchedule, defaultSchedule);
    plannedSchedule.map((p) => {
      defaultSchedule.map((d) => {
        console.log(p);
        console.log(d);
      });
    });
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
            Wybierz datę spotkania
          </Typography>

          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          ></Stack>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Container>
      </Box>
      <Container sx={{ py: 1 }} maxWidth="md">
        {/* End hero unit */}
        {visitArray ? <div>11</div> : <div>14</div>}
        {doctorVisits ? <div>12</div> : <div>15</div>}
        {visitArray ? (
          doctorVisits ? (
            doctorVisits.data.map((visit) => <div>xd</div>)
          ) : (
            <div>2222</div>
          )
        ) : (
          <div>123</div>
        )}

        {visitArray ? (
          <div>
            {visitArray.map((v) =>
              doctorVisits ? (
                doctorVisits.data.map((visit) =>
                  v.toString() == new Date(visit.visit_date).toString() ? (
                    <div>Tutaj nie wyświetlać!!!</div>
                  ) : (
                    <div>{v.toString()}</div>
                  )
                )
              ) : (
                <div>3333</div>
              )
            )}
          </div>
        ) : (
          <div>321</div>
        )}

        {visitArray ? (
          visitArray.map((freeDate) =>
            doctorVisits ? (
              doctorVisits.data.map((plannedVisit) => (
                <div>{new Date(plannedVisit.visit_date).toString()}</div>
              ))
            ) : (
              <div>XD</div>
            )
          )
        ) : (
          <div>14</div>
        )}
        {console.log(doctorVisits)}
        <Grid container>
          {visitArray ? (
            visitArray.map((visit) => (
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
                    Wyzyta lekarska godzina
                  </Typography>
                  <Grid
                    container
                    sx={{
                      paddingBottom: "5px",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gridGap: "5px",
                    }}
                  >
                    <Paper elevation={3} sx={{ padding: "8px" }}>
                      13:30
                    </Paper>
                  </Grid>
                </CardContent>
                <CardActions sx={{}}>
                  <Button size="large" color="success">
                    Umów wizytę
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <></>
          )}
          {/* {doctors.data.map((doc) => (
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
                    <Button
                      onClick={() => {
                        selectDoctorAndRedirect(doc.id);
                      }}
                      size="large"
                      color="success"
                    >
                      Umów wizytę
                    </Button>
                  </CardActions>
                </Card>
              </Hidden>
              <Hidden smUp>
                <Card
                  sx={{
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "80% 20%",
                    gridTemplateRows: "auto auto",
                    placeSelf: "center",
                  }}
                >
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
                  <CardContent sx={{ gridColumn: "1/4" }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {doc.doctors_id.academic_title} {doc.first_name}{" "}
                      {doc.last_name}
                    </Typography>
                    <Grid
                      container
                      sx={{
                        paddingBottom: "5px",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
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

                  <CardActions
                    sx={{
                      marginLeft: "10px",
                      gridRow: "2/3",
                      gridColumn: "1/3",
                    }}
                  >
                    <Button
                      onClick={() => {
                        selectDoctorAndRedirect(doc.id);
                      }}
                      size="small"
                      color="success"
                      variant="contained"
                    >
                      Umów wizytę
                    </Button>
                  </CardActions>
                </Card>
              </Hidden>
            </Grid> 
          ))}*/}
        </Grid>
      </Container>
    </main>
  );
};
