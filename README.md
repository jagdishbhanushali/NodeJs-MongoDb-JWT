# NodeJs-MongoDb-JWT
RestFull API in nodejs with MongoDb and token based authentication


#Please change database name in mongo.js accroding to your database name
Add table users in Mongodb with folowing details
{
  userName:"admin",
  userPassword:"admin",
  authenticationLevel:"admin"
}

Go to "localhost:3000/auth" for getting token and use same token for requesting users and companies detail.

How to use

1)Get Token

    HEADER: {Content-Type :application/json}
    POST: localhost:3000/auth
    BODY:
    {
      "name":"admin",
      "password":"admin"
    }

2)Use token for all the request by setting header parameter
   
   HEADER:{ x-access-token: "token got from above step"}
   
   
3) Get all companies
  
    HEADER:{ x-access-token: "token got from above step"}
    GET: localhost:3000/company
 
 4) Get top n compnaies
  
    HEADER:{ x-access-token: "token got from above step"}
    GET: localhost:3000/company/financials/5          #selecting top 5 companies sort by financial ranking
   
 5) Add company (Only admin can do)
    HEADER:{ x-access-token: "token got from above step"}
    POST: localhost:3000/company
    BODY:{
      {
        "id":2,
        "name":"Releaf",
        "num_employees":25,
        "contact_email":"help@releaf.ng",
        "year_founded":2014,
        "contact_name":"HelpDesk",
        "rankings":{
          "financials":9,
          "team":9,
          "idea":2
        }
      }
    }
  
 6) Update Company
  
    HEADER:{ x-access-token: "token got from above step"}
    POST: localhost:3000/company/58c8cdec427719227802d8b3   # _id of company
    BODY:{
      "id":2,
        "name":"Releaf",
        "num_employees":25,
        "contact_email":"help@releaf.ng",
        "year_founded":2014,
        "contact_name":"HelpDesk",
        "rankings":{
          "financials":9,
          "team":9,
          "idea":2
        }
      }
    }
    
 7) Delete Company
     
     HEADER:{ x-access-token: "token got from above step"}
     DELETE: localhost:3000/company/58c8cdec427719227802d8b3   # _id of company
     
 
 Currently password in database for users will be stored without any encryption.
 
 In Progress tasks:-
    Encryption of password
    UI Implementation
