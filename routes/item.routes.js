import { Router } from "express";
import db from '../config/db.js'

const router = Router();

// Route to get all items
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT name, price, image FROM items");
        
        const formattedData = result.rows.map(item => ({
            name: item.name,
            price: item.price,
            image: item.image
        }));

        res.json(formattedData);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ message: "An error occurred while fetching items" });
    }
});

// Route to get a specific item by ID
router.get("/:id", async (req, res) => {
    try {
        const itemId = req.params.id;

        const result = await db.query("SELECT name, price, image, description FROM items WHERE item_id = $1", [itemId]);
        console.log(result);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        const item = result.rows[0];
        const response = {
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description
        };

        return res.json(response);
    } catch (err) {
        console.error("Error fetching item:", err);
        res.status(500).json({ message: "An error occurred while fetching the item" });
    }
});

router.post("/add", async (req, res) => {
    try {
        // Log the entire request body
        console.log("Request body:", req.body);

        // Extract item details from request body
        const { name, price, image, description} = req.body;

        // Log each field
        console.log("Name:", name);
        console.log("Price:", price);
        console.log("Image:", image);
        console.log("Description:", description);

        // Check each field individually and create an array of missing fields
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!price) missingFields.push("price");
        if (!image) missingFields.push("image");
        if (!description) missingFields.push("description");

        // If there are any missing fields, return an error response
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "Some fields are missing", 
                missingFields: missingFields 
            });
        }

        // Insert new item into the database
        const result = await db.query(
            "INSERT INTO items (name, price, image, description) VALUES ($1, $2, $3, $4) RETURNING name, price, image, description",
            [name, price, image, description]
        );

        // Check if insertion was successful
        if (result.rows.length > 0) {
            const newItem = result.rows[0];
            res.status(201).json({
                message: "Item added successfully",
                item: newItem
            });
        } else {
            res.status(500).json({ message: "Failed to add item" });
        }
    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).json({ message: "An error occurred while adding the item", error: err.message });
    }
});
router.delete("/", async (req, res) => {
    // delete kar do

});
router.put("/", async (req, res) => {
    // update

});
export default router;