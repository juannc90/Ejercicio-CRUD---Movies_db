const db = require('../database/models');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        Movies.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        Movies.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        Movies.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        Movies.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll()
            .then(genre => res.render('moviesAdd', { allGenres: genre }))
    },
    create: function (req, res) {
        Movies.create({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id
        })
        res.redirect('/movies')
    },
    edit: function (req, res) {
        let movieSolicitada = Movies.findByPk(req.params.id, {
            include: ["genres"]
        })
        let genreSolicitado = Genres.findAll()

        Promise.all([movieSolicitada, genreSolicitado])
            .then(function ([movie, genres]) {
                res.render('moviesEdit', { Movie: movie, allGenres: genres })
            })
            .catch(err => err)
    },
    update: function (req, res) {
        Movies.update({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id
        },
            {
                where: { id: req.params.id }
            })
        res.redirect('/movies')
    },
    delete: function (req, res) {
        Movies.findByPk(req.params.id)
            .then(movie => res.render('moviesDelete', { Movie: movie }))
    },
    destroy: function (req, res) {
        Movies.destroy({
            where: { id: req.params.id }
        })
        res.redirect('/movies')
    }
}

module.exports = moviesController;