import { createElement, Component, render } from './toy-react';

class MyComponent extends Component {
  render() {
    return <div></div>
  }
}


render(<div id="a" class="c">
    <span style="font-weight: bold">hello</span>
    <div id="b"><span>World</span></div>
    <MyComponent />
  </div>, document.body);