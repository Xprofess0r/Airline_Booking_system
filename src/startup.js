/**
 * startup.js — Production entry point for Railway
 * 
 * Runs migrations, seeds (only if tables are empty),
 * then starts the Express server.
 * 
 * This avoids the shell chaining issues with:
 * "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && node src/index.js"
 */

const { execSync } = require('child_process');
const path = require('path');

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  } catch (err) {
    console.error(`✖ Command failed: ${cmd}`);
    process.exit(1);
  }
}

// Step 1: Run migrations
run('npx sequelize-cli db:migrate');

// Step 2: Seed only if Airports table is empty (avoid duplicate seed errors)
try {
  const db = require('./models/index');
  db.sequelize.query('SELECT COUNT(*) as count FROM Airports').then(([results]) => {
    const count = results[0].count;
    if (count === 0) {
      run('npx sequelize-cli db:seed:all');
    } else {
      console.log('▶ Skipping seeds — data already exists');
    }
    // Step 3: Start server
    require('./index');
  }).catch(() => {
    // Table might not exist yet after first migration — seed and start anyway
    run('npx sequelize-cli db:seed:all');
    require('./index');
  });
} catch (e) {
  require('./index');
}
