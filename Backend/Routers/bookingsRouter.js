const express = require("express")
const Stripe = require("stripe");
const Booking = require("../model/bookingsModel")
const Show = require("../model/showsModel")

const authMiddleware = require("../middlewares/authMiddleware")

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const router = express.Router()


// ========================
// Create Payment Intent
// ========================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

createCheckoutSession = async (req, res) => {

    try {

        const {

            showId,
            seats,
            amount

        } = req.body;

        const session = await stripe.checkout.sessions.create({

            mode: "payment",

            payment_method_types: ["card"],

            line_items: [

                {

                    price_data: {

                        currency: "inr",

                        product_data: {

                            name: "Movie Ticket"

                        },

                        unit_amount: amount * 100

                    },

                    quantity: 1

                }

            ],

            metadata: {

                showId,

                seats: JSON.stringify(seats),

                userId: req.user._id.toString(),

            },

            success_url:
                `${process.env.FRONTEND_URL}/payment-success`,

            cancel_url:
                `${process.env.FRONTEND_URL}/payment-cancel`

        });

        res.send({

            success: true,

    url: session.url,

        });

    } catch (err) {

        res.status(500).send({

            success: false,

            message: err.message

        });

    }

};

//webhook to be sent by the Stripe to my backend

webhook = async (req, res) => {

    const signature =
        req.headers["stripe-signature"];

    let event;

    try {

        event =
            stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

    } catch (err) {

        return res
            .status(400)
            .send(`Webhook Error: ${err.message}`);

    }

    if (event.type === "checkout.session.completed") {

        

        const session = event.data.object;

        console.log(session);


        const showId = session.metadata.showId;

        const userId = session.metadata.userId;

        const seats = JSON.parse(
            session.metadata.seats
        );

        await Booking.create({

            show: showId,

            user: userId,

            seats,

            amount:
                session.amount_total / 100,

            transactionId:
                session.payment_intent,
            sessionId: 
                session.id



        });

        await Show.findByIdAndUpdate(

            showId,

            {

                $push: {

                    bookedSeats: {

                        $each: seats

                    }

                },

                $inc: {

                    availableSeats:
                        -seats.length

                }

            }

        );

    }

    res.sendStatus(200);

};

router.post(
    "/payment-confirmation-webhook",
    express.raw({ type: "application/json" }),
    webhook
);


router.post(
    "/create-checkout-session",express.json(),
     authMiddleware,
    createCheckoutSession
);

 
// ========================
// Get Bookings for User
// ========================

router.get("/getUserBookings", express.json(),
 authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: "show",
                populate: [
                    { path: "movie" },
                    { path: "theatre" },
                ]
            })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        })
    }
})


module.exports = router