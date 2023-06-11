const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const { connectToDB, getArticleCollection } = require("./db");

// Initialize middleware
// parse JSON body payload
app.use(express.json({ extended: false }));

// Routes
app.get("/api/articles", async (req, res) => {
  try {
    const articleCollection = getArticleCollection();
    const articles = await articleCollection.find().toArray();
    res.json(articles);
  } catch (error) {
    console.error("Error retrieving articles:", error);
    res.status(500).json({ error: "Failed to retrieve articles" });
  }
});

app.get("/api/articles/:slug", async (req, res) => {
  try {
    const articleCollection = getArticleCollection();
    const articles = await articleCollection.find(req.params.slug).toArray();
    res.json(articles);
  } catch (error) {
    console.error("Error retrieving articles:", error);
    res.status(500).json({ error: "Failed to retrieve articles" });
  }
});

app.post("/api/articles", async (req, res) => {
  try {
    const articleData = req.body.article;
    // Check if the required properties exist
    if (
      !articleData ||
      !articleData.slug ||
      !articleData.title ||
      !articleData.description ||
      !articleData.body ||
      !articleData.tagList
    ) {
      return res.status(400).json({ message: "Invalid article data" });
    }

    // Create a new article object
    const article = {
      slug: articleData.slug,
      title: articleData.title,
      description: articleData.description,
      body: articleData.body,
      tagList: articleData.tagList,
      favorited: articleData.favorited || false,
      favoritesCount: articleData.favoritesCount || 0,
      comments: articleData.comments || [],
    };
    // Assuming you have the article collection available from your MongoDB connection
    const articleCollection = getArticleCollection();

    articleCollection
      .insertOne(article)
      .then((result) => {
        const insertedArticleObjectId = result.insertedId;
  
        // Retrieve the inserted article from the collection by objectId
        return articleCollection.findOne({ _id: insertedArticleObjectId });
      })
      .then((insertedArticle) => {
        res.json(insertedArticle);
      })
      .catch((error) => {
        console.error("Failed to insert article:", error);
        res.status(500).json({ message: "Failed to create article" });
      });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
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
app.post("/api/articles/:slug/comments", (req, res) => {
  const article = articles[req.params.slug];
  if (article) {
    const comment = req.body.comment;
    article.comments.push(comment);
    res.json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

// Connect to MongoDB
connectToDB()
  .then(() => {
    const articleCollection = getArticleCollection();
    articleCollection.createIndex({ slug: 1 }, { unique: true });
    console.log("Article collection created");
    // Start the server after successfully connecting to MongoDB
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
