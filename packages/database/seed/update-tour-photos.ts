import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

async function main() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL required');
  const sql = postgres(DATABASE_URL);

  console.log('📸 Updating tour china-may with photos for days, highlights and accommodation...\n');

  // 1. Get tour
  const [tour] = await sql`SELECT id, program, highlights FROM tours WHERE slug = 'china-may' LIMIT 1`;
  if (!tour) {
    console.error('❌ Tour china-may not found!');
    process.exit(1);
  }

  // 2. Get all media URLs for this tour (from gallery)
  const mediaItems = await sql`
    SELECT m.url, m.filename, m.original_filename
    FROM tour_media tm
    JOIN media m ON tm.media_id = m.id
    WHERE tm.tour_id = ${tour.id}
    ORDER BY tm.position ASC
  `;

  console.log(`Found ${mediaItems.length} media items for tour\n`);

  // List all filenames to understand what we have
  for (const m of mediaItems) {
    console.log(`  ${m.filename}: ${m.url.substring(0, 80)}...`);
  }

  // 3. Distribute photos to days
  // We'll take gallery photos and spread them across program days (3-5 per day)
  const gallery = mediaItems.map((m: any) => m.url);

  // Distribute evenly across 11 days, 3-5 each
  const program = tour.program as any[];
  const photosPerDay = Math.max(3, Math.floor(gallery.length / program.length));

  let photoIndex = 0;
  const updatedProgram = program.map((day: any, dayIndex: number) => {
    const count = Math.min(photosPerDay, 5); // max 5 per day
    const dayImages: string[] = [];

    for (let i = 0; i < count && photoIndex < gallery.length; i++) {
      dayImages.push(gallery[photoIndex]);
      photoIndex++;
    }

    console.log(`\nDay ${day.day}: ${day.title} → ${dayImages.length} photos`);

    return {
      ...day,
      images: dayImages
    };
  });

  // 4. Update highlights with photos from gallery
  const highlights = tour.highlights as any[];
  // Take remaining photos for highlights, or cycle back
  let hlPhotoIndex = 0;
  const updatedHighlights = highlights.map((hl: any, index: number) => {
    const imgUrl = gallery[hlPhotoIndex % gallery.length] || '';
    hlPhotoIndex += Math.floor(gallery.length / highlights.length);

    console.log(`\nHighlight: ${hl.title} → ${imgUrl.substring(0, 60)}...`);

    return {
      ...hl,
      imageUrl: imgUrl
    };
  });

  // 5. Create accommodation data
  // Pick some nice hotel-looking photos from the gallery
  const accommPhotos = gallery.slice(0, 4);
  const accommodations = [
    {
      name: 'Отели 4* по всему маршруту',
      description: 'На протяжении всего путешествия мы размещаемся в комфортабельных отелях с высоким гостевым рейтингом (от 8,8 на Booking/Trip.com). Все отели расположены в удобных локациях рядом с основными достопримечательностями. Двухместное размещение, чистые просторные номера, завтраки включены. В Шанхае — отель в самом сердце города с видом на небоскребы Пудуна. В Чжанцзяцзе — уютный отель у подножия гор. В Фуронге — гостевой дом с видом на водопад. В Чэнду — современный отель в центре города.',
      images: accommPhotos,
      videoUrl: ''
    }
  ];

  // 6. Update tour in database
  console.log('\n\n💾 Updating tour in database...');

  await sql`
    UPDATE tours
    SET
      program = ${JSON.stringify(updatedProgram)}::jsonb,
      highlights = ${JSON.stringify(updatedHighlights)}::jsonb,
      accommodations = ${JSON.stringify(accommodations)}::jsonb,
      comfort_level = 'comfort',
      min_age = 6,
      updated_at = now()
    WHERE slug = 'china-may'
  `;

  console.log('✅ Tour updated successfully!');
  console.log(`   📸 ${updatedProgram.reduce((sum: number, d: any) => sum + (d.images?.length || 0), 0)} photos across ${updatedProgram.length} days`);
  console.log(`   🏞️ ${updatedHighlights.filter((h: any) => h.imageUrl).length} highlight images`);
  console.log(`   🏨 ${accommodations.length} accommodation with ${accommPhotos.length} photos`);

  await sql.end();
}

main().catch(console.error);
