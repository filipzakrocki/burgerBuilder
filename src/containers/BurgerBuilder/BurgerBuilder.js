import React, { Component } from "react";

import { connect } from "react-redux";

import Auxilliary from "../../hoc/Auxilliary/Auxilliary";
import axios from "../../axios-orders";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

// action creators
import * as actions from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    purchasing: false // moved to checkout?
  };

  componentDidMount = () => {
    this.props.onInitIngredients();
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");

    // const queryParams = [];

    // for (let i in this.props.ings) {
    //   queryParams.push(
    //     encodeURIComponent(i) + "=" + encodeURIComponent(this.props.ings[i])
    //   );
    // }
    // queryParams.push("price=" + this.props.prc);
    // queryParams.push("kcal=" + this.props.kcal);
    // const queryString = queryParams.join("&");

    // this.props.history.push({
    //   pathname: "/checkout",
    //   search: "?" + queryString
    // });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Ingredients cannnot be loaded!</p>
    ) : (
      <Spinner />
    );

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
            purchasable={this.updatePurchaseState(this.props.ings)}
          />
        </Auxilliary>
      );

      orderSummary = (
        <OrderSummary
          price={this.props.prc}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.props.ings}
        />
      );
    }

    return (
      <Auxilliary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxilliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    prc: state.burgerBuilder.totalPrice,
    kcal: state.burgerBuilder.totalKcal,
    pur: state.burgerBuilder.purchasable,
    err: state.burgerBuilder.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
