import React, { Component } from "react";
export const connect = propsToSubscribe => WrappedComponent => {
  return class ConnectedComponent extends Component {
    subscriptions;
    constructor(...args) {
        super(...args);
        this.state = Object.keys(propsToSubscribe).reduce((cum, curr) => {
            return {
                ...cum,
                [curr]: undefined
            };
        }, {});
    }

    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method();
    }

    componentDidMount() {
        // subscribe
        this.subscriptions = Object.keys(propsToSubscribe).reduce((cum, curr) => {
            return {
                ...cum,
                [curr]: propsToSubscribe[curr].subscribe(result => {
                    this.setState({[curr]: result});
                })
            };
        }, {});
    }

    componentWillUnmount() {
      // unsubscribe
      Object.keys(this.subscriptions).forEach(key => {
          this.subscriptions[key].unsubscribe();
      });
    }
    render() {
      const overriddenProps = {
        ...this.props,
        observables: {
          ...propsToSubscribe
        },
        ...this.state
      };
      if(typeof WrappedComponent !== 'function') {
          overriddenProps.ref = this.proc.bind(this);
      }
      return <WrappedComponent {...overriddenProps} />;
    }
  };
};