const express = require("express");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const databasePath = path.join(__dirname, "data.db");

app.use(express.json());
app.use(cors());





let database = null;
const PORT = process.env.PORT || 5000;
// Initialize the database
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// User Registration
app.post("/register", async (request, response) => {
  console.log(request.body)
  const { username, email, name, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (!databaseUser) {
    const createUserQuery = `
      INSERT INTO users (id, username, name, password, email)
      VALUES ('${uuidv4()}', '${username}', '${name}', '${hashedPassword}', '${email}');`;
    if (password.length > 4) {
      await database.run(createUserQuery);
      response.send({"message":"User created successfully"});
    } else {
      response.status(400).send({"error_msg": "Password is too short"});
    }
  } else {
    response.status(400).send({"error_msg": "User already exists"});
  }
});

// User Login
app.post("/login", async (request, response) => {
  console.log(request.body)
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}';`;
  const dbUser = await database.get(selectUserQuery);
  
  if (dbUser) {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken, user_id: dbUser.id, username: dbUser.username });
    } else {
      response.status(400).send({"error_msg": "Invalid Password"});
    }
  } else {
    response.status(400).send({"error_msg": "Invalid User"});
  }
});

// Get all todos for a user
app.post("/todos", async (request, response) => {
  const { user_id } = request.body;
  const getTodosQuery = `SELECT * FROM todos WHERE user_id = '${user_id}'`;
  const todos = await database.all(getTodosQuery);
  response.send(todos);
});


// Add a new todo
app.post("/add-todo", async (request, response) => {
  const { user_id, todo, is_completed } = request.body;
  console.log(request.body)

  
  // Format the current date in YYYY-MM-DD HH:MM:SS
  const startTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const addTodoQuery = `
    INSERT INTO todos (id, user_id, todo, is_completed, start_time)
    VALUES ('${uuidv4()}', '${user_id}', '${todo}', '${is_completed}', '${startTime}');`;
    
  try {
    await database.run(addTodoQuery);
    response.send({message:"Todo added successfully"});
  } catch (error) {
    console.error(error);
    response.status(500).send({error: "Failed to add todo"});
  }
});


// updating status 

app.put("/change-status", async(request,response) => {
  console.log(request.body)

  const {status,todo_id} = request.body;

  const updateTodoQuery = `
          UPDATE todos
          SET is_completed = '${status}'
          WHERE id = '${todo_id}';`
  
  await database.run(updateTodoQuery);

  response.send("updated succesfully")
})


// Timer APIs

// Start the timer
app.post("/start-timer", async (request, response) => {
  console.log(request.body)
  const { todo_id, start_time } = request.body; // Receive the start_time from the frontend
  const startTimerQuery = `
    UPDATE todos 
    SET start_time = '${start_time}', is_running = 1 
    WHERE id = '${todo_id}';`;
  
  await database.run(startTimerQuery);
  response.send({message: "Timer started"});
});



// Pause the timer
app.post("/pause-timer", async (request, response) => {
  const { todo_id } = request.body;
  console.log(request.body)


  try {
    // Fetch start_time of the todo item
    const getTodoQuery = `SELECT start_time FROM todos WHERE id = ?`;
    const todo = await database.get(getTodoQuery, [todo_id]);

    if (todo) {
      const startTime = new Date(todo.start_time);
      const totalTimeSpent = Math.floor((new Date() - startTime) / 1000); // Calculate time spent in seconds

      // Update total_time_spent and pause the timer
      const pauseTimerQuery = `
        UPDATE todos 
        SET total_time_spent = total_time_spent + ?, 
            is_running = 0
        WHERE id = ?;`;
      
      await database.run(pauseTimerQuery, [totalTimeSpent, todo_id]);

      // Success response
      response.send({ message: "Timer paused" });
    } else {
      // If the todo doesn't exist
      response.status(404).send({ error_msg: "Todo not found" });
    }
  } catch (error) {
    // Catch any errors and send a response
    console.error(error);
    response.status(500).send({ error_msg: "Server error occurred" });
  }
});



// Reset the timer
app.post("/reset-timer", async (request, response) => {
  console.log(request.body)

  const { todo_id } = request.body;
  const resetTimerQuery = `
    UPDATE todos 
    SET start_time = NULL, total_time_spent = 0, is_running = 0 
    WHERE id = '${todo_id}';`;
  await database.run(resetTimerQuery);
  response.send({message:"Timer reset"});
});


// delte todo api 

app.delete("/delete-todo", async(request,response) => {
  console.log(request.body)


  const {todo_id} = request.body 

  const deleteTodoQuery = `
    DELETE FROM todos WHERE id = '${todo_id}' ; 
  `

  await database.run(deleteTodoQuery)

  response.send({message:"successfully deleted"});

})



