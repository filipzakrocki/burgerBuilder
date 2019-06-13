import React, { Component } from 'react';

import Auxilliary from '../../hoc/Auxilliary/Auxilliary'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

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
        ingredients: {
            salad: 0,
            egg: 0,
            bacon: 0,
            cheese: 0,
            meat: 0,
            
        },
        totalPrice: 4,
        totalKcal: 120,
        purchasable: false,
        purchasing: false
    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true})
    }
    
    purchaseContinueHandler = () => {
        alert('You continue!')
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
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
        
        const oldKcal = this.state.totalKcal;
        const updatedKcal = oldKcal + INGREDIENT_KCAL[type];
        this.setState({totalKcal: updatedKcal})
        
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
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
        
        const oldKcal = this.state.totalKcal;
        const updatedKcal = oldKcal - INGREDIENT_KCAL[type];
        this.setState({totalKcal: updatedKcal})
    }
    
    render() {
        
        const disabledInfo = {
            ...this.state.ingredients
        };
        
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        
        return (
            <Auxilliary>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients}/>
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ordered={this.purchaseHandler}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    price={this.state.totalPrice}
                    totalKcal={this.state.totalKcal}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}/>
                
            </Auxilliary>);
    }
}

export default BurgerBuilder;