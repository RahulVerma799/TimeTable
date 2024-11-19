var express = require('express');
var router = express.Router();
var router = require('express').Router();
var app = express();
module.exports = router;
var db = require('../db');



/* Get Enforce View */
router.get("/enfValue",function(req,res){
    if (req.session.loggedin) {
        var data;
        db.query('select *   from faculty ; select * from subjects;select * from rooms ; select * from period ; select * from assigneddata ; select * from semesters;select * from days;',function(error,result){
            if(error){
                throw error;
            }
             
            console.log(result);
            // console.log(result[2]);
                 data=result;
                res.render("enfValue",{faculty:JSON.parse(JSON.stringify(data))});
        });
       
        }else{
            res.render("index");
        }
    });

    

    /* Insert Data */
    router.post("/submitEnfValue", function(request, response) {
        if (request.session.loggedin) {
        
            let faculty = request.body.faculty;
            let period = parseInt(request.body.period); 
            let day = request.body.days;
    
        // Check the faculty is already assigned
            db.query(
                "SELECT * FROM assigneddata WHERE faculty = ? AND period = ? AND dayId = ?",
                [faculty, period, day],
                function(err, result) {
                    if (err) {
                        throw err;
                    }
    
                  
                    if (result.length > 0) {
                        console.log("This faculty is already assigned in another classroom at this time.");
                        response.send("<script>alert('This faculty is already assigned in another classroom at this time.'); window.location.href='/enfValue';</script>");
                    } else {
                        
                        db.query(
                            "SELECT period FROM assigneddata WHERE faculty = ? AND dayId = ? ORDER BY period DESC LIMIT 3",
                            [faculty, day],
                            function(err, result) {
                                if (err) {
                                    throw err;
                                }
    
                              
                                if (result.length >= 2) {
                                    const lastPeriod = parseInt(result[0].period);
                                    const secondLastPeriod = parseInt(result[1].period);
    
                                  
                                    if (lastPeriod === (secondLastPeriod + 1)) {
                                      
                                        if (period === (lastPeriod + 1)) {
                                            console.log("This faculty cannot be assigned more than two consecutive classes without a break.");
                                            response.send("<script>alert('This faculty cannot be assigned more than two consecutive classes without a break.'); window.location.href='/enfValue';</script>");
                                            return;
                                        }
                                    }
                                }
    
                                
                                if (result.length === 3) {
                                    const lastPeriod = parseInt(result[0].period);
                                    const secondLastPeriod = parseInt(result[1].period);
                                    const thirdLastPeriod = parseInt(result[2].period);
    
                                    
                                    if (lastPeriod === (secondLastPeriod + 1) && thirdLastPeriod !== (secondLastPeriod - 1)) {
                                        if (period === (lastPeriod + 1)) {
                                            console.log("This faculty cannot be assigned more than two consecutive classes without a break.");
                                            response.send("<script>alert('This faculty cannot be assigned more than two consecutive classes without a break.'); window.location.href='/enfValue';</script>");
                                            return;
                                        }
                                    }
                                }
    
                                
                                db.query(
                                    "INSERT INTO assigneddata (faculty, subject, classroom, period, semister, dayId) VALUES (?, ?, ?, ?, ?, ?)",
                                    [faculty, request.body.subject, request.body.classRoom, period, request.body.semister, day],
                                    function(err, result) {
                                        if (err) {
                                            if (err.code === "ER_DUP_ENTRY") {
                                                console.log("Error Duplicate");
                                            } else {
                                                throw err;
                                            }
                                        }
                                        console.log("Record inserted");
                                        response.redirect("/enfValue");
                                    }
                                );
                            }
                        );
                    }
                }
            );
        } else {
            response.render("index");
        }
    });
    
    

//////////////////Delete////////////////////

router.get("/delenf/:faculty/:period/:dayId", function(request, response) {
    db.query(
        'DELETE FROM assigneddata WHERE faculty = ? AND period = ? AND dayId = ?',
        [request.params.faculty, request.params.period, request.params.dayId],
        function(err, result) {
            if (err) {
                response.send("Unable to perform deletion");
                throw err;
            } else {
                response.redirect("/enfValue");
            }
        }
    );
});


    
module.exports = router;   
    
