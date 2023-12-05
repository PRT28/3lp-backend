const bcrypt= require("bcrypt");
const jwt=require ("jsonwebtoken");
const User= require("../models/user.js");
const CheckinModal = require("../models/checkin.js");
const RiderDetails = require("../models/riderDetails.js")
const {sendMessage} = require("../config/globals.js");
const {s3Upload} = require('../config/globals.js');

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

const register = async (req, res) => {
    try {
        const {
            username,
            mobile,
            password,
            address,
            email,
            zip_code,
            user_role,
            account_type,
            typeOfVehicle,
            gender
        } = req.body;
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        if (user_role === 3) {
            const rider = new User({
                username,
                mobile,
                password: passwordHash,
                address,
                email,
                user_role,
                checked_in: false,
                typeOfVehicle,
                gender
            })
            await rider.save()
                    .then(() => {
                        const token = jwt.sign({user: rider}, process.env.JWT_SECRET);
                        res.status(201).json({
                            content: {
                                user: rider,
                                status: true,
                                token
                            },
                            message: 'Rider Created Successfully'
                        })
                    })
                    .catch(e => {
                        res.status(500).json({
                            content: {
                                status: false
                            },
                            message: `Failed to created rider! ${e.message}`
                        })
                    });
        } else {
            const user = new User({
                username,
                mobile,
                password: passwordHash,
                address,
                zip_code,
                email,
                user_role,
                account_type
            })
            await user.save()
                    .then(data => {
                        const token = jwt.sign({user}, process.env.JWT_SECRET);
                        res.status(201).json({
                            content: {
                                token,
                                user,
                                status: true
                            },
                            message: 'User Created Successfully'
                        })
                    })
                    .catch(e => {
                        res.status(500).json({
                            content: {
                                status: false
                            },
                            message: `Failed to created user! ${e.message}`
                        })
                    });
        }
    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to created user! ${e.message}`
        })
    }
}

const login = async (req, res) => {
    try {
        const {
            numberOrEmail, password
        } = req.body
        let user;
        if(!isNaN(numberOrEmail)){
            user = await User.findOne({ mobile:numberOrEmail});
        }
        else{
            user = await User.findOne({ email:numberOrEmail});
        }
        if (!user) return res.status(400).json({ msg: "User does not exist. " });
        // if (user.status===false) return res.status(400).json({ msg: "Account is diabled" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        if (user.user_role === 3) {
            const rider = await RiderDetails.aggregate([
                {
                  $lookup: {
                    from: 'user',
                    localField: 'riderId',
                    foreignField: '_id',
                    as: 'userDetails'
                  }
                },
                {$unwind: "$userDetails"},
                {$match: {"userDetails.mobile": numberOrEmail}}
              ]);
            const token = jwt.sign({user: rider}, process.env.JWT_SECRET);
            return res.status(200).json({
                content: {
                    token,
                    rider,
                    status: true
                },
                message: 'User Logged In Successfully'});
        }
    
        const token = jwt.sign({user}, process.env.JWT_SECRET);
        user.$set('password', null);
        return res.status(200).json({
            content: {
                token,
                user,
                status: true
            },
            message: 'User Logged In Successfully'});

    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to login user! ${e.message}`
        })
    }
};

