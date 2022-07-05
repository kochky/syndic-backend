const { buildSchema } = require("graphql")

module.exports = buildSchema(`

  type Provision {
    _id:ID!
    year:Int!
    montant:Float!
    paid:Boolean!
  }

  type User {
    _id: ID!
    email:String!
    password:String!
    name: String!
    lot:Int!
    millieme:String!
    provision:[Provision]
    admin:Boolean
  }

  type Contact {
    _id: ID!
    name: String!
   
  }


  input UserInput {
    email:String!
    password:String!
    name: String!
    lot:Int!
    millieme:String!
  }

  input UserModifyInput {
    _id: ID!
    email:String
    password:String
    name: String
    lot:Int
    millieme:String

  }

  type LoginReturnType{
    token:String
    userId:ID
    name:String
    email:String
    millieme:String
    lot:Int
    provision:[Provision]
    admin:Boolean
  }

  type Info {
    _id: ID!
    date:String!
    description:String!
    status:String!
  }

  type Incident {
    _id: ID!
    date:String!
    description:String!
    status:String!
    messageAdmin:String!
  }

  type Releve {
    _id:ID!
    date:String!
    description:String!
    type:String!
    recette:Float!
    depense:Float!
  } 

  type Finance {
    _id:ID!
    year:Int!
    solde:Float
    actuel:Float
    releve:[Releve]
  }

  type Message {
    _id:ID!
    expediteur:String!
    destinataire:String!
    message:String!
    lu:Boolean!
    date:String!
  }

  input MessageInput {
    destinataire:String!
    message:String!

  }
  input MessageLuInput {
   _id:String!
  }

  input InfoInput {
    description:String!
  }
  
  input StatusInput {
    _id:ID!
    status:String!
  }
  
  input IncidentInput {
    _id:ID!
    date:String
    description:String
    status:String
    messageAdmin:String
  }
  input IncidentCreateInput {
    description:String!
   
  }
  input FinanceInput{
    year:Int!
    solde:Float
    actuel:Float
    releve:[ReleveInput]
  }

  input ReleveInput {
    _id:ID
    year:Float!
    date:String!
    description:String!
    type:String!
    recette:Float!
    depense:Float!
  } 
  
  input Id {
    _id:ID!
  }

  input ReleveDeleteInput {
    _id:ID!
    year:String!
  }

  input ProvisionCreateInput {
    year:Float!
    montant:Float!
    name:String!
  }

  input ProvisionModifyInput {
    montant:Float!
    year:Float!
    name:String!
    oldMontant:Float!
  }

  input ProvisionChangeStatus {
    montant:Float!
    paid:Boolean!
    name:String!


  }

  input ProvisionDelete{
    montant:Float!
    name:String!
  }
  
  input PasswordInput {
    password:String!
    newPassword:String!
  }
  input PasswordForgotInput {
    email:String!
  }

  type Query {
    users:[User!]
    loginUser(email:String!,password:String!):LoginReturnType!
    infos:[Info!]
    infosNoAdmin:[Info!]
    incidentsNoAdmin:[Incident!]
    incidents:[Incident!]
    finances:[Finance]
    contacts:[Contact!]
    messages:[Message!]
  }

  type Mutation {
    createUser(user:UserInput): User
    updateUser(user:UserModifyInput): User
    deleteUser(user:Id):User
    createInfo(infos:InfoInput):Info
    changeStatusInfos(infos:StatusInput):Info
    changeStatusIncident(incidents:StatusInput):Incident
    deleteIncident(incidents:Id):Incident
    deleteInfo(infos:Id):Info
    createIncident(incidents:IncidentCreateInput):Incident
    updateIncident(incidents:IncidentInput):Incident
    createYearFinance(finances:FinanceInput):Finance
    createReleve(finances:ReleveInput):Finance
    deleteReleve(finances:ReleveDeleteInput):Finance
    changeReleve(finances:ReleveInput):Finance
    createProvision(user:ProvisionCreateInput):User
    modifyProvision(user:ProvisionModifyInput):User
    modifyProvisionStatus(user:ProvisionChangeStatus):User
    deleteProvision(user:ProvisionDelete):User
    changePassword(user:PasswordInput):User
    createMessage(messages:MessageInput):Message
    readMessage(messages:MessageLuInput):Message
    forgotPassword(password:PasswordForgotInput):User

  }

  schema {
    query: Query
    mutation: Mutation
  }
`)