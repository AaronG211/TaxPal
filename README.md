# TaxPal
hackathon demo

## Setup Instructions

### Adding Your Gemini API Key

**IMPORTANT SECURITY NOTES:**
1. Never commit your API key to version control (the .env file is in .gitignore)
2. In production, you should use a backend proxy to hide your API key
3. For development/demo purposes, store your key in the `.env` file

### How to Add Your API Key

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file and add your API key:
   ```
   API_KEY=your_actual_api_key_here
   ```

3. Save the file and refresh your browser

**Note:** If you don't have a `.env` file yet, just create one and add:
```
API_KEY=AIzaSyCUQzoy_yi9UGr7daQr6yBVNWNxzuXvyfI
```

### Security Best Practices

For a production application, you should:
- Create a backend API that holds your API key
- Make requests from your frontend to your backend API
- Have your backend make the requests to Gemini
- This way, your API key never leaves your server

For this demo/hackathon project, adding it directly to the file is acceptable, but remember not to push it to GitHub!
