import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export const SliderButton = (props) => {
  const { to, text, ...rest } = props;

  const CustomLink = (props) => (
    <Link sx={{ textDecoration: "none" }} to={to} {...props} />
  );

  return (
    <Button
      {...rest}
      sx={{
        borderBottom: "1px solid black",
        borderRadius: "0 0 0 0 !important",
      }}
      variant="secondary"
      component={(props) => <CustomLink {...props} />}
    >
      {text}
    </Button>
  );
};
