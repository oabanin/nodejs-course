import path from "path";
import {Request, Response} from "express";

// const get404 = (req: Request<any, any, any>, res:any) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
// }

const get404 = (req: Request, res: Response) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};

export {get404}



