import { useEffect, useState } from "react"
import { Table, Button, Popconfirm, Space, message } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { getUserShows, deleteShow, updateShow } from "../../apiCall/showsApi"
import ShowsForm from "./ShowsForm"

function ShowsList({refreshShows}) {
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState(null) // null | "edit" | "delete"
    const [showForm, setShowForm] = useState(false)
    const [selectedShow, setSelectedShow] = useState(null)

    useEffect(() => {
        fetchShows()
    }, [refreshShows])

    const fetchShows = async () => {
        try {
            setLoading(true)
            const response = await getUserShows()
            setShows(response.data.data)
        } catch (error) {
            message.error("Failed to fetch shows")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteShow(id)
            message.success("Show deleted")
            setShows((prev) => prev.filter((s) => s._id !== id))
        } catch (error) {
            message.error("Failed to delete show")
        }
    }

    const handleUpdate = async (id, updatedData) => {
        try {
            const response = await updateShow(id, updatedData)
            message.success("Show updated")
            setShows((prev) =>
                prev.map((s) => (s._id === id ? { ...s, ...response.data.data } : s))
            )
            setShowForm(false)
            setSelectedShow(null)
            setMode(null)
        } catch (error) {
            message.error("Failed to update show")
        }
    }

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
            title: "Total Seats",
            dataIndex: "totalSeats",
        },
        {
            title: "Available Seats",
            dataIndex: "availableSeats",
        },
        {
            title: "Booked Seats",
            dataIndex: "bookedSeats",
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
                            onClick={() => {
                                setSelectedShow(record)
                                setShowForm(true)
                            }}
                        >
                            Edit
                        </Button>
                    )
                }

                if (mode === "delete") {
                    return (
                        <Popconfirm
                            title="Delete this show?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
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

    return (
        <div>
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
            </Space>

            <Table
                dataSource={shows}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: true }}
            />

            <ShowsForm
                visible={showForm}
                onClose={() => {
                    setShowForm(false)
                    setSelectedShow(null)
                    setMode(null)
                }}
                initialData={selectedShow}
                preselectedTheatre={null}
                // onAddSuccess={(newShow) => {
                //     setShows((prev) => [...prev, newShow])
                //     setShowForm(false)
                // }}
                onUpdateSuccess={handleUpdate}
            />
        </div>
    )
}

export default ShowsList