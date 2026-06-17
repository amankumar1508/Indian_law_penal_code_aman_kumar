const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Law = require('../models/Law');

// Load environment variables from parent backend root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing laws collection
    console.log('Clearing existing law database collections... 🧹');
    await Law.deleteMany();

    const datasetDir = path.join(__dirname, '../../dataset');
    const files = [
      { name: 'ipc.json', act: 'IPC', category: 'Criminal' },
      { name: 'crpc.json', act: 'CrPC', category: 'Criminal' },
      { name: 'cpc.json', act: 'CPC', category: 'Civil' },
      { name: 'hma.json', act: 'HMA', category: 'Family' },
      { name: 'ida.json', act: 'IDA', category: 'Family' },
      { name: 'iea.json', act: 'IEA', category: 'Evidence' },
      { name: 'nia.json', act: 'NIA', category: 'Financial' },
      { name: 'MVA.json', act: 'MVA', category: 'Traffic' }
    ];

    let totalLaws = [];

    for (const file of files) {
      const filePath = path.join(datasetDir, file.name);
      if (!fs.existsSync(filePath)) {
        console.log(`Warning: Dataset file ${file.name} not found at ${filePath}. Skipping.`);
        continue;
      }

      console.log(`Reading and parsing ${file.name}... 📄`);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const lawsArray = JSON.parse(rawData);

      const mapped = lawsArray.map((item, idx) => {
        // Enforce strong defaults for seeding
        const bailableValue = file.category === 'Criminal' ? (idx % 2 === 0) : true;
        const cognizableValue = file.category === 'Criminal' ? (idx % 3 === 0) : false;
        
        return {
          act: file.act,
          category: file.category,
          chapter: item.chapter || 1,
          chapter_title: item.chapter_title || item.Chapter_title || 'General',
          section: String(item.Section || item.section || idx + 1),
          section_title: item.section_title || item.Section_title || item.title || 'Legal Provision',
          section_desc: item.section_desc || item.section_desc || item.description || 'Details of this legal clause or penal code section.',
          bailable: bailableValue,
          cognizable: cognizableValue,
          views: Math.floor(Math.random() * 500) + 10 // randomized views for analytics tests
        };
      });

      totalLaws = totalLaws.concat(mapped);
      console.log(`Mapped ${mapped.length} records for ${file.act}.`);
    }

    console.log(`Importing ${totalLaws.length} total law records to MongoDB... 🚀`);
    const docs = await Law.insertMany(totalLaws);
    console.log(`Successfully seeded ${docs.length} legal provisions into MongoDB! 🎉`);

    mongoose.connection.close();
    console.log('Database connection closed safely. Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed: ❌', error);
    process.exit(1);
  }
};

// Check if run directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
