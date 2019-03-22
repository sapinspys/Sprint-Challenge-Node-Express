const express = require("express");

// Custom imports
const postsDb = require("../data/helpers/postDb.js");

const router = express.Router();

// Returns an array of all the post objects contained in the database.
router.get("/", async (req, res) => {
  try {
    const users = await postsDb.get();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The posts could not be retrieved." });
  }
});

// Creates a post using the information sent inside the `request body`.
router.post("/", async (req, res) => {
  try {
    if (!req.body.text || !req.body.user_id) {
      res.status(400).json({
        errorMessage: "Please provide text and user id for the post."
      });
    } else {
      const newPost = await postsDb.insert(req.body);
      res.status(201).json(newPost);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the post to the database."
    });
  }
});

// CODE BELOW FOR REFERENCE ONLY

// // Endpoints: Handle all URLs beginning with /api/posts
// // Creates a post using the information sent inside the `request body`.
// router.post("/", async (req, res) => {
//   try {
//     if (!req.body.title || !req.body.contents) {
//       res.status(400).json({
//         errorMessage: "Please provide title and contents for the post."
//       });
//     } else {
//       const newUserId = await db.insert(req.body);
//       res.status(201).json({ ...newUserId, ...req.body });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "There was an error while saving the post to the database."
//     });
//   }
// });

// // Returns an array of all the post objects contained in the database.
// router.get("/", async (req, res) => {
//   try {
//     const posts = await db.find();
//     res.status(200).json(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "The posts could not be retrieved." });
//   }
// });

// // Returns the post object with the specified id.
// router.get("/:id", async (req, res) => {
//   try {
//     const post = await db.findById(req.params.id); // returns post or empty array
//     if (!post.length) {
//       res
//         .status(404)
//         .json({ message: "The post with the specified ID does not exist." });
//     } else {
//       res.status(200).json(post[0]);
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ error: "The posts information could not be retrieved." });
//   }
// });

// // Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement.
// router.delete("/:id", async (req, res) => {
//   try {
//     const postToBeDeleted = await db.findById(req.params.id);
//     if (!postToBeDeleted.length) {
//       res
//         .status(404)
//         .json({ message: "The post with the specified ID does not exist." });
//     } else {
//       await db.remove(req.params.id);
//       res.status(200).json(postToBeDeleted[0]);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "The post could not be removed." });
//   }
// });

// // Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
// router.put("/:id", async (req, res) => {
//   try {
//     if (!req.body.title || !req.body.contents) {
//       res.status(400).json({
//         errorMessage: "Please provide title and contents for the post."
//       });
//     } else {
//       const numPostsUpdated = await db.update(req.params.id, req.body);
//       if (!numPostsUpdated) {
//         res
//           .status(404)
//           .json({ message: "The post with the specified ID does not exist." });
//       } else {
//         const post = await db.findById(req.params.id);
//         res.status(200).json(post[0]);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ error: "The post information could not be modified." });
//   }
// });

module.exports = router;
