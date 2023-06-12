const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const {
  connectToDB,
  getArticleCollection,
  getCommentCollection,
} = require("./db");
const { ObjectId } = require("mongodb");

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
    const commentCollection = getCommentCollection();

    const article = await articleCollection.findOne({ slug: req.params.slug });
    if (article) {
      const comments = await commentCollection
        .find({ articleId: article._id })
        .toArray();
      article.comments = comments;
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
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
    };
    // Assuming you have the article collection available from your MongoDB connection
    const articleCollection = getArticleCollection();
    const commentCollection = getCommentCollection();

    articleCollection
      .insertOne(article)
      .then((result) => {
        const insertedArticleObjectId = result.insertedId;

        // Insert the comments
        const comments = articleData.comments.map((comment) => {
          return {
            articleId: insertedArticleObjectId,
            body: comment.body,
            author: comment.author,
          };
        });
        commentCollection.insertMany(comments);

        // Retrieve the inserted article from the collection by objectId
        res.json(articleCollection.findOne({ _id: insertedArticleObjectId }));
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
app.post("/api/articles/:slug/comments", async (req, res) => {
  try {
    const articleCollection = getArticleCollection();
    const commentCollection = getCommentCollection();
    // Find the article by slug
    const article = await articleCollection.findOne({ slug: req.params.slug });
    if (article) {
      // Create a new comment object
      const comment = {
        articleId: article._id,
        body: req.body.comment.body,
        author: req.body.comment.author,
      };
      // Insert the comment into the comments collection
      commentCollection.insertOne(comment)
      .then(() => {
        // Return success response with the inserted comment
        res.json({message: "Comment created successfully"});
      })
      .catch((error) => {
        console.error("Failed to insert comment:", error);
        res.status(500).json({ message: "Failed to create comment" });
      });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Delete comment
app.delete("/api/articles/:slug/comments/:id", async (req, res) => {
  try {
    const articleCollection = getArticleCollection();
    const commentCollection = getCommentCollection();
    // Find the article by slug
    const article = await articleCollection.findOne({ slug: req.params.slug });
    console.log(req.params.id);
    if (article) {
      // find comment by objectId
      const comment = await commentCollection.findOne({
        _id: new ObjectId(req.params.id),
        articleId: article._id,
      });
      if (comment) {
        // Delete the comment from the comments collection
        await commentCollection.deleteOne({ _id: comment._id });

        // Remove the comment from the article's comments array
        const updatedArticle = await articleCollection.findOneAndUpdate(
          { _id: article._id },
          { $pull: { comments: { _id: comment._id } } },
          { returnOriginal: false }
        );

        res.json(updatedArticle.value);
      }
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// Delete article
app.delete("/api/articles/:slug", async (req, res) => {
  try {
    const articleCollection = getArticleCollection();
    const commentCollection = getCommentCollection();
    // Find the article by slug
    const article = await articleCollection.findOne({ slug: req.params.slug });
    if (article) {
      // Delete the article from the articles collection
      await articleCollection.deleteOne({ _id: article._id });
      // Delete the comments from the comments collection
      await commentCollection.deleteMany({ articleId: article._id });
      res.json({ message: "Article deleted" });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
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
