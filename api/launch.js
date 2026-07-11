// Vercel Serverless Function - Token Launch
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';

const NETWORK = 'devnet';
const RPC_URL = 'https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, symbol, supply, creatorAddress, imageBase64, description } = req.body;
    
    if (!name || !symbol || !supply || !creatorAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate mint keypair
    const mintKeypair = Keypair.generate();
    
    // Store launch data (use Redis/DB in production)
    const launchData = {
      mint: mintKeypair.publicKey.toString(),
      name,
      symbol,
      totalSupply: supply,
      sold: 0,
      virtualLiquidity: 2500,
      startingFDV: 5000,
      creator: creatorAddress,
      creatorFee: 0.01,
      platformFee: 0.01,
      graduated: false,
      createdAt: new Date().toISOString(),
      image: imageBase64 || null,
      description: description || ''
    };

    // Return success - actual mint creation happens when user signs tx
    res.status(200).json({
      success: true,
      mint: mintKeypair.publicKey.toString(),
      name,
      symbol,
      address: mintKeypair.publicKey.toString(),
      curve: launchData
    });

  } catch (error) {
    console.error('Launch error:', error);
    res.status(500).json({ error: error.message });
  }
}
