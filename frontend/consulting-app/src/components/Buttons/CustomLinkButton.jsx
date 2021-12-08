import { Button } from "@mui/material";
import { Link, useNavigate, Navigate } from "react-router-dom";

const ButtonLink = (props) => {
  const { to, text, ...rest } = props;

  const CustomLink = (props) => <Link to={to} {...props} />;

  return (
    <Button {...rest} component={CustomLink}>
      {text}
    </Button>
  );
};

export default ButtonLink;
