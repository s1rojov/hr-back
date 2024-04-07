const express = require('express')
require('dotenv').config()

const app = express()

app.use(express.json())


app.use("/api", require("./routes/index"));
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(
        'Project is running'
    );
})