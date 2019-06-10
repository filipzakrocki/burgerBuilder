import React from 'react';
import classes from './Button.css';



const button = (props) => (
    <button
        onClick={props.clicked}
        className={[props.Button, classes[props.btnType]].join(' ')}>{props.children}</button>
);

export default button;