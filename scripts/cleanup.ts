import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';
import logger from '../lib/logger';

const DOWNLOADS_DIR = join(process.cwd(), 'public', 'downloads');
const MAX_AGE = 3600000; // 1 hour in milliseconds

async function cleanup() {
  try {
    const files = await readdir(DOWNLOADS_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = join(DOWNLOADS_DIR, file);
      const fileStat = await stat(filePath);

      if (now - fileStat.mtimeMs > MAX_AGE) {
        await unlink(filePath);
        logger.info(`Cleaned up file: ${file}`);
      }
    }
  } catch (error) {
    logger.error('Cleanup error:', error);
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanup();
}

export default cleanup;