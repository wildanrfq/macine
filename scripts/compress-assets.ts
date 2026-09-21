import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

interface CompressStats {
  filePath: string;
  originalBytes: number;
  compressedBytes: number;
  savedPercent: number;
  status: "compressed" | "skipped" | "error";
}

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_WIDTH = 720;
const MAX_HEIGHT = 1080;
const MIN_SAVED_BYTES = 2048;
const MIN_SAVED_PERCENT = 5;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function collectImageFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectImageFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function compressImage(filePath: string): Promise<CompressStats> {
  const stat = await fs.stat(filePath);
  const originalBytes = stat.size;
  const ext = path.extname(filePath).toLowerCase();

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = sharp(filePath).rotate();

    if (
      metadata.width &&
      metadata.height &&
      (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT)
    ) {
      pipeline = pipeline.resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({
        quality: 82,
        progressive: true,
        mozjpeg: true,
      });
    } else if (ext === ".png") {
      pipeline = pipeline.png({
        compressionLevel: 9,
        palette: true,
        quality: 85,
      });
    } else if (ext === ".webp") {
      pipeline = pipeline.webp({
        quality: 82,
        effort: 6,
      });
    }

    const compressedBuffer = await pipeline.toBuffer();
    const compressedBytes = compressedBuffer.length;
    const diff = originalBytes - compressedBytes;
    const savedPercent = originalBytes > 0 ? (diff / originalBytes) * 100 : 0;

    if (diff >= MIN_SAVED_BYTES && savedPercent >= MIN_SAVED_PERCENT) {
      await fs.writeFile(filePath, compressedBuffer);
      return {
        filePath,
        originalBytes,
        compressedBytes,
        savedPercent,
        status: "compressed",
      };
    }

    return {
      filePath,
      originalBytes,
      compressedBytes: originalBytes,
      savedPercent: 0,
      status: "skipped",
    };
  } catch (error) {
    console.error(`Failed to compress ${filePath}:`, error);
    return {
      filePath,
      originalBytes,
      compressedBytes: originalBytes,
      savedPercent: 0,
      status: "error",
    };
  }
}

async function main() {
  const publicDir = path.resolve(process.cwd(), "public");

  try {
    await fs.access(publicDir);
  } catch {
    console.log("public directory not found, skipping asset compression.");
    return;
  }

  console.log("[macine] Scanning public directory for assets...");
  const imageFiles = await collectImageFiles(publicDir);

  if (imageFiles.length === 0) {
    console.log("[macine] No image assets found.");
    return;
  }

  console.log(`[macine] Found ${imageFiles.length} image asset(s). Starting compression...\n`);

  const results: CompressStats[] = [];
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of imageFiles) {
    const result = await compressImage(file);
    results.push(result);
    totalOriginal += result.originalBytes;
    totalCompressed += result.compressedBytes;

    const relPath = path.relative(process.cwd(), result.filePath);
    if (result.status === "compressed") {
      console.log(
        `[OK] ${relPath}: ${formatBytes(result.originalBytes)} -> ${formatBytes(result.compressedBytes)} (-${result.savedPercent.toFixed(1)}%)`
      );
    } else if (result.status === "skipped") {
      console.log(`[SKIP] ${relPath}: already optimal (${formatBytes(result.originalBytes)})`);
    } else {
      console.log(`[ERR] ${relPath}: failed to process`);
    }
  }

  const totalSaved = totalOriginal - totalCompressed;
  const totalSavedPercent = totalOriginal > 0 ? (totalSaved / totalOriginal) * 100 : 0;

  console.log("\n------------------------------------------------------------");
  console.log(
    `[macine] Total: ${formatBytes(totalOriginal)} -> ${formatBytes(totalCompressed)} (Saved ${formatBytes(totalSaved)}, -${totalSavedPercent.toFixed(1)}%)`
  );
  console.log("------------------------------------------------------------\n");
}

main().catch((err) => {
  console.error("[macine] Asset compression encountered an unhandled error:", err);
  process.exit(1);
});
