import sharp from "sharp";
import fs from "fs";
import path from "path";

// Supported image extensions
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

// Target directories
const TARGET_DIRS = ["public", "app"];

function getAllImages(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllImages(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function backupFiles(files) {
  const backupDir = path.resolve("public-backup");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const file of files) {
    const rel = path.relative(".", file);
    const dest = path.join(backupDir, rel);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    // Only copy if backup doesn't already exist to preserve pristine originals
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(file, dest);
    }
  }
  console.log(`[backup] Pristine originals preserved in ${backupDir}`);
}

async function compressImage(filePath) {
  const statBefore = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Read file into memory buffer to avoid Windows file-locking issues during write
  const inputBuffer = fs.readFileSync(filePath);
  const meta = await sharp(inputBuffer).metadata();

  let pipeline = sharp(inputBuffer);

  if (ext === ".png") {
    // Determine resize policy based on role & dimensions
    const baseName = path.basename(filePath).toLowerCase();

    if (baseName.includes("logo") || baseName.includes("icon") || baseName.includes("favicon")) {
      // Logos and icons: maintain exact pixels, optimize palette
      pipeline = pipeline.png({
        quality: 90,
        compressionLevel: 9,
        effort: 8,
        palette: true,
      });
    } else if (baseName.includes("hero")) {
      // Hero banners: max width 1920 to keep crystal clear
      pipeline = pipeline
        .resize({ width: 1920, height: 2560, fit: "inside", withoutEnlargement: true })
        .png({
          quality: 85,
          compressionLevel: 9,
          effort: 8,
          palette: true,
        });
    } else if (meta.width > 1400 || meta.height > 1400) {
      // Large category and banner photography (e.g. 1920x1920 or 2560x1440)
      pipeline = pipeline
        .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
        .png({
          quality: 85,
          compressionLevel: 9,
          effort: 8,
          palette: true,
        });
    } else {
      pipeline = pipeline.png({
        quality: 85,
        compressionLevel: 9,
        effort: 8,
        palette: true,
      });
    }
  } else if (ext === ".jpg" || ext === ".jpeg") {
    // JPEG product and category images
    if (meta.width > 1600 || meta.height > 1600) {
      pipeline = pipeline.resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    pipeline = pipeline.jpeg({
      quality: 82,
      mozjpeg: true,
      progressive: true,
    });
  } else if (ext === ".webp") {
    // WebP story images
    if (meta.width > 1600 || meta.height > 2000) {
      pipeline = pipeline.resize({
        width: 1600,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    pipeline = pipeline.webp({
      quality: 82,
      effort: 6,
    });
  }

  const compressedBuffer = await pipeline.toBuffer();

  // Only overwrite if we actually made it smaller
  if (compressedBuffer.length < statBefore.size) {
    fs.writeFileSync(filePath, compressedBuffer);
    return {
      file: filePath,
      before: statBefore.size,
      after: compressedBuffer.length,
      saved: statBefore.size - compressedBuffer.length,
      percent: ((1 - compressedBuffer.length / statBefore.size) * 100).toFixed(1),
      status: "COMPRESSED",
    };
  }

  return {
    file: filePath,
    before: statBefore.size,
    after: statBefore.size,
    saved: 0,
    percent: "0.0",
    status: "ALREADY OPTIMAL",
  };
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function run() {
  console.log("==================================================");
  console.log("       Sazaira Sharp Image Compression Tool       ");
  console.log("==================================================");

  let allFiles = [];
  for (const dir of TARGET_DIRS) {
    allFiles = allFiles.concat(getAllImages(dir));
  }

  // Deduplicate and filter out node_modules/.next
  allFiles = [...new Set(allFiles)].filter(
    (f) => !f.includes(".next") && !f.includes("node_modules")
  );

  console.log(`Found ${allFiles.length} target images to analyze & compress.\n`);

  backupFiles(allFiles);

  const results = [];
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of allFiles) {
    process.stdout.write(`Processing: ${path.relative(".", file)} ... `);
    try {
      const res = await compressImage(file);
      results.push(res);
      totalBefore += res.before;
      totalAfter += res.after;
      console.log(
        `${formatBytes(res.before)} -> ${formatBytes(res.after)} (${res.percent}% reduction) [${res.status}]`
      );
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  const totalSaved = totalBefore - totalAfter;
  const overallPercent = ((totalSaved / totalBefore) * 100).toFixed(1);

  console.log("\n==================================================");
  console.log("                 COMPRESSION SUMMARY              ");
  console.log("==================================================");
  console.log(`Total original size:   ${formatBytes(totalBefore)}`);
  console.log(`Total compressed size: ${formatBytes(totalAfter)}`);
  console.log(`Total storage saved:   ${formatBytes(totalSaved)} (${overallPercent}% reduction)`);
  console.log("==================================================\n");
}

run();
