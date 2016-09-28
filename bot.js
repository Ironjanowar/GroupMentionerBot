// Requires
var jsonfile = require("./data/groups.json");
var fs = require('fs');

// Require dotenv library
require('dotenv').load();

// Require the API
var TelegramBot = require('node-telegram-bot-api');

// Get token from env var
var token = process.env.TELEGRAM_BOT_TOKEN.replace(/^\s|\s+$|\n$/g, '');

var bot = new TelegramBot(token, { polling: true });

// Functions
var sendHelp = function sendHelp(message) {
    bot.sendMessage(message.chat.id, "Test help!");
};

var catchReply = function catchReply(sendedMessage, callback) {
    bot.onReplyToMessage(sendedMessage, callback);
}

// Receives an object and saves it as JSON
var saveGroups = function saveGroups(groups) {
    fs.writeFile("./data/groups.json", JSON.stringify(groups), function(err) {
        if(err) {
            return console.log(err);
        }
    });
};

// Creates a new group
var createGroup = function createGroup(message, group) {
    var groupName = group.substring(1);
    if (!group.startsWith("@")) {
        bot.sendMessage(message.chat.id, "El grupo tiene que empezar por '@'");
    } else if (jsonfile[group] != undefined) {
        bot.sendMessage(message.chat.id, "Ese grupo ya existe!");
    } else if (groupName.match(/[A-Z]|[a-z]|[0-9]/g)) {
        bot.sendMessage(message.chat.id, "Ese no es un alias valido!");
    } else {
        jsonfile[group] = [];
        saveGroups(jsonfile);
        bot.sendMessage(message.chat.id, "Grupo creado con el nombre: " + group);
    }
};

// Drops da' bass
var dropGroups = function dropGroups(message) {
    saveGroups({});
    bot.sendMessage(message.chat.id, "The bass has been dropped!");
};

// Adds user to group
var addUser = function addUser(message, match) {
    
}

// Handlers
// Help
bot.onText(/^\/help$/, sendHelp);

// Create group
bot.onText(/^\/create (.+)/, createGroup);

// Drop groups
bot.onText(/^\/drop$/, dropGroups);

// Adds user to group
bot.onText(/^\/add (.+)/, addUser);

// Mmmeh
console.log("Running...");
