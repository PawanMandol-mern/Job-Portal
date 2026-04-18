    import axios from "axios";
    import React, { useEffect, useState } from "react";
    import toast from "react-hot-toast";
    import { useNavigate } from "react-router-dom";

    const ForgatePassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");

    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
        }
    }, [timer]);

    const handleSendOtp = async () => {
        if (!email) return toast.error("Enter email first");

        try {
        setLoading(true);

        const res = await axios.post(
            "http://localhost:3000/api/user/reset-send-otp",
            { email }
        );

        toast.success(res.data.message);
        setStep(2);
        setTimer(30);
        } catch (error) {
        toast.error(error.response?.data?.message || "Error sending OTP");
        } finally {
        setLoading(false);
        }
    };


    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Enter OTP");

        try {
        setLoading(true);

        const res = await axios.post(
            "http://localhost:3000/api/user/verify-reset-otp",
            { email, otp }
        );

        toast.success(res.data.message);
        setStep(3);
        } catch (error) {
        toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
        setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !reEnterPassword) {
        return toast.error("Enter both passwords");
        }

        if (newPassword !== reEnterPassword) {
        return toast.error("Passwords do not match");
        }

        try {
        setLoading(true);

        const res = await axios.post(
            "http://localhost:3000/api/user/reset-password",
            { email, newPassword }
        );

        toast.success(res.data.message);
        navigate("/login");
        } catch (error) {
        toast.error(error.response?.data?.message || "Error resetting password");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">

        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

            <h1 className="text-2xl font-bold text-center text-blue-500 mb-4">
            Reset Password
            </h1>

            {/* EMAIL */}
            <div className="flex gap-2 mb-4">
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                disabled={step > 1}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
            />

            <button
                onClick={handleSendOtp}
                disabled={loading || timer > 0}
                className="bg-blue-500 text-white px-3 rounded-lg"
            >
                {loading ? "..." : timer > 0 ? `${timer}s` : "Send OTP"}
            </button>
            </div>

            {/* OTP STEP */}
            {step === 2 && (
            <>
                <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                />

                <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="bg-green-500 text-white px-3 rounded-lg"
                >
                    {loading ? "..." : "Verify"}
                </button>
                </div>

                {/* RESEND */}
                <div className="text-sm text-center">
                {timer > 0 ? (
                    <span>Resend OTP in {timer}s</span>
                ) : (
                    <button
                    onClick={handleSendOtp}
                    className="text-blue-500 underline"
                    >
                    Resend OTP
                    </button>
                )}
                </div>
            </>
            )}

            {/* PASSWORD STEP */}
            {step === 3 && (
            <>
                <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg mb-3"
                />

                <input
                type="password"
                placeholder="Re-enter Password"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg mb-3"
                />

                <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-lg"
                >
                {loading ? "Resetting..." : "Reset Password"}
                </button>
            </>
            )}
        </div>
        </div>
    );
    };

    export default ForgatePassword;