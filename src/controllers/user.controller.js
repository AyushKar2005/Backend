import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
     const {fullName,email,username,password}=req.body

     if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
     ){
        throw new ApiError("Please fill all the fields",400)

     }
     const existedUser = User.findOne({
        $or: [{username},{email}]
     })

     if(existedUser){
        throw new ApiError(409,"User already exists")
     }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError("Please upload an avatar",400)
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("Please upload an avatar",400)
    }
    User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError("User not found",404)
    }
    return res.status(201).json(new ApiResponse(200,createdUser,"User created successfully"))


})

export {registerUser}