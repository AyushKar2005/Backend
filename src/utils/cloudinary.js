import {v2 as cloudinary} from "cloudinary"

import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (file) => {
    try{
        if(!file) return null
        const response = await cloudinary.uploader.upload(file,{
            resource_type:"auto",
        })
        console.log("File has been uploaded successfully")
        fs.unlinkSync(file);
        return response;
    }
    catch(err){
        fs.unlinkSync(file);
        console.log(err)
        return null
    }
}

export default uploadOnCloudinary