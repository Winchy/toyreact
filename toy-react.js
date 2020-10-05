const RENDER_TO_DOM = Symbol('renderToDom');

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
    } else if (name === 'className') {
      this.root.className = value;
    } else {
      this.root.setAttribute(name, value);
    }
  }
  appendChild(component) {
    let range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    if (component !== null) {
      component[RENDER_TO_DOM](range);
    }
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export class Component {
  constructor(type) {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
    this._range = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  [RENDER_TO_DOM](range) {
    this._range = range;
    this.render()[RENDER_TO_DOM](range);
  }
  rerender() {
    let oldRange = this._range;
    let range = document.createRange();
    range.setStart(oldRange.startContainer, oldRange.startOffset);
    range.setEnd(oldRange.startContainer, oldRange.startOffset);
    this[RENDER_TO_DOM](range);

    oldRange.setStart(range.endContainer, range.endOffset);
    oldRange.deleteContents();
  }
  setState(newState) {
    if (this.state === null || typeof this.state != 'object') {
      this.state = newState;
      this.rerender();
      return;
    }
    let merge = (oldState, newState) => {
      for (let p in newState) {
        if (oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p];
        } else if (oldState[p] instanceof Array && newState[p] instanceof Array) {
          oldState[p] = newState[p];
        } else {
          merge(oldState[p], newState[p]);
        }
      }
    }
    merge(this.state, newState);
    this.rerender();
  }
}

export function createElement(type, attributes, ...children) {
  let component;
  if (typeof(type) === 'string') {
    component = new ElementWrapper(type);
  } else {
    component = new type;
  }

  for (let p in attributes) {
    component.setAttribute(p, attributes[p]);
  }

  let insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child);
        continue;
      }
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      component.appendChild(child);
    }
  }
  insertChildren(children);
  return component;
}

export function render(component, parentElement) {
  // parentElement.appendChild(component.root);
  let range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}
