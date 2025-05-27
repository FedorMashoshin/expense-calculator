import { Router, Request, Response } from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config/s3Client";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const validateFileName = (fileName: string): boolean => {
    const pattern = /^[a-z]+_(credit|debit)_\d{2}_\d{2}\.pdf$/;
    return pattern.test(fileName.toLowerCase());
};

router.post(
    '/upload',
    upload.single("file"),
    async (req: Request, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({ message: "No file provided" });
            return;
        }

        const fileName = req.file.originalname;
        if (!validateFileName(fileName)) {
            res.status(400).json({
                message: "Invalid file name format. Expected format: bankname_credit_MM_YY.pdf"
            });
            return;
        }

        try {
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: 'application/pdf'
            });

            await s3Client.send(command);
            res.json({
                message: "File uploaded successfully",
                fileName: fileName
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                message: "Failed to upload file to S3",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

export default router;