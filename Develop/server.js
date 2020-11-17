// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
// for unique ids
const shortId = require("shortid");
// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

const allNotes = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json")));

console.log(allNotes);
console.log("test all notes");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// reference: https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Routes
// index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    return res.json(allNotes);
});

// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
    let newNote = `{ "title": "${req.body.title}", "text":"${req.body.text}", "id": "${shortId.generate()}" }`;
    console.log("test post api/notes");
    allNotes.push(JSON.parse(newNote));
    console.log(allNotes);
    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes), err => {
        if (err) throw err;
    });
    return res.json(newNote);
});

// DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete("/api/notes/:id", (req, res) => {
    let index = 0;
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id === req.params.id) {
            index = i;
        }
    }
    allNotes.splice(index, 1);
    console.log("test delete" + req.params.id);
    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes), err => {
        if (err) throw err;
        res.end();
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Starts the server to begin listening
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});