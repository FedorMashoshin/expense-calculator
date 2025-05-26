import { Router, Request, Response } from "express";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    '/upload',
    upload.single("file"),
    (req: Request, res: Response): void => {
        console.log('Hello');
        if (!req.file) {
            res.status(400).json({ message: "No file provided" });
            return;
        }
        res.json({ message: `Recieved the file ${req.file.originalname}` });
    }
)

export default router;