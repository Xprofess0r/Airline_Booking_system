/**
 * startup.js — Railway production boot sequence
 * Connects to DB, runs migrations, seeds if needed, starts server.
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const { execSync }  = require('child_process');
const path          = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── wait for DB to be actually reachable before migrating ──
async function waitForDB(maxRetries = 10, delayMs = 3000) {
  const cfg = require('./config/config.js').production;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const seq = new Sequelize(cfg.database, cfg.username, cfg.password, {
        host:           cfg.host,
        port:           cfg.port,
        dialect:        'mysql',
        dialectOptions: cfg.dialectOptions,
        logging:        false
      });
      await seq.authenticate();
      await seq.close();
      console.log('✔ Database is reachable');
      return true;
    } catch (err) {
      console.log(`⏳ DB not ready (attempt ${i}/${maxRetries}): ${err.message}`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('✖ Could not connect to database after maximum retries');
}

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
}

async function boot() {
  try {
    // 1. Wait for DB
    await waitForDB();

    // 2. Run migrations
    run('npx sequelize-cli db:migrate');

    // 3. Seed only if Airplanes table is empty
    try {
      const db = require('./models/index');
      const [[{ count }]] = await db.sequelize.query('SELECT COUNT(*) as count FROM Airplanes');
      if (Number(count) === 0) {
        console.log('\n▶ Seeding initial data...');
        run('npx sequelize-cli db:seed:all');
      } else {
        console.log('\n▶ Skipping seeds — data already exists');
      }
      // NOTE: do NOT close db.sequelize here — the app reuses this connection
    } catch (seedErr) {
      console.log('\n⚠ Seed check failed, skipping seeds:', seedErr.message);
    }

    // 4. Start Express server
    console.log('\n▶ Starting server...');
    require('./index');

  } catch (err) {
    console.error('\n✖ Boot failed:', err.message);
    process.exit(1);
  }
}

boot();