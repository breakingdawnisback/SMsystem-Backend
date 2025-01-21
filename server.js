const Express = require('express');
const app = Express();  
const Cors = require('cors');
const Mongoose = require('mongoose');


app.use (Express.urlencoded());
app.use(Cors());
app.use(Express.json());//it also read incoming data as javascript object

// Mongoose.connect('mongodb://localhost:27017/SMsystem');
Mongoose.connect("mongodb+srv://System:students11@cluster0.k90oz.mongodb.net/SMsystem?retryWrites=true&w=majority&appName=Cluster0")

//create schema
const StudentSchema=new Mongoose.Schema({
    rollno:{
        type:Number,
        required:true,
        unique:true
    },
   name:{
        type:String,
        required:true,
        minlenght:3,
        maxlenght:20
    },
    age:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true,
        minlenght:3,
        maxlenght:20
    //     validate:{ //custom validation its a object where we have to write a function to validate the data
    //         validator:function(value){
    //             return value.length>2;
    //         },
    //         message:'City name should be greater than 2'
    // }
    }
});
//create model where create a collection
const StudentModel = Mongoose.model("students",StudentSchema);

//endpoints
app.post('/collect',function(req, res){
    //collect the data from the frontend and store it in the database   
    const myrollno=req.body.rollno;
    const myname=req.body.name;
    const myage=req.body.age;
    const mycity=req.body.city;

    //here we write a code to store and save the data in the database
    const studentdata = new StudentModel({
        rollno:myrollno,
        name:myname,
        age:myage,
        city:mycity
    })
   studentdata.save().then(function(output){
        res.send(`Data has been saved ${output}`);
   }).catch(function(err){
       res.send(`Data has not been saved due to ${err.message}`);
   });

});

app.get("/read",async function(req,res){
    const readData = await StudentModel.find();
    res.send(readData);
});

app.get("/read/data/:id",async function(req,res){
    const studentid=req.params.id;
    studentdata =await StudentModel.find({ rollno:studentid})
    res.send(studentdata);
});

app.delete("/delete/data/:id",async function(req,res){
    const studentid=req.params.id;
    const result = await StudentModel.deleteOne({rollno : studentid})
    if(result.deletedCount==1){
        res.send("Data has been deleted");
    }else{
        res.send("Data has not been deleted");
    }
});

app.listen(9000, function(){
    console.log('Server is running on port 9000');
});
