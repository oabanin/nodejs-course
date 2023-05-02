import * as http from "http";
import {requestHandler} from "./nodejs_routes";
import express from "express";
import * as bodyParser from "body-parser";
import {routerAdmin} from "./routes/admin";
import {router} from "./routes/shop"
import path from "path";
import {get404} from "./controllers/error";
//import {engine} from 'express-handlebars';

const app = express();
app.set('view engine', 'ejs');
//app.engine('hbs', engine({layoutsDir: "views/layouts", defaultLayout: "main-layout", extname: "hbs"}))
// app.set('view engine', 'hbs'); //handlebars defined as extension

//app.set('view engine', 'pug');
//app.set('views', 'views'); //DEFAULT

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', routerAdmin);

app.use(router);


// app.use((req, res, next) => {
//     res.status(404).send("<h3>Page not found</h3>")
// })

// app.use((req, res, next) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
// })

app.use(get404)

app.listen(3000)

// const server = http.createServer(app);
//
// server.listen(3000);

