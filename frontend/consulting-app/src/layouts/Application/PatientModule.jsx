import { Route, Redirect } from "react-router-dom";
import { SelectDoctorPatient } from "../patient/SelectDoctor";
import { SelectDate } from "../patient/SelectDate";
import { Visits } from "../patient/Visits";
const PatientModule = (props) => {
  return (
    <>
      <Route path="/patient/visits">
        <Visits />
      </Route>
      <Route path="/patient/meeting/browse-doctors">
        <SelectDoctorPatient />
      </Route>
      <Route path="/patient/meeting/select-date">
        <SelectDate />
      </Route>
      <Route exact path="*">
        <Redirect to="/patient/visits" />
      </Route>
    </>
  );
};

export { PatientModule };
