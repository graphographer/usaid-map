import usgData from '../data/usg_data.csv';

const h1 = document.createElement('h1');

h1.innerText = 'Help me, somebody!';

document.body.appendChild(h1);

const pre = document.createElement('pre');

const code = document.createElement('code');

pre.appendChild(code);

console.log('usgParsed', usgData);

code.innerText = JSON.stringify(usgData, undefined, 2);

document.body.appendChild(pre);
