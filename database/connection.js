const mongoose = require("mongoose");


async function initialize_mongo_connectivity() {
    const URI ="mongodb+srv://jijinjose7598:ql5VG0XBYYroVkRi@cluster0.wtblw.mongodb.net/";
    
    
    // console.log(process.env.NODE_ENV);
  console.log("mongodb connectivity initialize");
  try {
    const response = await mongoose.connect(URI, {
      dbName: "capstone",
    });

    console.log("mongodb connectivity success");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  initialize_mongo_connectivity,
};
