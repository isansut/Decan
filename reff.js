const axios = require('axios');

// --- KONFIGURASI ---
let startFid = 2676380; // FID awal yang akan diproses
const JUMLAH_AKUN = 1000;  // Berapa banyak akun yang ingin diproses (FID+1, FID+2, dst)
const REFERRAL_ID = "1132996"; // ganti sama FID Farcaster lo
const BASE_URL = 'https://lhqecpvwncvhtlsvcfic.supabase.co/functions/v1';

const customHeaders = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocWVjcHZ3bmN2aHRsc3ZjZmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDY3MDUsImV4cCI6MjA4OTk4MjcwNX0.IDiiIY0ho2Y-34j5o9uSWQsmt4MkRR2hjCmxBS8XE9o',
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocWVjcHZ3bmN2aHRsc3ZjZmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDY3MDUsImV4cCI6MjA4OTk4MjcwNX0.IDiiIY0ho2Y-34j5o9uSWQsmt4MkRR2hjCmxBS8XE9o',
    'content-type': 'application/json',
    'origin': 'https://serduncan.vercel.app',
    'referer': 'https://serduncan.vercel.app/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    'x-client-info': 'supabase-js-web/2.100.0'
};

// Fungsi Generate Random Username (6 karakter random)
function generateRandomUsername() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let res = 'user_';
    for (let i = 0; i < 6; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
}

async function processAccount(fid) {
    const username = generateRandomUsername();
    
    // Payload untuk Init (dengan Ref)
    const initPayload = {
        fid: fid,
        username: username,
        displayName: `farcaster_${fid}`,
        pfpUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/a6062065-8cc7-4f76-2a4a-8cb954802300/original",
        walletAddress: null,
        ref: REFERRAL_ID
    };

    // Payload untuk Claim (tanpa Ref)
    const { ref, ...claimPayload } = initPayload;

    try {
        console.log(`\n--- 🚀 PROCESSING FID: ${fid} ---`);

        // 1. MINIAAPP INIT
        console.log(`[1] Init MiniApp sebagai @${username}...`);
        const initRes = await axios.post(`${BASE_URL}/miniapp-init`, initPayload, { headers: customHeaders });
        console.log(`✅ Init Sukses.`);

        // 2. SNAPSHOT CLAIM
        console.log(`[2] Menjalankan Snapshot Claim...`);
        const claimRes = await axios.post(`${BASE_URL}/snapshot-claim`, claimPayload, { headers: customHeaders });
        console.log(`✅ Claim Sukses.`);

    } catch (error) {
        console.error(`❌ Gagal di FID ${fid}:`, error.response?.data || error.message);
    }
}

async function startBatch() {
    for (let i = 0; i < JUMLAH_AKUN; i++) {
        const targetFid = startFid + i;
        await processAccount(targetFid);
        
        // Jeda 2 detik antar akun agar tidak terdeteksi spam berlebihan
        if (i < JUMLAH_AKUN - 1) {
            console.log(`Menunggu 2 detik untuk akun berikutnya...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    console.log('\n--- ✨ SEMUA AKUN SELESAI DIPROSES ---');
}

startBatch();
