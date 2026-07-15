import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { message, Card, Row, Col, Tag, Button, Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { getShowById } from '../../apiCall/showsApi'
import Navbar from '../Navbar'
import '../../stylesheets/booking.css'
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../apiCall/bookingsApi";

const stripePromise = loadStripe(
    "pk_test_51Tshf6Jz5u4VH7AU0NvIYf0rCeu4SRfs4Wymb8bP79Dj6eOnE7y8QcT982YIaejJ0GKpc6C0Ncxff0XIr020p0RH00BlDGNe8G"
    );

const COLUMNS = 12



function BookingPage() {
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])

    const { id } = useParams()
    const navigate = useNavigate()

    // ── fix: empty dependency array — only run once on mount ─────────────────
    useEffect(() => {
        fetchShowDetails()
    }, [])

    async function fetchShowDetails() {
        try {
            setLoading(true)
            const response = await getShowById(id)
            setShow(response.data.data)
        } catch (error) {
            message.error("Failed to fetch show details")
        } finally {
            setLoading(false)
        }
    }

    // ── seat helpers ──────────────────────────────────────────────────────────
    const availableSeats = show?.availableSeats || 0
    const bookedSeats = show?.bookedSeats || []
    const ROWS = Math.ceil(availableSeats / COLUMNS)
    const ticketPrice = show?.ticketPrice || 0


    const makePayment = async () => {

    try {

        const stripe = await stripePromise;
                    


        const response = await createCheckoutSession({

            showId: show._id,

            seats: selectedSeats,

            amount: selectedSeats.length * ticketPrice

        });

        console.log(response.data.sessionId)

                  window.location.href = response.data.url;

    } catch (err) {
        console.log(err)

        message.error(`Payment Failed`);

    }

};

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return // cant select booked seat

        setSelectedSeats((prev) =>
            prev.includes(seatNumber)
                ? prev.filter((s) => s !== seatNumber) // deselect
                : [...prev, seatNumber]                 // select
        )

    }

    const getSeatClass = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return 'seat booked'
        if (selectedSeats.includes(seatNumber)) return 'seat selected'
        return 'seat'
    }

    // ── loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                    <Spin size="large" />
                </div>
            </div>
        )
    }

    if (!show) return null

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>

                <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 16 }}
                >
                    Back
                </Button>

                {/* ── Show Details ─────────────────────────────────────────── */}
                <Card style={{ borderRadius: 12, marginBottom: 24 }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={6}>
                            <img
                                src={show.movie?.poster}
                                alt={show.movie?.name}
                                style={{
                                    width: '100%',
                                    borderRadius: 8,
                                    objectFit: 'cover',
                                    maxHeight: 180,
                                }}
                            />
                        </Col>

                        <Col xs={24} sm={18}>
                            <h2 style={{ margin: '0 0 8px 0' }}>{show.name}</h2>
                            <div style={{ color: '#888', marginBottom: 10 }}>
                                {show.movie?.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <Tag color="blue">{show.theatre?.name}</Tag>
                                <Tag color="purple">
                                    {new Date(show.date).toLocaleString([], {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Tag>
                                <Tag color="green">
                                    {show.availableSeats} seats available
                                </Tag>
                                <Tag color="red">
                                    {bookedSeats.length} booked
                                </Tag>
                            </div>
                            <div style={{ marginTop: 10, color: '#555' }}>
                                {show.theatre?.address}
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* ── Legend ───────────────────────────────────────────────── */}
                <div className="legend">
                    <div className="legend-item">
                        <div className="seat" />
                        <span>Available</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat selected" />
                        <span>Selected</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat booked" />
                        <span>Booked</span>
                    </div>
                </div>

                {/* ── Screen ───────────────────────────────────────────────── */}
                <div className="screen">SCREEN THIS WAY</div>

                {/* ── Seat Grid ────────────────────────────────────────────── */}
                <div className="seat-grid">
                    {[...Array(ROWS).keys()].map((rowItem) => (
                        <div key={rowItem} className="seat-row">
                            <span className="row-label">
                                {String.fromCharCode(65 + rowItem)}
                            </span>
                            {[...Array(COLUMNS).keys()].map((colItem) => {
                                const seatNumber = `${String.fromCharCode(65 + rowItem)}${colItem + 1}`

                                if (colItem + 1 + COLUMNS * rowItem > availableSeats) return null

                                return (
                                    <div
                                        key={seatNumber}
                                        className={getSeatClass(seatNumber)}
                                        onClick={() => handleSeatClick(seatNumber)}
                                        title={`Seat ${seatNumber}`}
                                    >
                                        {colItem + 1}  {/* ← display just the number */}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* ── Summary + Book Now ────────────────────────────────────── */}
                <Card
                    style={{
                        marginTop: 24,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 12,
                        maxWidth: 400,
                        width: "100%",
                    }}
                >

                    <div style={styles.summaryRow}>
                        <span>Selected Seats</span>
                        <span style={ {color: 'green', marginLeft:'1%'}}>
                            {selectedSeats.length > 0
                                ? selectedSeats.sort((a, b) => a - b).join(', ')
                                : 'None'}
                        </span>
                    </div>
                    <div style={styles.summaryRow}>
                        <span >Total Seats</span>
                        <span style={ {color: 'green', marginLeft:'1%'}}>{selectedSeats.length}</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span> Price Per Ticket</span>
                        <span style={ {color: 'green', marginLeft:'1%'}}>{ticketPrice}</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span>Total Price</span>
                        <span style={ {color: 'green', marginLeft:'1%'}}>{ selectedSeats.length * ticketPrice}</span>
                    </div>

                    {/* Stripe component will wrap this button later */}
                    <Button
                        type="primary"
                        size="large"
                        block
                        disabled={selectedSeats.length === 0}
                        style={{ marginTop: 16 }}
                        onClick={makePayment}
                    >
                        Book Now ({selectedSeats.length} seats)
                    </Button>
                </Card>

            </div>
        </div>
    )
}

const styles = {
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 10,
        fontSize: 14,
    },
}

export default BookingPage