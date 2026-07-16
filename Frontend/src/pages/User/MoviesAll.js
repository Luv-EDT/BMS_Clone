import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../Navbar';
import { useEffect, useState } from "react"
import { Input, Row, Col, Card, Tag, message, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { getUpcomingAndWithShows } from "../../apiCall/moviesApi"

function MoviesAll() {
    const navigate = useNavigate()
    const [moviesWithShows, setMoviesWithShows] = useState([])
    const [moviesUpcoming, setMoviesUpcoming] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)
      const { user } = useSelector((state) => state.user)

    useEffect(() => {
        if(user.isAdmin){
        navigate("/admin")
        return
  }
        else if(user.isProfile){
        navigate("/profile")
        return
  }
        const fetchMovies = async () => {
            try {
                setLoading(true)
                const response = await getUpcomingAndWithShows()
                setMoviesWithShows(response.data.data.withShows)
                setMoviesUpcoming(response.data.data.upcoming)
            } catch (error) {
                message.error("Failed to fetch movies")
            } finally {
                setLoading(false)
            }
        }
        fetchMovies()
    }, [])

    // filter both lists based on search query
    const filterMovies = (list) =>
        list.filter((movie) =>
            movie.name.toLowerCase().includes(searchQuery.toLowerCase())
        )

    const MovieCard = ({ movie, isUpcoming }) => (
        <Col xs={24} sm={12} md={8} lg={6} key={movie._id}>
            <Card
                hoverable={!isUpcoming}
                onClick={() => {
                    if (!isUpcoming) navigate(`/movie/${movie._id}`)
                }}
                cover={
                    <img
                        src={movie.poster}
                        alt={movie.name}
                        style={{
                            height: "clamp(100px, 40vw, 400px)",
                            objectFit: "contain",
                        }}
                    />
                }
                style={{
                    opacity: isUpcoming ? 0.7 : 1,
                    cursor: isUpcoming ? "default" : "pointer",
                }}
            >
                <Card.Meta
                    title={movie.name}
                    description={
                        <div>
                            <div style={{ marginBottom: 6 }}>
                                {Array.isArray(movie.genre)
                                    ? movie.genre.map((g) => (
                                          <Tag color="blue" key={g}>
                                              {g}
                                          </Tag>
                                      ))
                                    : movie.genre
                                          ?.split(", ")
                                          .map((g) => (
                                              <Tag color="blue" key={g}>
                                                  {g}
                                              </Tag>
                                          ))}
                            </div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                                {movie.duration} mins |{" "}
                                {new Date(
                                    movie.releaseDate
                                ).toLocaleDateString()}
                            </div>
                            {isUpcoming && (
                                <Tag
                                    color="orange"
                                    style={{ marginTop: 6 }}
                                >
                                    Coming Soon
                                </Tag>
                            )}
                        </div>
                    }
                />
            </Card>
        </Col>
    )

    if (loading) {
        return (
            <div>
                <Navbar />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 100,
                    }}
                >
                    <Spin size="large" />
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>
                {/* Search */}
                <Input
                    placeholder="Search movies..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        marginBottom: 32,
                        maxWidth: 400,
                        borderRadius: 8,
                    }}
                    size="large"
                />

                {/* Now Showing */}
                {filterMovies(moviesWithShows).length > 0 && (
                    <div style={{ marginBottom: 40 }}>
                        <h2 style={styles.sectionTitle}>🎬 Now Showing</h2>
                        <Row gutter={[16, 16]}>
                            {filterMovies(moviesWithShows).map((movie) => (
                                <MovieCard
                                    key={movie._id}
                                    movie={movie}
                                    isUpcoming={false}
                                />
                            ))}
                        </Row>
                    </div>
                )}

                {/* Upcoming */}
                {filterMovies(moviesUpcoming).length > 0 && (
                    <div>
                        <h2 style={styles.sectionTitle}>🕐 Upcoming Movies</h2>
                        <Row gutter={[16, 16]}>
                            {filterMovies(moviesUpcoming).map((movie) => (
                                <MovieCard
                                    key={movie._id}
                                    movie={movie}
                                    isUpcoming={true}
                                />
                            ))}
                        </Row>
                    </div>
                )}

                {/* No results */}
                {filterMovies(moviesWithShows).length === 0 &&
                    filterMovies(moviesUpcoming).length === 0 && (
                        <div style={styles.noResults}>
                            No movies found for "{searchQuery}"
                        </div>
                    )}
            </div>
        </div>
    )
}

const styles = {
    sectionTitle: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 16,
        color: "#1a1a1a",
    },
    noResults: {
        textAlign: "center",
        color: "#888",
        fontSize: 16,
        marginTop: 60,
    },
}

export default MoviesAll