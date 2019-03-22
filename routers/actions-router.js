const express = require("express");

// Custom imports
const actions = require("../data/helpers/actionModel.js");
const projects = require("../data/helpers/projectModel.js");

const router = express.Router();

// Creates an action using the information sent inside the `request body`, returns created object. CREATE.
router.post("/", async (req, res) => {
  try {
    if (!req.body.description || !req.body.notes || !req.body.project_id) {
      res.status(400).json({
        errorMessage: "Please provide project id, action description, and notes."
      });
    } else {
      const foundAction = await projects.get(req.body.project_id);
      if (foundAction) {
        const newAction = await actions.insert(req.body);
        res.status(201).json(newAction);
      } else {
        res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error while saving the action to the database or the project with the specified ID does not exist."
    });
  }
});

// Returns an array of all the action objects contained in the database. READ.
router.get("/", async (req, res) => {
  try {
    const allActions = await actions.get();
    res.status(200).json(allActions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The action could not be retrieved." });
  }
});

// Updates the project with the specified `id` using data from the `request body`. Returns the modified object or null if not found. UPDATE.
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.description || !req.body.notes) {
      res.status(400).json({
        errorMessage: "Please provide action description and notes."
      });
    } else {
      const updatedObject = await actions.update(req.params.id, req.body);
      if (!updatedObject) {
        res
          .status(404)
          .json({ message: "The action with the specified ID does not exist." });
      } else {
        res.status(200).json(updatedObject);
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

// Removes the action with the specified id and returns number of records deleted. DELETE.
router.delete("/:id", async (req, res) => {
  try {
    const numActionsDeleted = await actions.remove(req.params.id);
    if (!numActionsDeleted) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      res
        .status(200)
        .json({ message: `Successfully deleted action ${req.params.id}.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The action could not be removed." });
  }
});

module.exports = router;
