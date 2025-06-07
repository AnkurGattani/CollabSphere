import express from "express";
import { prisma } from "../db/index";
import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/stripe', express.raw({ type: "application/json" }) as express.RequestHandler, asyncHandler(async (req, res) => {
  const sign = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sign!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Webhook Error: ${error.message}`);
    } else {
      console.error(`Webhook Error: ${String(error)}`);
    }
    res.status(400).send(`Webhook Error!!`);
    return;
  }

  try{
    switch (event.type) {
            case "checkout.session.completed":
                {
                    const session = event.data.object as Stripe.Checkout.Session;
                    console.log(session.customer_details);

          
                    const email = session.customer_details?.email;

                    // Update user subscription
                    if (email) {
                        await prisma.user.update({
                            where: { email },
                            data: { isSubscribed: true },
                        });
                        console.log(`User with email ${email} subscribed successfully!`);
                    } else {
                        console.error("No customer email found in session.");
                    }
                    break;
                }

            case "customer.subscription.deleted": {
                // ❌ Revoke access to the product
                // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
                const subscription = await stripe.subscriptions.retrieve(
                    event.data.object.id
                );
                
        

                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
  } catch(error) {
    if (error instanceof Error) {
      console.error(`Webhook Error: ${error.message}`);
    } else {
      console.error(`Webhook Error: ${String(error)}`);
    }
    res.status(400).send(`Webhook Error!! User not found`);
    return;
  }
  res.sendStatus(200);
}));

export default router;