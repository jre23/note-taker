// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Routes
// index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../../index.html"));
});
// notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "../../notes.html"));
});
// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
    return fs.readFile(path.join(__dirname, "../../../db/db.json"), function (err, data) {
        if (err) throw err;
        res.end(data);
    });
});

// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    const newNote = (req.body);
    console.log(newNote);
    fs.appendFile(path.join(__dirname, "../../../db/db.json"), newNote, function (err, data) {
        if (err) throw err;
        console.log("Note added!");
        res.json(newNote);
    });
});
// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});