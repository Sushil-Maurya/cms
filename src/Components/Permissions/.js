const Jobs = require("../models/jobs");
const Activity = require("../models/userActivity");
const s3Upload = require("../helper/s3upload");
const csv = require("csvtojson");
const json2csv = require("json2csv").parse;
const fs = require("fs");
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
const create = async (req, res, nest) => {
  try {
    if (
      req.body.name &&
      req.body.createdby
    ) {
      let jobs = new Jobs({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        createdby: req.body.createdby,
      });
      
      if (req.body.company) {
          jobs.company = req.body.company
      }
      
      if (req.body.company_address) {
          jobs.company_address = req.body.company_address
      }
      
      if (req.body.joiningDate) {
          jobs.joiningDate = req.body.joiningDate
      }
      
      if (req.body.status) {
          jobs.status = req.body.status
      }
      
      

      if (req.body.image) {
        let uploadedFile = await s3Upload(req.body.image, "/jobs");
        if (uploadedFile != null) {
          jobs.image = uploadedFile;
        }
      }
      if (req.body.cv) {
        let uploadedFile = await s3Upload(req.body.cv, "/cv");
        if (uploadedFile != null) {
          jobs.cv = uploadedFile;
        }
      }

      jobs.save();
      let userActivity = new Activity({
        userid: req.body.createdby,
        module: "Job",
        activity: "create",
        newdata: JSON.stringify(jobs),
      });
      userActivity
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "Job added successfuly",
          });
        })
        .catch((error) => {
          res.json({
            status: false,
            message: error.message || "An error Occured!",
          });
        });
    } else {
      res.json({
        status: false,
        message: "please provide all request field",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

let update = async (req, res) => {
  try {
    if (
      req.body.updatedby &&
      req.body.jobID
    ) {
      let jobID = req.body.jobID;

      let updatedata = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        updatedby: req.body.updatedby,
        reminder: req.body.reminder,
      };

      
      if (req.body.company) {
          updatedata.company = req.body.company
      }
      
      if (req.body.company_address) {
          updatedata.company_address = req.body.company_address
      }
      
      if (req.body.joiningDate) {
          updatedata.joiningDate = req.body.joiningDate
      }
      
      if (req.body.status) {
          updatedata.status = req.body.status
      }
      
      if (req.body.image) {
        let uploadedFile = await s3Upload(req.body.image, "/jobs");
        if (uploadedFile != null) {
          updatedata.image = uploadedFile;
        }
      }
      if (req.body.cv) {
        let uploadedFile = await s3Upload(req.body.cv, "/cv");
        if (uploadedFile != null) {
          updatedata.image = uploadedFile;
        }
      }

      let previousdata = await Jobs.findById(jobID);

      let s = await Jobs.findByIdAndUpdate(jobID, { $set: updatedata });
      let userActivity = new Activity({
        userid: req.body.updatedby,
        module: "Job",
        activity: "update",
        olddata: JSON.stringify(previousdata),
        newdata: JSON.stringify(updatedata),
      });
      userActivity
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "Job updated successfuly",
          });
        })
        .catch((error) => {
          res.json({
            status: false,
            message: "An error Occured!",
          });
        });
    } else {
      res.json({
        status: false,
        message: "please provide all request field",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

let view = async (req, res) => {
  try {
    if (req.body.page && req.body.limit) {
      var requestbody = req.body;
      var query = {};

      if (
        requestbody.from &&
        requestbody.from != "" &&
        requestbody.to &&
        requestbody.to != ""
      ) {
        var from = new Date(requestbody.from);
        var to = new Date(requestbody.to);
        to.setDate(to.getDate() + 1);
        query = { ...query, createdAt: { $gte: from, $lte: to } };
      }

      if (req.body.userID) {
        query = { ...query, createdby: req.body.userID };
      }
      if (req.body.jobID) {
        query = { ...query, _id: req.body.jobID };
      }

      if (req.body.status) {
        query = { ...query, status: req.body.status };
      }


      let page = req.body.page;
      let limit = req.body.limit;
      var options = await {
        limit: limit,
        page: page,
        populate: [
          {
            path: "createdby",
            select: "name",
          },
          {
            path: "updatedby",
            select: "name",
          },
        ],
        sort: { createdAt: -1 },
      };
      // find products and paginate
      let products = await Jobs.paginate(query, options)
        .then((response) => {
          res.json({
            status: true,
            message: "data found Successful",
            response: response,
          });
        })
        .catch((error) => {
          res.json({
            status: false,
            message: "An error Occured!",
          });
        });
    } else {
      res.json({
        status: false,
        message: "please provide all request field !",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

let status = async (req, res) => {
  try {
    if (req.body.jobID && req.body.status && req.body.updatedby) {
      let jobID = req.body.jobID;

      let updatedata = {
        status: req.body.status,
        updatedby: req.body.updatedby,
      };
      let previousdata = await Jobs.findById(jobID);
      let s = await Jobs.findByIdAndUpdate(jobID, { $set: updatedata });

      let userActivity = new Activity({
        userid: req.body.updatedby,
        module: "Setter",
        activity: "status update",
        olddata: JSON.stringify(previousdata),
        newdata: JSON.stringify(updatedata),
      });
      userActivity
        .save()
        .then((response) => {
          res.json({
            status: true,
            message: "Jobs status updated successfuly",
          });
        })
        .catch((error) => {
          res.json({
            status: false,
            message: "An error Occured!",
          });
        });
    } else {
      res.json({
        status: false,
        message: "please provide all request field !",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

const destory = async (req, res, next) => {
  try {
    if (req.body.jobID && req.body.updatedby) {
      let jobID = req.body.jobidID;
      let deletedData = await Jobs.findById(jobID);
      let userActivity = new Activity({
        userid: req.body.updatedby,
        module: "Job",
        activity: "Delete",
        olddata: JSON.stringify(deletedData),
      });
      await userActivity.save();
      await Jobs.findByIdAndRemove(jobID)
        .then((response) => {
          return res.json({
            status: true,
            message: "Job Deleted Successfuly",
          });
        })
        .catch((error) => {
          return res.json({
            status: false,
            message: "An error Occured!",
          });
        });
    } else {
      return res.json({
        status: false,
        message: "please provide all request field !",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

const importData = async (req, res) => {
  try {
    var base64 = req.body.base64;
    let bufferObj = Buffer.from(base64, "base64");

    // Encode the Buffer as a utf8 string
    let decodedString = bufferObj.toString("utf8");
    let spl = decodedString.split("\n");

    var InsertData = [];

    for (let x = 1; x < spl.length - 1; x++) {
      var content = spl[x];
      var impData = content.split(",");
      var temp = {
        letter_no: impData[1],
        letter_to: impData[2],
        subject: impData[3],
        brief: impData[4],
        ministryID: impData[5],
        letterstatus: impData[6],
        status: impData[7],
        letter_date: impData[8],
        image: impData[9],
  
        reminder: impData[10],
        createdby: req.body.userID,
      };
      //  console.log(temp);
      InsertData.push(temp);
    }

    Letter.insertMany(InsertData)
      .then(function () {
        return res.json({
          status: true,
          message: "Letter import successfuly",
        });
      })
      .catch(function (err) {
        return res.json({
          status: false,
          message: "An error Occured!",
          err,
        });
      });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

const exportData = async (req, res) => {
  try {
    const dateTime = new Date()
      .toISOString()
      .slice(-24)
      .replace(/\D/g, "")
      .slice(0, 14);

    const filePath = "export/letter" + dateTime + ".csv";
    let csv;

    const data = await Letter.find({});
    const fields = [
      "_id",
      "letter_no",
      "letter_to",
      "subject",
      "brief",
      "ministryID",
      "letterstatus",
      "status",
      "letter_date",
      "image",
   
      "reminder",
    ];
    try {
      csv = json2csv(data, { fields });
    } catch (err) {
      return res.json({
        status: false,
        message: "An error Occured!",
      });
    }
    fs.writeFile(filePath, csv, function (err) {
      if (err) {
        return res.json(err).status(500);
      } else {
        return res.json({
          status: true,
          message: "Letter export successfuly",
          filePath: filePath,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

const importupdate = async (req, res) => {
  try {
    var base64 = req.body.base64;
    let bufferObj = Buffer.from(base64, "base64");

    // Encode the Buffer as a utf8 string
    let decodedString = bufferObj.toString("utf8");
    let spl = decodedString.split("\n");

    let InsertData = [];
    let keyss = spl[0].split(",");
    for (let x = 1; x < spl.length - 1; x++) {
      let content = spl[x];
      let impData = content.split(",");
      let temp = { updatedby: req.body.userID };

      for (let i = 0; i < keyss.length; i++) {
        temp = { ...temp, [keyss[i]]: impData[i] };
      }
      InsertData.push(temp);
    }
    try {
      for (let j = 0; j < InsertData.length; j++) {
        const ID = InsertData[j]._id;
        let data = InsertData[j];
        await Letter.findByIdAndUpdate(ID, { $set: data });
      }
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: error.message || "please send the valid data .",
      });
    }
    res.json({
      status: true,
      message: "data update successfuly",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};
module.exports = {
  create,
  update,
  view,
  status,
  destory,
  importData,
  exportData,
  importupdate
};
