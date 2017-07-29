import {parseHTML, addEventListenerByClass, onMutations} from './helpers';
import {processTextNode} from './parser';
import {addHolderContent, ebToggle} from './tooltip';

function main(target){
  parseHTML(target, (element) => {
    processTextNode(element);
  });
  addHolderContent(target);
  addEventListenerByClass('experimental-crypto-tooltip', 'mouseenter', ebToggle);
}

main(document.body);
onMutations(() => {
  main(document.body);
});
