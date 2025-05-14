import express from "express";
import dotenv from "dotenv";
import { MongoClient , ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { auth } from "./User/auth.js";

dotenv.config();
export const app = express();
app.use(express.json());
app.use(cors())
// const port = 9000;

const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
    try{
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        console.log("MONGO CONNECTED");
        return client;
    }
    catch(err){
        console.error("Server not connected:", err);
        throw new Error("Database connection failed");
    }
}

export const client = await createConnection().catch(err => {
    console.error(err.message,"Server not connected")
    process.exit(1);
});

async function genPassword(password){
    const salt = await bcrypt.genSalt(5);
    // console.log("salt",salt)
    const hashedPassword = await bcrypt.hash(password,salt)
    // console.log("hashedPass",hashedPassword)
    return hashedPassword;
}

app.get("/test",async (req,res)=>{
    res.send("Hello World");
})

// admin ********************

// admin login
app.post("/admin/login",async (req,res)=>{
    try {
        const {email,password, secret, type} = req.body;

        if(type === "register"){

            if(!email || !password || !secret || !type){
                res.status(400).json({message: "All fields are required"});
                return;
            }

            if(secret !== process.env.SECRET_KEY){
                res.status(400).json({message: "Invalid secret key"});
                return;
            }
            const isAdminExists = await client.db("studentMentor").collection("admin").findOne({ email });
            
            if(isAdminExists){
                res.status(400).json({message: "Admin email already exists"});
                return;
            }

            const hashedPassword = await genPassword(password);
            const admin = await client.db("studentMentor").collection("admin").insertOne({ email, password: hashedPassword, secret });
            res.status(200).json({message: "Admin registered successfully"});
        }
        else if(type === "login"){
            if(!email || !password){
                res.status(400).json({message: "All fields are required"});
                return;
            }
            const admin = await client.db("studentMentor").collection("admin").findOne({ email });
            if(!admin){
                res.status(400).json({message: "Admin email not found"});
                return;
            }
            const storedPassword = admin.password;
            const passwordMatch = await bcrypt.compare(password,storedPassword);
            if(!passwordMatch){
                res.status(400).json({message: "Invalid password"});
                return;
            }
            const token = jwt.sign({id:admin._id},process.env.SECRET_KEY)
            res.status(200).json({message: "Admin login successfully", id:admin._id, adminName: admin.name, token});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error login", error});
    }
})


// student  ********************

// student login
app.post("/student/login",async (req,res)=>{
    try {
        const {rollNumber,password} = req.body;
        const student = await client.db("studentMentor").collection("student").findOne({ rollNumber });

        if(!student){
            res.status(400).json({message: "Student roll number not found"});
            return;
        }
        const storedPassword = student.password;
        const passwordMatch = await bcrypt.compare(password,storedPassword);

        if(!passwordMatch){
            res.status(400).json({message: "Invalid password"});
            return;
        }

        const token = jwt.sign({id:student._id},process.env.SECRET_KEY)

        student.password = undefined;

        res.status(200).json({message: "Successfully login", id:student._id, token});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error login", error});
    }
})

// add student
app.post("/add/student",auth,async (req,res)=>{

    const studentData = req.body; 

    console.log(studentData);

    try {

        const findStudent = await client.db("studentMentor").collection("student").findOne({ rollNumber: studentData.rollNumber });
        
        if(findStudent){
            res.status(400).json({message: "Student roll number already exists"});
            return;
        }

        const hashedPassword = await genPassword(studentData.rollNumber);

        studentData.password = hashedPassword;

        const student = await client.db("studentMentor").collection("student").insertOne(studentData);
        res.status(200).json({ message: "Student details added successfully", student });

    } catch (error) {
        res.status(500).json({ message: 'Error adding student details', error });
    }
})

// get student by id
app.get("/student/:id",auth,async (req,res)=>{
    try {

        const id = req.params.id;

        if(!id){
            return res.status(400).json({ message: 'Student ID is required' });
        }
        const student = await client.db("studentMentor").collection("student").findOne({ _id: new ObjectId(id) },{ projection: { password: 0 } });
        
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        if(student.mentorAssigned.length === 0){
            return res.status(404).json({message: "No mentors assigned to this student"});
        }
        
        const mentors = student.mentorAssigned.map(id => new ObjectId(id));

        const mentorDetails = await client.db("studentMentor").collection("mentor").find({_id: {$in: mentors}}).project({password: 0, studentsAssigned: 0, }).toArray();
        
        // Get total booking count
        const bookingCount = await client
        .db("studentMentor")
        .collection("booking")
        .countDocuments({studentId: id});

        // Get counts by session status
        const statusCounts = {
            pending: await client.db("studentMentor").collection("booking").countDocuments({studentId: id, sessionStatus: "pending"}),
            completed: await client.db("studentMentor").collection("booking").countDocuments({studentId: id, sessionStatus: "completed"}),
            rejected: await client.db("studentMentor").collection("booking").countDocuments({studentId: id, sessionStatus: "rejected"}),
            confirmed: await client.db("studentMentor").collection("booking").countDocuments({studentId: id, sessionStatus: "confirmed"})
        };

        // Get current month's booking count
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
        
        const currentMonthCount = await client
        .db("studentMentor")
        .collection("booking")
        .countDocuments({
            studentId: id,
            bookingDate: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        
        res.status(200).json({
            student,
            mentorDetails,
            bookingStats: {
                totalBookings: bookingCount,
                currentMonthBookings: currentMonthCount,
                statusCounts
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching student', error });
    }
})

// get all students
app.get("/get/all/students/:department",auth,async (req,res)=>{
    const department = req.params.department;
    console.log({department});
    try {
        const students = await client.db("studentMentor").collection("student").find({ department: department }).project({ password: 0 }).toArray();
        res.status(200).json({students});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
})

//  update student attendance
app.post("/update/student/attendance/:rollNumber",auth,async (req,res)=>{

    try {
        const rollNumber = req.params.rollNumber;
        const attendance = req.body;
        console.log({rollNumber,attendance});

        const student = await client.db("studentMentor").collection("student").findOne({ rollNumber });
        if(!student){
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if attendance for this month already exists
        const monthExists = student.attendance && 
            student.attendance.some(item => item.month === attendance.month);
        
        if (monthExists) {
            // Update existing month's attendance
            await client.db("studentMentor").collection("student").updateOne(
                { rollNumber, "attendance.month": attendance.month },
                { $set: { "attendance.$": attendance } }
            );
        } else {
            // Add new month to attendance array (creates array if it doesn't exist)
            await client.db("studentMentor").collection("student").updateOne(
                { rollNumber },
                { $push: { attendance: attendance } }
            );
        }

        res.status(200).json({ message: 'Student attendance updated successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating student attendance', error });
    }
})

//  mentor  *******************

// mentor login
app.post("/mentor/login",async (req,res)=>{
    try {
        const {email,password} = req.body;
        const mentor = await client.db("studentMentor").collection("mentor").findOne({ email });

        if(!mentor){
            return res.status(400).json({message: "Mentor email not found"});
        }

        const storedPassword = mentor.password;
        const passwordMatch = await bcrypt.compare(password,storedPassword);

        if(!passwordMatch){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({id:mentor._id},process.env.SECRET_KEY)

        mentor.password = undefined;

        res.status(200).json({message: "Successfully login", id:mentor._id, token});
        
    } catch (error) {
        
    }
})
// add mentor
app.post("/add/mentor", auth, async (req,res)=>{

    const mentorData = req.body; 

    console.log(mentorData);

    try {

        const findMentor = await client.db("studentMentor").collection("mentor").findOne({ email: mentorData.email });
        
        if(findMentor){
            res.status(400).json({message: "Mentor email already exists"});
            return;
        }

        const hashedPassword = await genPassword(mentorData.email);
        
        mentorData.password = hashedPassword;

        const mentor = await client.db("studentMentor").collection("mentor").insertOne(mentorData);
        res.status(200).json({ message: "Mentor details added successfully", mentor });

    } catch (error) {
        res.status(500).json({ message: 'Error adding mentor details', error });
    }
})

// get all mentors
app.get("/get/all/mentors/:department",auth,async (req,res)=>{
    const department = req.params.department;
    console.log({department});
    try {
        const mentors = await client.db("studentMentor").collection("mentor").find({ department: department }).project({ password: 0 }).toArray();
        res.status(200).json({mentors});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentors', error });
    }
})

// add student to mentor
app.post("/add/student/to/mentor/:mentorId",auth,async (req,res)=>{
    try {
        const mentorId = req.params.mentorId;
        const studentRollNumbers = req.body.students; // Array of student roll numbers
        console.log({mentorId,studentRollNumbers});

        if(!mentorId || !studentRollNumbers){
            return res.status(400).json({message: "Both mentorId and studentRollNumbers are required"});
        }
        
        // Find the mentor
        const mentor = await client.db("studentMentor").collection("mentor").findOne(
            { _id: new ObjectId(mentorId) }
        );
        
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }
        
        // Initialize studentsAssigned array if it doesn't exist
        if (!mentor.studentsAssigned) {
            mentor.studentsAssigned = [];
        }
        
        const updatedStudents = [];
        const notFoundStudents = [];
        
        for (const rollNumber of studentRollNumbers) {
            // Check if student exists
            const student = await client.db("studentMentor").collection("student").findOne({ rollNumber });
            
            if (!student) {
                notFoundStudents.push(rollNumber);
                continue;
            }
            
            // Check if student is already assigned to this mentor
            if (mentor.studentsAssigned.includes(rollNumber)) {
                continue;
            }
            
            // Add student to mentor's studentsAssigned array
            mentor.studentsAssigned.push(rollNumber);
            
            // Initialize mentorAssigned array in student if it doesn't exist
            if (!student.mentorAssigned) {
                student.mentorAssigned = [];
            }
            
            // Add mentor to student's mentorAssigned array if not already there
            if (!student.mentorAssigned.includes(mentorId)) {
                student.mentorAssigned.push(mentorId);
                
                // Update student document
                await client.db("studentMentor").collection("student").updateOne(
                    { rollNumber },
                    { $set: { mentorAssigned: student.mentorAssigned } }
                );
            }
            
            updatedStudents.push(rollNumber);
        }
        
        // Update mentor document with new studentsAssigned array
        await client.db("studentMentor").collection("mentor").updateOne(
            { _id: new ObjectId(mentorId) },
            { $set: { studentsAssigned: mentor.studentsAssigned } }
        );
        
        res.status(200).json({
            message: "Students assigned to mentor successfully",
            updatedStudents,
            notFoundStudents,
            totalAssigned: mentor.studentsAssigned.length
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error adding student to mentor", error});
    } 
})

// get mentors by student_id
app.get("/get-mentors/:studentId",auth,async (req,res)=>{
    const studentId = req.params.studentId;
    try {
        const student = await client.db("studentMentor").collection("student").findOne({_id: new ObjectId(studentId)}, {projection: {mentorAssigned: 1}});
        
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        if(student.mentorAssigned.length === 0){
            return res.status(404).json({message: "No mentors assigned to this student"});
        }
        
        const mentors = student.mentorAssigned.map(id => new ObjectId(id));

        const mentorDetails = await client.db("studentMentor").collection("mentor").find({_id: {$in: mentors}}).project({password: 0, studentsAssigned: 0, }).toArray();
        
        res.status(200).json(mentorDetails);

    } catch (error) {
        res.status(500).json({message: "Error fetching mentors", error});
    }
})

// add mentor availability
app.post("/add/mentor/availability/:mentorId",auth,async (req,res)=>{
    try {
        const mentorId = req.params.mentorId;
        const availability = req.body;
        console.log({mentorId,availability});

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }

        let formattedMentorId = new ObjectId(mentorId);

        const mentor = await client.db("studentMentor").collection("mentor").findOne({_id: formattedMentorId});
        console.log({mentor});
        if(!mentor){
            return res.status(404).json({message: "Mentor not found"});
        }

        await client.db("studentMentor").collection("mentor").updateOne(
            { _id: formattedMentorId },
            { $set: { availability: availability } }
        );
        
        res.status(200).json({message: "Mentor availability added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error adding mentor availability", error});
    }
})

// get mentor availability
app.get("/mentor/get-mentor-availability/:mentorId",auth,async (req,res)=>{
    try {
        const mentorId = req.params.mentorId;

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }

        let formattedMentorId = new ObjectId(mentorId);

        const mentor = await client.db("studentMentor").collection("mentor").findOne({_id: formattedMentorId}, {projection: {availability: 1}});
        
        if(!mentor?.availability){
            return res.status(404).json({message: "Mentor not found"});
        }

        res.status(200).json({availability: mentor?.availability});

    } catch (error) {
        res.status(500).json({message: "Error fetching mentor availability", error});
    }
})

// get mentor details with booking count
app.get("/get/mentor/:mentorId",auth,async (req,res)=>{
    try {
        const mentorId = req.params.mentorId;

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }

        let formattedMentorId = new ObjectId(mentorId);

        const mentor = await client
        .db("studentMentor")
        .collection("mentor")
        .findOne({_id: formattedMentorId}, {projection: {password: 0}});
        
        if(!mentor){
            return res.status(404).json({message: "Mentor not found"});
        }

        // Get total booking count
        const bookingCount = await client
        .db("studentMentor")
        .collection("booking")
        .countDocuments({mentorId});

        // Get counts by session status
        const statusCounts = {
            pending: await client.db("studentMentor").collection("booking").countDocuments({mentorId, sessionStatus: "pending"}),
            completed: await client.db("studentMentor").collection("booking").countDocuments({mentorId, sessionStatus: "completed"}),
            rejected: await client.db("studentMentor").collection("booking").countDocuments({mentorId, sessionStatus: "rejected"}),
            confirmed: await client.db("studentMentor").collection("booking").countDocuments({mentorId, sessionStatus: "confirmed"})
        };

        // Get current month's booking count
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
        
        const currentMonthCount = await client
        .db("studentMentor")
        .collection("booking")
        .countDocuments({
            mentorId,
            bookingDate: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        mentor.studentsAssigned = mentor?.studentsAssigned?.length ?? 0;
        
        res.status(200).json({
            mentor,
            bookingStats: {
                totalBookings: bookingCount,
                currentMonthBookings: currentMonthCount,
                statusCounts
            }
        });
    } catch (error) {
        res.status(500).json({message: "Error fetching mentor", error});
    }
})

// get students assigned to mentor
app.get("/get/students/mentor/:mentorId",auth,async (req,res)=>{
    try {
        const mentorId = req.params.mentorId;

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }

        const mentor = await client.db("studentMentor").collection("mentor").findOne({_id: new ObjectId(mentorId)});

        if(!mentor){
            return res.status(404).json({message: "Mentor not found"});
        }

        // Get all students assigned to this mentor with complete details
        const students = await client
        .db("studentMentor")
        .collection("student")
        .find({rollNumber: {$in: mentor.studentsAssigned}})
        .project({password: 0, meetings: 0, availedLeaves: 0, mentorAssigned: 0})
        .toArray();

        // Process students to identify those with attendance below 75%
        const studentsWithLowAttendance = [];
        
        // Add attendance calculation for all students
        students.forEach(student => {
            if (!student.attendance || student.attendance.length === 0) {
                // If no attendance data, set 0% attendance
                student.averageAttendance = 0;
                studentsWithLowAttendance.push(student);
                return;
            }
            
            // Calculate average attendance across all months
            let totalAttendancePercentage = 0;
            student.attendance.forEach(month => {
                // Calculate days present
                const totalWorkingDays = parseInt(month.totalWorkingDays);
                const leavesTaken = month.leavesTaken || 0;
                const daysPresent = totalWorkingDays - leavesTaken;
                
                // Calculate percentage
                const percentage = (daysPresent / totalWorkingDays) * 100;
                totalAttendancePercentage += percentage;
            });
            
            const averageAttendance = totalAttendancePercentage / student.attendance.length;
            student.averageAttendance = averageAttendance;
            
            // Add student to low attendance list if attendance is below 75%
            if (averageAttendance < 75) {
                studentsWithLowAttendance.push(student);
            }
        });
        
        res.status(200).json({
            students,
            studentsWithLowAttendance,
            totalStudents: students.length,
            lowAttendanceCount: studentsWithLowAttendance.length,
            totalStudentsAssigned: mentor?.studentsAssigned?.length
        });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error fetching students", error});
    }
})

// get all students with low meeting count
app.get("/app/mentor/meeting/:mentorId",auth,async (req,res)=>{
    try {
        const mentorId = req.params.mentorId;

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }
        
        const mentor = await client.db("studentMentor").collection("mentor").findOne({_id: new ObjectId(mentorId)});

        if(!mentor){
            return res.status(404).json({message: "Mentor not found"});
        }
        
        // Get all bookings for this mentor
        const bookings = await client.db("studentMentor").collection("booking")
            .find({
                mentorId: mentorId,
                sessionStatus: "completed" // Only count completed meetings
            })
            .toArray();
        
        // Get all students assigned to this mentor
        const students = await client.db("studentMentor").collection("student")
            .find({rollNumber: {$in: mentor.studentsAssigned || []}})
            .project({password: 0, meetings: 0, availedLeaves: 0, mentorAssigned: 0})
            .toArray();
        
        // Count completed meetings for each student
        const studentMeetingCounts = {};
        bookings.forEach(booking => {
            if (!studentMeetingCounts[booking.studentId]) {
                studentMeetingCounts[booking.studentId] = 0;
            }
            studentMeetingCounts[booking.studentId]++;
        });
        
        // Identify students with less than 2 completed meetings
        const studentsWithLowMeetingCount = students.map(student => {
            const studentId = student._id.toString();
            const completedMeetings = studentMeetingCounts[studentId] || 0;
            
            return {
                studentId: studentId,
                name: student.name,
                rollNumber: student.rollNumber,
                department: student.department,
                completedMeetings: completedMeetings,
                needsAttention: completedMeetings < 2
            };
        }).filter(student => student.needsAttention);
        
        // Get ALL booking details for this mentor
        const allBookings = await client.db("studentMentor").collection("booking")
            .find({mentorId: mentorId})
            .sort({bookingDate: -1})
            .toArray();
            
        // Format ALL booking details with student information
        const formattedAllBookings = await Promise.all(allBookings.map(async booking => {
            const student = await client.db("studentMentor").collection("student")
                .findOne({_id: new ObjectId(booking.studentId)}, 
                         {projection: {name: 1, rollNumber: 1, department: 1}});
                
            return {
                bookingId: booking._id,
                bookingDate: booking.bookingDate,
                lastUpdatedDate: booking.lastUpdatedDate,
                sessionNotes: booking.sessionNotes,
                doubts: booking.doubts,
                sessionStatus: booking.sessionStatus,
                sessionLink: booking.sessionStatus === "confirmed" ? booking.sessionLink : null,
                studentId: booking.studentId,
                studentName: student?.name || "Unknown",
                studentRollNumber: student?.rollNumber || "Unknown",
                studentDepartment: student?.department || "Unknown"
            };
        }));
        
        // Get booking statistics
        // const totalBookings = await client.db("studentMentor").collection("booking")
        //     .countDocuments({mentorId: mentorId,}); --> all count
            
        const pendingBookings = await client.db("studentMentor").collection("booking")
            .countDocuments({mentorId: mentorId, sessionStatus: "pending"});
            
        const completedBookings = await client.db("studentMentor").collection("booking")
            .countDocuments({mentorId: mentorId, sessionStatus: "completed"});
            
        const confirmedBookings = await client.db("studentMentor").collection("booking")
            .countDocuments({mentorId: mentorId, sessionStatus: "confirmed"});

        const rejectedBookings = await client.db("studentMentor").collection("booking")
            .countDocuments({mentorId: mentorId, sessionStatus: "rejected"});
            
        res.status(200).json({
            bookingStats: {
                // total: totalBookings,
                pending: pendingBookings,
                completed: completedBookings,
                confirmed: confirmedBookings,
                rejected: rejectedBookings
            },
            allMeetings: formattedAllBookings,
            studentsWithLowMeetingCount,
            totalStudentsWithLowMeetingCount: studentsWithLowMeetingCount.length,
            totalStudentsAssigned: mentor.studentsAssigned?.length || 0
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error fetching students", error});
    }
})

// booking **************

app.post("/book-session/:studentId",auth,async (req,res)=>{
    
    const studentId = req.params.studentId;
    const mentorId = req.body.mentorId;

    try {

        if(!studentId){
            return res.status(400).json({message: "StudentId is required"});
        }

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }

        const student = await client.db("studentMentor").collection("student").findOne({_id: new ObjectId(studentId)});
       
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        const mentor = await client.db("studentMentor").collection("mentor").findOne({_id: new ObjectId(mentorId)});

        if(!mentor){
            return res.status(404).json({message: "Mentor not found"});
        }

        const booking = {
            studentId: studentId,
            mentorId: mentorId,
            bookingDate: new Date(),
            lastUpdatedDate: new Date(),
            sessionLink: null,
            sessionNotes: null,
            doubts: req.body.description,
            sessionStatus: "pending",           
        }

        await client.db("studentMentor").collection("booking").insertOne(booking);

        res.status(200).json({message: "Booking created successfully", booking});     
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error booking appointment", error});
    }
})

app.post("/mentor/book-session/:mentorId",auth,async (req,res)=>{
    
    const studentId = req.body.studentId;
    const mentorId = req.params.mentorId;

    try {

        if(!studentId){
            return res.status(400).json({message: "StudentId is required"});
        }

        if(!mentorId){
            return res.status(400).json({message: "MentorId is required"});
        }

        const student = await client.db("studentMentor").collection("student").findOne({_id: new ObjectId(studentId)});
       
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        const mentor = await client.db("studentMentor").collection("mentor").findOne({_id: new ObjectId(mentorId)});

        if(!mentor){
            return res.status(404).json({message: "Mentor not found"});
        }

        const booking = {
            studentId: studentId,
            mentorId: mentorId,
            bookingDate: new Date(),
            lastUpdatedDate: new Date(),
            sessionLink: null,
            sessionNotes: null,
            doubts: req.body.description,
            sessionStatus: "confirmed",           
        }

        await client.db("studentMentor").collection("booking").insertOne(booking);

        res.status(200).json({message: "Booking created successfully", booking});     
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error booking appointment", error});
    }
})

// get mentor details from studentId
app.get("/app/student/mybookings/:studentId",auth,async (req,res)=>{
    try {
        const studentId = req.params.studentId;

        if(!studentId){
            return res.status(400).json({message: "StudentId is required"});
        }

        const student = await client.db("studentMentor").collection("student").findOne({_id: new ObjectId(studentId)});
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        if(!student.mentorAssigned || student.mentorAssigned.length === 0){
            return res.status(404).json({message: "No mentors assigned to this student"});
        }

        // Convert string IDs to ObjectId
        const mentorObjectIds = student.mentorAssigned.map(id => new ObjectId(id));
        
        // Get mentor details from mentor collection
        const mentors = await client.db("studentMentor").collection("mentor")
            .find({_id: {$in: mentorObjectIds}})
            .project({password: 0, studentsAssigned: 0, availability: 0})
            .toArray();
            
        // Get booking details for this student
        const bookings = await client.db("studentMentor").collection("booking")
            .find({studentId: studentId})
            // .project({sessionLink: 0})
            .toArray();
            
        // Create a flattened array of bookings with mentor details
        const bookingsWithMentorDetails = [];
        
        bookings.forEach(booking => {
            const mentor = mentors.find(m => m._id.toString() === booking.mentorId);
            if (mentor) {
                bookingsWithMentorDetails.push({
                    bookingId: booking._id,
                    bookingDate: booking.bookingDate,
                    lastUpdatedDate: booking.lastUpdatedDate,
                    sessionNotes: booking.sessionNotes,
                    doubts: booking.doubts,
                    sessionStatus: booking.sessionStatus,
                    sessionLink: booking.sessionStatus === "confirmed" ? booking.sessionLink : null,
                    
                    mentorId: mentor._id,
                    mentorName: mentor.name,
                    mentorEmail: mentor.email,
                    mentorDepartment: mentor.department,
                    mentorPhone: mentor.phone,
                });
            }
        });

        res.status(200).json({
            bookings: bookingsWithMentorDetails
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error fetching Meeting details", error});
    }
})

app.post("/app/update/session-notes/:bookingId",auth,async (req,res)=>{
    try {
        const bookingId = req.params.bookingId;
        const {sessionNotes} = req.body;



        if(!bookingId){
            return res.status(400).json({message: "BookingId is required"});
        }

        if(!sessionNotes){
            return res.status(400).json({message: "SessionNotes is required"});
        }

        const booking = await client.db("studentMentor").collection("booking").findOne({_id: new ObjectId(bookingId)});

        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        }
        
        await client.db("studentMentor").collection("booking").updateOne({_id: new ObjectId(bookingId)}, {$set: {sessionNotes: sessionNotes}});

        res.status(200).json({message: "Session notes updated successfully", booking});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error updating session notes", error});
    }
})

//  change status of booking
app.post("/app/mentor/meeting/update-status/:bookingId",auth,async (req,res)=>{
    try {
        const bookingId = req.params.bookingId;
        const {sessionStatus} = req.body;

        if(!bookingId){
            return res.status(400).json({message: "BookingId is required"});
        }

        if(!sessionStatus){
            return res.status(400).json({message: "SessionStatus is required"});
        }

        const booking = await client.db("studentMentor").collection("booking").findOne({_id: new ObjectId(bookingId)});

        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        }

        if(sessionStatus === "confirmed"){
            const sessionLink = [...Array(15)].map(() => Math.random().toString(36)[2]).join('');
            await client.db("studentMentor").collection("booking").updateOne({_id: new ObjectId(bookingId)}, {$set: {sessionLink}});
        }

        await client.db("studentMentor").collection("booking").updateOne({_id: new ObjectId(bookingId)}, {$set: {sessionStatus: sessionStatus}});

        res.status(200).json({message: "Booking status updated successfully", booking});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error updating booking status", error});
    }
})

const port = process.env.PORT ?? 9000;

app.listen(port,()=>{
    console.log(port,"server connected successfully");
})