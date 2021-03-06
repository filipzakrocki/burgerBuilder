import React, { Component } from "react";
import { connect } from "react-redux";

import Auxilliary from "../Auxilliary/Auxilliary";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

import classes from "./Layout.css";

class Layout extends Component {
  state = {
    showSideDrawer: false
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    return (
      <Auxilliary>
        <Toolbar
          isAuthenticated={this.props.isAuthenticated}
          clicked={this.props.purchaseHandler}
          toggle={this.sideDrawerToggleHandler}
        />
        <SideDrawer
          isAuthenticated={this.props.isAuthenticated}
          clicked={this.props.purchaseHandler}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />

        <main className={classes.Content}>{this.props.children}</main>
      </Auxilliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.idToken !== null
  };
};

export default connect(
  mapStateToProps,
  null
)(Layout);
