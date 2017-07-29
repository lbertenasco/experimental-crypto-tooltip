import {loadData} from './api';
import * as $ from 'jquery';
import * as mousewheel from 'jquery-mousewheel';
import * as Humanize from 'humanize-plus';
let mw = mousewheel;
/*
* Action to perform when hover on icon.
*/
export function ebToggle(){
  var publicKey = this.getAttribute('key');
  loadData(publicKey, (response) => {
    if (!response) {
      return;
    }
    if (response.length) {
      response.forEach(data => {
        if (data.account) {
          // Parse Ether value in balance:
          data.balance = data.balance / Math.pow(10, 18);
          $(this).find('.eth').attr('id', data.account);
          $(this).find('.eth').html(`
            <p balance="${data.balance}">
              ETH: ${Humanize.formatNumber(data.balance, 2)} <span class="price"></span>
            </p>`
          );
        } else if (data.contract) {
          let contractElement = $(this).find(`#${data.contract}`);
          if (contractElement.length) {
            contractElement.html(`<p>${data.text}: <span class="price">${data.value}</span></p>`);
          } else {
            $(this).find('.crypto-tokens').append(
            ` <li id="${data.contract}">
                <p>${data.text}: <span class="price">${data.value}</span></p>
              </li>
            `);
          }
          // ADD or REPLACE in tooltip div the tag with id:data.contract
        }
      })
    } else if (response.eth) {
      addETHPrice(response, this);
    }
    let that = this;
    setTimeout(() => {
      fixScroll(that);
    }, 50);
  });
}

function addETHPrice(data, element, retry = 0) {
  if (retry > 5) {
    return;
  }
  let balance = $(element).find('.eth').find('p').attr('balance');
  if (!balance) {
    // Timeout required to wait for etherdelta
    setTimeout(function () {
      addETHPrice(data, element, retry++);
    }, 1000);
    return;
  }
  let price = Humanize.formatNumber(parseFloat(balance) * data.eth.price_usd, 2);
  $(element).find('.eth').find('.price').html(`$${price} (@ $${data.eth.price_usd}/ETH)`);
  // Parse ETH balance and add estimated value in USD/BTC + more info on ETH. % change 1h/24h/7d
}

/*
* Add an image and an empty span to experimental-crypto-tooltip span.
*/
export function addHolderContent(context) {
  try {
    var list = context.getElementsByClassName('experimental-crypto-tooltip');

    for (var i = 0, len = list.length; i < len; i++) {
      let element = $(list[i]).load(chrome.extension.getURL("assets/html/tooltip.html"));
      setTimeout(() => {
        $(element).find('.image-logo').attr("src", chrome.extension.getURL("assets/icons/cryptotooltip_logo32.png"));
      }, 10);
    }

  }
  catch (err) {
    console.error("Error: " + err);
    return false;
  }
}



function fixScroll(element) {
  element = $(element).find('.experimental-crypto-tooltip-container');
  let height = element.height(),
      scrollHeight = element.get(0).scrollHeight;

  $(element).on('mousewheel', function(e, d) {
    if((this.scrollTop === (scrollHeight - height) && d < 0) || (this.scrollTop === 0 && d > 0)) {
      e.preventDefault();
    }
  });
}
