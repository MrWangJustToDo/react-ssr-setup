import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

const FRUITS = ["🍏 Apple", "🍌 Banana", "🍍 Pineapple", "🥥 Coconut", "🍉 Watermelon"];

function renderItem({ item, handleRemoveFruit }: { item: string; handleRemoveFruit: (s: string) => void }) {
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" title="Delete" onClick={() => handleRemoveFruit(item)}>
          delete
        </IconButton>
      }
    >
      <ListItemText primary={item} />
    </ListItem>
  );
}

export default function MaterialComponent() {
  const [fruitsInBasket, setFruitsInBasket] = useState(FRUITS.slice(0, 3));

  const handleAddFruit = () => {
    const nextHiddenItem = FRUITS.find((i) => !fruitsInBasket.includes(i));
    if (nextHiddenItem) {
      setFruitsInBasket((prev) => [nextHiddenItem, ...prev]);
    }
  };

  const handleRemoveFruit = (item: string) => {
    setFruitsInBasket((prev) => [...prev.filter((i) => i !== item)]);
  };

  const addFruitButton = (
    <Button variant="contained" disabled={fruitsInBasket.length >= FRUITS.length} onClick={handleAddFruit}>
      Add fruit to basket
    </Button>
  );

  return (
    <>
      <h2>Material UI</h2>
      <div>
        {addFruitButton}
        <Box sx={{ mt: 1 }}>
          <List>
            {fruitsInBasket.map((item) => (
              <Fade key={item} in>
                {renderItem({ item, handleRemoveFruit })}
              </Fade>
            ))}
          </List>
        </Box>
      </div>
    </>
  );
}
