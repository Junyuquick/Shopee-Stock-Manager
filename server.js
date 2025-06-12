//express removes the need to use require("http") to create instance of server, bcuz express() does it, and allow u to make api endpoints easily. GREAT!
//express is a web server
const express = require("express");
const app = express();
const apiRoutes = require("./api");
const port = 443;

//middleware to parse JSON
app.use(express.json());

app.use("./data", apiRoutes);


app.listen(port, () => {
    console.log(`server runing on https://localhost:${port}`);
});


