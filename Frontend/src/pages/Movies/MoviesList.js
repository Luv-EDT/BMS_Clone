import { useEffect, useState } from "react"
import { Table, Button, Popconfirm, Space, message } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { getAllMovies, deleteMovie, updateMovie } from "../../apiCall/moviesApi"
import MoviesForm from "./MoviesForm"

function MoviesList() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState(null) // null | "edit" | "delete" | "add"
    const [showForm, setShowForm] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null) // for edit

    // ─── Fetch all movies on mount ───────────────────────────────────────────
    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async () => {
        try {
            setLoading(true)
            const response = await getAllMovies()
            setMovies(response.data.data)
        } catch (error) {
            message.error("Failed to fetch movies")
        } finally {
            setLoading(false)
        }
    }

    // ─── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            await deleteMovie(id)
            message.success("Movie deleted successfully")
            setMovies((prev) => prev.filter((movie) => movie._id !== id))
        } catch (error) {
            message.error("Failed to delete movie")
        }
    }

    // ─── Edit (opens form pre-filled) ────────────────────────────────────────
    const handleEditClick = (movie) => {
        setSelectedMovie(movie)
        setShowForm(true)
    }

    // called from MoviesForm on submit in edit mode
    const handleUpdate = async (id, updatedData) => {
        try {
            await updateMovie(id, updatedData)
            message.success("Movie updated successfully")
            setMovies((prev) =>
                prev.map((movie) =>
                    movie._id === id ? { ...movie, ...updatedData } : movie
                )
            )
            setShowForm(false)
            setSelectedMovie(null)
            setMode(null)
        } catch (error) {
            message.error("Failed to update movie")
        }
    }

    // called from MoviesForm on submit in add mode
    const handleAddSuccess = (newMovie) => {
        setMovies((prev) => [...prev, newMovie])
        setShowForm(false)
        setMode(null)
    }

    // ─── Columns ─────────────────────────────────────────────────────────────
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Poster",
            dataIndex: "poster",
            render: (url) => (
                <img
                    src={url}
                    alt="poster"
                    style={{
                        width: 60,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 4,
                    }}
                />
            ),
        },
        {
            title: "Genre",
            dataIndex: "genre",
                render: (genres) => Array.isArray(genres) ? genres.join(", ") : genres

        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text) => (
                <span style={{ 
                    display: "block", 
                    maxWidth: 200, 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap" 
                }}>
                    {text}
                </span>
            ),
        },
        {
            title: "Duration (mins)",
            dataIndex: "duration",
        },
        {
            title: "Languages",
            dataIndex: "languages",
            render: (langs) =>
                Array.isArray(langs) ? langs.join(", ") : langs,
        },
        {
            title: "Release Date",
            dataIndex: "releaseDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Action",
            render: (_, record) => {
                if (mode === "edit") {
                    return (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEditClick(record)}
                        >
                            Edit
                        </Button>
                    )
                }

                if (mode === "delete") {
                    return (
                        <Popconfirm
                            title="Are you sure you want to delete this movie?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes, delete"
                            cancelText="Cancel"
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Popconfirm>
                    )
                }

                return null
            },
        },
    ]

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div>
            {/* Toolbar */}
            <Space style={{ marginBottom: 16 }}>
                <Button
                    type={mode === "edit" ? "primary" : "default"}
                    icon={<EditOutlined />}
                    onClick={() => setMode(mode === "edit" ? null : "edit")}
                >
                    {mode === "edit" ? "Cancel Edit" : "Edit"}
                </Button>

                <Button
                    danger
                    type={mode === "delete" ? "primary" : "default"}
                    icon={<DeleteOutlined />}
                    onClick={() => setMode(mode === "delete" ? null : "delete")}
                >
                    {mode === "delete" ? "Cancel Delete" : "Delete"}
                </Button>

                <Button
                    type={mode === "add" ? "primary" : "default"}
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedMovie(null)
                        setShowForm(true)
                        setMode("add")
                    }}
                >
                    Add Movie
                </Button>
            </Space>

            {/* Table */}
            <Table
                dataSource={movies}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: true }}
            />

            {/* Form Modal */}
            <MoviesForm
                visible={showForm}
                onClose={() => {
                    setShowForm(false)
                    setSelectedMovie(null)
                    setMode(null)
                }}
                initialData={selectedMovie}      // null = add mode, object = edit mode
                onAddSuccess={handleAddSuccess}
                onUpdateSuccess={handleUpdate}
            />
        </div>
    )
}

export default MoviesList