const Express = require('express');
const app = Express();
const Cors = require('cors');
const Mongoose = require('mongoose');


app.use(Express.urlencoded());
app.use(Cors());
app.use(Express.json());


const dbUsername = 'System'; 
const dbPassword = 'STUDENTS11'; 
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.k90oz.mongodb.net/SMsystem?retryWrites=true&w=majority&appName=Cluster0`;

Mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const StudentSchema = new Mongoose.Schema({
  rollno: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  age: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  }
});

const StudentModel = Mongoose.model("students", StudentSchema);

app.post('/collect', function (req, res) {
  const myrollno = req.body.rollno;
  const myname = req.body.name;
  const myage = req.body.age;
  const mycity = req.body.city;

  const studentdata = new StudentModel({
    rollno: myrollno,
    name: myname,
    age: myage,
    city: mycity
  })

  studentdata.save().then(function (output) {
    res.send(`Data has been saved ${output}`);
  }).catch(function (err) {
    res.send(`Data has not been saved due to ${err.message}`);
  });
});

app.get("/read", async function (req, res) {
  const readData = await StudentModel.find();
  res.send(readData);
});

app.get("/read/data/:id", async function (req, res) {
  const studentid = req.params.id;
  const studentdata = await StudentModel.find({ rollno: studentid })
  res.send(studentdata);
});

app.delete("/delete/data/:id", async function (req, res) {
  const studentid = req.params.id;
  const result = await StudentModel.deleteOne({ rollno: studentid })
  if (result.deletedCount == 1) {
    res.send("Data has been deleted");
  } else {
    res.send("Data has not been deleted");
  }
});

app.listen(9000, function () {
  console.log('Server is running on port 9000');
});
