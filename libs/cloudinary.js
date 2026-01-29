// libs/cloudinary.js - SAFE VERSION (no hardcoded secrets)
import { v2 as cloudinary } from "cloudinary";

// Function to configure Cloudinary from environment variables
function configureCloudinary() {
  console.log("🔧 Configuring Cloudinary...");
  
  // Try CLOUDINARY_URL first (recommended by Cloudinary)
  if (process.env.CLOUDINARY_URL) {
    console.log("✅ Using CLOUDINARY_URL from environment");
    cloudinary.config();
    return;
  }
  
  // Fallback to individual variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 
                   process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || 
                 process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    console.log("✅ Using individual Cloudinary environment variables");
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  } else {
    console.error("❌ ERROR: Cloudinary environment variables not found!");
    console.error("Please set one of these in your environment:");
    console.error("1. CLOUDINARY_URL");
    console.error("2. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET");
    throw new Error("Cloudinary configuration missing");
  }
}

// Configure Cloudinary
configureCloudinary();

// Log configuration status (hide sensitive info)
const config = cloudinary.config();
console.log(`🌤️ Cloudinary configured for cloud: ${config.cloud_name || 'NOT CONFIGURED'}`);
console.log(`🔑 API Key: ${config.api_key ? '✓ SET' : '✗ MISSING'}`);
console.log(`🔒 API Secret: ${config.api_secret ? '✓ SET' : '✗ MISSING'}`);

export default cloudinary;