import Project from '../models/Project.js';
import User from '../models/User.js'; // Import User model
import Stripe from 'stripe';
import { sendEmail } from '../services/email.js'; // Import centralized service

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* CREATE PROJECT */
export const createProject = async (req, res) => {
    try {
        const { title, description, goalAmount, goalMembers, date, location, tags, image } = req.body;
        const newProject = new Project({
            title,
            description,
            goalAmount,
            goalMembers,
            date,
            location,
            tags,
            image,
            organizer: req.user ? req.user.id : req.body.organizer,
        });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ message: err.message });
    }
};

/* GET ALL PROJECTS */
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* JOIN PROJECT */
export const joinProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const project = await Project.findById(id);
        const user = await User.findById(userId); // Fetch user for email

        if (!project) return res.status(404).json({ message: "Project not found" });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if user is already a member (compare as strings)
        const isMember = project.members.some(memberId => memberId.toString() === userId);

        if (!isMember) {
            project.members.push(userId);
            await project.save();

            // Send Confirmation Email using centralized service
            try {
                await sendEmail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: `Welcome to the Team! - ${project.title}`,
                    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Project</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <!-- Tricolor Top Border -->
                    <tr>
                        <td style="height: 6px; background: linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);"></td>
                    </tr>
                    
                    <!-- Hero Section -->
                    <tr>
                        <td bgcolor="#138808" style="background: linear-gradient(135deg, #138808 0%, #2ecc71 100%); padding: 40px; text-align: center; position: relative;">
                            <div style="text-align: center;">
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Jai Hind, ${user.name}! 🇮🇳</h1>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">You are now part of the change.</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Project Image Section -->
                    ${project.image ? `
                    <tr>
                        <td style="padding: 0;">
                            <img src="${project.image}" alt="Project Cover" style="width: 100%; height: 200px; object-fit: cover; display: block;">
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Thank you for stepping up! You have successfully volunteered for <strong style="color: #138808;">"${project.title}"</strong>. Your contribution matters immensely.
                            </p>
                            
                            <!-- Key Details Card -->
                            <div style="background: #f8f9fa; border-left: 4px solid #FF9933; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table role="presentation" style="width: 100%;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #718096; font-size: 14px;">📍 Location</td>
                                        <td style="padding: 8px 0; color: #2d3748; font-weight: 600;">${project.location}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #718096; font-size: 14px;">📅 Date</td>
                                        <td style="padding: 8px 0; color: #2d3748; font-weight: 600;">${new Date(project.date).toDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #718096; font-size: 14px;">👥 Role</td>
                                        <td style="padding: 8px 0; color: #2d3748; font-weight: 600;">Volunteer</td>
                                    </tr>
                                </table>
                            </div>

                            <p style="color: #718096; font-size: 15px; font-style: italic; text-align: center; margin: 30px 0;">
                                "Unity is strength... when there is teamwork and collaboration, wonderful things can be achieved."
                            </p>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center;">
                                <a href="http://localhost:5173/projects" style="display: inline-block; background: linear-gradient(90deg, #FF9933 0%, #FF8008 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 153, 51, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                                    View Project Dashboard
                                </a>
                            </div>

                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2d3748; padding: 30px; text-align: center;">
                            <p style="color: white; margin: 0 0 10px; font-size: 14px; font-weight: 600;">EktaSahyog</p>
                            <p style="color: #a0aec0; margin: 0; font-size: 12px;">Connecting Communities, Building Dreams.</p>
                            <div style="margin-top: 20px;">
                                <a href="#" style="color: #FF9933; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
                                <span style="color: #4a5568;">|</span>
                                <a href="#" style="color: #138808; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
                });
            } catch (emailErr) {
                console.error("⚠️ Email service failed (Join Project), but DB updated successfully:", emailErr.message);
            }
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* LEAVE PROJECT */
export const leaveProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const project = await Project.findById(id);
        const user = await User.findById(userId);

        if (!project) return res.status(404).json({ message: "Project not found" });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove user from members
        project.members = project.members.filter(memberId => memberId.toString() !== userId);
        await project.save();

        // Send Cancellation Email using centralized service (Non-blocking fail)
        try {
            await sendEmail({
                from: `"EktaSahyog - Unity Projects" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: `📋 Participation Cancelled - "${project.title}"`,
                html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Participation Updated</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <!-- Tricolor Top Border -->
                    <tr>
                        <td style="height: 6px; background: linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);"></td>
                    </tr>
                    
                    <!-- Hero Section (Orange for Alert/Update) -->
                    <tr>
                        <td bgcolor="#FF9933" style="background: linear-gradient(135deg, #FF9933 0%, #FF8008 100%); padding: 40px; text-align: center;">
                            <div style="text-align: center;">
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Participation Updated</h1>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">We respect your journey.</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Namaste <strong style="color: #FF9933;">${user.name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                You have successfully opted out of <strong>"${project.title}"</strong>. We understand that plans change, and we appreciate the time you considered joining us.
                            </p>
                            
                            <!-- Info Card -->
                            <div style="background: #f8f9fa; border-left: 4px solid #138808; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 8px; color: #2d3748; font-size: 16px;">💡 Good to Know</h3>
                                <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                    If this was a mistake or if you'd like to re-join, we'd love to have you back! You can sign up again anytime.
                                </p>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="http://localhost:5173/projects" style="display: inline-block; background: white; color: #FF9933; border: 2px solid #FF9933; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 15px; transition: all 0.3s ease;">
                                    Explore Other Projects →
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2d3748; padding: 30px; text-align: center;">
                            <p style="color: white; margin: 0 0 10px; font-size: 14px; font-weight: 600;">EktaSahyog</p>
                            <p style="color: #a0aec0; margin: 0; font-size: 12px;">Building Bridges, Not Walls.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
            });
        } catch (emailErr) {
            console.error("⚠️ Email service failed (Leave Project), but DB updated successfully:", emailErr.message);
        } res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* DONATE TO PROJECT */
export const donateToProject = async (req, res) => {
    try {
        const { projectId, amount } = req.body;
        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Donation for ${project.title}`,
                            description: `Supporting ${project.title} in ${project.location}`,
                            images: [project.image],
                        },
                        unit_amount: amount * 100, // Amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/projects?success=true&projectId=${projectId}`,
            cancel_url: `http://localhost:5173/projects?canceled=true`,
            metadata: {
                projectId: projectId,
                amount: amount
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.error("Stripe Error:", err);
        res.status(500).json({ error: err.message });
    }
};
