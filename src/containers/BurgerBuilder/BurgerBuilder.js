import React, { Component } from 'react';
import axios from '../../axios-orders'


import Auxilliary from '../../hoc/Auxilliary/Auxilliary'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import Spinner from '../../components/UI/Spinner/Spinner'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGEDIENT_PRICES = {
    egg: 0.6,
    salad: 0.5,
    cheese: 0.4,
    bacon: 0.7,
    meat: 1.3,
}

const INGREDIENT_KCAL = {
    egg: 90,
    salad: 5,
    cheese: 85,
    bacon: 144,
    meat: 195,
}

class BurgerBuilder extends Component {
    
    state = {
        ingredients: null,
        totalPrice: 4, //starting price
        totalKcal: 120, // bun kcal
        purchasable: false, // ingredients present, can you buy?
        purchasing: false, // moved to checkout?
        loading: false, // is the request being sent?
    }
    
    componentDidMount = () => {
        axios.get('https://my-project-1551193995472.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data})
            this.updateInitialKcalHandler();
            this.updatePurchaseState(this.state.ingredients);
        })
        .catch(err => {
            this.setState({error: true})
        })
        
        
        
    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true})
    }
    
    updateInitialKcalHandler = () => {
        let ingredients = this.state.ingredients;
        let ingredientsKcal = 0;
        for (let ing in ingredients) {
            ingredientsKcal += (INGREDIENT_KCAL[ing] * ingredients[ing]);
        }

        this.setState({totalKcal: ingredientsKcal + 120});
    }
    

    
    purchaseContinueHandler = () => {
        
        const queryParams = [];
        
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice)        
        queryParams.push('kcal=' + this.state.totalKcal)        
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
    
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGEDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        
        const oldKcal = this.state.totalKcal;
        const updatedKcal = oldKcal + INGREDIENT_KCAL[type];
        
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients,
            totalKcal: updatedKcal
        })
        this.updatePurchaseState(updatedIngredients);
        
        
        
        
    }
    
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGEDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        
        const oldKcal = this.state.totalKcal;
        const updatedKcal = oldKcal - INGREDIENT_KCAL[type];
        
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients,
            totalKcal: updatedKcal
        })
        
        this.updatePurchaseState(updatedIngredients);
        
//        const oldKcal = this.state.totalKcal;
//        const updatedKcal = oldKcal - INGREDIENT_KCAL[type];
//        this.setState({totalKcal: updatedKcal})
        
        
    }
    
    
    
    render() {
        
        const disabledInfo = {
            ...this.state.ingredients
        };
        
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null;    
        let burger = this.state.error ? <p>Ingredients cannnot be loaded!</p> : <Spinner/>;
        
        if (this.state.ingredients) {
            burger = (
            <Auxilliary>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ordered={this.purchaseHandler}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    price={this.state.totalPrice}
                    totalKcal={this.state.totalKcal}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}/>
            </Auxilliary>
        );
            
            orderSummary = <OrderSummary
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients}/>
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

export default withErrorHandler(BurgerBuilder, axios);