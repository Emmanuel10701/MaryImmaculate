"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  LoaderCircle,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Create a separate component that uses useSearchParams
const ResetPasswordContent = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // States to track password conditions
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    } else {
      console.log("Token from URL:", token);
    }
  }, [token]);

  // This useEffect hook updates the password conditions in real-time
  useEffect(() => {
    // Check for minimum length (at least 8 characters)
    setHasMinLength(newPassword.length >= 8);

    // Check for at least one number using a regular expression
    setHasNumber(/[0-9]/.test(newPassword));

    // Check for at least one letter (uppercase or lowercase)
    setHasLetter(/[a-zA-Z]/.test(newPassword));

    // Check if the two password fields match
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== "");
  }, [newPassword, confirmPassword]);

  // Redirect to login after successful reset
  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        router.push("/pages/adminLogin");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if token exists
    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.");
      setLoading(false);
      return;
    }

    // Check all conditions are met before attempting submission
    if (!hasMinLength || !hasNumber || !hasLetter || !passwordsMatch) {
      setError("Please meet all password requirements.");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting password reset request...");
      console.log("Token being sent:", token);
      
      // Call the actual API endpoint - send raw token (backend will hash it)
      const response = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token, // Send the raw UUID token - backend will hash it
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      console.log("Password reset successful!");
      
      // Set success state
      setResetSuccess(true);

    } catch (error) {
      console.error("Failed to reset password:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  // Helper component for the list items to apply conditional styling
  const ConditionItem = ({ condition, text }) => {
    const iconClasses = condition ? "text-green-500" : "text-gray-400";
    const textClasses = condition ? "text-green-300" : "text-gray-400";

    return (
      <li className="flex items-center gap-2 py-1">
        {condition ? (
          <CheckCircle size={16} className={iconClasses} />
        ) : (
          <XCircle size={16} className={iconClasses} />
        )}
        <span className={`${textClasses} text-sm sm:text-base`}>{text}</span>
      </li>
    );
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6"
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
        <AlertCircle className="text-red-400 shrink-0 mt-0.5 sm:mt-0" size={18} />
        <p className="text-red-300 text-sm sm:text-base">{message}</p>
      </div>
    </motion.div>
  );

  // Success message component
  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 sm:py-8 px-2"
    >
      <div className="flex justify-center mb-3 sm:mb-4">
        <CheckCircle size={48} className="text-green-500 sm:w-16 sm:h-16" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 px-2">
        Password Reset Successful!
      </h2>
      <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 px-2">
        Your password has been successfully reset. Redirecting to login page...
      </p>
      <div className="flex justify-center items-center gap-2 mb-4">
        <LoaderCircle className="animate-spin text-white" size={20} />
        <span className="text-gray-300 text-xs sm:text-sm">Redirecting in 3 seconds</span>
      </div>
      
      {/* Manual redirect option */}
      <button
        onClick={() => router.push("/login")}
        className="mt-4 sm:mt-6 bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
      >
        Go to Login Now
      </button>
    </motion.div>
  );

  // No token message component
  const NoTokenMessage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 sm:py-8 px-2"
    >
      <div className="flex justify-center mb-3 sm:mb-4">
        <AlertCircle size={48} className="text-red-500 sm:w-16 sm:h-16" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Invalid Reset Link
      </h2>
      <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 px-2">
        This password reset link is invalid or has expired. Please request a new reset link.
      </p>
      <button
        onClick={() => router.push("/forgot-password")}
        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base w-full"
      >
        Request New Reset Link
      </button>
    </motion.div>
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-3 sm:p-4 font-sans">
        <div className="w-full max-w-md sm:max-w-xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-lg bg-white/10 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden">
          <NoTokenMessage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-3 sm:p-4 font-sans">
      <motion.div
        className="w-full max-w-md sm:max-w-xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-lg bg-white/10 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden transform-gpu"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative elements - smaller on mobile */}
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2000ms'}}></div>

        {resetSuccess ? (
          <SuccessMessage />
        ) : (
          <>
            {/* The rest of the UI (title, description) still animates in */}
            <motion.div className="relative z-10 text-center mb-4 sm:mb-6" variants={containerVariants}>
              <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <KeyRound className="text-white w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    Reset Password
                  </h1>
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-4 sm:mb-6 px-2">
                Enter your new password below to reset your account password.
              </p>
              <div className="flex justify-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full">#Security</span>
                <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full">#AccountRecovery</span>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full h-12 sm:h-14 pl-9 sm:pl-12 pr-10 sm:pr-12 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 text-sm sm:text-base"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-sm space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-white/10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
                  Password Requirements:
                </h3>
                <ul className="space-y-1">
                  <ConditionItem condition={hasMinLength} text="At least 8 characters" />
                  <ConditionItem condition={hasNumber} text="Contains a number" />
                  <ConditionItem condition={hasLetter} text="Contains a letter" />
                </ul>
                
                <div className="mt-4 sm:mt-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full h-12 sm:h-14 pl-9 sm:pl-12 pr-10 sm:pr-12 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 text-sm sm:text-base"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <ConditionItem condition={passwordsMatch} text="Passwords match" />
                </div>
              </div>

              <motion.div variants={containerVariants}>
                <button
                  type="submit"
                  disabled={loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch}
                  className={`w-full h-12 sm:h-14 rounded-xl text-white font-semibold transition-all duration-300 ${
                    loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
                  } text-sm sm:text-base`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoaderCircle className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="ml-2">Resetting Password...</span>
                    </div>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </motion.div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Main component with Suspense boundary
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md sm:max-w-xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-lg bg-white/10 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden">
          <div className="text-center py-6 sm:py-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <LoaderCircle className="animate-spin text-white w-10 h-10 sm:w-12 sm:h-12" size={48} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Loading...</h2>
            <p className="text-gray-300 text-sm sm:text-base">Checking reset link validity</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;