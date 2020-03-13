const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_API_KEY,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true})
