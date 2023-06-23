const http = require('http');
const url = require('url');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const {Query} = require("mysql/lib/protocol/sequences");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "STUDENT",
    database: "mydb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});
connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
});


const server = http.createServer((req, res) => {
    console.log(req.method);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url, true);
    console.log(reqUrl.pathname);
    // ------------------------------------------- AUTHENTICATE --------------------------------------------------------
    if (reqUrl.pathname === '/auth' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const requestData = JSON.parse(body);
            console.log('Received data:', requestData);
            //----------------------------------------------- LOGIN ----------------------------------------------------
            if (requestData.requestType === 'login') {
                const email = requestData.email;
                const password = requestData.password;
                const hashedPassword = await hashPassword(password);
                console.log(hashedPassword);
                try {
                    connection.query('SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?', [email, email, hashedPassword], (error, results, fields) => {
                        if (error) {
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.end('Internal server error');
                        }
                        console.log(results.length);
                        if (results.length === 0) {
                            res.writeHead(401, {'Content-Type': 'text/plain'});
                            res.end('Invalid email or password.');
                        } else {
                            const user = results[0];
                            const token = generateToken(email);
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({token: token}));
                        }
                    });

                } catch (error) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
                // ------------------------------------------ Sign Up --------------------------------------------------
            } else if (requestData.requestType === 'signup') {
                const email = requestData.email;
                const firstName = requestData.firstName;
                const lastName = requestData.lastName;
                const username = requestData.username;
                const password = requestData.password;
                const hashedPassword = await hashPassword(password);
                console.log(hashedPassword);
                const birth = requestData.birth;
                const formattedbirth = moment(birth, 'DD MM YYYY').format('YYYY-MM-DD');
                try {
                    connection.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (error, results, fields) => {
                        if (error) {
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.end('Internal server error');
                        }
                        if (results.length !== 0) {
                            res.writeHead(400, {'Content-Type': 'text/plain'});
                            res.end('Email or username already in use.');
                        } else {
                            await connection.query('INSERT INTO users (email, firstname, lastname, username, birth, password) VALUES (?, ?, ?, ?, ?, ?)', [email, firstName, lastName, username, formattedbirth, hashedPassword]);
                            const token = generateToken(email);
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({token: token}));
                        }
                    });
                } catch (error) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
            }
        });
    }
    if (reqUrl.pathname === '/profile/' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;
            try {
                connection.query('SELECT * FROM users WHERE email = ? ', [email], (error, results, fields) => {
                    if (error) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal server error');
                    }
                    console.log(results.length);
                    if (results.length === 0) {
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end('Invalid email or password.');
                    } else {
                        const user = results[0];
                        const profileData = {
                            "photo": user.photo,
                            "email": user.email,
                            "firstName": user.firstname,
                            "lastName": user.lastname,
                            "username": user.username,
                            "birth": user.birth.toLocaleDateString()
                        };
                        console.log(profileData);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(profileData));
                    }
                });

            } catch (error) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
            }
        });
    }
    if (reqUrl.pathname === '/profileEdit/' && req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const requestData = JSON.parse(body);
            const email = requestData.email;
            let photo = requestData.photo;
            const firstName = requestData.firstname;
            const lastName = requestData.lastname;
            const username = requestData.username;
            const birth = requestData.birth;
            const formattedbirth = moment(birth, 'DD MM YYYY').format('YYYY-MM-DD');
            console.log(photo);
            if (photo === '')
                photo=null;
            try {
                connection.query('SELECT * FROM users WHERE email != ? AND username = ?', [email, username], async (error, results, fields) => {
                    if (error) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal server error');
                    }
                    if (results.length !== 0) {
                        res.writeHead(400, {'Content-Type': 'text/plain'});
                        res.end('Username already in use.');
                    } else {
                        await connection.query('UPDATE users SET username = ?, firstname = ?, lastname = ?, birth = ?, photo = ? WHERE email = ?', [username, firstName, lastName, formattedbirth, photo, email]);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end("Successfully modified the data");
                    }
                });
            } catch (error) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
            }
        });
    }
    if (reqUrl.pathname === '/profilePassword/' && req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const requestData = JSON.parse(body);
            const email = requestData.email;
            const newPass= requestData.newPass;
            const oldPass= requestData.oldPass;
            const hashedPassword = await hashPassword(oldPass);
            const hashedNewPassword = await hashPassword(newPass);
            console.log(requestData);
            try {
                connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, hashedPassword], async (error, results, fields) => {
                    if (error) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal server error');
                    }
                    console.log(results.length);
                    if (results.length === 0) {
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end('Invalid email or password.');
                    } else {
                        await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedNewPassword, email]);
                    }
                });
            }
            catch (error) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
            }
            });
    }
    if (reqUrl.pathname === '/profileDelete/' && req.method === 'DELETE') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;
            try {
                connection.query('DELETE FROM users WHERE email = ?', [email], async (error, results, fields) => {
                    if (error) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal server error');
                    }
                    else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end("Successfully deleted the user");
                    }
                });
                }
            catch (error) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
            }
        });
    }
    // ------------------------------------------- Shoes -------------------------------------------------------------
    if (reqUrl.pathname === '/shoes/' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;
            try {
                connection.query('SELECT * FROM shoe ', [], (error, results, fields) => {
                    if (error) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal server error');
                    }
                    console.log(results.length);
                    if (results.length === 0) {
                        res.writeHead(401, {'Content-Type': 'text/plain'});
                        res.end('Invalid email or password.');
                    } else {
                        const shoes = results;
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(shoes));
                    }
                });

            } catch (error) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
            }
        });
    }
    // ------------------------------------------- Shoe --------------------------------------------------------------
    if (reqUrl.pathname.startsWith('/shoe/') && req.method === 'POST') {
        const shoeId = reqUrl.pathname.split('/')[2];
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;

        });
        try {
            connection.query('SELECT * FROM shoe WHERE id = ?', [shoeId], (error, results, fields) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
                if (results.length === 0) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Shoe not found.');
                } else {
                    const shoe = results[0]; // Assuming there is only one pair of shoes with the given ID
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(shoe));
                }
            });
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
        }
    }
    // ------------------------------------------- Search --------------------------------------------------------------
    if (reqUrl.pathname.startsWith('/search/') && req.method === 'POST') {
        const term = reqUrl.pathname.split('/')[2];
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;

        });
        try {
            const query = 'SELECT * FROM shoe WHERE name LIKE ? OR description LIKE ?';
            const decodedTerm = decodeURIComponent(term)
            const formattedQuery = mysql.format(query, ["%" + decodedTerm + "%", "%" + decodedTerm + "%"]);
            console.log('Query:', formattedQuery);
            connection.query(formattedQuery, (error, results, fields) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
                if (results.length === 0) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Shoe not found.');
                } else {
                    const shoes = results;
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(shoes));
                }
            });
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
        }
    }
    // ------------------------------------------- Multicriterial Search --------------------------------------------------------------
    if (reqUrl.pathname.startsWith('/mcsearch/') && req.method === 'POST') {
        const filters = reqUrl.pathname.split('/')[2];
        const filterArray = filters.split('%20');
        console.log(filterArray);
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;

        });
        try {
            let query = "SELECT * FROM shoe";
            for(let filter of filterArray){
                if(filter === filterArray[0])
                    query += (" WHERE");
                else
                    query += ("AND");
                query += (" (name LIKE '%" + filter + "%'");
                query += (" OR description LIKE '%" + filter + "%'");
                query += (" OR category LIKE '%" + filter + "%') ");
            }
            const formattedQuery = mysql.format(query, []);
            console.log('Query:', formattedQuery);
            connection.query(formattedQuery, (error, results, fields) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
                if (results.length === 0) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Shoe not found.');
                } else {
                    const shoes = results;
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(shoes));
                }
            });
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
        }
    }
    // ------------------------------------------- Filter --------------------------------------------------------------
    if (reqUrl.pathname.startsWith('/filter/') && req.method === 'POST') {
        const filters = reqUrl.pathname.split('/')[2];
        const filterArray = filters.split('%20');
        console.log(filterArray);
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const email = body;

        });
        try {
            let query = "SELECT * FROM shoe";
            for(let filter of filterArray){
                if(filter === filterArray[0])
                    query += (" WHERE");
                else
                    query += ("OR");
                query += (" category LIKE '%" + filter + "%' ");
            }
            const formattedQuery = mysql.format(query, []);
            console.log('Query:', formattedQuery);
            connection.query(formattedQuery, (error, results, fields) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                }
                if (results.length === 0) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Shoe not found.');
                } else {
                    const shoes = results;
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(shoes));
                }
            });
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
        }
    }
});


function generateToken(email) {
    const secretKey = 'my-secret-key';
    const token = jwt.sign({email}, secretKey, {expiresIn: '24h'});
    return token;
}

function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

server.listen(8081, () => {
    console.log('Server running at http://localhost:8081/');
});
