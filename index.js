const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors());

// Routes here
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).send({ message: "Payment process failed" });
  }
});

// Listen
app.listen(8000, () => {
  console.log("Server started at port 8000");
});
