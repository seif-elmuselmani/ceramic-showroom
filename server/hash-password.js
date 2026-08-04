const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log("Usage: node hash-password.js <password>");
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    process.exit(1);
  }
  console.log("\n==================================================");
  console.log(`Password: ${password}`);
  console.log(`Bcrypt Hash: ${hash}`);
  console.log("==================================================");
  console.log("Copy the Bcrypt Hash above and set it as ADMIN_PASS_HASH in your .env file.\n");
});
