import express from "express";
import {getByTime, getItems} from "../dynamoDB/db.js";
// import "../app/index.js";

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

app.get("/swap_info/latest", (req, res) => {
    getItems().then((result) => {
        const cnt = req.query.count;
        result = result["Items"].sort((a, b) => {
            if (a["timestamp"] < b["timestamp"]) {
                return 1;
            } else if (a["timestamp"] === b["timestamp"]) {
                return 0;
            } else {
                return -1;
            }
        })
        res.send(result.slice(0, cnt));
    })
})

app.listen(3000, () => console.log("listening server"));
