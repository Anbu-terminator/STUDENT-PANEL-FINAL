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
  
  // Route to serve the exam page
  app.get('/exam', async (req, res) => {
    try {
      const { email } = req.query;
  
      // Find student exam data by email and DOB
      const exam = await Exam.findOne({ email});
      if (!exam) {
        return res.status(404).send('Exam details not found.');
      }
  
      // Generate dummy MCQs for the exam
      const questions = generateQuestions(exam.courseName);
  
      res.render('exam', { exam, questions });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error.');
    }
  });
  
  
// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
