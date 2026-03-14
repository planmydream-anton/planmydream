import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

async function main() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL required');
  const sql = postgres(DATABASE_URL);

  // 1. Get tour ID
  const [tour] = await sql`SELECT id FROM tours WHERE slug = 'china-may' LIMIT 1`;
  if (!tour) { console.error('❌ Tour not found'); process.exit(1); }
  console.log(`🎯 Tour ID: ${tour.id}`);

  // 2. Get all uploaded media
  const allMedia = await sql`SELECT id, filename, url, size_bytes FROM media ORDER BY created_at`;
  console.log(`📸 Found ${allMedia.length} media files\n`);

  // 3. Filter out duplicates and small icons - keep best quality version of each unique image
  const bestMedia = new Map<string, typeof allMedia[0]>();
  for (const m of allMedia) {
    // Use base filename (without extension variants) as key
    const baseName = m.filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
    const existing = bestMedia.get(baseName);
    if (!existing || m.size_bytes > existing.size_bytes) {
      bestMedia.set(baseName, m);
    }
  }

  // Filter out very small files (< 10KB - icons, logos, favicons)
  const goodMedia = [...bestMedia.values()]
    .filter(m => m.size_bytes > 10000)
    .filter(m => !m.filename.toLowerCase().includes('fav'))
    .filter(m => !m.filename.toLowerCase().includes('logo'));

  console.log(`✨ ${goodMedia.length} quality images after dedup\n`);

  // 4. Choose cover image - use a large, scenic photo
  // Prioritize images with recognizable names
  const coverCandidates = [
    'Tianmen-Mountain', 'night-city-view', 'DSC_4610', 'DSC_4367',
    'house-traditional', 'scenery-boat', 'sky_gates', '2944',
  ];

  let coverMedia = null;
  for (const candidate of coverCandidates) {
    coverMedia = goodMedia.find(m => m.filename.toLowerCase().includes(candidate.toLowerCase()));
    if (coverMedia) break;
  }
  if (!coverMedia) coverMedia = goodMedia[0]; // Fallback to first

  console.log(`🖼️  Cover image: ${coverMedia.filename}`);

  // 5. Clear existing tour_media links
  await sql`DELETE FROM tour_media WHERE tour_id = ${tour.id}`;
  console.log('🧹 Cleared existing tour_media links\n');

  // 6. Insert cover image
  await sql`
    INSERT INTO tour_media (id, tour_id, media_id, position, is_cover, created_at)
    VALUES (gen_random_uuid(), ${tour.id}, ${coverMedia.id}, 0, true, now())
  `;
  console.log(`✅ Cover: ${coverMedia.filename}`);

  // 7. Insert gallery images (all others)
  let position = 1;
  for (const m of goodMedia) {
    if (m.id === coverMedia.id) continue; // Skip cover
    await sql`
      INSERT INTO tour_media (id, tour_id, media_id, position, is_cover, created_at)
      VALUES (gen_random_uuid(), ${tour.id}, ${m.id}, ${position}, false, now())
    `;
    console.log(`  [${position}] ${m.filename} (${(m.size_bytes / 1024).toFixed(0)} KB)`);
    position++;
  }

  console.log(`\n🎉 Done! Cover + ${position - 1} gallery images linked to tour`);
  await sql.end();
}

main().catch(console.error);
