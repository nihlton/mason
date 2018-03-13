import React, { Component } from 'react';

export default class List extends Component {
  render () {
    return <div>
      {this.props.balls}
      {this.props.shit.map(i => <button>{i}</button>)}
    </div>
  }
}


