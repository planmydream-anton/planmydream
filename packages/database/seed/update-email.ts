import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

async function updateEmail() {
  const sql = postgres(DATABASE_URL);
  const result = await sql`UPDATE users SET email = 'info@planmydream.ru' WHERE email = 'admin@planmydream.ru' RETURNING id, email, role`;
  console.log('✅ Email обновлён:', result[0].email);
  await sql.end();
}

updateEmail().catch(console.error);
