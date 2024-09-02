import { Router } from "express";
import db from '../config/db.js'

const router = Router();

router.get("/", async (req,res)=>{
    try {
        const result  = await db.query("SELECT * FROM reviews");
        const formatted = result.rows.map(review => ({
            item_id: review.item_id,
            uid: review.uid,
            review: review.review
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Error fetching review:", err);
        res.status(500).json({ message: "An error occurred while fetching reviews" });
    }
    
});
router.get("/item/:id", async (req, res) => {
    try {
        const itemId = req.params.id;

        const result = await db.query(
            "SELECT review_id, review, uid, item_id FROM reviews WHERE item_id = $1",
            [itemId]
        );
        console.log(result);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No reviews found for this item" });
        }

        const reviews = result.rows.map(row => ({
            reviewId: row.review_id,
            review: row.review,
            userId: row.uid,
            itemId: row.item_id
        }));

        return res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "An error occurred while fetching the reviews" });
    }
});
export default router;