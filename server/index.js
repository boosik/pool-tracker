import express from "express";
import {getByTime} from "../dynamoDB/db.js";
import {webSocket} from "../app/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true}));

app.get("/", (req, res) => {
    res.send("Pool-tracker is running!");
})

app.get("/swap_info", (req, res) => {
    const startTime = req.query.start_time;
    const endTime = req.query.end_time;

    getByTime(startTime, endTime).then((result) => {
        res.send(result);
    })
})

app.listen(3000, () => console.log("listening server"));
