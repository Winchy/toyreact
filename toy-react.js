class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(component) {
    this.root.appendChild(component.root);
  }
}

class TextWrapper {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
}

export class Component {
  constructor(type) {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
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
  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }
    component.appendChild(child);
  }
  return component;
}

export function render(component, parentElement) {
  parentElement.appendChild(component.root);
}
