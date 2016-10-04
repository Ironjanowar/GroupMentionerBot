"use strict";

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
        jsonfile = require("./data/groups.json");
    });
};

// Creates a new group
var createGroup = function createGroup(message, group) {
    var groupName = group[1].substring(1);
    if (!group[1].startsWith("@")) {
        bot.sendMessage(message.chat.id, "El grupo tiene que empezar por '@'");
    } else if (jsonfile[group[1]] != undefined) {
        bot.sendMessage(message.chat.id, "Ese grupo ya existe!");
    } else if (!groupName.match(/[A-Z]|[a-z]|[0-9]/g)) {
        bot.sendMessage(message.chat.id, "Ese no es un alias valido!");
    } else {
        jsonfile[group[1]] = [];
        saveGroups(jsonfile);
        bot.sendMessage(message.chat.id, "Grupo creado con el nombre: " + group[1]);
    }
};

// Drops da' bass
var dropGroups = function dropGroups(message) {
    saveGroups({});
    bot.sendMessage(message.chat.id, "The bass has been dropped!");
};

// Catches generic replies
var catchReply = function catchReply(callback, message) {
    bot.onReplyToMessage(message.chat.id, message.message_id, callback);
};

// Reply markup to force reply a message
var options = {
    reply_markup : JSON.stringify({ force_reply: true })
};

// Adds user to group
var addUser = function addUser(message) {
    bot.sendMessage(message.chat.id, "Que usuario quieres añadir?", options).then(catchReply.bind(null, getUserToAdd));
};

// Gets the user we want to add to a group
var getUserToAdd = function getUserToAdd(message) {
    if (!message.text.startsWith("@")) {
        bot.sendMessage(message.chat.id, "El alias tiene que empezar por '@'");
    } else {
        bot.sendMessage(message.chat.id, "Okkay!\nA que grupo quieres añadir ese usuario?", options).then(catchReply.bind(null, getGroupToAdd.bind(null ,message.text)));
    }
};

var getGroupToAdd = function getGroupToAdd(user, message) {
    var group = message.text
    var groupName = group.substring(1);
    if (!group.startsWith("@")) {
        bot.sendMessage(message.chat.id, "El grupo tiene que empezar por '@'");
    } else if (!groupName.match(/[A-Z]|[a-z]|[0-9]/g)) {
        bot.sendMessage(message.chat.id, "Ese no es un alias valido!");
    } else {
        jsonfile[group].push(user);
        saveGroups(jsonfile);
        bot.sendMessage(message.chat.id, "El usuario " + user + " ha sido aniadido al grupo " + group);
    }
};

// Mentions all users of a group
var mentionGroup = function mentionGroup(message) {
    if (!message.text.startsWith("/")) {
        var text = message.text.split(" ");
        var messageToSend = "";
        for (let word of text) {
            if (word.startsWith("@")) {
                if (jsonfile[word] != undefined) {
                    for (let name of jsonfile[word]) {
                        messageToSend += name + " ";
                    }

                    messageToSend += "This!";
                    bot.sendMessage(message.chat.id, messageToSend, { reply_to_message_id: message.message_id });
                }
            }
        }
    }
};

// Show groups
var showGroups = function showGroups(message) {
    if (Object.keys(jsonfile).length === 0) {
        bot.sendMessage(message.chat.id, "No hay grupos creados, crea uno con /create [nombre del grupo]")
    } else {
        var groupNames = "Los grupos actuales que hay son:\n";
        for (let name in jsonfile) {
            groupNames += "  " + name + "\n";
        }

        bot.sendMessage(message.chat.id, groupNames);
    }
};

// Handlers
// Help
bot.onText(/^\/help$/, sendHelp);

// Create group
bot.onText(/^\/create (.+)/, createGroup);

// Drop groups
bot.onText(/^\/drop$/, dropGroups);

// Adds user to group
bot.onText(/^\/adduser$/, addUser);

// Mention all users needed
bot.onText(/@/g, mentionGroup);

// Shows the current groups
bot.onText(/^\/groups$/, showGroups)

// Mmmeh
console.log("Running...");
