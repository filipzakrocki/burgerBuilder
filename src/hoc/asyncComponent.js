import React, { Component } from "react";

export const asyncComponent = importedComponent => {
  return class extends Component {
    state = {
      component: null
    };

    componentDidMount() {
      importedComponent().then(cmp => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  };
};
