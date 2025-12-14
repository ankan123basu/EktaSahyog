import Stripe from 'stripe';
import Project from '../models/Project.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Extract metadata
            const projectId = session.metadata.projectId;
            const amount = parseInt(session.metadata.amount);

            if (!projectId || !amount) {
                console.error('❌ Missing metadata in session:', session.id);
                return res.status(400).send('Missing metadata');
            }

            // Update project's raised amount
            const project = await Project.findById(projectId);

            if (!project) {
                console.error('❌ Project not found:', projectId);
                return res.status(404).send('Project not found');
            }

            project.raised += amount;
            await project.save();

            console.log(`✅ Donation recorded: ₹${amount} for "${project.title}" (Total: ₹${project.raised})`);
        } catch (err) {
            console.error('❌ Error processing donation:', err);
            return res.status(500).send('Error processing donation');
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
};
