import React, { Component } from "react";
import axios from "../../axios-orders";
import { connect } from "react-redux";

import Order from "../../components/Order/Order";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders();
    // axios.get('/orders.json')
    // .then(res => {
    //     const fetchedOrders = [];
    //     for (let key in res.data) {
    //         fetchedOrders.push({
    //             ...res.data[key],
    //             id: key
    //         });
    //     }
    //     this.setState({
    //         loading: false,
    //         orders: fetchedOrders
    //     });
    //     console.log(this.state.orders)
    // })
    // .catch(err => {
    //     this.setState({
    //         loading: false
    //     })
    // })
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
    loading: state.order.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(actions.fetchOrders())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
