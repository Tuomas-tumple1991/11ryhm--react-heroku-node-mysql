const express = require('express')
const app = express()
const port = process.env.PORT || 5000   
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const jwt = require('jsonwebtoken')
const JwtStrategy = require ('passport-jwt').Strategy
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')
const session = require ('express-session')
//const cors = require("cors");
const mysql = require('mysql')
const saltRounds = 5;
const path = require('path')
const bodyParser = require('body-parser')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { v4: uuidv4 } = require('uuid');
     ExtractJwt = require('passport-jwt').ExtractJwt
     app.use(bodyParser.json())
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.json());
app.use(express.static('build'))






const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


/*
app.use((req , res, next) => {

    console.log('Terveisiä alusta')
    
    next()
})

*/
app.use(express.static(path.join(__dirname, 'build')));




// TÄMÄ ON PAKKO OLLA!!!
app.use(cookieParser()) 
  app.use(bodyParser.urlencoded({extends: true}))
  
app.use(session({
  key: "IdOfUser",
  secret: "salaisuus",
  resave: "false",
  saveUninitialized: "false",
  cookie: {
    expires: 10000
  }
})
)
  
// MYSQL KOODIT DATABSEN HAKEMISEEN
//ClearDB Config
//mysql://b9132be53ac5ad:936723d5@us-cdbr-east-05.cleardb.net/heroku_7b33cd9919ea5b7?reconnect=true

//
const pool = mysql.createPool ({
    connectionLimit : 10,
    host : 'eu-cdbr-west-02.cleardb.net',
    user: 'b2b162a2af584a',    // HOX HOX vaati ehkä oman USER ja PASSWORD tunnuksen
    password: '67a7f4af',
    database: 'heroku_bd27eaa9c789200'
})



module.exports = pool




app.post("https://ryhma11-ravintolaapp-ver2.herokuapp.com/register", (req, res ) => {
console.log("NYT OLLAAN REGISTERI HOMMASSA")
const user_name = req.body.user_name
const user_password = req.body.user_password
const user_adress = req.body.user_adress


bcrypt.hash(user_password, saltRounds, (err, hash) => {

  if(err)  {
    console.log(err)
  }


pool.query(

  "INSERT INTO user (user_name, user_password, user_adress) VALUES (?,?,?)",
  [user_name, hash, user_adress],
  
  (err, result) => {
    console.log(err)
  }
)
})



}

)
app.get('/login', (req, res) => {
  if (req.session.IdOfUser) {
    res.send({ loggedIn: true, IIdOfUser: req.session.IdOfUser });
  } else {
    res.send({ loggedIn: false });
  }
});



app.post('/login', (req, res ) => {

  console.log("NYT OLLAAN LOGISSA HOMMASSA")
  const user_name = req.body.user_name
  const user_password = req.body.user_password

  pool.query(

    "SELECT * FROM user WHERE user_name = ? ",
    user_name, 
    (err, result) => {

      // TÄSSÄ ON COOKIE YLLÄPITO
     

      if(err) {
     res.send({ err: err})
    } 
    
    
    
      if (result.length > 0) {

        bcrypt.compare(user_password, result[0].user_password, (error, response) =>  {

                    if(response) {
                      
                      req.session.IdOfUser = result
                      console.log(req.session.IdOfUser)
                      res.send( result)
                      
                    } else {
                      res.send({message: "Väärä salasana"})
                    }
                    })
     

        
      } else {
        res.send({message: "Käyttäjää ei ole olemassa"})
      }
    
    }

  
  
  
  )

})




