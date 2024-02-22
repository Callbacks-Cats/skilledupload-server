import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

process.on('message', (payload: { tempFilePath: string; name: string }) => {
  const { tempFilePath, name } = payload;
  ffmpeg(tempFilePath)
    .fps(30)
    .addOptions(['-crf 28'])
    .on('end', () => {
      // Read the compressed video buffer into memory
      fs.readFile(`./temp/${name}`, (err, data) => {
        if (err) {
          if (process.send) {
            process.send({ statusCode: 500, text: 'Error reading compressed video' });
          }
          // process.send({ statusCode: 500, text: 'Error reading compressed video' });
        } else {
          if (process.send) {
            process.send({ statusCode: 200, text: 'Success', compressedVideo: data });
          }
        }
      });
    })
    .on('error', (err) => {
      if (process.send) {
        process.send({ statusCode: 500, text: err.message });
      }
    })
    .toFormat('mp4') // Ensure the output format is desired (e.g., mp4)
    .save(`./temp/${name}`); // Save the compressed video to disk (optional)
});
