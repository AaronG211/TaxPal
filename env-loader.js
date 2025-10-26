// Environment loader script
// This reads from a .env file and exposes variables to window

async function loadEnv() {
  try {
    const response = await fetch('.env');
    const text = await response.text();
    
    // Parse the .env file
    const lines = text.split('\n');
    const env = {};
    
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        env[key.trim()] = value.replace(/^["']|["']$/g, ''); // Remove quotes if present
      }
    });
    
    // Make API_KEY available globally
    window.API_KEY = env.API_KEY || "";
    
    console.log('Environment variables loaded');
  } catch (error) {
    console.warn('Could not load .env file:', error);
    window.API_KEY = "";
  }
}

// Load environment before anything else runs
loadEnv();
