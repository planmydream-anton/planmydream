import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN!;

async function uploadToBlob(filename: string, data: Buffer, contentType: string): Promise<string> {
  const response = await fetch(`https://blob.vercel-storage.com/media/${Date.now()}-${filename}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${BLOB_TOKEN}`,
      'x-content-type': contentType,
      'x-api-version': '7',
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`Blob upload failed: ${response.status} ${await response.text()}`);
  }

  const result = await response.json() as { url: string };
  return result.url;
}

async function downloadImage(url: string): Promise<{ data: Buffer; contentType: string } | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    return { data: Buffer.from(arrayBuffer), contentType };
  } catch (e) {
    console.error(`  ❌ Failed to download: ${url}`);
    return null;
  }
}

async function main() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL required');
  if (!BLOB_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN required');

  const sql = postgres(DATABASE_URL);

  // 1. Fetch the page and extract image URLs
  console.log('🔍 Fetching planmydream.ru/china-may...');
  const pageResponse = await fetch('https://planmydream.ru/china-may');
  const html = await pageResponse.text();

  // Extract all tildacdn image URLs
  const urlPattern = /https:\/\/static\.tildacdn\.one\/[^"'\s>]+\.(jpg|jpeg|png|webp)/g;
  const allUrls = [...new Set(html.match(urlPattern) || [])];

  // Filter out very small images (icons, tracking pixels)
  // Tilda uses /-/resize/WxH/ pattern - skip resized versions, keep originals
  const originalUrls = allUrls.filter(url => {
    // Skip SVGs (already filtered by regex)
    // Skip very small resize versions
    if (url.includes('/-/resize/20x/')) return false;
    if (url.includes('/-/resize/40x/')) return false;
    if (url.includes('/-/resize/60x/')) return false;
    // Keep originals and larger versions
    return true;
  });

  // Deduplicate by base filename (remove resize parameters)
  const seen = new Set<string>();
  const uniqueUrls: string[] = [];
  for (const url of originalUrls) {
    // Extract base path without resize params
    const basePath = url.replace(/\/-\/resize\/\d+x\d*\//, '/-/');
    if (!seen.has(basePath)) {
      seen.add(basePath);
      uniqueUrls.push(url);
    }
  }

  console.log(`📸 Found ${allUrls.length} total URLs, ${uniqueUrls.length} unique images\n`);

  // 2. Get the tour ID
  const [tour] = await sql`SELECT id FROM tours WHERE slug = 'china-may' LIMIT 1`;
  if (!tour) {
    console.error('❌ Tour china-may not found!');
    process.exit(1);
  }
  console.log(`🎯 Tour ID: ${tour.id}\n`);

  // 3. Get admin user for created_by
  const [admin] = await sql`SELECT id FROM users LIMIT 1`;

  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const filename = url.split('/').pop() || `image-${i}.jpg`;

    console.log(`[${i + 1}/${uniqueUrls.length}] Downloading ${filename}...`);

    // Download
    const image = await downloadImage(url);
    if (!image) {
      failed++;
      continue;
    }

    // Skip tiny files (< 5KB - likely icons)
    if (image.data.length < 5000) {
      console.log(`  ⏭️  Skipped (too small: ${image.data.length} bytes)`);
      continue;
    }

    // Upload to Vercel Blob
    try {
      console.log(`  ☁️  Uploading to Blob (${(image.data.length / 1024).toFixed(0)} KB)...`);
      const blobUrl = await uploadToBlob(filename, image.data, image.contentType);

      // Save to media table
      const isImage = image.contentType.startsWith('image/');
      const ext = filename.split('.').pop()?.toLowerCase() || '';
      const mimeType = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';

      await sql`
        INSERT INTO media (id, filename, original_filename, url, type, mime_type, size_bytes, created_by, created_at)
        VALUES (
          gen_random_uuid(),
          ${filename},
          ${filename},
          ${blobUrl},
          'image',
          ${mimeType},
          ${image.data.length},
          ${admin?.id || null},
          now()
        )
      `;

      console.log(`  ✅ Done: ${blobUrl.substring(0, 60)}...`);
      uploaded++;
    } catch (e: any) {
      console.error(`  ❌ Upload failed: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n🎉 Upload complete!`);
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total in media library: ${uploaded} files`);

  await sql.end();
}

main().catch(console.error);
