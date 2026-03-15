// routes/search.js &#8212; Search endpoint
const express = require('express');
const router = express.Router();

router.get('/search', (req, res) => {
  const query = req.query.q;
  // Render search results
  res.send(`
    <html>
      <body>
        <h1>Search Results</h1>
        <p>You searched for: ${query}</p>
        <p>No results found.</p>
      </body>
    </html>
  `);
});

module.exports = router;