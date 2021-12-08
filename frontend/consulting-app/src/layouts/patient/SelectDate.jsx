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
  Modal,
} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Redirect, useHistory } from "react-router-dom";
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
  const authState = useSelector((state) => state.account);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [visitArray, setVisitArray] = useState(false);
  const [scheduledVisists, setScheduledVisists] = useState();
  const [parameters, setParameters] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [viableVisitTerms, setViableVisitTerms] = useState(false);
  const [openPositive, setOpenPositive] = useState(false);
  const [openNegative, setOpenNegative] = useState(false);
  const history = useHistory();

  const handleOpenPositive = () => setOpenPositive(true);
  const handleClosePositive = () => {
    setOpenPositive(false);
    history.push("/");
  };

  const handleOpenNegative = () => setOpenNegative(true);
  const handleCloseNegative = () => {
    setOpenNegative(false);
    history.push("/");
  };

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
    if (scheduledVisists && visitArray) {
      checkViableDates(scheduledVisists, visitArray);
    }
  }, [visitArray, scheduledVisists]);

  useEffect(() => {}, [viableVisitTerms]);

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
    setSelectedDate(new Date(props));
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
      14,
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
    setDataReady(true);
  };

  const checkViableDates = (plannedSchedule, defaultSchedule) => {
    let viableTerms = [];
    let isTaken = false;
    console.log("AAAAAAAAAAAAAAAAAAAAA");
    console.log(plannedSchedule, defaultSchedule);
    defaultSchedule.map((p) => {
      isTaken = false;
      plannedSchedule.map((d) => {
        if (p.toString() === new Date(d.visit_date).toString()) {
          isTaken = true;
          console.log("takie same1!!!!!!!!!!!!!!!!!!!!!!!!");
        }
      });
      if (!isTaken) {
        viableTerms.push(p);
      }
    });
    console.log(viableTerms);
    setViableVisitTerms(viableTerms);
  };

  const sendVisitRequest = async (date, doctor) => {
    try {
      const res = await authAxios.post("/api/patient/visits/", {
        visit_date: date,
        atendees: [doctor, authState.userId],
        requested_doctor: doctor,
      });
      console.log(res);
      if (res.status === 201) {
        handleOpenPositive();
      }
    } catch (err) {
      handleCloseNegative();
    }
    console.log(date, authState.userId, doctor);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 200,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
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
        <Hidden mdDown>
          <Modal
            width="100%"
            open={openPositive}
            onClose={handleClosePositive}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Operacja powiodła się!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Dziękujemy za korzystanie z aplikacji.
              </Typography>
            </Box>
          </Modal>
          <Modal
            open={openNegative}
            onClose={handleCloseNegative}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Operacja nie powiodła się!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Wystąpił problem przy dodwaniu wizyty.
              </Typography>
            </Box>
          </Modal>
        </Hidden>
        <Container sx={{ display: "grid" }} maxWidth="md">
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
              inputFormat="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
              textFieldStyle={{ width: "100%" }}
            />
          </LocalizationProvider>
        </Container>
      </Box>
      <Container sx={{ py: 1, display: "grid" }} maxWidth="md">
        {visitArray ? (
          <Grid
            container
            sx={{ display: "grid", rowGap: "5px", gridTemplateColumns: "1fr" }}
          >
            {/* {visitArray.map((v) =>
              doctorVisits ? (
                doctorVisits.data.map((visit) =>
                  v.toString() == new Date(visit.visit_date).toString() ? (
                    <></>
                  ) : ( */}

            {viableVisitTerms ? (
              viableVisitTerms.length === 0 ? (
                <div>Brak wolnych wizyt</div>
              ) : (
                viableVisitTerms.map((v) => (
                  <Card
                    sx={{
                      height: "100%",
                      display: "grid",
                      gridTemplateRows: "auto",
                      width: "100%",
                      placeSelf: "center",
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Wolny termin konsultacji
                      </Typography>
                      <Grid
                        container
                        sx={{
                          marginTop: "20px",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
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
                          {v.getDate()}-{v.getMonth() + 1}-{v.getFullYear()}
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
                          {v.getHours()}:
                          {v.getMinutes() ? v.getMinutes() : "00"}
                        </Typography>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{}}>
                      <Button
                        onClick={() => {
                          return sendVisitRequest(v, visitState.doctorId);
                        }}
                        color="success"
                        variant="outlined"
                        sx={{ width: "100%" }}
                      >
                        Zarezerwuj
                      </Button>
                    </CardActions>
                  </Card>
                ))
              )
            ) : (
              <></>
            )}
          </Grid>
        ) : (
          <></>
        )}
      </Container>
    </main>
  );
};
