  // Load up the discord.js library
  const Discord = require("discord.js");
  const client = new Discord.Client();
  const config = require("./config.json");
  const package = require("./package.json")
  const mysql = require("mysql")
  /*Pik languages*/
  const lang = require(`./lang/${config.lang}`)
  /*functions*/
  function ticketnogenerator(length, chars) {
      var mask = '';
      if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
      if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (chars.indexOf('#') > -1) mask += '0123456789';
      if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
      var result = '';
      for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
      return result;
  }
  function MakeConnection(){
    var con = mysql.createConnection({
    host: config.database.host ,
    user: "root",
    password: config.database.password,
    database: "discordbot"
  });
      return con
  }

  function getFirstTicketInfo(status,message,lang,callback){
     var sql ="SELECT * FROM assistenza WHERE ticket_status= 'Non Definito' ORDER BY ID DESC";
        con.query(sql, function (err, result) {
          if (err) throw err;
          //display query console
            console.log(result);
            result = result
            return callback(result)
      }
    );
  }

function getSpecTicketInfo(status,message,lang,args,callback) {
  var sql= "SELECT * FROM assistenza WHERE ticket_status='Non Definito' AND ticket_id=? ORDER BY ID DESC";
  var value = [encodeURI(args[0])];
  con.query(sql, value, function(err,result){
    if (err) throw err;
    //dispaly query console
    console.log(result)
    result = result
    return callback(result)
    }
  );
}

  function getQueue(message,lang,callback){
  var sql ="SELECT * FROM assistenza WHERE ticket_status='Non Definito' OR ticket_status='Accettato' ORDER BY ID DESC LIMIT 10";
        con.query(sql, function (err, result) {
          if (err) throw err;
          //display query console
            console.log(result);
            result = result
            return callback(result)
      }
    );
  }

  function getToBeAssigned(message,m,lang,callback){
  var sql ="SELECT * FROM assistenza WHERE ticket_status= 'Non Definito' ORDER BY ID DESC";
        con.query(sql, function (err, result) {
          if (err) throw err;
          //display query console
            console.log(result);
            result = result
            return callback(result)
      }
    );
  }
  function getOwned(message,m,lang,callback){
     var sql ="SELECT * FROM assistenza WHERE accepted_by_name= ? AND ticket_status= 'Accettato' OR ticket_status= 'Non Definito' ORDER BY ID DESC";
     var value = [message.author.username]
        con.query(sql,value, function (err, result) {
          if (err) throw err;
          //display query console
            console.log(result);
            result = result
            return callback(result)
          }
      );
  }
   function getTicket(message,args,m,lang,callback){
    var sql = "SELECT * FROM assistenza WHERE ticket_id = ?";
    var value = [args[0]];
    con.query(sql, value, function(err,result){
      if (err) throw err;
      //display query console
      console.log(result);
      result = result
      return callback(result)
    });

   }
  //***THIS IS VITAL FOR THE LIFE OF THE BOT***//
  client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  });

  client.on("guildCreate", guild => {
    //This event is triggered when a new guild is added
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  });

  client.on("guildDelete", guild => {
    /*Say who banned the bot... Go to the admin who banned the bot
    * and remove he from is admin position ;)
    */
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  });


  client.on("message", async message => {
    //Ignore bot
    //if(message.author.bot) return;

    // Ignore oder commands
    //if(message.content.indexOf(config.prefix) !== 0) return;
    //const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //const command = args.shift().toLowerCase();

    /*if(command === "debug") {
      /* Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      *The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      */
      //const m = await message.channel.send("Ping?");*/
      //m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    //}
    /*if(command === "delete") {*/
      /* This command removes all messages from all users in the channel, up to 100.
       *get the delete count, as an actual number.
       */
      /*const deleteCount = parseInt(args[0], 10)
      if(!deleteCount || deleteCount < 2 || deleteCount > 1000)
        return message.reply("Please provide a number between 2 and 1000 for the number of messages to delete");
      const fetched = await message.channel.fetchMessages({limit: deleteCount});
      message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }*/

    //if (command === "assistenza"){
      /*
      * This command is take care of the support
      */
      //timestamp = new Date()
      //ticketid = ticketnogenerator(6,'aA#')
      //assistenza side
      /*console.log(`"Support requested at"${timestamp}`);
      await message.channel.send("Qualcuno ti contatterà abreve ");
      //Database Side
      con = MakeConnection()
      con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
      });
      var sql="INSERT INTO assistenza(sent_by_name, sent_by_id, sent_date, ticket_id, ticket_content) VALUES (?,?,?,?,?)"
      var value =[message.author.username,message.author.id,timestamp,ticketid,args.join(" ")]
      con.query(sql, value,function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
      //support side
      for (var i = 0; i < 3; i++) {
          client.users.get(config.assistenza[i].id).send({embed:{
                color: parseInt(config.staffcolor),
                title: lang.title,
                description: "You got a support ticket\n**Ticket Info: **",
                fields: [
                  {
                    name: lang.private[2].userUS,
                    value:message.author.username
                  },
                  {
                    name: lang.private[2].userUID,
                    value:message.author.id
                  },
                  {
                    name: lang.data,
                    value: timestamp
                  },
                  {
                    name: lang.private[0].ticketid,
                    value:ticketid
                  },
                  {
                    name:lang.private[0].tcontent ,
                    value: args.join(" ")
                  },
                  {
                    name:lang.use ,
                    value:lang.private[3].commandnote
                  },
                  {
                    name:lang.note ,
                    value: lang.private[3].acceptnote
                  }
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }

              }
            });
      }
      //client side
        client.users.get(message.author.id).send({embed:{
                color: parseInt(config.usercolor),
                title: lang.title,
                description: "You got a support ticket\n**Ticket Info: **",
                fields: [
                  {
                    name: lang.ticket[0].topen,
                    value:timestamp
                  },
                  {
                    name: lang.private[0].ticketid,
                    value:ticketid
                  },
                  {
                    name: lang.private[0].tcontent,
                    value: args.join(" ")
                  }
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }

              }
            })
      con.end();
      console.log(`Connection to the Database closed at :${timestamp}`);
    }*/

    //if(command === "accept"){
      /*
      * This command accept the tickets and assigne the ticket to the one that accepted it
      */
      /*const ticketid = args;
      var timestamp = new Date();
      var status = 'Accettato';
      const m =  await message.channel.send(`${lang.wating[0].lrequest}`);
       con = MakeConnection()
        con.connect(function(err) {
          if (err) throw err;
            console.log(`Connected to Database opened :${timestamp}`);
        });

      if(args[0] === undefined){
        console.log(args[0])
        getFirstTicketInfo(status,message,lang,function(result){
          result = result
          if (typeof  result === undefined || result.length === 0){
            client.users.get(message.author.id).send(`No Ticket to be assigned!`);
          }else{
          var sql  = "UPDATE assistenza SET accepted_by_name = ?, accepted_date= ?, ticket_status= ? WHERE ticket_id =?";
          var value =[message.author.username,timestamp,status,result[0].ticket_id];
          con.query(sql,value,function(err,res){
            if (err) throw err;
          console.log(res)
          });
            //staff side
              client.users.get(message.author.id).send({embed:{
                color: parseInt(config.staffcolor),
                title: lang.title,
                description: "You have accepted the ticket\nTicket Info",
                fields: [
                  {
                    name: lang.private[0].ticketid,
                    value:result[0].ticket_id
                  },
                  {
                    name: lang.private[2].userUS,
                    value:result[0].sent_by_name
                  },
                  {
                    name: "**Accepted by you on **",
                    value: timestamp
                  },
                  {
                    name: lang.private[0].tnstatus,
                    value:status
                  },
                  {
                    name:lang.private[0].tcontent ,
                    value: result[0].ticket_content
                  },
                  {
                    name:lang.userstatus,
                    value:client.user.presence.status
                  }
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }

              }
            });
        //user side
        client.users.get(message.author.id).send({embed:{
                color: config.usercolor,
                title: lang.title,
                description: "Your ticket have been accepted!\nSupport Info",
                fields: [
                  {
                    name: "**Tracking ID**",
                    value:result[0].ticket_id
                  },
                  {
                    name: lang.ticket[0].assigneto,
                    value:message.author.username
                  },
                  {
                    name: lang.private[0].tstatus,
                    value: status
                  },
                  {
                    name: "NOTE",
                    value:lang.wating[0].awatingc
                  },
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }

              }
            });
        }
      con.end()
      console.log(`Connection to the Database closed at :${timestamp}`)
      });
      }else if(args[0].length === 6){
        getSpecTicketInfo(status,message,lang,args,function(result){
          result = result;
          if (typeof  result === undefined || result.length === 0){
            client.users.get(message.author.id).send(`${message.author} ${lang.error[0].enotfound}`);
          }else{
            var sql  = "UPDATE assistenza SET accepted_by_name = ?, accepted_date= ?, ticket_status= ? WHERE ticket_id =?";
            var value =[message.author.username,timestamp,status,result[0].ticket_id];
            con.query(sql,value,function(err,res){
              if (err) throw err;
            console.log(res)
            });
            //staff side
              client.users.get(message.author.id).send({embed:{
                color: parseInt(config.staffcolor),
                title: lang.title,
                description: "You have accepted the ticket\nTicket Info",
                fields: [
                  {
                    name: lang.private[0].ticketid,
                    value:result[0].ticket_id
                  },
                  {
                    name: lang.private[2].userUS,
                    value:result[0].sent_by_name
                  },
                  {
                    name: "**Accepted by you on **",
                    value: timestamp
                  },
                  {
                    name: lang.private[0].tnstatus,
                    value:status
                  },
                  {
                    name:lang.private[0].tcontent ,
                    value: result[0].ticket_content
                  }
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }

              }
            });
        //user side
        client.users.get(message.author.id).send({embed:{
                color: config.usercolor,
                title: lang.title,
                description: "Your ticket have been accepted!\nSupport Info",
                fields: [
                  {
                    name: "**Tracking ID**",
                    value:result[0].ticket_id
                  },
                  {
                    name: lang.ticket[0].assigneto,
                    value:message.author.username
                  },
                  {
                    name: lang.private[0].tstatus,
                    value: status
                  },
                  {
                    name: lang.note,
                    value:lang.wating[0].awatingc
                  },
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }

              }
            });

        }
      con.end()
      console.log(`Connection to the Database closed at :${timestamp}`)
      });
      }else{
        client.users.get(message.author.id).send(`${message.author} ${lang.error[0].eformatt}`)
      }
      m.edit(`${lang.loading[0].complete}`);
    }
    if (command === "queue"){
      timestamp =new Date()
      con = MakeConnection()
       con.connect(function(err) {
          if (err) throw err;
            console.log(`Connected to Database opened :${timestamp}`);
        });
       getQueue(message,lang,function(result){
        count = result.length
        if(result!== undefined || result.length>0){
        if(message.member.roles.some(r=>["Server Founder", "Staff","Permesso"].includes(r.name)) ){
        client.users.get(message.author.id).send(`Queue members :${count}
          \n**Queue: **`);
        for (var i = 0; i < result.length; i++) {
            client.users.get(message.author.id).send(`**Ticket ID: **${result[i].ticket_id}
              **User Username: **${result[i].sent_by_name};
              **User ID: **${result[i].sent_by_id};
              **Requested Date: **${result[i].sent_date}
              **Status: **${result[i].ticket_status}
              **Ticket content: **${result[i].ticket_content}`);
        }
      }
        message.channel.send(` **NOTE: **The command display the only first 10 tickets in the queue
          Queue members :${count}
          \n**Queue: **`)
        for (var i = 0; i < result.length; i++) {
        message.channel.send(`**Position: **${i+1}
         **User Username: **${result[i].sent_by_name}
         **Requested Date: **${result[i].sent_date}
         **Status: **${result[i].ticket_status}`);
        }
      }else{
        client.users.get(message.author.id).send(`${lang.ticket[0].noticket}`);
        m.edit(`${lang.loading[0].complete}`)
      }
        con.end()
        console.log(`Connection to the Database closed at :${timestamp}`)
       });
    }

    if(command === "owned"){
      timestamp =new Date()
      con = MakeConnection()
       con.connect(function(err) {
          if (err) throw err;
            console.log(`Connected to Database opened :${timestamp}`);
        });
      const m =  await message.channel.send(`${lang.wating[0].lrequest}`);
       getOwned(message,m,lang,function(result){
        count = result.length;

      if(message.member.roles.some(r=>["Server Founder", "Staff","Permesso"].includes(r.name)) ){
          if (typeof  result === undefined || result.length === 0){
            client.users.get(message.author.id).send(`${lang.ticket[0].noticket}`);
            m.edit(`${lang.loading[0].complete}`)
          }else{
             client.users.get(message.author.id).send(`You have ${count} tickets to close
          \n**Queue: **`);
        for (var i = 0; i < result.length; i++) {
            client.users.get(message.author.id).send(`**Ticket ID: **${result[i].ticket_id}
              **User Username: **${result[i].sent_by_name};
              **User ID: **${result[i].sent_by_id};
              **Requested Date: **${result[i].sent_date}
              **Status: **${result[i].ticket_status}
              **Ticket content: **${result[i].ticket_content}
              **Accepted by you on : **${result[i].accepted_date}`);
            m.edit(`${message.author} ${lang.loading[0].cticket}`)
            }
          }
        }else{
          m.edit(lang.noper)
        }
        con.end()
        console.log(`Connection to the Database closed at :${timestamp}`)
       });

    }
    if(command === "pedding"){
      timestamp =new Date()
      con = MakeConnection()
       con.connect(function(err) {
          if (err) throw err;
            console.log(`Connected to Database opened :${timestamp}`);
        });
       const m =  await message.channel.send(`${lang.wating[0].lrequest}`);
       getToBeAssigned(message,m,lang,function(result){
        count = result.length
        if(message.member.roles.some(r=>["Server Founder", "Staff","Permesso"].includes(r.name)) ){
          if (result.length === 0) {
            client.users.get(message.author.id).send(`${message.author} ${lang.ticket[0].nopedding}`)
            m.edit(`${message.author} ${lang.loading[0].complete}`)
          }else{
            client.users.get(message.author.id).send(`${message.author} ${count} tickets to be accepted please use the !accept commnad to take it one ;)
              \n**Queue: **`)
            for (var i = 0; i < result.length; i++) {
               client.users.get(message.author.id).send(`**Ticket ID: **${result[i].ticket_id}
              **User Username: **${result[i].sent_by_name};
              **User ID: **${result[i].sent_by_id};
              **Requested Date: **${result[i].sent_date}
              **Status: **${result[i].ticket_status}
              **Ticket content: **${result[i].ticket_content}`)
               m.edit(`${message.author} ${lang.loading[0].complete}`)
              }
            }
        }else{
          m.edit(lang.noper)
        }
        con.end()
        console.log(`Connection to the Database closed at :${timestamp}`)
      });
    }*/

    //if(command === "close"){
      /*
      * This command close a ticket given the ticket ID
      */
      //timestamp = new Date()
    //con = MakeConnection()
      // con.connect(function(err) {
        //  if (err) throw err;
          //  console.log(`Connected to Database opened :${timestamp}`);
        //});
       /*const m =  await message.channel.send(`${message.author} ${lang.wating[0].lrequest}`);
      if(message.member.roles.some(r=>["Server Founder", "Staff","Permesso"].includes(r.name)) ){
          getTicket(message,args, m, lang,function(result){
            // vars
            var status = 'Completato'
            //database side
             if (typeof  result === undefined || result.length === 0){
            client.users.get(message.author.id).send(`${lang.error[0].enotfound}`)
            m.edit(`${lang.loading[0].cerror}`)
          }else{
            if(result[0].ticket_status !== status){
            var sql  = "UPDATE assistenza SET ticket_status = ?, complete_date =?   WHERE ticket_id =?";
            var value =[status,timestamp,result[0].ticket_id];
            con.query(sql,value,function(err,res){
              if (err) throw err;
            console.log(res)
          });

            if(args[1]=== undefined){
              args[1] = '****'
            }
            //support side
             client.users.get(result[0].sent_by_id).send({embed:{
              color: 25500033,
              title: lang.title,
              description: "You closed a ticket **Thanks for working hard!**\nTicket Info",
              fields: [
                {
                  name: lang.private[0].ticketid,
                  value:result[0].ticket_id
                },
                {
                  name: lang.private[2].userUS,
                  value:result[0].sent_by_name
                },
                {
                  name: lang.private[2].userUID,
                  value:result[0].sent_by_id
                },
                {
                  name: lang.private[1].staffcom,
                  value:args[1]
                },
                {
                  name: "**Closed by**",
                  value:message.author.username
                },
                {
                  name: "**Date**",
                  value:timestamp
                },
                {
                  name: lang.private[0].tnstatus,
                  value:status
                }
              ],
            timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: lang.footer
              }
          }
      });
            //client side
            client.users.get(result[0].sent_by_id).send({embed:{
              color: 3447003,
              title: lang.title,
              description: "Your ticket is complete",
              fields: [
                {
                  name: lang.private[0].ticketid,
                  value:result[0].ticket_id
                },
                {
                  name: lang.private[1].staffUs,
                  value:result[0].accepted_by_name
                },
                {
                  name: lang.private[1].staffUID,
                  value:message.author.id
                },
                {
                  name: lang.private[1].staffcom,
                  value:args[1]
                },
                {
                  name: "**Closed by**",
                  value:message.author.username
                },
                {
                  name: "**Date**",
                  value:timestamp
                },
                {
                  name: lang.private[0].tnstatus,
                  value:status
                }
              ],
            timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: lang.footer
              }
          }
      });
            m.edit(`${message.author} Ticket "${result[0].ticket_id}" has been closed new Updated status: ${status}`)
              }else{
                client.users.get(message.author.id).send(`${lang.error[0].eforbidden}`);
                m.edit(`${lang.loading[0].cerror}`)
              }
            }
          });
      }else{m.edit(`${lang.noper}`)}
    }
    if(command === "status"){
      timestamp = new Date()
      con = MakeConnection()
       con.connect(function(err) {
          if (err) throw err;
            console.log(`Connected to Database opened :${timestamp}`);
        });
       const m =  await message.channel.send(`${message.author} ${lang.wating[0].lrequest}`);
      getTicket(message,args,m,lang,function(result){
          if (typeof  result === undefined || result.length === 0){
            client.users.get(message.author.id).send(`${lang.error[0].enotfound}`)
            m.edit(`${lang.loading[0].cerror}`)
          }else{
      m.edit(`Ticket status for ID. ${result[0].ticket_id} is ${result[0].ticket_status}`)
      client.users.get(message.author.id).send({embed:{
                color: parseInt(config.usercolor),
                title: lang.title,
                description: "Ticket status request\n**Ticket Info: **",
                 fields:[
                  {
                    name: lang.private[0].ticketid,
                    value:result[0].ticket_id
                  },
                  {
                    name: lang.private[2].userUS,
                    value:result[0].sent_by_name
                  },
                  {
                    name:lang.ticket[0].trequestdate,
                    value:result[0].sent_date,
                  },
                  {
                    name: lang.private[0].tstatus,
                    value: result[0].ticket_status
                  }
                ]
              }
            });
        }
    });
  }*/
  /*if (command === "help") {
    if(message.member.roles.some(r=>["Server Founder","STAFF","Permesso"].includes(r.name)) ){
      console.log(client.user.presence.status)
      client.users.get(message.author.id).send({embed:{
                color: parseInt(config.usercolor),
                title: lang.title,
                description: package.description,
                fields: [
                 {
                    name: lang.regolamentost,
                    value:lang.helpst
                  },
                  {
                    name: lang.comandist,
                    value:lang.commandst
                  }
                ],
              timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: lang.footer
                }
            }
      });
    }else{
      console.log(message.member.roles)
      client.users.get(message.author.id).send({embed:{
        color: parseInt(config.usercolor),
        title: lang.title,
        description: package.description,
        fields: [
         {
            name: lang.regolamentost,
            value:lang.helpus
          },
          {
            name: lang.comandius,
            value:lang.commandus
          }
        ],
        timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: lang.footer
                }
            }
        });
    }
  }*/
}),
  client.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    /*
    adding to the role the person that have joined to server without check
    */
    member.addRole('485937432408096768').catch(console.error("Error add role function something went wrong"));
    console.log(`New User "${member.user.username}" added to role Civile`);

        member.send({embed:{
            color: 3447003,
            title: "**Cactus RolePlay[ITA]** Welcome Bot!",
            description: config.message,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "© Cactus RolePlay [ITA] 2019"
          }
        }
      });

        timestamp = new Date();
        console.log(`"Welcome message sent at "${timestamp}`);
  });


  client.login(config.token);
