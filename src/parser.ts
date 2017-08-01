export const CLASS = 'experimental-crypto-tooltip';
export const ETH = /\b0x[a-zA-Z0-9]{40}\b/g;
// TODO Handle transaction hashes
export const TRANSACTION = /\b0x[a-zA-Z0-9]{64}\b/g;
let globalKeys = {};

export function processTextNode(element) {

  let val = element.nodeValue;

  if (!val || !ETH.test(val)) {
    return;
  }
  if (checkElementTagName(element, 'A')) {
    let keys = val.match(ETH);
    let key = keys[0];
    if (!findElement(key, element)) {
      addElementKey(key, element);
      insertSpanAfterLink(element, key, CLASS);
    }

  } else if (checkElementTagName(element, 'SPAN')) {
    let keys = val.match(ETH);
    let key = keys[0];
    if (!findElement(key, element)) {
      addElementKey(key, element);
      insertSpanAfterSpan(element, key, CLASS);
    }
  } else {
    let regExp = /\b0x[a-zA-Z0-9]{40}\b/g; // TODO Fix duplicated regExp
    let regExpArray;
    let prev = 0;
    let counter = 0;
    let curNode = element;
    while ((regExpArray = regExp.exec(val)) !== null) {
      if (!findElement(regExpArray[0], element)) {
        addElementKey(regExpArray[0], curNode);
        insertSpanInTextNode(curNode, regExpArray[0], CLASS, regExp.lastIndex-prev);
      }
      prev = regExp.lastIndex;
      counter = counter + 1;
      curNode = element.parentNode.childNodes[2*counter];
    }
  }
}

function checkElementTagName(element, tagName) {
  let curNode = element;
  while (curNode) {
    if (curNode.tagName === tagName) {
      return true;
    } else {
      curNode = curNode.parentNode;
    }
  }
  return false;
}

/*
* Insert a container inside a text node.
*/
function insertSpanInTextNode(element, key, className, at) {
  // create new container node
  let parent = $(element.parentNode);
  if (parent.find(`[key="${key}"]`).length) {
    return;
  }
  let container = createContainer(key, className);

  // split the text node into two and add new container
  element.parentNode.insertBefore(container, element.splitText(at));
}

/*
* Insert a container inside after the parent node that represents a link.
*/
function insertSpanAfterLink(element, key, className) {
  let curNode = element;
  while (curNode) {
    if (curNode.tagName == 'A') {
      // create new container node
      let parent = $(element.parentNode);
      if (parent.find(`[key="${key}"]`).length) {
        return;
      }
      let container = createContainer(key, className);

      // add the container after the link
      curNode.parentNode.insertBefore(container,curNode.nextSibling);
      return true;
    } else {
      curNode = curNode.parentNode;
    }
  }
}

/*
* Insert a container inside after the parent node that represents a container.
*/
function insertSpanAfterSpan(element, key, className) {
  let curNode = element;
  while (curNode) {
    if (curNode.tagName == 'SPAN') {
      // create new container node
      let parent = $(element.parentNode);
      if (parent.find(`[key="${key}"]`).length) {
        return;
      }
      let container = createContainer(key, className);

      // add the container after the link
      curNode.parentNode.insertBefore(container,curNode.nextSibling);
      return true;
    } else {
      curNode = curNode.parentNode;
    }
  }
}

function createContainer(key, className) {
  let container = document.createElement('span');
  container.setAttribute('key', key);
  container.className = className;
  container.appendChild(document.createTextNode(''));
  return container;
}

function addElementKey(key, element) {
  if (!globalKeys[key]) {
    globalKeys[key] = [];
  }
  globalKeys[key].push(element);
}

function findElement(key, element) {
  if (globalKeys[key]) {
    return !!globalKeys[key].find(el => $(el).is($(element)));
  }
  return false;
}
