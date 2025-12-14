import Story from '../models/Story.js';

/* CREATE STORY */
export const createStory = async (req, res) => {
    try {
        const { title, content, region, image } = req.body;

        // Auto-generate preview (first 150 characters)
        const preview = content.length > 150
            ? content.substring(0, 150) + '...'
            : content;

        const newStory = new Story({
            title,
            content,
            preview,
            region,
            image,
            author: req.body.author || "Anonymous",
            authorId: req.body.authorId,
        });
        const savedStory = await newStory.save();
        res.status(201).json(savedStory);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* GET ALL STORIES */
export const getStories = async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 });
        res.status(200).json(stories);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* LIKE/UNLIKE STORY */
export const likeStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const story = await Story.findById(id);

        // Check if user already liked
        const alreadyLiked = story.likedBy.some(uid => uid.toString() === userId);

        if (alreadyLiked) {
            // Unlike
            story.likedBy = story.likedBy.filter(uid => uid.toString() !== userId);
            story.likes = Math.max(0, story.likes - 1);
        } else {
            // Like
            story.likedBy.push(userId);
            story.likes += 1;
        }

        const updatedStory = await story.save();
        res.status(200).json(updatedStory);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userName, text } = req.body;

        const story = await Story.findById(id);

        story.comments.push({
            userId,
            userName,
            text,
            createdAt: new Date()
        });

        const updatedStory = await story.save();
        res.status(200).json(updatedStory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { userId } = req.body;

        const story = await Story.findById(id);

        // Find the comment
        const comment = story.comments.id(commentId);

        // Only allow deletion if user owns the comment
        if (comment && comment.userId.toString() === userId) {
            comment.remove();
            const updatedStory = await story.save();
            res.status(200).json(updatedStory);
        } else {
            res.status(403).json({ message: "Not authorized to delete this comment" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
