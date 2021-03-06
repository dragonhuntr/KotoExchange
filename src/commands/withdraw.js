const { OOPS_TEXT } = require('../messages')

const WITHDRAW_TEXT = 'Successful withdrawal.'
const PROPER_AMOUNT_TEXT = 'You need to provide the amount of Koto to send.'
const NO_COMMA_TEXT = 'Please use "." instead of ",".'
const NEED_ADDRESS_TEXT = 'Please specify a Koto t-address as your third argument.'
const NO_FUNDS = 'You do not have any Koto in your wallet, please add Koto using the address provided in **-koto address**.'
const NOT_ENOUGH_FUNDS = 'You do not have enough Koto to send, please do **-koto address** to check your balance.'

var multilevel = require('multilevel')
var levelup = require('levelup')
var leveldown = require('leveldown')
var net = require('net')

var db = multilevel.client();
var con = net.connect(3000);
con.pipe(db.createRpcStream()).pipe(con);

var addr = ''
var test = 'test'

var Zcash = require("zcash");

const http = require('http');

const rpcLogin = ‘insert-rpc-username-here’;
const rpcPassword = ‘insert-rpc-password-here’;
const rpcHost = ‘insert-rpc-ip-here’;
const rpcPort = 8432;

const txFee = 0.0001;

const threshold = 0.1;

// Make HTTP POST
function post(method, params, callback) {
    var body = JSON.stringify({ method: method, params: params })
    var options = {
        port: rpcPort,
        hostname: rpcHost,
        auth: rpcLogin + ':' + rpcPassword,
        method: 'POST',
        path: '/',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    var req = http.request(options, function(res) {
        res.on('data', function (body) {
            if (callback != null) {
                callback(null, JSON.parse(body));
            }
        });
    });
    req.on('error', function(err) {
        callback(err, null);
    });
    req.write(body);
    req.end('\n');
};
 
// Execute RPC z_sendmany
function withdraw (message, Zcash, amount, toAddress) {
  var amountInt = parseInt(amount)
  if (!amountInt) {
    message.reply(PROPER_AMOUNT_TEXT)
    return
  }

  // If amount has a comma
  if (amount.indexOf(',') >= 0) {
    message.reply(NO_COMMA_TEXT)
    return
  }

  if (!toAddress) {
    message.reply(NEED_ADDRESS_TEXT)
    return
  }

  var account = message.author.tag.replace('#', '')

  db.get(account, function(err, address) {
    var gaddress = addr + address
    console.log(gaddress)
    post('z_getbalance', [gaddress], function(err, data) {
        if (err != null) {
            console.log('Error: ' + err.message);
            return;
        }
        if (data.result >= (threshold - txFee)) {
            var amount = data.result - txFee;
            var bal = amount - amountInt;
            console.log('Transfer', amountInt, 'from', gaddress, 'to', toAddress);
            post('z_sendmany', [gaddress, [{ address: toAddress, amount: amountInt }, { address: gaddress, amount: bal }]], function(err, data) {
                if (err != null) {
                    console.log('Error: ' + e.message);
                    message.channel.send(message.author.toString() + ' ERROR, please contact Limit#1844')
                } else {
                    console.log(data)
                    console.log('Sent', amountInt, 'to', toAddress);
                    message.channel.send(message.author.toString() + ', Sent **' +  amountInt + '** Koto to ``' +  toAddress + '``')
                    message.channel.send('Your balance should update once the transaction gets confirmed.')
                }
            });
        } else {
            console.log('Balance', data.result, 'is below threshold');
            message.channel.send('You do not have enough balance');
        }
    });
  })
}
 
module.exports = withdraw
