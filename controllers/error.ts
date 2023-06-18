const get404 = (req: any, res: any) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', path: '/404', isAuthenticated: req.session.isLoggedIn});
};


const get500 = (req: any, res: any) => {
    res.status(500).render('500', {pageTitle: 'Error 500', path: '/500', isAuthenticated: req.session.isLoggedIn});
};

export {get404, get500}
