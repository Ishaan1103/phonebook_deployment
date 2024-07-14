import mongoose from 'mongoose'
import 'dotenv/config'
const URL = process.env.MONGO_URI

mongoose.set('strictQuery',false)

mongoose.connect(URL)

const phonebookSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
    unique: true,
    minLength: 3,
  },
  number: {
    type:String,
    require:true,
    unique:true,
    minLength:8,
    match: /^(?:\d{2}-\d{5,}|\d{3}-\d{4,})$/,
  },
})

phonebookSchema.set('toJSON',{
  transform:(document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('PhoneBook',phonebookSchema)
