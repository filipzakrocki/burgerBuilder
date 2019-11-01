import React, { Component } from "react";
import axios from "../../axios-orders";
import { connect } from "react-redux";

import Order from "../../components/Order/Order";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  render() {
    let orders = this.props.loading ? (
      <Spinner />
    ) : (
      <div>
        {this.props.orders.map(order => (
          <Order
            key={order.id}
            kcal={order.kcal}
            price={order.price}
            ingredients={order.ingredients}
          />
        ))}
      </div>
    );

    return orders;
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.idToken,
    userId: state.auth.localId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
