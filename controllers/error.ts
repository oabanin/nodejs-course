import path from "path";
import {Request} from "express";

const get404 = (req: Request<any, any, any>, res:any) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
}

export {get404}