const express = require('express');
const fs = require('fs');
const mongoose=require('mongoose');
//const AllReports=mongoose.model("AllReports");
const { cityFinder } = require('./geo');

const router = express.Router();

let allReports = [];

function loadDB() {
  fs.readFile('db/reports.json', 'utf-8', (error, data) => {
    if (error) {
      console.log(error);
      throw new Error('Unable to read reports file');
    }

    allReports = JSON.parse(data);
  })
}

loadDB()

async function saveDB() {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(allReports);

    fs.writeFile('db/reports.json', jsonData, (error) => {
      if (error) {
        console.error(error);

        reject(error);
      }

      console.log('Response Written to File');
      resolve();
    });
  });
}

async function createReport({ name, age, gender, state, district, city }) {
  const l = allReports.length;
  const pid=allReports[l-1].id+1;
  const { longitude, latitude } = global.citiesData[city];

  allReports.push({
    id: pid, name, age, gender, state, district, city, latitude, longitude
  })

  console.log(allReports)
  await saveDB();
}

async function readReport(reportId) {
  

  await saveDB();
}

async function updateReport({reportId, name, age, gender, state, district, city }) {
  
  const { longitude, latitude } = global.citiesData[city];
  for(var i=0;i<allReports.length;i++){
      if(allReports[i].id==reportId){
        allReports[i].name=name;
        allReports[i].age=age;
        allReports[i].gender=gender;
        allReports[i].state=state;
        allReports[i].district=district;
        allReports[i].city=city;
        allReports[i].latitude=latitude;
        allReports[i].longitude=longitude;
      }
  }
  
  await saveDB();
}

async function removeReport(reportId) {
  
  allReports=allReports.filter(item=>{
        if(item.id!=reportId){
            return item;
        }
        
  })
  await saveDB();
}


router.route('/')
  .get((req, res) => {
    res.render('pages/reports', {
      reports: allReports,
      
      mapboxKey: 'pk.eyJ1Ijoiam95ZGVlcC1pYiIsImEiOiJja2I4eXhpcWEwOTEwMnVwa3ZsOGg3ZmZ1In0.oS2EZQ7fdhItSubL4NMZBA',

    });
    //res.send(allReports);
  })
  .post((req, res) => {
    res.status(405).send('Method Not Supported')
  });


router.route('/new')
  .get((req, res) => {
    res.render('pages/create_report', {});
  })
  .post((req, res) => {
    const { pname: name, age, gender, pstate: state, district, city } = req.body;

    createReport({ name, age, gender, state, district, city });

    res.redirect('/reports')
  });

router.route('/edit/:reportId')
  .get((req, res) => {
    const dta={id:req.params.reportId};
    res.render('pages/edit_report', {data:dta});
  })
  .post((req, res) => {
    const { pname: name, age, gender, pstate: state, district, city } = req.body;
    const reportId=req.params.reportId;
    updateReport({ reportId,name, age, gender, state, district, city });

    res.redirect('/reports')
  });


router.route('/:reportId')
  .get((req, res) => {

    console.log(req.params.reportId);
    let d=req.params.reportId;

    let data=allReports.filter(item=>{
        if(item.id==req.params.reportId){
            return item;
        }
        
    })
    console.log(data[0]);
    //let data=allReports[d];
    res.render('pages/report', {data:data[0]});
  })
  .post((req, res) => {
    res.status(405).send("Method not allowed")
  })
  .put((req, res) => {

  })
  .delete((req, res) => {
    console.log("ara h",req.params.reportId);
    removeReport(req.params.reportId);

  })

module.exports = router;