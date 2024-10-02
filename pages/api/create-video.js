// pages/api/create-video.js
import nextConnect from 'next-connect';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploads

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: `Error occurred: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
})
.use(upload.fields([{ name: 'images', maxCount: 10 }, { name: 'soundFile', maxCount: 1 }]))
.post((req, res) => {
  const { images, soundFile } = req.files;

  // Check if files are received
  if (!images || !soundFile) {
    return res.status(400).json({ error: 'Images and sound file are required' });
  }

  // Define output video path
  const outputVideoPath = path.join('output', 'output-video.mp4');

  // Use ffmpeg to create video
  ffmpeg()
    .input(soundFile[0].path)
    .input(images.map(img => img.path))
    .output(outputVideoPath)
    .on('end', () => {
      // Clean up uploaded files after video creation
      images.forEach(img => fs.unlinkSync(img.path));
      fs.unlinkSync(soundFile[0].path);

      res.status(200).json({ success: true, outputVideoPath });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error creating video' });
    })
    .run();
});

export default apiRoute;
