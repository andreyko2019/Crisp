export function getElementId(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function getElements(selectors: string, target: HTMLElement | Document = document): NodeListOf<HTMLElement> {
  return target.querySelectorAll(selectors);
}

export function getElement(selector: string, target: HTMLElement | Document = document): HTMLElement | null {
  return target.querySelector(selector);
}

function classManipulator(element: HTMLElement, action: 'add' | 'remove', className: string) {
  if (action === 'add') {
    element.classList.add(className);
  } else if (action === 'remove') {
    element.classList.remove(className);
  }
}

export function renderElement(element: string, elementsClass: string[] | string | null) {
  const domElement = document.createElement(element);

  if (elementsClass) {
    if (Array.isArray(elementsClass)) {
      elementsClass.forEach((item) => classManipulator(domElement, 'add', item));
      return domElement;
    }

    classManipulator(domElement, 'add', elementsClass);
  }

  return domElement;
}
