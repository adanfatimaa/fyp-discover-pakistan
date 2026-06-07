const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://test:saif123@cluster0.zdfyv1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB Connected');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });