const express = require("express");

// Custom imports
const usersDb = require("../data/helpers/userDb.js");

const router = express.Router();

// CUSTOM MIDDLEWARE (CAPITALIZE IF STRING)
router.use(function(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && req.body.name) {
    let upperCaseArray = []

    for (name of req.body.name.split(' ')) {
      upperCaseArray.push(name.charAt(0).toUpperCase() + name.slice(1));
    }

    req.body.name = upperCaseArray.join(' ')
  }

  next();
});

// Creates a new user.
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).json({
        errorMessage: "Please provide the new user's name."
      });
    } else {
      const newUser = await usersDb.insert(req.body);
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the post to the database."
    });
  }
});

// Retrieve the list of `posts` for a `user`.
router.get("/:id/posts", async (req, res) => {
  try {
    const posts = await usersDb.getUserPosts(req.params.id); // returns posts found for user
    if (!posts.length) {
      res
        .status(404)
        .json({
          message:
            "The post with the specified ID does not exist or this user has no posts."
        });
    } else {
      res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});

// Returns an array of all the users contained in the database.
router.get("/", async (req, res) => {
  try {
    const users = await usersDb.get();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The posts could not be retrieved." });
  }
});

// Returns a specific user by ID.
router.get("/:id", async (req, res) => {
  try {
    const user = await usersDb.getById(req.params.id);
    if (!(typeof user === 'object')) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
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
