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

var saveGroups = function saveGroups(groups) {
    fs.writeFile("./data/groups.json", JSON.stringify(newGroup), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}



// Handlers
bot.onText(/^\/help$/, sendHelp);

// Mmmeh
console.log("Running...");
