export function getElementId(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function getElementIdForFB(id: string, parentId?: string): HTMLElement | null {
  if (parentId) {
    const parentElement = document.getElementById(parentId);
    return parentElement?.querySelector(`#${id}`) || null;
  } else {
    return document.getElementById(id);
  }
}

export function getElements(selectors: string, target: Document = document): NodeListOf<Element> {
  return target.querySelectorAll(selectors);
}

export function getElement(selector: string, target: Document = document): Element | null {
  return target.querySelector(selector);
}
