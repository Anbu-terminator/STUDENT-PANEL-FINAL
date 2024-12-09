const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session"); // Import express-session
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files
app.use(express.static(path.join(__dirname, "public"))); // Serve files from the public directory

// Session setup
app.use(session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` for HTTPS (in production)
}));

// Set view engine
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect("mongodb+srv://anbulegend101:vlgeadmindata@vlge.8mhrh.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema and Model for Login
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    DateofBirth: String,
    email: String,
    gender: String,
    nation: String,
    fatherName: String,
    motherName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    aadhar: String,
    phone: String,
    pin: String,
    education: String,
    previous: String,
    skills: String,
    course: String,
    time: String,
    mode: String,
    fees: String,
    offer: String,
    duration: String,
});

const examSchema = new mongoose.Schema({
    email: String,
    name: String,
    dob: String,
    registrationNumber: String,
    courseName: String,
   
});


const Student = mongoose.model("Student", studentSchema);

// Fees Schema
const feesSchema = new mongoose.Schema({
    email: String,
    DateofBirth: String,
    feesDue: Number,
    lastPaidDate: String,
});

const Fees = mongoose.model("Fees", feesSchema);

// Handle login submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Now this should work
            res.redirect('https://vlgeadmin.up.railway.app/');
        } else {
            res.send('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});

// Login page
app.get("/", (req, res) => {
    res.render("login");
});

app.post("/login1", async (req, res) => {
    const { email, DateofBirth } = req.body;

    try {
        const student = await Student.findOne({ email, DateofBirth });

        if (!student) {
            return res.send("Invalid login details!");
        }

        const feesData = await Fees.findOne({ email, DateofBirth });

        if (!feesData) {
            return res.render("profile", { student, feesData: null });
        }

        res.render("profile", { student, feesData });
    } catch (error) {
        console.error(error);
        res.send("Server error.");
    }
});

app.get("/fees", async (req, res) => {
    const { email } = req.query;

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.send("Student not found.");
        }

        const feesData = await Fees.findOne({ email });
        if (!feesData) {
            return res.send("No fees data available.");
        }

        res.render("fees", { student, feesData });
    } catch (error) {
        console.error(error);
        res.send("Server error.");
    }
});

// Schemas
const attendanceSchema = new mongoose.Schema({
    email: String,
    dob: Date,
    name: String,
    attendanceDetails: String,
});

const courseOverviewSchema = new mongoose.Schema({
    email: String,
    dob: Date,
    name: String,
    courseName: String,
    courseDescription: String,
});

const courseStatusSchema = new mongoose.Schema({
    email: String,
    dob: Date,
    name: String,
    courseName: String,
    certificate: Object,
});

const progressSchema = new mongoose.Schema({
    email: String,
    weeklyAssessment: Number,
    monthlyAssessment: Number,
    practicalExam: Number,
    finalExam: Number,
    totalMarks: Number,
    grade: String,
});

// Models
const Attendance = mongoose.model("Attendance", attendanceSchema);
const CourseOverview = mongoose.model("CourseOverview", courseOverviewSchema);
const CourseStatus = mongoose.model("CourseStatus", courseStatusSchema);
const Progress = mongoose.model("Progress", progressSchema);

app.get('/profile', (req, res) => {
    res.render('profile');
});

// Routes for courses and attendance
app.get("/attendanceManagement", async (req, res) => {
    const { email } = req.query;

    try {
        const data = await Attendance.findOne({ email });
        if (!data) {
            return res.send("Attendance data not found.");
        }
        res.render("attendanceManagement", { data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching attendance data.");
    }
});

app.get("/courseOverview", async (req, res) => {
    const { email } = req.query;

    try {
        const data = await CourseOverview.findOne({ email });
        if (!data) {
            return res.send("Course overview data not found.");
        }
        res.render("courseOverview", { data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching course overview.");
    }
});

app.get("/courseStatus", async (req, res) => {
    const { email } = req.query;

    try {
        const data = await CourseStatus.findOne({ email });
        if (!data) {
            return res.send("Course status data not found.");
        }
        res.render("courseStatus", { data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching course status.");
    }
});

app.get("/progress", async (req, res) => {
    const { email } = req.query;

    try {
        const data = await Progress.findOne({ email });
        res.render("progress", { data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching progress data.");
    }
});

const Exam = mongoose.model('Exam', examSchema);

  
  
  // Middleware
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: false }));
  
  const mcqData = {
    "UI/UX Designing": [
        {
            "question": "What does UI stand for?",
            "options": ["User Interface", "User Interaction", "Unique Interface", "Universal Interaction"],
            "correctAnswer": "User Interface"
        },
        {
            "question": "Which tool is commonly used for UI/UX design?",
            "options": ["Adobe XD", "MySQL", "Git", "Docker"],
            "correctAnswer": "Adobe XD"
        },
        {
            "question": "What does UX stand for?",
            "options": ["User Experience", "Universal Experience", "User Extension", "Unique Experience"],
            "correctAnswer": "User Experience"
        },
        {
            "question": "Which is a key principle of UX design?",
            "options": ["Accessibility", "Compilation", "Automation", "Randomization"],
            "correctAnswer": "Accessibility"
          },
          {
            "question": "Which software is used for wireframing?",
            "options": ["Figma", "Excel", "Photoshop", "Notepad"],
            "correctAnswer": "Figma"
          },
          {
            "question": "Which methodology focuses on creating a prototype?",
            "options": ["Design Thinking", "Agile Development", "SCRUM", "DevOps"],
            "correctAnswer": "Design Thinking"
          },
          {
            "question": "What does the term 'responsive design' mean?",
            "options": [
              "Adapts to different devices",
              "Loads faster on browsers",
              "Has fixed dimensions",
              "Uses only text content"
            ],
            "correctAnswer": "Adapts to different devices"
          },
          {
            "question": "What is the main purpose of user personas?",
            "options": [
              "To represent target users",
              "To create backend architecture",
              "To define color palettes",
              "To ensure code security"
            ],
            "correctAnswer": "To represent target users"
          },
          {
            "question": "Which color model is used for web design?",
            "options": ["RGB", "CMYK", "LAB", "HSB"],
            "correctAnswer": "RGB"
          },
          {
            "question": "What is the purpose of usability testing?",
            "options": [
              "To evaluate user interaction with a product",
              "To test backend performance",
              "To check application scalability",
              "To design UI animations"
            ],
            "correctAnswer": "To evaluate user interaction with a product"
          },
          {
            "question": "Which of the following is a type of navigation design?",
            "options": ["Breadcrumb", "Color Palette", "Typography", "Wireframe"],
            "correctAnswer": "Breadcrumb"
          },
          {
            "question": "What is a wireframe?",
            "options": [
              "A basic layout design",
              "A detailed high-fidelity design",
              "A type of backend algorithm",
              "A graphic design tool"
            ],
            "correctAnswer": "A basic layout design"
          },
          {
            "question": "Which font type is best for readability in UI?",
            "options": ["Sans-serif", "Cursive", "Monospace", "Script"],
            "correctAnswer": "Sans-serif"
          },
          {
            "question": "What is the main focus of UI design?",
            "options": ["Visual elements", "Data security", "API development", "Algorithm optimization"],
            "correctAnswer": "Visual elements"
          },
          {
            "question": "What is a prototype in UX design?",
            "options": [
              "A functional sample of the product",
              "A coding standard",
              "A type of software framework",
              "A marketing strategy"
            ],
            "correctAnswer": "A functional sample of the product"
          },
          {
            "question": "Which is NOT a UI design tool?",
            "options": ["Sketch", "Figma", "Git", "Adobe XD"],
            "correctAnswer": "Git"
          },
          {
            "question": "What is the purpose of a style guide in UI/UX design?",
            "options": [
              "To maintain design consistency",
              "To store user data",
              "To generate backend code",
              "To analyze market trends"
            ],
            "correctAnswer": "To maintain design consistency"
          },
          {
            "question": "What does the term 'A/B testing' refer to?",
            "options": [
              "Comparing two design variations",
              "Creating animations",
              "Testing API endpoints",
              "Building wireframes"
            ],
            "correctAnswer": "Comparing two design variations"
          },
          {
            "question": "Which term describes user interactions with a product?",
            "options": ["User Journey", "Backend Flow", "API Call", "Data Mining"],
            "correctAnswer": "User Journey"
          },
          {
            "question": "What is the primary goal of UX design?",
            "options": [
              "To improve user satisfaction",
              "To create dynamic APIs",
              "To write efficient algorithms",
              "To enhance server performance"
            ],
            "correctAnswer": "To improve user satisfaction"
          },
          {
            "question": "What is the importance of a grid system in UI design?",
            "options": [
              "Ensures alignment and consistency",
              "Adds interactivity",
              "Optimizes database structure",
              "Improves server speed"
            ],
            "correctAnswer": "Ensures alignment and consistency"
          },
          {
            "question": "Which file format is commonly used for exporting UI designs?",
            "options": ["SVG", "SQL", "XML", "JSON"],
            "correctAnswer": "SVG"
          },
          {
            "question": "What is the use of a mood board in design?",
            "options": [
              "To gather visual inspiration",
              "To debug software",
              "To store user data",
              "To create algorithms"
            ],
            "correctAnswer": "To gather visual inspiration"
          },
          {
            "question": "What is an example of a call-to-action (CTA)?",
            "options": [
              "'Sign Up Now' button",
              "'Terms and Conditions' link",
              "'User Profile' page",
              "'Settings' menu"
            ],
            "correctAnswer": "'Sign Up Now' button"
          },
          {
            "question": "Which is an example of microinteraction?",
            "options": ["Button animation", "Website navigation", "API call", "Database query"],
            "correctAnswer": "Button animation"
          }
    ],
    "Java Programming": [
        {
            "question": "Which of the following is a valid Java keyword?",
            "options": ["static", "integer", "function", "none"],
            "correctAnswer": "static"
        },
        {
            "question": "What is the default value of an int variable in Java?",
            "options": ["0", "null", "undefined", "1"],
            "correctAnswer": "0"
        },
        {
            "question": "Which method is used to start a Java application?",
            "options": ["main()", "start()", "run()", "execute()"],
            "correctAnswer": "main()"
        },
        {
            "question": "Which of these is NOT a Java access modifier?",
            "options": ["public", "protected", "private", "default"],
            "correctAnswer": "default"
          },
          {
            "question": "Which keyword is used to inherit a class in Java?",
            "options": ["extends", "implements", "inherits", "super"],
            "correctAnswer": "extends"
          },
          {
            "question": "What is the size of a byte in Java?",
            "options": ["8 bits", "16 bits", "32 bits", "64 bits"],
            "correctAnswer": "8 bits"
          },
          {
            "question": "What is the result of 9/2 in Java?",
            "options": ["4", "4.5", "5", "None"],
            "correctAnswer": "4"
          },
          {
            "question": "Which of these is used to handle exceptions in Java?",
            "options": ["try-catch", "if-else", "switch-case", "loop"],
            "correctAnswer": "try-catch"
          },
          {
            "question": "What does the keyword 'final' mean in Java?",
            "options": [
              "Cannot be modified",
              "Runs indefinitely",
              "Indicates the end of a loop",
              "Used for garbage collection"
            ],
            "correctAnswer": "Cannot be modified"
          },
          {
            "question": "Which of these is a superclass for all exceptions in Java?",
            "options": ["Throwable", "Error", "Exception", "RuntimeException"],
            "correctAnswer": "Throwable"
          },
          {
            "question": "What is the default value of a boolean in Java?",
            "options": ["false", "true", "0", "null"],
            "correctAnswer": "false"
          },
          {
            "question": "Which operator is used to concatenate strings in Java?",
            "options": ["+", "&", "|", "*"],
            "correctAnswer": "+"
          },
          {
            "question": "Which loop executes at least once?",
            "options": ["do-while", "while", "for", "foreach"],
            "correctAnswer": "do-while"
          },
          {
            "question": "What is the purpose of the 'this' keyword in Java?",
            "options": [
              "Refers to the current instance of a class",
              "Refers to the superclass",
              "Imports a package",
              "None of the above"
            ],
            "correctAnswer": "Refers to the current instance of a class"
          },
          {
            "question": "Which class is used to handle input/output in Java?",
            "options": ["Scanner", "BufferedReader", "FileReader", "All of the above"],
            "correctAnswer": "All of the above"
          },
          {
            "question": "Which statement is used to stop a loop prematurely?",
            "options": ["break", "stop", "exit", "terminate"],
            "correctAnswer": "break"
          },
          {
            "question": "What is garbage collection in Java?",
            "options": [
              "Reclaiming unused memory",
              "Deleting files",
              "Removing errors",
              "Optimizing CPU usage"
            ],
            "correctAnswer": "Reclaiming unused memory"
          },
          {
            "question": "Which package contains the String class?",
            "options": ["java.lang", "java.util", "java.io", "java.text"],
            "correctAnswer": "java.lang"
          },
          {
            "question": "Which keyword is used to declare an interface?",
            "options": ["interface", "class", "abstract", "implements"],
            "correctAnswer": "interface"
          },
          {
            "question": "Which of the following is a wrapper class in Java?",
            "options": ["Integer", "int", "float", "None"],
            "correctAnswer": "Integer"
          },
          {
            "question": "What is the purpose of the 'super' keyword in Java?",
            "options": [
              "Refers to the parent class",
              "Refers to the current object",
              "Creates a new object",
              "None of the above"
            ],
            "correctAnswer": "Refers to the parent class"
          },
          {
            "question": "Which of these is a valid constructor in Java?",
            "options": ["MyClass()", "void MyClass()", "int MyClass()", "All of the above"],
            "correctAnswer": "MyClass()"
          },
          {
            "question": "Which of these is a marker interface?",
            "options": ["Serializable", "Cloneable", "Both", "None"],
            "correctAnswer": "Both"
          },
          {
            "question": "What does the 'static' keyword mean in Java?",
            "options": [
              "Belongs to the class rather than an instance",
              "Cannot be modified",
              "Indicates a loop",
              "None of the above"
            ],
            "correctAnswer": "Belongs to the class rather than an instance"
          },
          {
            "question": "Which method is used to convert a string to uppercase?",
            "options": ["toUpperCase()", "upperCase()", "convertUpper()", "None"],
            "correctAnswer": "toUpperCase()"
          }
    ]
};

  // Exam page with MCQs based on course
app.get("/exam", async (req, res) => {
    const { email } = req.query;

    try {
        // Fetch student exam details using email from the Exam collection
        const student = await Exam.findOne({ email });
        
        if (!student) {
            return res.status(404).send("Student exam details not found.");
        }

        console.log("Student course name:", student.courseName);

        // Fetch MCQs for the student's course from the hard-coded mcqData object
        const mcqQuestions = mcqData[student.courseName] || [];

        if (mcqQuestions.length === 0) {
            return res.status(404).send("MCQ data not found for the course.");
        }

        // Render the exam page with student details and MCQs
        res.render("exam", { exam: student, mcqData: { questions: mcqQuestions } });

    } catch (err) {
        console.error("Error fetching student exam or MCQs:", err);
        res.status(500).send("Server error.");
    }
});


// Add middleware to parse JSON
app.use(bodyParser.json());
app.use(express.json());

// Route to handle exam submission
app.post("/submitExam", async (req, res) => {
    const answers = req.body; // This will contain the answers submitted by the student
    console.log("Student answers:", answers); // Log the submitted answers

    const courseName = answers.courseName; // Ensure courseName is passed along with the form
    console.log("Student course name:", courseName); // Log the student's course name

    if (!mcqData[courseName]) {
        return res.status(400).send("Invalid course name.");
    }

    const mcqQuestions = mcqData[courseName];
    let score = 0;

    // Evaluate the answers
    for (let [questionKey, answer] of Object.entries(answers)) {
        if (questionKey.startsWith("question")) {
            const questionIndex = parseInt(questionKey.replace("question", ""));
            if (
                mcqQuestions[questionIndex] &&
                mcqQuestions[questionIndex].correctAnswer === answer
            ) {
                score += 2; // Each correct answer gives 2 marks
            }
        }
    }

    console.log(`Score calculated for course "${courseName}": ${score}`); // Log the course name and final score

    // Render the response as an HTML page
    const totalMarks = mcqQuestions.length * 2;
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Score</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }
                .popup {
                    position: relative;
                    width: 300px;
                    padding: 20px;
                    text-align: center;
                    background: #fff;
                    border: 2px solid #ffc107;
                    border-radius: 10px;
                    animation: boom 0.5s ease-out;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                @keyframes boom {
                    0% {
                        transform: scale(0.5);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .score {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .total {
                    font-size: 18px;
                    color: #555;
                }
                .btn {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .btn:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="popup">
                <h2>Exam Results</h2>
                <div class="score">You scored ${score} out of ${totalMarks}</div>
                <div class="total">Great job!</div>
                <a class="btn">Press Back Button to Return</a>
            </div>
        </body>
        </html>
    `);
});



// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
