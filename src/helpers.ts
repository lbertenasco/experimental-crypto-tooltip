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
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      callback(mutation.addedNodes[0]);
    });
  });

  let config = { attributes: true, childList: true, characterData: true };
  observer.observe(document.body, config);
}

export function addEventListenerByClass(className, event, fn) {
  let list = document.getElementsByClassName(className);
  for (let i = 0, len = list.length; i < len; i++) {
    list[i].addEventListener(event, fn, false);
  }
}


/* Fix for position fixed scroll on tooltips */
function scrollTooltip() {
  var tooltips = $('.experimental-crypto-tooltip');
  for (var i = 0; i < tooltips.length; i++) {
    let top = $(tooltips[i]).offset().top - $(window).scrollTop();
    let left = $(tooltips[i]).offset().left - $(window).scrollLeft();
    $(tooltips[i]).find('.experimental-crypto-tooltip-container').css({
      'top': top,
      'left': left
    });
  }
}
$(window).scroll(scrollTooltip);
