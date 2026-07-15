import { useEffect, useState } from 'react'
import { Card, Row, Col, Tag, message, Spin, Empty } from 'antd'
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { getUserBookings } from '../../apiCall/bookingsApi'

function Bookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const response = await getUserBookings()
            setBookings(response.data.data)
        } catch (error) {
            message.error("Failed to fetch bookings")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (bookings.length === 0) {
        return <Empty description="No bookings yet" style={{ marginTop: 60 }} />
    }

    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>My Bookings</h2>
            <Row gutter={[16, 16]}>
                {bookings.map((booking) => (
                    <Col xs={24} md={12} lg={8} key={booking._id}>
                        <Card
                            style={{ borderRadius: 12 }}
                            cover={
                                <img
                                    src={booking.show?.movie?.poster}
                                    alt={booking.show?.movie?.name}
                                    style={{
                                        height: 200,
                                        objectFit: 'cover',
                                        borderRadius: '12px 12px 0 0',
                                    }}
                                />
                            }
                        >
                            {/* Movie + Show Name */}
                            <h3 style={{ margin: '0 0 4px 0' }}>
                                {booking.show?.movie?.name}
                            </h3>
                            <div style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
                                {booking.show?.name}
                            </div>

                            {/* Theatre */}
                            <div style={styles.infoRow}>
                                <EnvironmentOutlined style={{ color: '#1677ff' }} />
                                <span>{booking.show?.theatre?.name}</span>
                            </div>

                            {/* Date */}
                            <div style={styles.infoRow}>
                                <CalendarOutlined style={{ color: '#1677ff' }} />
                                <span>
                                    {new Date(booking.show?.date).toLocaleString([], {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>

                            {/* Seats */}
                            <div style={{ marginTop: 12, marginBottom: 8 }}>
                                <span style={{ fontSize: 13, color: '#555' }}>
                                    Seats:{" "}
                                </span>
                                {booking.seats.map((seat) => (
                                    <Tag color="green" key={seat}>
                                        {seat}
                                    </Tag>
                                ))}
                            </div>

                            {/* Amount + Transaction */}
                            <div style={styles.infoRow}>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>
                                    ₹{booking.amount}
                                </span>
                                <Tag color="blue">Confirmed</Tag>
                            </div>

                            <div style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>
                                Txn: {booking.transactionId}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

const styles = {
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
        fontSize: 13,
        color: '#444',
    },
}

export default Bookings