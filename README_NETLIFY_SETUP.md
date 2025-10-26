# TaxPal - Netlify Deployment Guide

## Quick Setup for Netlify

### Required Environment Variable

Your site needs the Gemini API key to function. Set it up in Netlify:

#### Steps:

1. **Go to your Netlify site**: https://app.netlify.com
2. Click on your TaxPal site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Enter:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyCUQzoy_yi9UGr7daQr6yBVNWNxzuXvyfI`
6. Click **"Save"**
7. Go to the **Deploys** tab
8. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Alternative: Using Terminal (if you have Netlify CLI)

```bash
# First, link your site to Netlify
netlify link

# Set the environment variable
netlify env:set GEMINI_API_KEY AIzaSyCUQzoy_yi9UGr7daQr6yBVNWNxzuXvyfI

# Deploy
netlify deploy --prod
```

### Troubleshooting

**Error: "API key not configured"**
- Make sure you added the environment variable in Netlify
- Make sure you redeployed after adding the variable
- Check that the variable name is exactly `GEMINI_API_KEY` (case-sensitive)

**Error: "404 Not Found"**
- Make sure the Netlify functions are in the `netlify/functions` folder
- Check that `netlify.toml` is in the root directory

## File Structure

```
TaxPal/
├── index.html
├── App.js
├── netlify.toml
├── netlify/
│   └── functions/
│       ├── getTaxPlan.js
│       └── getChatReply.js
└── README.md
```

## Deployment

1. Push to GitHub
2. Netlify automatically deploys from GitHub
3. Make sure environment variables are set
4. Done! ✅
