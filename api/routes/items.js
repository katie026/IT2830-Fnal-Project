import express from "express"
import { getItems, getItem, addItem, deleteItem, updateItem } from "../controllers/item.js"

const router = express.Router()

// is technically /api/items/
router.get("/", getItems)
router.get("/:id", getItem)
router.post("/", addItem)
router.delete("/:id", deleteItem)
router.put("/:id", updateItem)

export default router