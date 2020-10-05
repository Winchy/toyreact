import { createElement, Component, render } from './toy-react';

class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2
    }
  }
  render() {
    return <div>
      <h1>My Component</h1>
      <button onclick={() => { this.setState({ a: this.state.a + 1 }) }}>add</button>
      <span>{this.state.a.toString()}</span>
      <span>{this.state.b.toString()}</span>
    </div>
  }
}


render(<div id="a" class="c">
    <span style="font-weight: bold">hello</span>
    <div id="b"><span>World</span></div>
    <MyComponent>my component</MyComponent>
  </div>, document.body);