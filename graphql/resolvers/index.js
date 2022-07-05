const User = require("../../models/user")
const Info=require("../../models/info")
const Incident=require("../../models/incident")
const Finance=require("../../models/finance")
const Releve=require ("../../models/releve")
const Message=require("../../models/message")
const bcrypt=require("bcrypt")
const jwt= require("jsonwebtoken")
const nodemailer = require('nodemailer');
const env= require('dotenv').config()


let transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
     ciphers:'SSLv3'
  },
  auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`
  }
});


module.exports = {
  users: async(_,req) => {
    try {
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      const usersFetched = await User.find()
      return usersFetched.map(user => {
        return {
          ...user._doc,
          _id: user.id,
        }
      })
    } catch (error) {
        throw error
    }
  },
  contacts: async(_,req) => {
    try {
        if(!req.isAuth){
            throw new Error ("Non autorisé")
        }
      const usersFetched = await User.find()
      return usersFetched.map(user => {
        return {
          ...user._doc,
          _id: user.id,
        }
      })
    } catch (error) {
        throw error
    }
  },

  createUser: async (args,req) => {
    try {
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      const hash = bcrypt.hashSync(args.user.password, 10);

      const user = new User({
        email:args.user.email,
        password:hash,
        name:args.user.name,
        lot:args.user.lot,
        millieme:args.user.millieme
 
      })

      const newUSer = await user.save()
      return { ...newUSer._doc, _id: newUSer.id }
    } catch (error) {
        throw error
    }
  },

  updateUser:async (args,req) => {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
        let arguments
        if(!args.user.password){
            arguments={name:args.user.name,email:args.user.email,lot:args.user.lot,millieme:args.user.millieme}
        }else {
            const hash = bcrypt.hashSync(args.user.password, 10);

            arguments={name:args.user.name,email:args.user.email,lot:args.user.lot,password:hash,millieme:args.user.millieme}
        }
        const user= await User.findOneAndUpdate({_id:args.user._id},arguments
        )
        return { ...user._doc}

    } catch (error ){
        throw error
    }
  },

  deleteUser:async (args,req) => {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      
        const user= await User.findOneAndDelete({_id:args.user._id})
        return { ...user._doc}

    } catch (error ){
        throw error
    }
  },

  loginUser:async ({email,password}) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Identifiant invalide')
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            throw new Error("Mot de passe invalide")
        }
        const token = jwt.sign({ _id: user._id},'RANDOM_TOKEN_SECRET'
            
        );
        return {
            token,
            ...user._doc,
            userId:user._id
            
        }
    } catch (error) {
        return error
    }
  },
  createInfo:async(args,req)=> {
    try {
        if(!req.isAuth){
            throw new Error ("Non autorisé")
        }
      const info = new Info({description:cat(args.infos.description),status:"En attente"})

      const newInfo = await info.save()
      const user = await User.findOne({_id:req.userId});

      const message = {
        from: `${process.env.EMAIL_USER}`, // Sender address
        to: `${process.env.EMAIL_USER}`,         // List of recipients
        subject: 'Info à modérer', // Subject line
        text: `Une info a été créée par ${user.name}`, // Plain text body
    };
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
      return { ...newInfo._doc,_id: newInfo.id}
    } catch (error) {
        throw error
    }
  },
  infos: async(_,req) => {
    try {
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      const infosFetched = await Info.find()
      return infosFetched.map(info => {
        return {
          ...info._doc,
          _id: info.id,
        }
      })
    } catch (error) {
        throw error
    }
  },
  infosNoAdmin: async(_,req) => {
    try {
        if(!req.isAuth){
            throw new Error ("Non autorisé")
        }
      const infosFetched = await Info.find({status:"Publié"})
      return infosFetched.map(info => {
         
        return {
          ...info._doc,
          _id: info.id,
        }
      })
    } catch (error) {
        throw error
    }
  },
  changeStatusInfos:async(args,req)=> {
      try {
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
        const info= await Info.findOneAndUpdate({_id:args.infos._id},{status:args.infos.status},{
            new:true
        })
        if(args.infos.status==="Publié"){
          const usersFetched = await User.find()
          return usersFetched.map(user => {
        
            const message = {
              from: `${process.env.EMAIL_USER}`, // Sender address
              to: `${user.email}`,         // List of recipients
              subject: 'Actualités sur Ma Copro', // Subject line
              text: `Bonjour
              
              Voici la nouvelle actualité concernant la copropriété Villa Laure:
              ${info.description}
        
               
               http://copro-villa-laure.fr/dashboard
        
        
                Christopher`, // Plain text body
          };
          transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
          });
        })
      }
      return { ...info._doc}

      }catch(error){
          
      }
  },
  changeStatusIncident:async(args,req)=> {
    try {
      if(!req.isAdmin){
          throw new Error ("Non autorisé")
      }
      const incident= await Incident.findOneAndUpdate({_id:args.incidents._id},{status:args.incidents.status},{
          new:true
      })
      if(args.incidents.status==="Publié"){
        const usersFetched = await User.find()
        return usersFetched.map(user => {
      
          const message = {
            from: `${process.env.EMAIL_USER}`, // Sender address
            to: `${user.email}`,         // List of recipients
            subject: 'Incidents sur Ma Copro', // Subject line
            text: `Bonjour
            
           Un incident a été remonté concernant la copropriété Villa Laure:

            ${incident.description}
      
             
             http://copro-villa-laure.fr/dashboard
      
      
              Christopher`, // Plain text body
        };
        transport.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
        });
      })
    }
      return { ...incident._doc}

    }catch(error){
        
    }
},
  deleteInfo:async (args,req) => {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      
        const info= await Info.findOneAndDelete({_id:args.infos._id})
        return { ...info._doc}

    } catch (error ){
        throw error
    }
  },
  deleteIncident:async (args,req) => {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      
        const incident= await Incident.findOneAndDelete({_id:args.incidents._id})
        return { ...incident._doc}

    } catch (error ){
        throw error
    }
  },
  createIncident:async(args,req)=> {
    try {
        if(!req.isAuth){
            throw new Error ("Non autorisé")
        }
      const incident = new Incident({description:args.incidents.description,status:"En attente"})

      const newIncident = await incident.save()
      const user = await User.findOne({_id:req.userId});

      const message = {
        from: `${process.env.EMAIL_USER}`, // Sender address
        to: `${process.env.EMAIL_USER}`,         // List of recipients
        subject: 'Incident à modérer', // Subject line
        text: `Un incident a été remonté par ${user.name}`, // Plain text body
    };
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
      return { ...newIncident._doc,_id: newIncident.id}
    } catch (error) {
        throw error
    }
  },
  incidents: async(_,req) => {
     try {
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      const incidentsFetched = await Incident.find()
      return incidentsFetched.map(incident => {
        return {
          ...incident._doc,
          _id: incident.id,
        }
      })
    } catch (error) {
        throw error
    }
  },
  incidentsNoAdmin: async(_,req) => {
    try {
        if(!req.isAuth){
            throw new Error ("Non autorisé")
        }
      const incidentsFetched = await Incident.find({status:"Publié"})
      return incidentsFetched.map(incident => {
         
        return {
          ...incident._doc,
          _id: incident.id,
        }
      })
    } catch (error) {
        throw error
    }
  },
  updateIncident:async (args,req) => {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      const arguments={messageAdmin:args.incidents.messageAdmin,description:args.incidents.description}
        
        const incident= await Incident.findOneAndUpdate({_id:args.incidents._id},arguments
        )
        return { ...incident._doc}

    } catch (error ){
        throw error
    }
  },
  createYearFinance:async(args,req)=> {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
      const prevYear=(args.finances.year -1)
      const prevFinance= await Finance.findOne({year:prevYear})
      let finance
      if( prevFinance){
         finance = new Finance({year:args.finances.year,solde:prevFinance.actuel,actuel:prevFinance.actuel})

      }else {
         finance = new Finance({year:args.finances.year,actuel:args.finances.actuel,solde:args.finances.solde})

      }
      const newFinance= await finance.save()
        
      return { ...newFinance._doc}

    } catch (error ){
        throw error
    }
  },
  finances: async(_,req) => {
    try {
        if(!req.isAuth){
            throw new Error ("Non autorisé")
        }
      const financesFetched = await Finance.find().sort([["year",-1]])
      return financesFetched.map(finance => {
        return {
          ...finance._doc,
          _id: finance.id,
        }
      })
    } catch (error) {
        throw error
    }
  },
  createReleve:async(args,req)=> {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
  
      const releve = new Releve({date:args.finances.date,description:args.finances.description,type:args.finances.type,recette:args.finances.recette,depense:args.finances.depense})
      const finance= await Finance.findOne({year:args.finances.year})
      let sum=args.finances.recette-args.finances.depense
      const newActuel= await Finance.findOneAndUpdate(
        {"year":args.finances.year},
        {"$inc":{"actuel":sum}}
      )
      const financeModified= await finance.releve.push(releve)
      const newFinance= await finance.save()

      return { ...newFinance._doc,newActuel}

    } catch (error ){
        throw error
    }
  },

  deleteReleve:async (args,req) => {
    try { 
        if(!req.isAdmin){
            throw new Error ("Non autorisé")
        }
        const finance= await Finance.findOne({year:args.finances.year})
        let sum=finance.solde
        const financeModified= await finance.releve.pull({_id:args.finances._id})
        finance.releve.map(releve=>sum+=(releve.recette-releve.depense))
        const newActuel= await Finance.findOneAndUpdate(
          {"year":args.finances.year},
          {"$set":{"actuel":sum}}
        )
        const newFinance= await finance.save()
  
        
        return { ...newFinance._doc}
    } catch (error ){
        throw error
    }
  },

  changeReleve:async(args,req)=> {
    try {
      if(!req.isAdmin){
          throw new Error ("Non autorisé")
      }

      const releve=  await Finance.findOneAndUpdate(
        {"year":args.finances.year,"releve._id":args.finances._id},
        {"$set":{"releve.$.description":args.finances.description,"releve.$.date":args.finances.date,"releve.$.type":args.finances.type,"releve.$.recette":args.finances.recette,"releve.$.depense":args.finances.depense}}
      )
      const finance= await Finance.findOne({year:args.finances.year})
      let sum=finance.solde
      finance.releve.map(releve=>sum+=(releve.recette-releve.depense))
      const newActuel= await Finance.findOneAndUpdate(
        {"year":args.finances.year},
        {"$set":{"actuel":sum}}
      )
       return { ...releve._doc}

    }catch(error){
      throw error

    }
},
createProvision:async(args,req)=> {
  try { 
      if(!req.isAdmin){
          throw new Error ("Non autorisé")
      }

    const newProvision= await User.findOneAndUpdate(
      {"name":args.user.name},
      {"$push":{"provision":{'year':args.user.year,'montant':args.user.montant,'paid':false}}}
    )
    const user= await User.findOne({_id:req.userId})
    const message = {
      from: `${process.env.EMAIL_USER}`, // Sender address
      to: `${user.email}`,         // List of recipients
      subject: 'Un appel de fonds vous concerne', // Subject line
      text: `Bonjour


       Une demande de provision pour l'année ${args.user.year}  d'un montant de ${args.user.montant}€ vous est adressée sur la plateforme Ma Copro'.


       http://copro-villa-laure.fr/dashboard


        Christopher`, // Plain text body
  };
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});
    return { ...newProvision._doc}

  } catch (error ){
      throw error
  }
},
deleteProvision:async (args,req) => {
  try { 
      if(!req.isAdmin){
          throw new Error ("Non autorisé")
      }
    
      const user= await User.findOneAndUpdate(
        {"name":args.user.name},
        {"$pull":{"provision":{"montant":args.user.montant}}}

      )      
      return { ...user._doc}

  } catch (error ){
      throw error
  }
},
modifyProvision:async(args,req)=> {
  try {
    if(!req.isAdmin){
        throw new Error ("Non autorisé")
    }

    const provision=  await User.findOneAndUpdate(
      {"name":args.user.name,"provision.montant":args.user.oldMontant},
      {"$set":{"provision.$.montant":args.user.montant,"provision.$.year":args.user.year}}
    )
 
     return { ...provision._doc}

  }catch(error){
      
  }
},
modifyProvisionStatus:async(args,req)=> {
  try {
    if(!req.isAdmin){
      throw new Error ("Non autorisé")
    }

    const provision=  await User.findOneAndUpdate(
      {"name":args.user.name,"provision.montant":args.user.montant},
      {"$set":{"provision.$.paid":args.user.paid}}
    )
 const user= await User.findOne({"name":args.user.name})
    const message = {
      from: `${process.env.EMAIL_USER}`, // Sender address
      to: `${user.email}`,         // List of recipients
      subject: 'Provision', // Subject line
      text: `Bonjour


     Le status de votre provision d'un montant de ${args.user.montant}€ a été modifié.

       
       http://copro-villa-laure.fr/dashboard


        Christopher`, // Plain text body
  };
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});
     return { ...provision._doc}

  }catch(error){
    throw error

  }
},
changePassword:async(args,req)=> {
  try{
    if(!req.isAuth){
      throw new Error ("Non autorisé")
    }
    const user = await User.findOne({_id:req.userId});
    if (!user) {
      throw new Error('Identifiant invalide')
  }
    
    const isCorrectPassword = await bcrypt.compare(args.user.password, user.password);
    if (!isCorrectPassword) {
      throw new Error("Mot de passe invalide")
  }
  const hash = bcrypt.hashSync(args.user.newPassword, 10);
  const userUpdated= await User.findOneAndUpdate({_id:req.userId},{password:hash})

  return { ...userUpdated._doc}

    
  }catch(error){
    throw error

  }
},
createMessage:async(args,req)=> {
  try {
      if(!req.isAuth){
          throw new Error ("Non autorisé")
      }
    const user = await User.findOne({_id:req.userId});
    const destinataire= await User.findOne({name:args.messages.destinataire})
    const email = {
      from: `${process.env.EMAIL_USER}`, // Sender address
      to: `${destinataire.email}`,         // List of recipients
      subject: 'Nouveau message sur la plateforme Ma Copro', // Subject line
      text: `Bonjour !
      
      ${user.name} vous a envoyé un message sur Ma Copro
      
      http://copro-villa-laure.fr/'
       `, // Plain text body
  };
  transport.sendMail(email, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});

    const message = new Message({message:args.messages.message,expediteur:user.name,destinataire:args.messages.destinataire})

    const newMessage = await message.save()
    return { ...newMessage._doc,_id: newMessage.id}
  } catch (error) {
      throw error
  }
},
readMessage:async(args,req)=> {
  try {
      if(!req.isAuth){
          throw new Error ("Non autorisé")
      }
    const message = await Message.findOneAndUpdate({_id:args.messages._id},{lu:true});

    return { ...message._doc}
  } catch (error) {
      throw error
  }
},
messages: async(_,req) => {
  try {
      if(!req.isAuth){
          throw new Error ("Non autorisé")
      }
    const user = await User.findOne({_id:req.userId});
    

    const messagesFetched = await Message.find({$or:[{destinataire:user.name},{expediteur:user.name}]}).sort([["date",+1]])
    return messagesFetched.map(message =>{{return {...message._doc}}}
      
  
    )
  } catch (error) {
      throw error
  }
},
forgotPassword:async(args)=> {
  try {

    var randomstring = Math.random().toString(36).slice(-8);
    const hash = bcrypt.hashSync(randomstring, 10);

    const user = await User.findOneAndUpdate({email:args.password.email},{password:hash});
    

    const email = {
      from: `${process.env.EMAIL_USER}`, // Sender address
      to: `${user.email}`,         // List of recipients
      subject: 'Mot de pass oublié', // Subject line
      text: `Votre mot de passe provisoire est  '${randomstring}' `, // Plain text body
  };
  transport.sendMail(email, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});
    return { ...user._doc}
  } catch (error) {
      throw error
  }
},
userInfo:async (args,req) => {
  try {
    if(!req.isAuth){
      throw new Error ("Non autorisé")
    }
      const user = await User.findOne({ _id:req.userId });
      if (!user) {
        throw new Error('Identifiant invalide')
    }
    const token = jwt.sign({ _id: user._id},'RANDOM_TOKEN_SECRET')

      return {
        token,
         ...user._doc,
         userId:user._id


      }
  } catch (error) {
      return error
  }
}
  
}