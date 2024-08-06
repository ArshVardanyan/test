import express from "express";
import path from "path";
import fs from "fs";

const app = express();

app.use(express.static("public"));

    const filePath = path.resolve("./data.json");
    app.get("/getData",(req,res)=>{
        res.sendFile(filePath);
    })


function newObj(arg){
    const obj = {};
    obj.id = new Date().getMilliseconds();
    obj.descr = arg;
    obj.comp = false;
    return obj;
}

app.use(express.json());
app.post("/addTask",(req,res)=>{
    const newTask = req.body.key;
    const filePath = path.resolve('./data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }

        const tasksData = JSON.parse(data);
        tasksData.push(newObj(newTask));
        
        fs.writeFile(filePath, JSON.stringify(tasksData, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error writing to file');
                return;
            }
            res.send("Task added successfully");
        });
    });
})


app.post("/completed",(req,res)=>{
    const infoData = req.body.compKey;
    const filePath = path.resolve('./data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }

        const tasksData = JSON.parse(data).map((item, index) => {
            if (infoData[0] == index) {
                item.comp = infoData[1];
            }
            return item;
        })
        fs.writeFile(filePath, JSON.stringify(tasksData, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error writing to file');
                return;
            }
            res.send("Task status changed successfully");
        });
    });
})



app.post("/deleted",(req,res)=>{
    const infoData = req.body.compKey;
    const filePath = path.resolve('./data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }

        const tasksData = JSON.parse(data).filter((item, index) => {
            if (infoData != index) {
                return item;
            }
        })
        fs.writeFile(filePath, JSON.stringify(tasksData, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error writing to file');
                return;
            }
            res.send("Task deleted successfully");
        });
    });
})


app.listen(3001);