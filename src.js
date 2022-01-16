const Discord = require('discord.js')
const TOKEN = ''
const prefix = '.';

const client = new Discord.Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES'
  ]
})
client.login(TOKEN)

function checks(msg, _do) {
    if (!msg.content.startsWith(prefix) || msg.author.bot) {} else {
        _do()
    }
}
client.once('ready', () => {
  console.log(`READY: ${client.user.tag}`)
})

var orders_channel
var items = ""
var list = []
var pkgs = []
var ign
const prices = {
    "wither":50,
    "pvp-kit":100
}
for (const [k, v] of Object.entries(prices)) {
    pkgs.push(k)
}
function validOrder() {
    var count = 0;
    for (i=0; i<list.length; i++) {
        if (pkgs.includes(list[i].replace(/\s/g, ""))) {
            count++
        }
    }
    return (count == list.length)
}
function getPrice() {
    var p = 0
    var splitPrices = items.replace(/,/g, "").split(" ")

    for (i=0; i<splitPrices.length; i+=2) {
        if (i != splitPrices.length - 1) {
            if (splitPrices[i] == "" || splitPrices[i] == " ") {
                p += prices[splitPrices[i+1]]
                items = items.replace(/  +/g, " ")
            } else {
                p += prices[splitPrices[i+1]] * parseInt(splitPrices[i])
                items = items.replace(/  +/g, " ")
            }
        }
    }
    price = p
}
var cmds = {
    ".order": (e, args, items) => {
        if (validOrder() == true) {
            var amount = 0;
            if (args[2] != undefined) {
                amount = args[2] + ")"
            } else {
                amount = "1)"
            }
            getPrice()
            e.guild.channels.cache.get("932317294913273937").send(`\`\`\`css\nITEMS: ${items}\nPRICE: ${price}\nIGN: ${ign}\`\`\``)
        } else {
            e.channel.send("order was not valid")
        }
    }
}
client.on('messageCreate', (e) => {
    var args = e.content.split(" ")
    var cmd = cmds[args[0]]

    checks(e, () => {
        if (cmd) {
            var or; var or2; items = ""; list = []; var price; ign = args[args.length - 1]
            args.splice(args.length - 1, 1)
            for (i=0; i<args.length; i++) {
                if (args[i][0] == "(") {
                    args[i] = "1" + args[i]
                }
            }

            for (i=0; i<args.length; i++) {
                if (i != args.length - 1) {
                    args[i] = args[i].toLowerCase()
                }
                if (i != 0) {
                    if (i == args.length - 1) {
                        or = ""
                        or2 = ""
                    } else {
                        or = ", "
                        or2 = " "
                    }
                    items += args[i].replace(/\(/g, " ").replace(/\)/g, "") + or
                    list.push(args[i].replace(/\(/g, " ").replace(/\)/g, or2).replace(/[0-9]/g, ""))
                }
            }
            cmd(e, args, items)
        }
    })
})
