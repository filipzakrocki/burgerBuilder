import React from 'react';
import classes from './Input.css';

const Input = (props) => {

    let inputType = null;

    switch (props.elementType) {
        case ('input'):
            inputType = <input onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value}/>
            break;
        case ('textarea'):
            inputType = <textarea onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value}/>
            break;
        case ('select'):
                inputType = (
                    <select onChange={props.changed}
                    className={classes.InputElement}
                    value={props.value}>
                        {props.elementConfig.options.map( option => (
                            <option key={option.value} value={option.value}>
                            {option.displayValue}
                            </option>
                        )  )}
                    </select>
                )
                break;    
        default:
            inputType = <input onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value}/>     
    }



    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputType}
        </div>
    );
}

export default Input;