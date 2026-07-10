import { useEffect, useState } from "react"
import { Table, Button, Popconfirm, Space, message, Tag } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { getAllTheatres, deleteTheatre, updateTheatre } from "../../apiCall/theatreApi"
import TheatreForm from "./TheatreForm"

function TheatreList() {
    const [theatres, setTheatres] = useState([])
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState(null) // null | "edit" | "delete" | "add"
    const [showForm, setShowForm] = useState(false)
    const [selectedTheatre, setSelectedTheatre] = useState(null)

    // ─── Fetch all theatres on mount ─────────────────────────────────────────
    useEffect(() => {
        fetchTheatres()
    }, [])

    const fetchTheatres = async () => {
        try {
            setLoading(true)
            const response = await getAllTheatres()
            setTheatres(response.data.data)
        } catch (error) {
            message.error("Failed to fetch theatres")
        } finally {
            setLoading(false)
        }
    }

    // ─── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            await deleteTheatre(id)
            message.success("Theatre deleted successfully")
            setTheatres((prev) => prev.filter((t) => t._id !== id))
        } catch (error) {
            message.error("Failed to delete theatre")
        }
    }

    // ─── Edit ────────────────────────────────────────────────────────────────
    const handleEditClick = (theatre) => {
        setSelectedTheatre(theatre)
        setShowForm(true)
    }

    const handleUpdate = async (id, updatedData) => {
        try {
            await updateTheatre(id, updatedData)
            message.success("Theatre updated successfully")
            setTheatres((prev) =>
                prev.map((t) => (t._id === id ? { ...t, ...updatedData } : t))
            )
            setShowForm(false)
            setSelectedTheatre(null)
            setMode(null)
        } catch (error) {
            message.error("Failed to update theatre")
        }
    }

    // ─── Add ─────────────────────────────────────────────────────────────────
    const handleAddSuccess = (newTheatre) => {
        setTheatres((prev) => [...prev, newTheatre])
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
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Owner",
            dataIndex: "owner",
            render: (owner) => owner?.userId || "N/A",
        },
        {
            title: "Status",
            dataIndex: "isActive",
            render: (isActive) =>
                isActive ? (
                    <Tag color="green">Approved</Tag>
                ) : (
                    <Tag color="orange">Pending</Tag>
                ),
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
                            title="Are you sure you want to delete this theatre?"
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
                        setSelectedTheatre(null)
                        setShowForm(true)
                        setMode("add")
                    }}
                >
                    Add Theatre
                </Button>
            </Space>

            {/* Table */}
            <Table
                dataSource={theatres}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: true }}
            />

            {/* Form Modal */}
            <TheatreForm
                visible={showForm}
                onClose={() => {
                    setShowForm(false)
                    setSelectedTheatre(null)
                    setMode(null)
                }}
                initialData={selectedTheatre}
                onAddSuccess={handleAddSuccess}
                onUpdateSuccess={handleUpdate}
            />
        </div>
    )
}

export default TheatreList