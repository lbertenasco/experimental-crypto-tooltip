import * as $ from 'jquery';
import * as mousewheel from 'jquery-mousewheel';
import * as Humanize from 'humanize-plus';
let mw = mousewheel;

import {loadData} from './api';

/*
* Action to perform when hover on icon.
*/
export function ebToggle(){
  let top = $(this).offset().top - $(window).scrollTop();
  let left = $(this).offset().left - $(window).scrollLeft();
  $(this).find('.experimental-crypto-tooltip-container').css({
    'top': top,
    'left': left
  });
  $(this).find('.experimental-crypto-tooltip-container .loading').css('display', 'block');
  var publicKey = this.getAttribute('key');
  var cryptoType = this.getAttribute('crypto-type');

  setViewOnLink(this, publicKey ,cryptoType);

  loadData(publicKey, cryptoType, (response) => {
    if (!response) {
      return;
    }
    $(this).find('.experimental-crypto-tooltip-container .loading').css('display', 'none');
    if (response.length) {
      response.forEach(data => {
        if (data.account) {
          // Parse Ether value in balance:
          data.balance = data.balance / Math.pow(10, 18);
          $(this).find('.eth').attr('id', data.account);
          $(this).find('.eth').html(`
            <p balance="${data.balance}">
              ETH: ${Humanize.formatNumber(data.balance, 4)} <span class="price"></span>
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
    } else if (response.eth_price) {
      addETHPrice(response.eth_price, this);
    } else if (response.btc) {
      addBTC(response, this);
    } else if (response.btc_price) {
      addBTCPrice(response.btc_price, this);
    }
    let that = this;
    setTimeout(() => {
      fixScroll(that);
    }, 50);
  });
}

function setViewOnLink(element, publicKey ,cryptoType) {
  if (cryptoType === 'ETH') {
    $(element).find('.link').text(`View on Etherscan`);
    $(element).find('.link').attr('href', `https://etherscan.io/address/${publicKey}`);
  } else if (cryptoType === 'BTC') {
    $(element).find('.link').text(`View on Blockchain.info`);
    $(element).find('.link').attr('href', `https://blockchain.info/address/${publicKey}`);
  }
}

function addETHPrice(eth_price, element, retry = 0) {
  if (retry > 5) {
    return;
  }
  let balance = $(element).find('.eth').find('p').attr('balance');
  if (!balance) {
    // Timeout required to wait for etherdelta
    setTimeout(function () {
      addETHPrice(eth_price, element, retry++);
    }, 1000);
    return;
  }
  let price = Humanize.formatNumber(parseFloat(balance) * eth_price.price_usd, 2);
  $(element).find('.eth').find('.price').html(`$${price} (@ $${eth_price.price_usd}/ETH)`);
  // Parse ETH balance and add estimated value in USD/BTC + more info on ETH. % change 1h/24h/7d
}

function addBTC(data, element) {
  data.res.final_balance = data.res.final_balance / Math.pow(10, 8);

  let html = `
    <li id="${data.btc}" class="btc">
      <p balance="${data.res.final_balance}">
        Bitcoins: ${Humanize.formatNumber(data.res.final_balance, 4)} <span class="price"></span>
      </p>
    </li>
  `;
  let btc = $(element).find(`#${data.btc}`);
  if (btc.length) {
    $(btc[0]).html(html);
  } else {
    $(element).find('.crypto-tokens').append(html);
  }
}


function addBTCPrice(btc_price, element, retry = 0) {
  if (retry > 5) {
    return;
  }
  let balance = $(element).find('.btc').find('p').attr('balance');
  if (!balance) {
    // Timeout required to wait for etherdelta
    setTimeout(function () {
      addBTCPrice(btc_price, element, retry++);
    }, 1000);
    return;
  }
  let price = Humanize.formatNumber(parseFloat(balance) * btc_price.price_usd, 2);
  $(element).find('.btc').find('.price').html(`$${price} (@ $${btc_price.price_usd}/BTC)`);
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
