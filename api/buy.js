// Vercel Serverless Function - Buy Token
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mintAddress, buyerAddress, solAmount } = req.body;
    
    // Bonding curve math
    const basePrice = 0.000001;
    const totalSupply = 1000000000; // Would fetch from DB in production
    const sold = Math.floor(Math.random() * 500000); // Would fetch from DB
    const remaining = totalSupply - sold;
    const ratio = remaining / totalSupply;
    const price = basePrice / (ratio * ratio);
    const tokensReceived = Math.floor(solAmount / price);
    
    const mcap = totalSupply * price;
    const graduated = mcap >= 100000;

    res.status(200).json({
      success: true,
      tokensReceived,
      price,
      marketCap: mcap,
      graduated,
      platformFee: solAmount * 0.01,
      creatorFee: solAmount * 0.01,
      tx: 'simulated-tx-' + Date.now()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
