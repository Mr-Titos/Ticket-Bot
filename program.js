const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

//Faire en sorte que idticket s'incrémente meme si il y a redémarrage (sauvegarde dans fichier text via FS)

var prefix = "$";
var ticketchannel = 0;
let link = false;
var idticket = 0;
var catticket = false;
let categorie;


bot.on('ready', function () {
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

function C_Chan(resolve,serv,user) {
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
            id: serv.roles.find(role => role.name === "Support").id,
            allow: ['VIEW_CHANNEL'],
        },

    ]).then(channel => {
        channel.setParent(resolve.id);
    }).catch(console.error);
    
    idticket++;
}

bot.on('message', msg => {
    if(msg.content.substring(0,1) === prefix && msg.author.id !== bot.user.id) {
        if(msg.content === prefix + 'help' ) {
            if(msg.member.hasPermission('ADMINISTRATOR')) {
                msg.author.sendMessage("Prerequis: \nUn rôle nommé \"Support\" \nRéservé un channel spécifique pour la création de ticket(Je conseille de poster un message d'explication avant la réservation du channel) \n\nCommandes: \nPour appeler une commande il faut le préfixe plus le nom de la commande (+ arguments si nécessaire) \nlink: Permet de réserver un channel pour la création de tickets (Nécessite le droit Administrateur) \nticket: Permet a l'utilisateur de créer un ticket, doit être appelé dans le channel réservé par la commande link \nhelp: Permet d'envoyer ce texte en MP afin d'aider dans l'utilisation de ce bot (Nécessite le droit Administrateur) \n \nPour plus de renseignement contacter Titos#2671")
                .catch(function() { console.error(); });
            } else {
                msg.author.sendMessage("Vous n'avez pas les droits nécéssaires pour consulter cette aide").catch(function() { console.error(); });
            }
            msg.delete(); 
        } 
            if(msg.channel.id === ticketchannel) {
                    if(msg.content === prefix + 'ticket') {
                            var server = msg.guild;
                            var usertemp = msg.author;
                                    C_Cat(server).catch(function () {
                                        server.createChannel("Problemes/Tickets", "category").then(function() {
                                            msg.reply("La catégorie afin d'acceuillir les ticket a été crée, si vous voulez créer un ticket veuillez réitérer la commande ticket.");
                                            catticket = true;
                                        })
                                    }).then(function(res) { 
                                        if(catticket === true || categorie !== null) {
                                            C_Chan(res,server,usertemp); 
                                        }
                                    }); 
                            msg.delete();
                    } 
                    
                    // A faire apres, nécéssite une sauvegarde par server id, et une code de trame
                    /*else if(msg.content.substring(0,7) === prefix + 'ticketrole ') {
                        
                    }*/
                    else {
                        msg.delete();
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
                else {
                    if(link === false && msg.content === prefix +'ticket') {
                        msg.reply("Veuillez d'abord me lier a un channel");
                    }

                }
                //Nécéssite ici aussi une sauvegarde via un fichier extérieur et tutti quanti
                /*if (msg.content === prefix +'prefix') {
                    if(msg.content.substring(8).length === 1) {
                        prefix = msg.content.substring(8);
                        msg.reply("Le prefix a bien été mis a jour");
                    } else {
                        msg.reply("Erreur lors de la commande : <ancien_préfix>prefix <nouveau_préfix>");
                    }
                }*/
            }
    }   
    if(msg.channel.id === ticketchannel && msg.content.substring(0,1) !== prefix) { 
        msg.delete();
    }
  })

  
bot.login('NTc5Mzk0NzA3MDcxODI3OTc4.XOBjpA.wHq1gZg0spPy4-F8GPJIUYc4BrQ');