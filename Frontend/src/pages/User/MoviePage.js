import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Row, Col, Tag, Button, Card, message, Spin, Divider } from "antd"
import { ArrowLeftOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons"
import { getMovieById } from "../../apiCall/moviesApi"
import Navbar from "../Navbar"
import BookingPage from "./BookingPage"

function MoviePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true)
                const response = await getMovieById(id)
                setMovie(response.data.data)
            } catch (error) {
                message.error("Failed to fetch movie details")
            } finally {
                setLoading(false)
            }
        }
        fetchMovie()
    }, [id])

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

    if (!movie) return null

    // sort shows by nearest date
    const sortShows = (shows) =>
        [...shows].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        )

    const isUpcoming = !movie.theatre || movie.theatre.length === 0

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>
                {/* Back button */}
                <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    onClick={() => navigate("/")}
                    style={{ marginBottom: 16 }}
                >
                    Back to Movies
                </Button>

                {/* Movie Info */}
                <Row gutter={[32, 32]}>
                    {/* Poster */}
                    <Col xs={24} sm={8} md={6}>
                        <img
                            src={movie.poster}
                            alt={movie.name}
                            style={{
                                width: "100%",
                                borderRadius: 12,
                                objectFit: "cover",
                                maxHeight: 400,
                            }}
                        />
                    </Col>

                    {/* Details */}
                    <Col xs={24} sm={16} md={18}>
                        <h1 style={styles.movieTitle}>{movie.name}</h1>

                        <div style={{ marginBottom: 12 }}>
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

                        <p style={styles.description}>{movie.description}</p>

                        <div style={styles.metaRow}>
                            <ClockCircleOutlined style={{ marginRight: 6 }} />
                            {movie.duration} minutes
                        </div>

                        <div style={styles.metaRow}>
                            <CalendarOutlined style={{ marginRight: 6 }} />
                            Release:{" "}
                            {new Date(movie.releaseDate).toLocaleDateString()}
                        </div>

                        <div style={styles.metaRow}>
                            Languages:{" "}
                            {Array.isArray(movie.languages)
                                ? movie.languages.join(", ")
                                : movie.languages}
                        </div>

                        {isUpcoming && (
                            <Tag
                                color="orange"
                                style={{ marginTop: 12, fontSize: 14 }}
                            >
                                Coming Soon — No shows yet
                            </Tag>
                        )}
                    </Col>
                </Row>

                {/* Theatres and Shows */}
                {!isUpcoming && (
                    <>
                        <Divider />
                        <h2 style={styles.sectionTitle}>
                            🎭 Select Theatre & Show
                        </h2>

                        <Row gutter={[16, 16]}>
                            {movie.theatre.map((theatre) => (
                                <Col
                                    xs={24}
                                    md={12}
                                    key={theatre._id}   
                                >
                                    <Card
                                        title={theatre.name}
                                        extra={
                                            <Tag color="green">
                                                {theatre.address}
                                            </Tag>
                                        }
                                        style={styles.theatreCard}
                                    >
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#888",
                                                marginBottom: 12,
                                            }}
                                        >
                                            {theatre.email} |{" "}
                                            {theatre.phone}
                                        </div>

                                        <div style={styles.showsLabel}>
                                            Available Shows:
                                        </div>

                                        <div style={styles.showsGrid}>
                                            {sortShows(theatre.showsAll).map(
                                                (show) => (
                                                    <Button
                                                        key={show._id}
                                                        style={styles.showButton}
                                                        onClick={() => {
                                                            navigate(`/booking/${show._id}`)
                                                            // booking feature to be added
                                                            console.log(
                                                                "show selected:",
                                                                show
                                                            )
                                                        }}
                                                    >
                                                        <div
                                                            style={
                                                                styles.showTime
                                                            }
                                                        >
                                                            {new Date(
                                                                show.date
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </div>
                                                        <div
                                                            style={
                                                                styles.showDate
                                                            }
                                                        >
                                                            {new Date(
                                                                show.date
                                                            ).toLocaleDateString(
                                                                [],
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                }
                                                            )}
                                                        </div>
                                                        <div
                                                            style={
                                                                styles.showSeats
                                                            }
                                                        >
                                                            {
                                                                show.availableSeats
                                                            }{" "}
                                                            seats left
                                                        </div>
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    movieTitle: {
        fontSize: 32,
        fontWeight: 700,
        margin: "0 0 12px 0",
    },
    description: {
        color: "#555",
        fontSize: 15,
        lineHeight: 1.7,
        margin: "12px 0",
    },
    metaRow: {
        color: "#444",
        fontSize: 14,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 16,
    },
    theatreCard: {
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    showsLabel: {
        fontWeight: 600,
        marginBottom: 10,
        color: "#333",
    },
    showsGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
    },
    showButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "auto",
        padding: "8px 16px",
        borderRadius: 8,
        border: "1px solid #1677ff",
        color: "#1677ff",
        minWidth: 90,
    },
    showTime: {
        fontWeight: 700,
        fontSize: 15,
    },
    showDate: {
        fontSize: 11,
        color: "#888",
    },
    showSeats: {
        fontSize: 10,
        color: "#52c41a",
        marginTop: 2,
    },
}

export default MoviePage