import React, { Component } from 'react';
import axios from '../../axios-orders';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions'


import Auxilliary from '../../hoc/Auxilliary/Auxilliary'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import Spinner from '../../components/UI/Spinner/Spinner'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';



class BurgerBuilder extends Component {
    
    state = {
        totalPrice: 4, //starting price
        totalKcal: 120, // bun kcal
        purchasable: false, // ingredients present, can you buy?
        purchasing: false, // moved to checkout?
        loading: false, // is the request being sent?
    }
    
    componentDidMount = () => {
        // axios.get('https://my-project-1551193995472.firebaseio.com/ingredients.json')
        // .then(response => {
        //     this.setState({ingredients: response.data})
        //     this.updateInitialKcalHandler();
        //     this.updatePurchaseState(this.state.ingredients);
        // })
        // .catch(err => {
        //     this.setState({error: true})
        // })
        
        
        
    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true})
    }
    

    
    purchaseContinueHandler = () => {
        
        const queryParams = [];
        
        for (let i in this.props.ings) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]))
        }
        queryParams.push('price=' + this.props.prc)        
        queryParams.push('kcal=' + this.props.kcal)        
        const queryString = queryParams.join('&');
        
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
    }
    
    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }
    
    
    updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients)
        .map( igKey => {
            return ingredients[igKey]
        })
        .reduce( (sum, el) => {
            return sum+el;
        } ,0);
        this.setState({purchasable: sum > 0})
    }
 

    
    
    render() {
        
        const disabledInfo = {
            ...this.props.ings
        };
        
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null;    
        let burger = this.state.error ? <p>Ingredients cannnot be loaded!</p> : <Spinner/>;
        
        if (this.props.ings) {
            burger = (
            <Auxilliary>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ordered={this.purchaseHandler}
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    price={this.props.prc}
                    totalKcal={this.props.kcal}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}/>
            </Auxilliary>
        );
            
            orderSummary = <OrderSummary
                        price={this.props.prc}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        ingredients={this.props.ings}/>
        }
        
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        
        
            
        
        return (
            <Auxilliary>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
                
            </Auxilliary>);
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        prc: state.totalPrice,
        kcal: state.totalKcal
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));