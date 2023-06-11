const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const articles = {
  "learn-react": {
    slug: "learn-react",
    title: "The Fastest Way to Learn React",
    description: "This is the description!",
    body: "This is the body!",
    tagList: ["react", "frontend"],
    createdAt: new Date(),
    updatedAt: new Date(),
    favorited: false,
    favoritesCount: 0,
    comments: [],
  },
  "learn-node": {
    slug: "learn-node",
    title: "Learn Node",
    description: "This is the description!",
    body: "This is the body!",
    tagList: ["node", "backend"],
    createdAt: new Date(),
    updatedAt: new Date(),
    favorited: false,
    favoritesCount: 0,
    comments: [],
  },
}

// Initialize middleware
// parse JSON body payload
app.use(express.json({ extended: false }));

// Routes
app.get('/api/articles', (req, res) => {
  res.json(Object.values(articles));
});
app.get('/api/articles/:slug', (req, res) => {
  const article = articles[req.params.slug];
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
});

/**
 * POST /api/articles
 * Request body: {
 *  comment: {
 *   body: string,
 *   author: string
 *  }
 * }
 */
app.post('/api/articles/:slug/comments', (req, res) => {
  const article = articles[req.params.slug];
  if (article) {
    const comment = req.body.comment;
    article.comments.push(comment);
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
});

app.listen(port, () => console.log('Server running on port ' + port));