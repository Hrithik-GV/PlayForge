import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { generateGame } from '../services/game.service.js';

async function test() {
  console.log('Connecting to DB...');
  await connectDB();

  const testPrompt = `A retro styled balloon popping game - ${Date.now()}`;
  console.log(`Testing generateGame (Fresh Cache Miss) with prompt: "${testPrompt}"...`);
  
  const result1 = await generateGame(testPrompt);
  console.log('Result 1 Cache Hit:', result1.cacheHit);
  console.log('Game Title:', result1.game.title);
  console.log('Description:', result1.game.description);
  console.log('Thumbnail URL:', result1.game.thumbnail);
  console.log('HTML size:', result1.game.html?.length);

  console.log('\nTesting generateGame (Cache Hit)...');
  const result2 = await generateGame(testPrompt);
  console.log('Result 2 Cache Hit:', result2.cacheHit);
  console.log('Game Title:', result2.game.title);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

test().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
