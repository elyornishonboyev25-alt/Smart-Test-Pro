const { db, admin } = require('../firebaseService');

async function seed() {
  console.log('Seeding sample reading test...');
  // Create a sample reading test
  const test = {
    title: 'Sample IELTS Reading - Practice Passage',
    description: 'Practice passage with multiple question types (synthetic sample).',
    duration: 60, // minutes
    sections: [
      {
        id: 'sec-1',
        title: 'Passage 1',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice-single',
            text: 'What is the main idea of paragraph 1?',
            options: ['A: Option one', 'B: Option two', 'C: Option three', 'D: Option four'],
            correctAnswer: 'A'
          },
          {
            id: 'q2',
            type: 'true-false-not-given',
            text: 'Statement about passage content',
            options: ['True','False','Not Given'],
            correctAnswer: 'Not Given'
          }
        ],
        passage: 'This is a synthetic sample passage for demo purposes. Replace with real content you have rights to.'
      }
    ],
    createdAt: Date.now()
  };

  const ref = await db.collection('tests').add(test);
  console.log('Seeded test with id:', ref.id);

  // Optionally create an admin user if ADMIN_UID is set
  const adminUid = process.env.ADMIN_UID;
  if (adminUid) {
    console.log('Ensuring admin claims for', adminUid);
    await admin.auth().setCustomUserClaims(adminUid, { admin: true });
    console.log('Admin claim set');
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });