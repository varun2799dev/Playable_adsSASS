const { Worker } = require("bullmq");
const redis = require("../../config/redis");
const Job = require("../../models/Job");
const Asset = require("../../models/Asset");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs").promises;

const renderWorker = new Worker(
  "render-queue",
  async (job) => {
    const { jobId, projectId } = job.data;

    try {
      // Update job status to processing
      await Job.updateStatus(jobId, "processing");

      console.log(`Starting render job ${jobId} for project ${projectId}`);

      // Get project assets
      const assets = await Asset.findByProjectId(projectId);

      if (assets.length === 0) {
        throw new Error("No assets found for this project");
      }

      // Simulate rendering with FFmpeg
      // For demo: take first video/image asset and add text overlay
      const videoAsset = assets.find(
        (a) =>
          a.mimetype &&
          (a.mimetype.includes("video") || a.mimetype.includes("image"))
      );

      if (!videoAsset) {
        // If no video/image, create a simple test video
        await simulateRender(jobId, projectId);
      } else {
        await renderWithFFmpeg(videoAsset, jobId, projectId);
      }

      const outputPath = path.join(process.env.OUTPUT_DIR, `${jobId}.mp4`);

      // Update job status to done
      await Job.updateStatus(jobId, "done", outputPath);

      console.log(`Render job ${jobId} completed successfully`);

      return { success: true, outputPath };
    } catch (error) {
      console.error(`Render job ${jobId} failed:`, error);
      await Job.updateStatus(jobId, "failed", null, error.message);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 2,
  }
);

async function simulateRender(jobId, projectId) {
  // Create outputs directory if it doesn't exist
  await fs.mkdir(process.env.OUTPUT_DIR, { recursive: true });

  const outputPath = path.join(process.env.OUTPUT_DIR, `${jobId}.mp4`);

  return new Promise((resolve, reject) => {
    // Create a simple test video with FFmpeg
    ffmpeg()
      .input("color=c=blue:s=640x480:d=5")
      .inputFormat("lavfi")
      .outputOptions([
        "-vf",
        `drawtext=text='Project ${projectId} - Rendered':fontsize=30:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2`,
        "-c:v",
        "libx264",
        "-t",
        "5",
        "-pix_fmt",
        "yuv420p",
      ])
      .save(outputPath)
      .on("end", () => {
        console.log(`Test video created: ${outputPath}`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      });
  });
}

async function renderWithFFmpeg(asset, jobId, projectId) {
  const outputPath = path.join(process.env.OUTPUT_DIR, `${jobId}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(asset.path)
      .outputOptions([
        "-vf",
        `drawtext=text='Playable Ad - Project ${projectId}':fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=50`,
        "-c:a",
        "copy",
      ])
      .save(outputPath)
      .on("end", () => {
        console.log(`Video rendered: ${outputPath}`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("FFmpeg rendering error:", err);
        reject(err);
      });
  });
}

renderWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

renderWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

module.exports = renderWorker;
