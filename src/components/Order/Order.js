import React from "react";
import classes from "./Order.css";

const order = props => {
  const ingredients = [];

  for (let ingredientName in props.ingredients) {
    ingredients.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName]
    });
  }

  let ingredientOutput = ingredients.map(ig => {
    return ig.amount !== 0 ? (
      <span
        style={{
          textTransform: "capitalize",
          display: "inline-block",
          margin: "3px 8px",
          border: "1px solid #ccc",
          padding: "5px"
        }}
        key={ig.name}
      >
        {ig.name} ({ig.amount}){" "}
      </span>
    ) : null;
  });

  const formattedDate = date => new Date(date).toUTCString();

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>
        Price: <strong>{props.price.toFixed(2)} USD</strong>
        <span
          style={{
            color: props.kcal >= 1000 ? "red" : "green",
            fontWeight: "600",

            marginLeft: "100px"
          }}
        >
          Kcal: {props.kcal}
        </span>
      </p>

      <p
        style={{
          color: "gray",
          fontWeight: "100",
          textAlign: "right",
          fontSize: "12px"
        }}
      >
        Order Time: {formattedDate(props.date)}
      </p>
    </div>
  );
};

export default order;
