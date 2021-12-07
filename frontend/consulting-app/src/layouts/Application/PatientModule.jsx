import { Route, Redirect } from "react-router-dom";
import { SelectDoctorPatient } from "../patient/SelectDoctor";
import { SelectDate } from "../patient/SelectDate";
import { Visits } from "../patient/Visits";
const PatientModule = (props) => {
  return (
    <>
      <Route
        exact
        path="/patient/visits"
        render={(props) => <Visits />}
      ></Route>
      <Route
        exact
        path="/patient/meeting/browse-doctors"
        render={(props) => <SelectDoctorPatient />}
      ></Route>
      <Route
        exact
        path="/patient/meeting/select-date"
        render={(props) => <SelectDate />}
      ></Route>
      <Route exact path="*">
        <Redirect to="/patient/visits" />
      </Route>
    </>
  );
};

export { PatientModule };
