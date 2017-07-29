export function parseHTML(node, callback) {
  let child, next;
  try {
    switch (node.nodeType) {
      case 1:  // Element
      case 9:  // Document
      case 11: // Document fragment
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          parseHTML(child, callback);
          child = next;
        }
        break;
      case 3: // Text node
        if(node.parentElement.tagName.toLowerCase() != "script") {
          callback(node);
        }
        break;
    }
  } catch (err) {
    console.error("parseHTML error", err);
  }
}

export function onMutations(callback){
  let target: any = document.body;

  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      target = mutation.addedNodes[0];
      callback(target);
    });
  });

  let config = { attributes: true, childList: true, characterData: true };
  observer.observe(target, config);
}

export function addEventListenerByClass(className, event, fn) {
  let list = document.getElementsByClassName(className);
  for (let i = 0, len = list.length; i < len; i++) {
    list[i].addEventListener(event, fn, false);
  }
}
