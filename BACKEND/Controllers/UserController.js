    import UserModule from "../Module/UserModel.js";
    import bcrypt from "bcryptjs";
    import jwt from "jsonwebtoken";
    import { sendEmail } from "../utils/sendEmail.js";

    export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
        return res.status(400).json({
            message: "Email is required",
            success: false,
        });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await UserModule.findOne({ email });

        if (!user) {
        user = await UserModule.create({
            email,
            otp,
            otpExpire: Date.now() + 5 * 60 * 1000,
            isVerified: false,
        });
        } else {
        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;
        user.isVerified = false;

        await user.save();
        }

        await sendEmail(email, "Your OTP code", `Your OTP is ${otp}`);

        return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
        });
    } catch (error) {
        console.log("Error in sendOtp", error.message);
        return res.status(500).json({
        message: "Error sending OTP",
        success: false,
        });
    }
    };

    export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await UserModule.findOne({ email });

        if (!user) {
        return res.status(400).json({
            message: "User not Found",
            success: false,
        });
        }

        if (user.isVerified) {
        return res.status(400).json({
            message: "Already verified",
        });
        }

        if (user.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
            success: false,
        });
        }

        if (user.otpExpire < Date.now()) {
        return res.status(400).json({
            message: "OTP has Expired",
            success: false,
        });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        return res.status(200).json({
        message: "Email verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
        error: error.message,
        });
    }
    };

    export const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        });
        }

        const user = await UserModule.findOne({ email });

        if (!user) {
        return res.status(400).json({
            message: "Please verify Email first",
            success: false,
        });
        }

        if (!user.isVerified) {
        return res.status(400).json({
            message: "Please verify OTP first",
            success: false,
        });
        }

        //update users details
        user.fullName = fullName;
        user.password = await bcrypt.hash(password, 10);
        user.role = role;

        user.save();

        return res.status(200).json({
        message: "user register successfully",
        success: true,
        });
    } catch (error) {
        return res.status(500).json({
        error: error.message || "Error in register",
        success: false,
        });
    }
    };

    export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({
            message: "Email or Password are required",
            success: false,
        });
        }

        const exitsUser = await UserModule.findOne({ email });

        if (!exitsUser) {
        return res.status(400).json({
            message: "User not exits",
            success: false,
        });
        }

        if (!exitsUser.isVerified) {
        return res.status(400).json({
            message: "Please verify your email first",
            success: false,
        });
        }

        if (!exitsUser.password) {
        return res.status(400).json({
            message: "Please complete registeration first",
            success: false,
        });
        }

        const isMatch = await bcrypt.compare(password, exitsUser.password);

        if (!isMatch) {
        return res.status(400).json({
            message: "Password is Incorrect, Please Enter the valid password",
            success: false,
        });
        }

        const token = jwt.sign(
        { id: exitsUser._id, role: exitsUser.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" },
        );

        res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        });

        const user = {
        _id: exitsUser._id,
        fullName: exitsUser.fullName,
        email: exitsUser.email,
        role: exitsUser.role,
        };

        return res.status(200).json({
        message: "Login successfully",
        success: true,
        token,
        user,
        });
    } catch (error) {
        return res.status(500).json({
        error: "Error in login" || error.message,
        success: false,
        });
    }
    };

    export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModule.findOne({ email });

        if (!user) {
        return res.status(400).json({
            message: "User not Found",
            success: false,
        });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() + 5 * 60 * 1000;

        user.save();

        await sendEmail(
            email,
            "Your OTP Code", 
            `Your OTp Code is ${otp}`
        );

        return res.status(200).json({
        message: "Reset OTP sent in your Email",
        success: true,
        });

    } catch (error) {
        return res.status(500).json({
        error: "Error in ResetOtp",
        success: false,
        });
    }
    };

    export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
        return res.status(400).json({
            message: "Email or Otp is required",
            success: false,
        });
        }

        const user = await UserModule.findOne({ email });

        if (!user) {
        return res.status(400).json({
            message: "User not found",
            success: false,
        });
        }

        if (user.resetOtp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP",
            success: false,
        });
        }

        if (user.resetOtpExpire < Date.now()) {
        return res.status(400).json({
            message: "OTP has been Expired",
            success: false,
        });
        }

        return res.status(200).json({
        message: "OTP Verified successfully",
        success: true,
        });
    } catch (error) {
        return res.status(500).json({
        error: "Error in Verify reset otp",
        success: false,
        });
    }
    };

    export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await UserModule.findOne({ email });

        if (!user) {
        return res.status(400).json({
            message: "User not found",
            success: false,
        });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        user.resetOtp = null;
        user.resetOtpExpire = null;

        await user.save();

        return res.status(200).json({
        message: "Password reset successfully",
        success: true,
        });
    } catch (error) {
        return res.status(500).json({
        error: "Error in Reset password",
        success: false,
        });
    }
    };

    export const logout = async (req, res) => {
    try {
        res.clearCookie("token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        });

        return res.status(200).json({
        message: "Logout successfully",
        success: true,
        });
    } catch (error) {
        return res.status(500).json({
        error: "Error in logout" || error.message,
        success: false,
        });
    }
    };

    export const getMe = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await UserModule.findById(userId);

        if (!user) {
        return res.status(403).json({
            message: "User not found",
        });
        }

        return res.status(200).json({
        message: "User found successfull",
        success: true,
        user,
        });
    } catch (error) {
        return res.status(500).json({
        error: error.message,
        success: false,
        });
    }
    };
