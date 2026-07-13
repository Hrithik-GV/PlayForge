import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Game from '../models/game.model.js';
import PublishedGame from '../models/publishedGame.model.js';
import { publishGame, getFeed } from '../controllers/publish.controller.js';

async function runTests() {
  console.log('Connecting to DB...');
  await connectDB();

  console.log('Cleaning up existing published games for clean run...');
  await PublishedGame.deleteMany({});

  // 1. Find a game to publish
  const game = await Game.findOne();
  if (!game) {
    console.error('No games found in the database. Please run seed-fallbacks.js or test_db.js first.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found game to publish: "${game.title}" (ID: ${game._id})`);

  // 2. Mock Express req and res for testing publishGame controller
  const mockReqPublish = {
    body: {
      gameId: game._id.toString()
    }
  };

  let publishedResponse = null;
  const mockResPublish = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      publishedResponse = data;
      return this;
    }
  };

  console.log('Testing publishGame controller...');
  await publishGame(mockReqPublish, mockResPublish, (err) => {
    if (err) console.error('Error in controller:', err);
  });

  console.log('Publish status code:', mockResPublish.statusCode);
  console.log('Publish response:', JSON.stringify(publishedResponse, null, 2));

  // 3. Mock publish directly (without gameId)
  const mockReqDirectPublish = {
    body: {
      title: 'Direct Published Game',
      prompt: 'A custom retro game published directly',
      gameCode: '<html><body>Direct game</body></html>',
      thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.png'
    }
  };

  let directPublishedResponse = null;
  const mockResDirectPublish = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      directPublishedResponse = data;
      return this;
    }
  };

  console.log('Testing direct publishGame controller...');
  await publishGame(mockReqDirectPublish, mockResDirectPublish, (err) => {
    if (err) console.error('Error in controller:', err);
  });

  console.log('Direct Publish status code:', mockResDirectPublish.statusCode);
  console.log('Direct Publish response:', JSON.stringify(directPublishedResponse, null, 2));

  // 4. Test getFeed controller
  let feedResponse = null;
  const mockResFeed = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      feedResponse = data;
      return this;
    }
  };

  console.log('Testing getFeed controller...');
  await getFeed({}, mockResFeed, (err) => {
    if (err) console.error('Error in controller:', err);
  });

  console.log('Feed status code:', mockResFeed.statusCode);
  console.log('Feed response contains', feedResponse.feed.length, 'games.');
  console.log('First game in feed:', JSON.stringify(feedResponse.feed[0], null, 2));

  // Verify fields on first game
  const firstGame = feedResponse.feed[0];
  const requiredFields = ['title', 'prompt', 'gameCode', 'thumbnail', 'createdAt'];
  const missing = requiredFields.filter(field => !firstGame[field]);
  if (missing.length === 0) {
    console.log('✅ ALL REQUIRED FIELDS PRESENT in feed games!');
  } else {
    console.error('❌ MISSING FIELDS:', missing);
  }

  await mongoose.disconnect();
  console.log('Disconnected from DB.');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  mongoose.disconnect();
});
