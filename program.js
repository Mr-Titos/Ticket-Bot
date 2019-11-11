require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const token = process.env.DISCORD_TOKEN;


var prefix = "";
var ticketchannel = 0;
var channeladmin;
let link = false;
let linkadmin = false;
var idticket = 0;
var suprole = "";
var save;
var catticket = false;
let categorie;
let msgprblm = "";

bot.on('ready', function () {
    fs.readFile("save.txt",'utf-8', function(error, data) {
        if (error) {
            return console.log(err);
          } else {
          save = data.split(',');
          idticket = save[0];
          suprole = save[1];
          prefix = save[2];
         }
    })
  console.log("Je suis connecté !");
})

function C_Cat(serv) {  
        
    return new Promise(function (resolve, reject) {
        categorie = serv.channels.find(c => c.name == "Problemes/Tickets" && c.type == "category");

        if(categorie === null) {
            reject();
        }
        else {
            resolve(categorie);
        }
    })
  }

function C_Chan(cat,serv,user) {
    serv.createChannel("prblm-" + idticket, "text", [
        {
            id: serv.defaultRole.id,
            deny: ['VIEW_CHANNEL'],
        },
        {
            id: user.id,
            allow: ['VIEW_CHANNEL'],
        },
        {
            id: serv.roles.find(role => role.name === suprole).id,
            allow: ['VIEW_CHANNEL'],
        },

    ]).then(channel => {
        channel.setParent(cat.id); // cat est le channel categorie parent
        channel.sendMessage("@everyone Le ticket est ouvert !");
        if(msgprblm !== "") {
            channel.sendMessage("Le probleme est le suivant : \r\n" + msgprblm);
        }
    }).catch(console.error);
    
    idticket++;
    fs.writeFileSync("save.txt", idticket + ',' + save[1] + ',' + prefix, { encoding: 'utf8'});         
}

bot.on('message', msg => {
    if(msg.content.substring(0,1) === prefix && msg.author.id !== bot.user.id) {
        if(msg.content === prefix + 'help' ) {
            if(msg.member.hasPermission('ADMINISTRATOR')) {
                msg.author.sendMessage("Prerequis: \nUn rôle nommé \"Support\" \nRéserver un channel spécifique pour la création de ticket(Je conseille de poster un message d'explication avant la réservation du channel) \nRéserver un channel (de préférence seulement pour les admins) pour l'éxécution de commandes admin du bot \n\nCommandes: \nPour appeler une commande \"<prefix><commande> <argument>\" \nlink: Permet de réserver un channel pour la création de tickets (Nécessite le droit Administrateur) \nlinkadmin : Permet de réserver un channel pour éxécuter les commandes admins du bot (Nécessite le droit Administrateur) \nticket: Permet a l'utilisateur de créer un ticket, doit être appelé dans le channel réservé par la commande link \nhelp: Permet d'envoyer ce texte en MP afin d'aider dans l'utilisation de ce bot (Nécessite le droit Administrateur) \nprefix: Permet de changer le préfixe a utiliser avant d'appeler une commande (Nécessite le droit Administrateur)  \n \nPour plus de renseignement contacter Titos#2671")
                .catch(function() { console.error(); });
            } else {
                msg.author.sendMessage("Vous n'avez pas les droits nécessaires").catch(function() { console.error(); });
            }
            msg.delete(); 
        } 
            if(msg.channel.id === ticketchannel) {
                    if(msg.content.substring(0,7) === prefix + 'ticket') {
                            msgprblm = msg.content.substring(7);
                            var server = msg.guild;
                            var usertemp = msg.author;
                                    C_Cat(server).catch(function () {
                                        server.createChannel("Problemes/Tickets", "category").then(function() {
                                            msg.reply("La catégorie afin d'acceuillir les ticket a été crée, si vous voulez créer un ticket veuillez réitérer la commande ticket.");
                                            msg.delete();
                                            catticket = true;
                                        })
                                    }).then(function(res) { 
                                        if(catticket === true || categorie !== null) {
                                            C_Chan(res,server,usertemp); 
                                        }
                                    }); 
                            msg.delete();
                    } 
                    
                    else {
                        msg.delete();
                    }

                
            }
            else if(msg.channel.id === channeladmin ) {
                if(msg.member.hasPermission('ADMINISTRATOR')) {
                    //Pas vraiment utile cette commande et creer du traitement supplémentaire
                    /*if(msg.content.substring(0,12) === prefix + 'ticketrole ') {
                        fs.writeFileSync("save.txt", save[0] + ',' + msg.content.substring(12) +',' + prefix, { encoding: 'utf8'});
                        msg.reply("Le role a bien été changé !")
                    }*/
                    if(msg.content.substring(0,8) === prefix + 'prefix ') {
                        if(msg.content.substring(8).length === 1) {
                            prefix = msg.content.substring(8);
                            fs.writeFileSync("save.txt", save[0] + ',' + save[1] +',' + msg.content.substring(8), { encoding: 'utf8'});
                            msg.reply("Le prefix a bien été changé ! N'oubliez pas de changez l'annonce ;)")
                        } else {
                            msg.reply("Veuillez indiquez un seul caractère pour le préfix")
                        }
                    }
                }
                else {
                    msg.reply("Vous n'avez pas les droits nécessaires")
                }
            }
            else {
                if (msg.content === prefix +'link') {
                    if(msg.member.hasPermission('ADMINISTRATOR')) {
                        msg.reply('Link on ' + msg.channel.name);
                        ticketchannel = msg.channel.id;
                        link = true;
                        msg.delete();
                    }
                    else {
                        msg.reply("Vous n'avez pas les droits nécessaires");
                        msg.delete();
                    }
                    
                }
                else if(msg.content === prefix +'linkadmin') {
                    if(msg.member.hasPermission('ADMINISTRATOR')) {
                        msg.reply('Link admin on ' + msg.channel.name);
                        channeladmin = msg.channel.id;
                        linkadmin = true;
                    }
                    else {
                        msg.reply("Vous n'avez pas les droits nécessaires");
                    }
                }
                else {
                    if(link === false && msg.content === prefix +'ticket') {
                        msg.reply("Veuillez d'abord me lier a un channel");
                    }

                }
            }
    }   
    if(msg.channel.id === ticketchannel && msg.content.substring(0,1) !== prefix) { 
        msg.delete();
    }
  });

  
bot.login(token);