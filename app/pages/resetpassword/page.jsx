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
        router.push("/pages/login");
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
      <li className="flex items-center gap-2">
        {condition ? (
          <CheckCircle size={18} className={iconClasses} />
        ) : (
          <XCircle size={18} className={iconClasses} />
        )}
        <span className={textClasses}>{text}</span>
      </li>
    );
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="text-red-400 shrink-0" size={20} />
        <p className="text-red-300 text-sm">{message}</p>
      </div>
    </motion.div>
  );

  // Success message component
  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
      <p className="text-gray-300 mb-4">
        Your password has been successfully reset. Redirecting to login page...
      </p>
      <div className="flex justify-center items-center gap-2">
        <LoaderCircle className="animate-spin text-white" size={24} />
        <span className="text-gray-300 text-sm">Redirecting in 3 seconds</span>
      </div>
      
      {/* Manual redirect option */}
      <button
        onClick={() => router.push("/login")}
        className="mt-6 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl transition-all duration-300"
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
      className="text-center py-8"
    >
      <div className="flex justify-center mb-4">
        <AlertCircle size={64} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
      <p className="text-gray-300 mb-6">
        This password reset link is invalid or has expired. Please request a new reset link.
      </p>
      <button
        onClick={() => router.push("/forgot-password")}
        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
      >
        Request New Reset Link
      </button>
    </motion.div>
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-xl w-full mx-auto p-8 sm:p-10 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
          <NoTokenMessage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4 font-sans">
      <motion.div
        className="max-w-xl w-full mx-auto p-8 sm:p-10 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl relative overflow-hidden transform-gpu"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2000ms'}}></div>

        {resetSuccess ? (
          <SuccessMessage />
        ) : (
          <>
            {/* The rest of the UI (title, description) still animates in */}
            <motion.div className="relative z-10 text-center" variants={containerVariants}>
              <div className="flex items-center justify-center mb-4">
                <KeyRound className="text-white text-4xl mr-3" />
                <h1 className="text-4xl font-extrabold tracking-tight">Reset Password</h1>
              </div>
              <p className="text-base text-gray-300 mb-6">
                Enter your new password below to reset your account password.
              </p>
              <div className="flex justify-center flex-wrap gap-2 text-sm font-medium mb-8">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm">#Security</span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm">#AccountRecovery</span>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full h-14 pl-12 pr-12 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <ul className="text-sm space-y-2 mt-4 p-4 rounded-xl backdrop-blur-sm bg-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Password must:</h3>
                <ConditionItem condition={hasMinLength} text="Be at least 8 characters long" />
                <ConditionItem condition={hasNumber} text="Contain a number" />
                <ConditionItem condition={hasLetter} text="Contain a letter" />
                <div>
                  <div className="relative mt-6">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full h-14 pl-12 pr-12 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <ConditionItem condition={passwordsMatch} text="Passwords match" />
              </ul>

              <motion.div variants={containerVariants}>
                <button
                  type="submit"
                  disabled={loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch}
                  className={`w-full h-14 rounded-xl text-white font-semibold transition-all duration-300 transform ${
                    loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoaderCircle className="animate-spin" size={24} />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full mx-auto p-8 sm:p-10 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <LoaderCircle className="animate-spin text-white" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
            <p className="text-gray-300">Checking reset link validity</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;