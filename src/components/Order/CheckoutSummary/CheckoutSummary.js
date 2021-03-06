import React from 'react';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';

import classes from './CheckoutSummary.css';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h2>Here is your burger, press 'Continue' and enter your address!</h2>
            <div style={{width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients}/>
            </div>
            <Button
                clicked={props.checkoutCancelled}
                btnType='Danger'>CANCEL</Button>
            <Button
                clicked={props.checkoutContinued}
                btnType='Success'>CONTINUE</Button>
        </div>
    );
}

export default checkoutSummary;