app.get('/ravintola', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi ravintola polulta')


 connection.query("SELECT * from restaurant ",  (err, result) => {
  console.log(result)
    connection.release() 
     if(!err) {
         res.send(result)
     } else {
         console.log(err)
     }

 })
   


  })
 })

 app.get('/ravintola1', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi ravintola polulta')


 connection.query("SELECT * from restaurant WHERE restaurant_name = 'Röyssy' ",  (err, result) => {
  console.log(result)
    connection.release() 
     if(!err) {
         res.send(result)
     } else {
         console.log(err)
     }

 })
   


  })
 })


 app.get('/ravintola2', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi ravintola polulta')


 connection.query("SELECT * from restaurant WHERE restaurant_name = 'Shos' ",  (err, result) => {
  console.log(result)
    connection.release() 
     if(!err) {
         res.send(result)
     } else {
         console.log(err)
     }

 })
   


  })
 })




 app.get('/Menu1', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi tuotteet polulta')


 connection.query(" SELECT * from product WHERE menu_number = '1' ",   (err, rows) => {

    connection.release() 
     if(!err) {
         res.send(rows)
     } else {
         console.log(err)
     }

 })
   


  })
 })

 app.get('/Menu2', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi tuotteet polulta')


 connection.query(" SELECT * from product WHERE menu_number = '2' ",   (err, rows) => {

    connection.release() 
     if(!err) {
         res.send(rows)
     } else {
         console.log(err)
     }

 })
   


  })
 })
 app.get('/Menu3', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi tuotteet polulta')


 connection.query(" SELECT * from product WHERE menu_number = '3' ",   (err, rows) => {

    connection.release() 
     if(!err) {
         res.send(rows)
     } else {
         console.log(err)
     }

 })
   


  })
 })
 app.get('/Menu4', (req, res) =>{

  pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi tuotteet polulta')


 connection.query(" SELECT * from product WHERE menu_number = '4' ",   (err, rows) => {

    connection.release() 
     if(!err) {
         res.send(rows)
     } else {
         console.log(err)
     }

 })
   


  })
 })

 



/// KUVIEN TUONTI REACTIIN

 app.post('/ravintola/kuvat', upload.array('photos', 6), function (req, res, next) {


  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //https://www.npmjs.com/package/multer sivulta otettu error handleri
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  })
})

/// KUVIEN TUONTI REACTIIN

app.post('/tuotteet/tuote-kuvat', upload.array('photos', 6), function (req, res, next) {


  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //https://www.npmjs.com/package/multer sivulta otettu error handleri
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  })
})










/*
const users = [
{
id: uuidv4(),         // KYSYPPÄ OPElTA VOIKO LUODA NÄIN, VAI DATABASEN AUTO INCREMENTillä
username: 'taneli',
password: '123456'

},

{
id: uuidv4(),
username: 'markku',
password: '432113'



}

];



/*
///////////////////////////////////////////////



/*
app.post("/registerToDatabase", (req, res) => {
    const iduser = req.body.iduser;
    const user_password = req.body.user_password;
  
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
  
      db.query(
        "INSERT INTO user (iduser, user_password) VALUES (?,?)",
        [username, hash],
        (err, result) => {
          console.log(err);
        }
      );
    });
  });



app.post("/loginFromDatabase", (req, res) => {
    const iduser = req.body.iduser;
    const user_password = req.body.user_password;
  
    pool.query(
      "SELECT * FROM user WHERE iduser = ?;",
      username,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
  
        if (result.length > 0) {
          bcrypt.compare(user_password, result[0].user_password, (error, response) => {
            if (response) {
              req.session.user = result;
              console.log(req.session.user);
              res.send(result);
            } else {
              res.send({ message: "Väärä salasana tai käyttäjä" });
            }
          });
        } else {
          res.send({ message: "Käyttäjää ei ole" });
        }
      }
    );
  });
  


*/


