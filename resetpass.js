const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/carrental').then(async () => {
  const hash = await bcrypt.hash('admin1234', 12);
  await mongoose.connection.collection('users').updateOne(
    { email: 'admin@carrental.com' },
    { $set: { password: hash } }
  );
  console.log('✅ Password updated successfully!');
  process.exit();
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit();
});