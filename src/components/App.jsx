import React, { Component } from "react";

export default class App extends Component {
  render() {
    return (
      <div id="content-main">
        {this.props.children}
      </div>
    );
  }
}