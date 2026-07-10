import { useEffect, useState } from "react"
import { Table, Button, message, Tag } from "antd"
import { getAllTheatresForAdmin, updateTheatreForAdmin } from "../../apiCall/theatreApi"

function TheatreAdminList() {
    const [theatres, setTheatres] = useState([])
    const [loading, setLoading] = useState(false)

    // ─── Fetch all theatres on mount ─────────────────────────────────────────
    useEffect(() => {
        fetchTheatres()
    }, [])

    const fetchTheatres = async () => {
        try {
            setLoading(true)
            const response = await getAllTheatresForAdmin()
            setTheatres(response.data.data)
        } catch (error) {
            message.error("Failed to fetch theatres")
        } finally {
            setLoading(false)
        }
    }

    // ─── Approve / Disapprove ────────────────────────────────────────────────
    const handleToggleStatus = async (record) => {
        try {
            const newStatus = !record.isActive

            await updateTheatreForAdmin(record._id, { isActive: newStatus })

            message.success(
                newStatus ? "Theatre approved" : "Theatre disapproved"
            )

            // update locally without refetching
            setTheatres((prev) =>
                prev.map((t) =>
                    t._id === record._id ? { ...t, isActive: newStatus } : t
                )
            )
        } catch (error) {
            message.error("Failed to update theatre status")
        }
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
            render: (_, record) => (
                <Button
                    size="small"
                    type={record.isActive ? "default" : "primary"}
                    danger={record.isActive}
                    onClick={() => handleToggleStatus(record)}
                >
                    {record.isActive ? "Disapprove" : "Approve"}
                </Button>
            ),
        },
    ]

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <Table
            dataSource={theatres}
            columns={columns}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: true }}
        />
    )
}

export default TheatreAdminList