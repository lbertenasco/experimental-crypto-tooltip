import * as $ from 'jquery';

/*
 * ETHER SCAN
 */

/*
* Load data from etherscan.io
*/
export function loadData(key, cryptoType, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let status = xhr.status;
      if (status == 200) {
        if (cryptoType === 'ETH') {
          let data = parseEtherscanContracts(xhr.response, key);
          loadKeys([key].concat(data.keys), callback);
          loadETHPrice(callback);
          if (data && data.contracts) {
            callback(data.contracts);
          }
        } else if (cryptoType === 'BTC') {
          loadBTCPrice(callback);
          callback({'btc': key, res: xhr.response})
        }
        /* Get extra contract data from APIS */
        /*
        data.contracts.forEach(contract => {
          loadContract(contract, key, callback);
        })
        */
      } else {
        // TODO retry & Handle error
      }
    }
  }
  let url;
  if (cryptoType === 'ETH') {
    url = `https://etherscan.io/address/${key}`;
    xhr.responseType = 'document';
  } else if (cryptoType === 'BTC') {
    url = `https://blockchain.info/rawaddr/${key}`;
    xhr.responseType = 'json';
  }
  xhr.open("GET", url, true);
  xhr.send();
}


function parseEtherscanContracts(document, key) {
  let list = document.getElementById('balancelist');
  let links = list.getElementsByTagName('a');
  let tokenContracts = [];
  // parsing aditional contracts
  for (var i = 0; i < links.length; i++) {
    if (links[i].pathname.indexOf('/token/0x') === 0 && links[i].search.indexOf(key) !== -1) {
      let token = links[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, " ").trim().replace(/\s+/g,' ');
      let text = ''
      let value = '';
      if (/\b0x[a-zA-Z0-9]{40}\b/g.test(token)) {
        text = token.split(' ')[2];
        value = token.split(' ')[1];
      } else {
        text = token.split(' ')[0];
        value = token.slice(text.length + 1);
      }
      tokenContracts.push({
        contract: links[i].pathname.split('/')[2],
        text: text,
        value: value
      });
    }
  }
  let keys = [];
  // TODO Parse extra usefull addresses
  return {
    keys: keys,
    contracts: tokenContracts
  };
}


function loadKeys(keys, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let status = xhr.status;
      if (status == 200) {
        let data = xhr.response;
        callback(data.result);
      } else {
        // TODO Try with etherchain
        // loadEtherChainData(node,key);
      }
    }
  }
  let url = `https://api.etherscan.io/api?module=account&action=balancemulti&tag=latest&address=${keys.join(',')}`;
  xhr.open("GET", url, true);
  xhr.responseType = 'json';
  xhr.send();
}

function loadContract(contract, key, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let status = xhr.status;
      if (status == 200) {
        let data = xhr.response;
        callback(data.result);
      } else {
        // TODO Try with etherchain
        // loadEtherChainData(node,key);
      }
    }
  }
  let url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${key}&tag=latest`;
  xhr.open("GET", url, true);
  xhr.responseType = 'json';
  xhr.send();
}

function loadETHPrice(callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let status = xhr.status;
      if (status == 200) {
        let data = xhr.response;
        if (data.length) {
          callback({eth_price: data[0]});
        }
      }
    }
  }
  let url = `https://api.coinmarketcap.com/v1/ticker/ethereum/`;
  xhr.open("GET", url, true);
  xhr.responseType = 'json';
  xhr.send();
}

function loadBTCPrice(callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let status = xhr.status;
      if (status == 200) {
        let data = xhr.response;
        if (data['USD'] && data['USD'].last) {
          callback({btc_price: {price_usd: data['USD'].last}});
        }
      }
    }
  }
  let url = `https://blockchain.info/ticker`;
  xhr.open("GET", url, true);
  xhr.responseType = 'json';
  xhr.send();
}




/*
 * ETHER CHAIN TODO not yet used
 */

 /*
 * Load data from etherchain.org.
 */
 function loadEtherChainData(key, callback) {
   let xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function() {
     if (xhr.readyState == 4) {
       let status = xhr.status;
       if (status == 200) {
         let json = JSON.parse(xhr.response);
         let balance = ''; //TODO
         loadEtherChainReceived(key, balance, callback);
       } else {
         // TODO handle retry and erros
       }
     }
   }
   let url = `https://etherchain.org/api/account/${key}`;

   xhr.open("GET", url, true);
   // xhr.responseType = 'json'; // TODO check if this works
   xhr.send();
 }


 /*
 * Load received amount from etherchain.org
 */
 function loadEtherChainReceived(key, myBalance, callback) {
   let xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function() {
     if (xhr.readyState == 4) {
       let status = xhr.status;
       if (status == 200) {
         let response = xhr.response;
         console.log('response', response);
       } else {
         // TODO handle retry and erros
       }
     }
   }
   let url = `https://etherchain.org/api/account/${key}`;
   xhr.open("GET", url, true);
   // xhr.responseType = 'json'; // TODO check if this works
   xhr.send();
 }
