import express, { Router } from 'express';
import { uploader } from '../lib';
import { storageController } from '../modules/storage';

const router: Router = express.Router();

// router.post('/upload', fileUploader.single('file'), storageController.uploadFile);
router.post('/upload', uploader.single('file'), storageController.uploadFile);
router.delete('/delete', storageController.deleteFile);

export default router;
/**
 * @swagger
 * tags:
 *   name: Storage
 *   description: File storage
 */

/**
 * @swagger
 * /storage/upload:
 *   post:
 *     summary: Upload a file to the server
 *     tags: [Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       "200":
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   format: uri
 *                   example: "https://skilledupload-bucket.nyc3.digitaloceanspaces.com/files/files/1709114782210.pdf"
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "400":
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Please upload a file"
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 data:
 *                   type: null
 *                   example: null
 */

/**
 * @swagger
 * /storage/delete:
 *   delete:
 *     summary: Delete a file from the server
 *     tags: [Storage]
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL of the file to delete
 *     responses:
 *       "200":
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "400":
 *         description: Error deleting file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Please provide a file URL"
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 data:
 *                   type: null
 *                   example: null
 */
