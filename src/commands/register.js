const { OOPS_TEXT } = require('../messages')

const ADDRESS_TEXT = ', **This is your Koto address!** : '

const nouser = 'User not found, creating an address'

const test = 'You arent meant to view this message, contact Limit#1844!'

const addr = ''

var multilevel = require('multilevel')
var levelup = require('levelup')
var leveldown = require('leveldown')
var net = require('net')

const db = levelup(leveldown('./addr'))

var fs = require('fs');

net.createServer(function (con) {
  con.pipe(multilevel.server(db)).pipe(con);
}).listen(3000);

function address (message) {
  var account = message.author.tag.replace('#', '');
  var address = address;

  // Will create a new account if doesn't exist... ? Should we allow this ?
  // Yes
  db.get(account, function (err) {
    if (err) {
      console.log(err)
      if (err.notFound) {
        message.author.reply({embed: {
          color: 3447003,
          description: "Please enter a login username."}});
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        console.log(collector)
        collector.on('collect', user => {
          message.author.reply({embed: {
            color: 3447003,
            description: "Please enter a login password."}});
            collector.on('collect', pas => {
              message.author.reply({embed: {
              color: 3447003,
              description: "Please confirm your login password."}});
              collector.on('collect', pass => {
                if (pas === pass) {
                  db.put(account, user, pass, function(err))
                    }
                  })
                })
              })
          else { 
            message.author.reply({embed: {
              color: 3447003,
              description: "Session expired, please execute command again."}});
                         }
                       })
                     })
                   }
                 }
    else {
      message.author.reply({embed: {
      color: 3447003,
      description: "You already have an account, please login!."}});
                  }
                }
              })
            }
    })
}

module.exports = register
