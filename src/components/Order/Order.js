import React from 'react';
import classes from './Order.css';

const order = (props) => (
    <div className={classes.Order}>
        <p>Ingredients: </p>
        <p>Price: <strong>5.45 USD</strong></p>
        <p>Kcal: </p>
    </div>
);
    


export default order;