/*






////////////////////////////////////////////////////////////////////////

passport.use(new BasicStrategy(
    function(username, password, done) {

     console.log('username:' + username)
     console.log('passwword:' + password)

    // Käyttäjän ja salasanan vertaus tietokantaan

const user = users.find(u => u.username === username)

if(user != null) {

 if(bcrypt.compareSync(password, user.password)){

//if(user.password === password) {  VANHA SALASANAN TESTAUS
    done(null, user)
} else {
    done(null, false)
}
}


else {
done(null, false)

}
    }
))


const jwtoptions = {

   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: "minunsecretkey"

}

 passport.use(new JwtStrategy(jwtoptions, function(jwt_payload, done){
   console.log('JWT strategyn sisällä')
   console.log('JWT ASDFASFtäällä katsotaan pay-load')
   console.log(jwt_payload)
    done(null, jwt_payload)
 }
 ))


 // KÄYTTÄJÄN LISÄYS
 // RAKENNE VASTAAMAAN DATABASEA

 app.post('/register1', (req, res) => {

console.log(req.body)


// TÄSSÄ ON SALASANAN HAShaus
const salt = bcrypt.genSaltSync(10)

const passwordHash = bcrypt.hashSync(req.body.password, salt)


const newUser = {

    id: uuidv4(),
    username: req.body.username,
    password: passwordHash
}

// TÄLLÄ VOIDAAN PUSHATA ARRAYHYN KATSO TOIMIIKO PUSH DATABASEEN
 users.push(newUser)

 console.log(users)

    res.send("KÄYTTÄJÄN LUONTI JSON POSTMANILLA")

 })


// SUOJAAMATON get
app.get('/', (req, res) => {
    console.log('terve tyhjästä')

})



function perus(req, res, next) 
{
     console.log('täältä tulee tekstiä konsoliin')
next()
}



app.get('/minun-suojattu-resurssi', passport.authenticate('basic', {session : false}), (req, res) => {

    console.log('Terve täällä suojassa')

    res.send(' Suojassa vieläkin passport authentikaten takana ')
    
})

app.post('/jwtLogin', passport.authenticate('basic', {session : false}), (req, res) => {
// TOKENIN TEKEMINEN

//console.log(req); Tällä näkee kaiken mikä kulkee payloadin mukana
console.log(" Nyt ollaan tokenin tekemis kohdassa")
{

const payload = {
user: {
    id: req.user.id,
    username: req.user.username

}


}

   const secretkey = "minunsecretkey"  // TÄTÄ EI KOSKAAN ESILLE

   const options =
   {
       expiresIn: '7d'  // TOKEN ON VOIMASSSA VIIKON
   }

  const generatedJWT =  jwt.sign(payload, secretkey, options)

    res.json( { jwt: generatedJWT})
}
})



app.get('/jwt-suojattu',passport.authenticate('jwt', {session : false}), (req, res) => {


    console.log(req.user)  // KONSOLIIN TULEE KÄYTTÄJIEN TIEDOT
    console.log('Terve täällä suojassa')

    res.send(' Suojassa vieläkin, mutta jwtSUOJATUSSA ')
    

})



app.get('/toinen-suojattu-resurssi', passport.authenticate('basic', {session : false}), (req, res) => {

    console.log('Terve täällä suojassa')

    res.send(' toisessa Suojassa vieläkin  ')
})










///////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

             // TÄÄLLÄ VANHAT DATBASEN LIITTÄMISET

///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////









// TOMINNAN TESTI
app.get('/testi', (req, res) => res.send(" TÄMÄ ON TESTAUS POSTMANILLE"))

//Tiedostojen haku
app.get('/user', (req, res) =>{

     pool.getConnection((err, connection) =>{
if(err) throw err
console.log(' Konnektoi customer polulta')


    connection.query('SELECT * from user', (err, rows) => {

        connection.release() 
        if(!err) {
            res.send(rows)
        } else {
            console.log(err)
        }

    })
      


     })
    })


    // Konnektoi Id:n perusteella


    app.get('/:iduser', (req, res) =>{

        pool.getConnection((err, connection) => {
   if(err) throw err
   console.log(' Konnektoi customer id perusteella')

    connection.query('SELECT * from user WHERE iduser = ?', [req.params.iduser], (err, rows) => {

        connection.release() 
        if(!err) {
            res.send(rows)
        } else {
            console.log(err)
        }

    })
      


     })
    })
   */ 

  // Käyttäjän poistaminen
  // Ei kannata ottaa käyttöön, jos ei tarvitse
    

/*
    app.delete('/:iduser', (req, res) =>{

        pool.getConnection((err, connection) => {
   if(err) throw err
   console.log(' Konnektoi customer id perusteella')

    connection.query('DELETE from user WHERE iduser = ?', [req.params.iduser], (err, rows) => {

        connection.release() 
        if(!err) {
            res.send(`Käyttäjä ID: ${[req.params.iduser]}  on poistettu`)  
        } else {
            console.log(err)
        }

    })
      
     })
    })
    
  

    // Tällä lisätään user databaseen

    // Käyttäjän lisääminen onnistuu postmanilla komennolla POST lähettäen JSON RAW dataa localhost:5000 osoitteeseen.
    app.post('/add', (req, res) =>{

        pool.getConnection((err, connection) => {
   if(err) throw err
   console.log(' Konnektoi customer id perusteella')

      // Tässä lisäksyn vartalo
      const params = req.body
      

    connection.query('INSERT INTO user SET ?', params, (err, rows) => {

        connection.release() 
        if(!err) {
            res.send(`Käyttäjä ID: ${[params.user_full_name]}  on Lisätty databaseravintolaan`)  
        } else {
            console.log(err)
        }

    })
      //  Näyttää konsolissa mitä lisätään

      console.log(req.body)

       

     })
    })


*/
    app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(` Kuuntelee porttia ${port}`)
})
