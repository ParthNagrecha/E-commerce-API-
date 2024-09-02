import express from "express";
import bodyParser from "body-parser";

import LoginRoutes from "./routes/login.routes.js";
import RegisterRoutes from "./routes/register.routes.js";
import ItemRoutes from "./routes/item.routes.js";
import reviewRoutes from "./routes/review.routes.js";
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/login',LoginRoutes)
app.use('/register',RegisterRoutes)
app.use('/item',ItemRoutes)
app.use('/reviews',reviewRoutes)

app.listen(port,()=>{
  console.log("Listening on Port",port)
});