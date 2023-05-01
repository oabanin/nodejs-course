import * as http from "http";
import {requestHandler} from "./nodejs_routes";
import express from "express";
import * as bodyParser from "body-parser";
import {routerAdmin} from "./routes/admin";
import {routerApp} from "./routes/shop";
import path from "path";

const app = express();
app.set('view engine', 'pug');
//app.set('views', 'views'); //DEFAULT

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', routerAdmin);

app.use(routerApp);


// app.use((req, res, next) => {
//     res.status(404).send("<h3>Page not found</h3>")
// })

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views','404.html'))
})

app.listen(3000)

// const server = http.createServer(app);
//
// server.listen(3000);

