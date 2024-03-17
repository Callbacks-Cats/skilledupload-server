import ffmpeg from 'fluent-ffmpeg';

export const generateScreenshot = async (videoPath: string, outputPath: string, time: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [time],
        folder: outputPath,
        size: '320x240', // adjust the size as needed
        filename: 'thumbnail.png'
      })
      .on('end', () => {
        resolve(`${outputPath}/thumbnail.png`);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
