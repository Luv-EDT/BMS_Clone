const express = require("express")
const Movie = require("../model/moviesModel")
const Show = require("../model/showsModel")
const authMiddleware = require("../middlewares/authMiddleware")
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware")

const router = express.Router()


// ========================
// Get All Movies
// ========================

router.get("/getAll", async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 })



        return res.status(200).json({
            success: true,
            message: "Movies fetched successfully",
            data: movies        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch movies",
            error: error.message,
        })
    }
})
// getting upcoming anb with shows

router.get("/getUpcomingAndWithShows", async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 })

        const shows = await Show.find().select("movie")

      // extract unique movieIds that have at least one show
        const movieIdsWithShows = new Set(
            shows.map((show) => show.movie.toString())
        )

        // now filter synchronously — no async needed
        const moviesWithShows = movies.filter((movie) =>
            movieIdsWithShows.has(movie._id.toString())
        )

        const moviesUpcoming = movies.filter((movie) =>
            !movieIdsWithShows.has(movie._id.toString())
        )

        return res.status(200).json({
            success: true,
            message: "Movies fetched successfully",
            data: {
                upcoming: moviesUpcoming,
                withShows: moviesWithShows
            }        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch movies",
            error: error.message,
        })
    }
})

// get one  movie data by id

router.post("/getById/:id", async (req, res) => {
    try {
        const id = req.params.id
        let movie_this = await Movie.findById(id)

        if(!movie_this){
               return res.status(500).json({ 
            success: false,
            message: "Movie not found",
        })
        }

        let shows = await Show.find({movie : movie_this._id }).populate('theatre').populate('movie')

        if(shows.length === 0){
              return res.status(200).json({
            success: true,
            message: "Upcoming Movie",
            data: movie_this,
        })
        }
        let uniqueTheatreList = []
        movie_this = {...movie_this._doc, theatre:[]}
        shows.forEach((show)=>{ 
            // if uniqueTheatreList has show.theatre._id then continue
            let theatreNew = uniqueTheatreList.filter((item)=>item._id === show.theatre._id)

            if(theatreNew.length === 0){
               let theatreShows = shows.filter((item)=>item.theatre._id === show.theatre._id).map( (item)=>{
            const { theatre, movie, ...rest } = item.toObject()
        return rest
               })
                theatreNew = {...show.theatre._doc, showsAll: theatreShows}
                uniqueTheatreList.push(theatreNew)
                movie_this.theatre.push(theatreNew)
            }
        })



        return res.status(200).json({
            success: true,
            message: "Movie fetched successfully",
            data: movie_this,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch the movie",
            error: error.message,
        })
    }
})


// ========================
// Add Movie
// ========================

router.post("/add", authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const { name, poster, genre, description, duration, languages, releaseDate } = req.body

        const newMovie = await Movie.create({
            name,
            poster,
            genre,
            description,
            duration,
            languages,
            releaseDate,
        })

        return res.status(201).json({
            success: true,
            message: "Movie added successfully",
            data: newMovie,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add movie",
            error: error.message,
        })
    }
})


// ========================
// Update Movie
// ========================

router.put("/update/:id", authMiddleware,adminAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }  // returns the updated document, not the old one
        )

        if (!updatedMovie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: updatedMovie,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update movie",
            error: error.message,
        })
    }
})


// ========================
// Delete Movie
// ========================

router.delete("/delete/:id", authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const deletedMovie = await Movie.findByIdAndDelete(id)

        if (!deletedMovie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
            data: deletedMovie,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete movie",
            error: error.message,
        })
    }
})


module.exports = router