import { useEffect, useState } from "react"
import { Table, message } from "antd"
import { getAllShows } from "../../apiCall/showsApi"

function ShowsListPublic() {
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchShows = async () => {
            try {
                setLoading(true)
                const response = await getAllShows()
                setShows(response.data.data)
            } catch (error) {
                message.error("Failed to fetch shows")
            } finally {
                setLoading(false)
            }
        }

        fetchShows()
    }, [])

    const columns = [
        {
            title: "Show Name",
            dataIndex: "name",
        },
        {
            title: "Movie",
            dataIndex: "movie",
            render: (movie) => movie?.name || "N/A",
        },
        {
            title: "Theatre",
            dataIndex: "theatre",
            render: (theatre) => theatre?.name || "N/A",
        },
        {
            title: "Date & Time",
            dataIndex: "date",
            render: (date) =>
                date ? new Date(date).toLocaleString() : "N/A",
        },
        {
            title: "Available Seats",
            dataIndex: "availableSeats",
        },
        {
            title: "Duration",
            dataIndex: "movie",
            render: (movie) =>
                movie?.duration ? `${movie.duration} mins` : "N/A",
        },
        {
            title: "Language",
            dataIndex: "movie",                
            render: (movie)=> Array.isArray(movie.languages) ? movie.languages.join(", ") : movie.languages,
        },
    ]

    return (
        <Table
            dataSource={shows}
            columns={columns}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
        />
    )
}

export default ShowsListPublic