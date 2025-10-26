# How to Set Up Your Netlify Environment Variable

The error "API key not configured" means you need to add your Gemini API key to Netlify's environment variables.

## Step-by-Step Instructions:

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Sign in to your account

2. **Navigate to Your Site**
   - Click on your site (TaxPal)

3. **Open Site Settings**
   - Click on "Site settings" in the top menu
   - Then click on "Environment variables" in the left sidebar

4. **Add the Environment Variable**
   - Click "Add a variable" button
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyCUQzoy_yi9UGr7daQr6yBVNWNxzuXvyfI`
   - Click "Save"

5. **Redeploy Your Site**
   - Go to "Deploys" tab
   - Click "Trigger deploy" button
   - Select "Clear cache and deploy site"

6. **Wait for Deployment**
   - Wait for the deployment to complete (usually 1-2 minutes)

7. **Test Your Site**
   - Once deployed, visit your site and try creating a tax plan
   - The error should be gone!

## Alternative: Use Netlify CLI

If you have the Netlify CLI installed, you can also set it via command line:

```bash
netlify env:set GEMINI_API_KEY AIzaSyCUQzoy_yi9UGr7daQr6yBVNWNxzuXvyfI
```

Then trigger a redeploy.
