const express = require("express");

// Custom imports
const projects = require("../data/helpers/projectModel.js");

const router = express.Router();

// Creates a project using the information sent inside the `request body`, returns created object. CREATE.
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      res.status(400).json({
        errorMessage: "Please provide project name and a description."
      });
    } else {
      const newProject = await projects.insert(req.body);
      res.status(201).json(newProject);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the project to the database."
    });
  }
});

// Returns an array of all the project objects contained in the database. READ.
router.get("/", async (req, res) => {
  try {
    const allProjects = await projects.get();
    res.status(200).json(allProjects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The projects could not be retrieved." });
  }
});

// Updates the project with the specified `id` using data from the `request body`. Returns the modified object or null if not found. UPDATE.
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      res.status(400).json({
        errorMessage: "Please provide project name and contents to be updated."
      });
    } else {
      const updatedObject = await projects.update(req.params.id, req.body);
      if (!updatedObject) {
        res
          .status(404)
          .json({ message: "The project with the specified ID does not exist." });
      } else {
        res.status(200).json(updatedObject);
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The project information could not be modified." });
  }
});

// Removes the project with the specified id and returns number of records deleted. DELETE.
router.delete("/:id", async (req, res) => {
  try {
    const numProjectsDeleted = await projects.remove(req.params.id);
    if (!numProjectsDeleted) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      res
        .status(200)
        .json({ message: `Successfully deleted project ${req.params.id}.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The project could not be removed." });
  }
});

module.exports = router;
