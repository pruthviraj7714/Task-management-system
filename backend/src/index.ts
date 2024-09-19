import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user";
import { taskRouter } from "./routes/task";
import "./db/db"

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/task', taskRouter);

app.listen(3000, () => {
    console.log("Server is running of PORT 3000")
})





