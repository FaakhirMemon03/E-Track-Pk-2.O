const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Store = require('./models/Store');
const StoreCustomer = require('./models/StoreCustomer');

dotenv.config();

const dummyNames = ["Ahmed Ali", "Zainab Khan", "Bilal Sheikh", "Sana Fatima", "Umer Farooq", "Hina Malik", "Mustafa Kamal", "Ayesha Siddiqui", "Hamza Junaid", "Maria B"];
const dummyCities = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta"];
const dummyNotes = ["Loyal customer", "Ordered multiple times", "Always pays on time", "Good buyer", "Frequent shopper"];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const store = await Store.findOne();
    if (!store) {
      console.log('No store found in database. Please register a store first.');
      process.exit();
    }

    console.log(`Seeding 50 customers for store: ${store.name} (${store._id})`);

    const customers = [];
    for (let i = 1; i <= 50; i++) {
      const name = dummyNames[Math.floor(Math.random() * dummyNames.length)] + " " + i;
      const phone = "03" + Math.floor(100000000 + Math.random() * 900000000);
      const email = `user${i}@example.com`;
      const address = `${Math.floor(Math.random() * 100)} Street, ${dummyCities[Math.floor(Math.random() * dummyCities.length)]}`;
      const notes = dummyNotes[Math.floor(Math.random() * dummyNotes.length)];
      const category = ['Regular', 'Loyal', 'Problematic'][Math.floor(Math.random() * 3)];

      customers.push({
        name,
        phone,
        email,
        address,
        notes,
        category,
        storeId: store._id,
        totalOrders: Math.floor(Math.random() * 10) + 1
      });
    }

    await StoreCustomer.insertMany(customers);
    console.log('Successfully seeded 50 dummy customers!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
