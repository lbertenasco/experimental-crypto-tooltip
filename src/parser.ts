export const CLASS = 'experimental-crypto-tooltip';
export const ETH = /\b0x[a-zA-Z0-9]{40}\b/g;
// TODO Handle transaction hashes
export const TRANSX = /\b0x[a-zA-Z0-9]{64}\b/g;

export function processTextNode(element) {

  let val = element.nodeValue;

  if (!val || !ETH.test(val)) {
    return;
  }
  if (checkElementTagName(element, 'A')) {
    let publicKeys = val.match(ETH);
    let publicKey = publicKeys[0];
    insertSpanAfterLink(element, publicKey, CLASS);

  } else if (checkElementTagName(element, 'SPAN')) {
    let publicKeys = val.match(ETH);
    let publicKey = publicKeys[0];
    insertSpanAfterSpan(element, publicKey, CLASS);

  } else {
    let regExp = /\b0x[a-zA-Z0-9]{40}\b/g; // TODO Fix duplicated regExp
    let regExpArray;
    let prev = 0;
    let counter = 0;
    let curNode = element;
    while ((regExpArray = regExp.exec(val)) !== null) {
      insertSpanInTextNode(curNode, regExpArray[0], CLASS, regExp.lastIndex-prev);
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
* From http://stackoverflow.com/a/374187
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
