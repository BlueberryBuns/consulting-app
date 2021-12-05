import { Route, Redirect } from "react-router-dom";
import { SelectDoctor } from "../patient/SelectDoctor";
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
        path="/patient/meeting/browse-doctos"
        render={(props) => <SelectDoctor />}
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
