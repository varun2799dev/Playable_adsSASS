// Simple in-memory "queue" replacement for Redis + BullMQ

const Job = require("../models/Job");
const Asset = require("../models/Asset");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs").promises;

async function processRenderJob(jobId, projectId, inputData) {
  try {
    await Job.updateStatus(jobId, "processing");
    console.log(`Starting render job ${jobId} for project ${projectId}`);

    const assets = await Asset.findByProjectId(projectId);

    if (assets.length === 0) {
      throw new Error("No assets found for this project");
    }

    const videoAsset = assets.find(
      (a) => a.mimetype?.includes("video") || a.mimetype?.includes("image")
    );

    const outputPath = path.join(process.env.OUTPUT_DIR, `${jobId}.mp4`);
    await fs.mkdir(process.env.OUTPUT_DIR, { recursive: true });

    if (videoAsset) {
      await new Promise((resolve, reject) => {
        ffmpeg(videoAsset.path)
          .outputOptions([
            "-vf",
            `drawtext=text='Playable Ad - Project ${projectId}':fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5`,
            "-c:a",
            "copy",
          ])
          .save(outputPath)
          .on("end", resolve)
          .on("error", reject);
      });
    } else {
      // Create a dummy 5s video if no valid asset
      await new Promise((resolve, reject) => {
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
          .on("end", resolve)
          .on("error", reject);
      });
    }

    await Job.updateStatus(jobId, "done", outputPath);
    console.log(`Render job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`Render job ${jobId} failed:`, error);
    await Job.updateStatus(jobId, "failed", null, error.message);
  }
}

module.exports = { processRenderJob };
