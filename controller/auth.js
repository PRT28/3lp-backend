const bcrypt= require("bcrypt");
const jwt=require ("jsonwebtoken");
const User= require("../models/user.js");
const CheckinModal = require("../models/checkin.js");
const {sendMessage} = require("../config/globals.js");

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

const register = async (req, res) => {
    try {
        const {
            name,
            mobile,
            password,
            address,
            zipcode,
            user_role,
            account_type
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        if (user_role === 3) {
            const rider = new User({
                name,
                mobile,
                password: passwordHash,
                address,
                zipcode,
                user_role,
                checked_in: false
            })
            await rider.save()
                    .then(() => {
                        const token = jwt.sign({rider}, process.env.JWT_SECRET);
                        res.status(201).json({
                            content: {
                                token,
                                rider,
                                status: true
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
                name,
                mobile,
                password: passwordHash,
                address,
                zipcode,
                user_role,
                account_type
            })
            await rider.save()
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
            name, password
        } = req.body
        const user = await User.findOne({ name });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });
        // if (user.status===false) return res.status(400).json({ msg: "Account is diabled" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    
        const token = jwt.sign({user}, process.env.JWT_SECRET);
        user.$set('password', null);
        res.status(200).json({
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
        const {user} = req;
        const checkin = new CheckinModal({
            checkin_time: new Date().getTime(),
            checkout_time: null,
            user_id: user._id
        });
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
        const {user} = req;
        const checkin = CheckinModal.find({user_id: user._id, checkout_time: null});
        if (!checkin) {
            res.status(400).json({
                content: {
                    status: false
                },
                message: 'No active session for user'
            })
        } else {
            await checkin.set('checkout_time', new Date().getTime())
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
            cache.del(phone);
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

module.exports = {
    register,
    login,
    checkin,
    checkout,
    sendOtp,
    checkOtp
}
