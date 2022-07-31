const express = require("express");
const path = require("path");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch"); //alles wird in ./scratch gespeichert
const bodyParse = require("body-parser");

const session = require("express-session");

const app = express();
app.use(bodyParse.json());
app.use(
  session({
    secret: "random string fuer hash",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/member", (req, res, next) => {
  if (req.session.eingeloggt) {
    next();
  } else {
    res.redirect("/index.html");
  }
});

app.use(express.static(path.join(__dirname, "static")));

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  console.log("Server up at 9999");
});

app.use(express.urlencoded({ extended: false })); // Daten im POST Request

app.get("/member/logout", (req, res) => {
  req.session.eingeloggt = false;
  res.redirect("/index.html");
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  let users = localStorage.getItem("users");
  users = JSON.parse(users); // array mit allen usern

  // suche den user
  for (let i in users) {
    if (users[i].email == email && users[i].password == password) {
      req.session.eingeloggt = true; // ab jetzt kann man /members öffnen
      req.session.email = req.body.email;
      console.log("login", req.session);
      res.send({ ok: true }); // schickt dem Bworser OK zurück
      return; // brauchen nicht weitersuchen
    }
  }

  res.send({ ok: false }); // keinen gefunden
});

app.post("/createuser", (req, res) => {
  /*const {vorname,nachname,email,password,confirmPassword,date,instrument,role} = req.body //get data from body (frontend)
    localStorage.setItem('vorname',vorname) 
    localStorage.setItem('nachname',nachname)
    localStorage.setItem('email',email)
    localStorage.setItem('password',password)
    localStorage.setItem('confirmPassword',confirmPassword)
    localStorage.setItem('date',date)
    localStorage.setItem('role',role)
    localStorage.setItem('instrument',instrument) */

  // Daten in JSON speichern mit fs.writeFile...
  //let users = [];
  // schon gespeicherten User laden
  let users = localStorage.getItem("users"); // lade gespeicherte
  console.log("users", users);
  if (!users) {
    // wenn noch nichts da, dann leerer array
    users = [];
  } else {
    users = JSON.parse(users); // gespeicherter JSON wieder in Array umwandeln
  }

  // Validierung (hier od. im Browser)
  // E-Mail?
  // PW
  // Name...

  users.push(req.body); // neuer kommt dazu

  localStorage.setItem("users", JSON.stringify(users, null, "\t")); // speicher alle
  res.end("fertig...");
});



//patch -> update data
app.patch("/edituser", (req, res) => {
  try {
    let users = localStorage.getItem("users");
    users = JSON.parse(users);

    for (let i in users) {
      if (users[i].email === req.session.email) {
        
        users[i].vorname = req.body.vorname;
        users[i].nachname = req.body.nachname;
        users[i].email = req.body.email;
        users[i].password = req.body.password;
        users[i].confirmPassword = req.body.confirmPassword;
        users[i].date = req.body.date;
        users[i].role = req.body.role;
        users[i].instrument = req.body.instrument;

        console.log("ALL USERS: ", users);
        // speichern!!
        localStorage.setItem("users", JSON.stringify(users, null, "\t"));
        res.send({ ok: true });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.send({ ok: false });
  }
});


app.post("/getuser", (req,res)=>{
  let users = localStorage.getItem("users");
  users = JSON.parse(users);
  for (let i in users) {
    if (users[i].email === req.session.email) {
      res.send( users[i] ); 
      return; // ende
    }
  }
  res.send({ ok: false });
});

app.post("/getmusiker", (req,res)=>{
  let users = localStorage.getItem("users");
  users = JSON.parse(users);
  let musiker = [];
  for (let i in users) {
    if (users[i].role === 'MU') {
      musiker.push( users[i] );
    }
  }
  res.send(musiker);
});
