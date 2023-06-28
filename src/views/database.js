/*
In terminal trebuie dat catre instalare:
    npm install mysql2
        SAU
    npm install mysql@latest  // pentru baza de date
    npm install jsonwebtoken  //pt jwt
    npm install moment   //pentru a putea scrie data 11 02 2002 nu 2002/02/11
    npm install axios  //Pentru scraping
    npm install cheerio //Tot pt scraping
    npm install bcrypt //parole hashuite
 */

const crypto = require('crypto');

// ----------------------------------- Pentu a face baza de date. Se ruleaza doar bucata asta ------------------------------------------------
/*var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "STUDENT"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE mydb", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});*/

// --------------------------------------------- Conectare la baza de date -----------------------------------------

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "STUDENT",
    database: "mydb"
});
var shoeCount = 0;


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});

    //drop la tabelul shoe (nu trb neap)
/*
    var sql = "DROP TABLE shoe";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table deleted");
    });
    //Aici am creat tabela shoe in baza de date; se ruleaza o singura data (sau drop)
    /*var sql1 = "CREATE TABLE shoe (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), brand VARCHAR(255), type VARCHAR(255), material VARCHAR(255), color VARCHAR(255), occasion VARCHAR(255), photo VARCHAR(500), description LONGTEXT, technologies VARCHAR(255))";
    con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });

    var sql = "DROP TABLE user";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table deleted");
    });

    //Aici am creat tabela user in baza de date; se ruleaza o singura data (sau drop)
    var sql2 = "CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255),  email  VARCHAR(255), username VARCHAR(255), password VARCHAR(255), birth Date)";
    con.query(sql2, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });*/

// ------------------------------------------------ inserat useri ------------------------------
    /*var user = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@example.com',
    username: 'johndoe',
    password: 'password123',
        birth: '10/10/2000'
};
   var sql = "INSERT INTO user (lastname, firstname, username, email, password, birth) VALUES (?, ?, ?, ?, ?, ?)";
   var values = [user.lastname, user.firstname, user.username, user.email, user.password, user.birth];

});*/

    /*  var user = {
          firstname: "John",
          lastname: "Doe",
          email: "johndoe@example.com",
          username: "johndoe",
          password: "password123",
          birth: "1990-01-01"
      };

      var sql = "INSERT INTO user (firstname, lastname, email, username, password, birth) VALUES (?, ?, ?, ?, ?, ?)";
      con.query(sql, [user.firstname, user.lastname, user.email, user.username, user.password, user.birth], function (err, result) {
          if (err) throw err;
          console.log("User inserted");
      });
        con.query(sql, values, function (err, result) {
           if (err) throw err;
           console.log("Number of records inserted: " + result.affectedRows);
     });

});*/


 // ------------------ Aici adaugam o poza draguta la profil-------------------------
/*
    con.query("ALTER TABLE user ADD COLUMN photo VARCHAR(255)", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

    con.query("DELETE FROM user WHERE email = '01ioana.dutuc@gmail.com'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
*/
//pentru afisare useri
   con.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

// -------------------- pentru admin --------------------------------------------
/*
//hash-uim parolele
   function hashPassword(password) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    const password = "admin";
    const hashedPassword = hashPassword(password);

    var sql2 = "INSERT INTO user (email, password) VALUES (?, ?)";
    var values = ['admin@admin.com', hashedPassword];
    con.query(sql2, values, function (err, result) {
        if (err) throw err;
        console.log("User inserted");
    });
*/
/*
//pentru sters useri
var sql3 = "DELETE FROM user WHERE id = '8'";
con.query(sql3, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
});

*/

// ----------------------------------- PENTRU FAVORITE ----------------------------------------------------

/*var sql2 = "CREATE TABLE favorite (id INT AUTO_INCREMENT PRIMARY KEY, idUser INT, idShoe INT UNIQUE)";
con.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("Table created");
})*/

con.query("SELECT * FROM favorite", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
});