const checkin = async (req, res) => {
    try {
        const {user} = req.user;
        if(user.user_role !== 3 ){
            return res.status(403).json({ msg: "Only available for rider account" });
        }
        const checkin = new CheckinModal({
            checkin_time: new Date().getTime(),
            checkout_time: null,
            userId: user._id
        });
        await User.findByIdAndUpdate(user._id, { checked_in: true })
        await checkin.save()
            .then(data => {
                res.status(201).json({
                    content: {
                        status: true
                    },
                    message: 'Rider Logged in Successfully'
                })
            })
            .catch(e => {
                res.status(500).json({
                    content: {
                        status: false
                    },
                    message: `Failed to clock in rider! ${e.message}`
                })
            });

    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to clock in rider! ${e.message}`
        })
    }
}

const checkout = async (req, res) => {
    try {
        const {user} = req.user;
        if(user.user_role !== 3 ){
            return res.status(403).json({ msg: "Only available for rider account" });
        }
        User.findByIdAndUpdate(user._id, { checked_in: false })
        const checkin = await CheckinModal.findOne({userId: user._id, checkout_time: null});
        console.log(checkin)
        if (!checkin) {
            res.status(400).json({
                content: {
                    status: false
                },
                message: 'No active session for user'
            })
        } else {
                checkin.$set('checkout_time', new Date().getTime())
            await checkin.save()
                .then(() => res.status(200).json({
                    content: {
                        status: true,
                    },
                    message: 'Rider logged out successfully'
                }))
        }
    }  catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
}
const calender = async (req, res) => {
    try {
        const{userId}=req.param;
        const checkin = await CheckinModal.find({userId});
            res.status(200).json({
                content: {
                    status: true,
                    data:checkin
                },
                message: 'Calender Fetched Successfully'
            })
        }catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
}
const sendOtp = async (req, res) => {
    try {
        const {phone} = req.query;
        const otp = Math.floor(100000 + Math.random() * 900000);
        cache.set(phone, otp, 120);
        const template = `Your OTP to sign in into your Facilytis account is ${otp}. This otp is valid for 2 mins`
        sendMessage(phone, template);
        res.status(200).json({
            message: "OTP sent successfully to your mobile number",
            content: {
                status: true
            }
        })
    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
} 

const checkOtp = async (req, res) => {
    try {
        const {
            phone,
            otp
        } = req.body
        const originalOtp = cache.get(phone);
        if (!originalOtp) {
            res.status(404).json({
                content: {
                    status: false
                },
                message: 'OTP may be expired'
            })
        } else if (originalOtp !== otp) {
            res.status(403).json({
                content: {
                    status: false
                },
                message: 'Invalid OTP try again'
            })
        } else {
            cache.set(phone,otp*(-1),300);
            res.status(200).json({
                content: {
                    status: true
                },
                message: 'OTP verified successfully'
            })
        }
    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
}

const updateRiderDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const {
            accountNumber,
            bankName,
            ifscCode,
            idprooftype,
            typeOfVehicle,
            idNumber,
            deliveryPref,
            workPref,
            zipCode,
            riderId,
        } = req.body;
        const {
            profileImageUrl,
            idFrontImgUrl,
            idBackImgUrl,
            panUrl,
            dlBackUrl,
            dlFrontUrl,
        } = req.files
        let profile = s3Upload({
            Key:`profile.${profileImageUrl.name.split('.')[1]}`,
            Body: Buffer.from(profileImageUrl.data),
            ContentType: profileImageUrl.mimtype
        })
        let idFront = s3Upload({
            Key: `idFront.${idFrontImgUrl.name.split('.')[1]}`,
            Body: Buffer.from(idFrontImgUrl.data),
            ContentType: idFrontImgUrl.mimtype
        })
        let idBack = s3Upload({
            Key: `idBack.${idBackImgUrl.name.split('.')[1]}`,
            Body: Buffer.from(idBackImgUrl.data),
            ContentType: idBackImgUrl.mimtype
        })
        let pan = s3Upload({
            Key: `pan.${panUrl.name.split('.')[1]}`,
            Body: Buffer.from(panUrl.data),
            ContentType: panUrl.mimtype
        })
        let dlFront = s3Upload({
            Key: `dlFront.${dlFrontUrl.name.split('.')[1]}`,
            Body: Buffer.from(dlFrontUrl.data),
            ContentType: dlFrontUrl.mimtype
        })
        let dlBack = s3Upload({
            Key: `dlBack.${dlBackUrl.name.split('.')[1]}`,
            Body: Buffer.from(dlBackUrl.data),
            ContentType: dlBackUrl.mimtype
        })
        const user = await User.findByIdAndUpdate(id, {typeOfVehicle});
        await new RiderDetails({
            profileImageUrl: profile,
            accountNumber,
            bankName,
            ifscCode,
            idprooftype,
            idFrontImgUrl: idFront,
            idBackImgUrl: idBack,
            panUrl: pan,
            dlBackUrl: dlFront,
            dlFrontUrl: dlBack,
            idNumber,
            deliveryPref,
            workPref,
            zipCode,
            riderId
        }).save();

        const rider = await RiderDetails.aggregate([
            {
              $lookup: {
                from: 'user',
                localField: 'riderId',
                foreignField: '_id',
                as: 'userDetails'
              }
            },
            {$unwind: "$userDetails"},
            {$match: {"userDetails._id": id}}
          ]);
        const token = jwt.sign({user: rider}, process.env.JWT_SECRET);
        return res.status(201).json({
            content: {
                token,
                user,
                status: true
            },
            message: 'User Created Successfully'
        })
    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const {user} = req.user;
        const {id} = req.params;
        await User.findByIdAndDelete(id)
            .then(async () => {
                if (user.user_role === 3) {
                    await RiderDetails.findOneAndDelete({riderId: id})
                        .then(() => {
                            res.status(200).json({
                                content: {
                                    status: true,
                                    message: 'Rider deleted Successfully'
                                }
                            })
                        })
                } else {
                    res.status(200).json({
                        content: {
                            status: true,
                            message: 'Rider deleted Successfully'
                        }
                    })
                }
            })
        

    } catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const {role} = req.query
        if (role) {
            const riders = await User.find({user_role: role})
            res.status(200).json({
                content: {
                    riders,
                    status: true
                },
                message: 'Riders fetched Successfully'
            })
        } else {
            const riders = await User.find({})
            res.status(200).json({
                content: {
                    riders,
                    status: true
                },
                message: 'Riders fetched Successfully'
            })
        }
        
    }  catch (e) {
        res.status(500).json({
            content: {
                status: false
            },
            message: e.message
        })
    }
} 

module.exports = {
    register,
    login,
    checkin,
    checkout,
    calender,
    sendOtp,
    checkOtp,
    updateRiderDetails,
    deleteUser,
    getAllUsers
}
