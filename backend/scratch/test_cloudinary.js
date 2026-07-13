import { uploadThumbnail } from '../services/cloudinary.service.js';

const mockSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <rect width="100%" height="100%" fill="#1a1a1a"/>
  <circle cx="200" cy="125" r="50" fill="#ff8a3d"/>
  <text x="200" y="130" font-family="sans-serif" font-size="20" fill="white" text-anchor="middle">Test</text>
</svg>
`;

async function test() {
  console.log('Testing Cloudinary service with mock SVG...');
  try {
    const url = await uploadThumbnail(mockSvg, 'Test Game');
    console.log('Resulting URL:', url);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
