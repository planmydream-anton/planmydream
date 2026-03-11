import postgres from 'postgres';
import { hashSync } from 'bcrypt';

const DATABASE_URL = process.env.DATABASE_URL!;

async function createAdmin() {
  const sql = postgres(DATABASE_URL);

  const email = 'admin@planmydream.ru';
  const password = 'Asterix2087planmydreamadmin';

  console.log(`Creating admin user: ${email}...`);

  const passwordHash = hashSync(password, 10);

  const result = await sql`
    INSERT INTO users (id, email, password_hash, name, role, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), ${email}, ${passwordHash}, 'Admin', 'admin', true, now(), now())
    RETURNING id, email, role
  `;

  console.log('✅ Admin user created!');
  console.log(`   ID: ${result[0].id}`);
  console.log(`   Email: ${result[0].email}`);
  console.log(`   Role: ${result[0].role}`);

  await sql.end();
}

createAdmin().catch(console.error);
