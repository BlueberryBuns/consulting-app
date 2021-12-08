import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const LinkTypography = (props) => {
  const { to, text, ...rest } = props;

  const CustomLink = (props) => (
    <Link to={to} style={{ textDecoration: "none" }} {...props} />
  );

  return (
    <Typography {...rest} component={CustomLink}>
      {text}
    </Typography>
  );
};

export default LinkTypography;
