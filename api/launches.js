// Vercel Serverless Function - Get User Launches
const launches = []; // In-memory, use DB in production

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { creator } = req.query;
  const userLaunches = launches.filter(l => l.creator === creator);
  res.status(200).json(userLaunches);
}
