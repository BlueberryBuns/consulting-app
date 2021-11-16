import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
const MyCarousel = () => {
  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
    },
  ];

  return (
    <Carousel
      NextIcon={<AccessibleForwardIcon />}
      PrevIcon={<AccessibleForwardIcon />}
    >
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
};

function Item(props) {
  return (
    <Paper>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>
      <AccessibleForwardIcon />

      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
}

export default MyCarousel;
