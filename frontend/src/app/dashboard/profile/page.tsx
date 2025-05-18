"use client";

import { useState, useRef, FormEvent, ChangeEvent, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  BookOpenIcon,
  PencilIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Update the interface
interface ProfileFormData {
  name: string;
  email: string;
  role: string;
  location: string;
  website: string;
  joinDate: string;
  interests: string[];
  currentKnowledge: string; // Instead of bio
}

const interestOptions = [
  "Machine Learning", "Deep Learning", "Natural Language Processing", 
  "Computer Vision", "Reinforcement Learning", "Data Science", 
  "Neural Networks", "AI Ethics", "Robotics", "Quantum Computing"
];

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [passwordError, setPasswordError] = useState("");
  
  // Add animation when component mounts
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const user = authService.getCurrentUser();
  
  // Update the initial state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
    location: user?.location || "San Francisco, CA",
    website: user?.website || "atomicsensei.com",
    joinDate: user?.joinDate || "January 2024",
    interests: user?.interests || ["Machine Learning", "Neural Networks", "Data Science"],
    currentKnowledge: user?.currentKnowledge || `
    - Machine Learning: Proficient in regression, classification, and clustering algorithms (82%)
    - Deep Learning: Experience with CNNs and basic neural network architectures (65%)
    - Natural Language Processing: Basic understanding of text processing and sentiment analysis (45%)
    - Python Programming: Advanced skills with Python, pandas, numpy, and scikit-learn (90%)
    - Mathematics for ML: Solid understanding of linear algebra, calculus, and statistics (75%)
    `,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Simple validation
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Password updated successfully!");
      setShowPasswordForm(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would send the data to your backend
      console.log("Profile updated:", { ...formData, avatar });
      
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <div className="relative mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        
        <div className="relative z-10 px-8 pt-16 pb-20 text-center sm:text-left sm:flex sm:items-end">
          <motion.div 
            className="relative mx-auto sm:mx-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div 
              onClick={handleAvatarClick}
              className="relative w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white cursor-pointer shadow-xl"
            >
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-full h-full text-gray-300" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <PencilIcon className="h-8 w-8 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
          
          <div className="mt-6 sm:mt-0 sm:ml-8 sm:flex-1">
            <h1 className="text-3xl font-bold text-white">{formData.name}</h1>
            <p className="mt-1 text-blue-100 text-lg">{formData.role} at Atomic Sensei</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.interests.slice(0, 3).map((interest, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                >
                  {interest}
                </span>
              ))}
              {formData.interests.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                  +{formData.interests.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start"
        >
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
          <p className="text-green-800">{successMessage}</p>
        </motion.div>
      )}
      
      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("personal")}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === "personal" 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <div className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5" />
              Personal Information
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("security")}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === "security" 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <div className="flex items-center">
              <LockClosedIcon className="mr-2 h-5 w-5" />
              Security
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("learning")}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === "learning" 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <div className="flex items-center">
              <BookOpenIcon className="mr-2 h-5 w-5" />
              Learning Preferences
            </div>
          </button>
        </nav>
      </div>
      
      {/* Content Sections */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AcademicCapIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <select
                          name="role"
                          id="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="professional">Professional</option>
                          <option value="researcher">Researcher</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                          placeholder="example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Member Since
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="joinDate"
                          id="joinDate"
                          value={formData.joinDate}
                          readOnly
                          className="bg-gray-50 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Areas of Interest
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {interestOptions.map((interest) => (
                        <div key={interest} className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`interest-${interest}`}
                              type="checkbox"
                              checked={formData.interests.includes(interest)}
                              onChange={() => handleInterestToggle(interest)}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`interest-${interest}`} className="font-medium text-gray-700">
                              {interest}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="currentKnowledge" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Knowledge
                    </label>
                    <textarea
                      id="currentKnowledge"
                      name="currentKnowledge"
                      value={formData.currentKnowledge}
                      onChange={handleChange}
                      className="mt-1 block w-full h-24 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                      placeholder={`
- Machine Learning: Proficient in regression, classification, and clustering algorithms (82%)
- Deep Learning: Experience with CNNs and basic neural network architectures (65%)
- Natural Language Processing: Basic understanding of text processing and sentiment analysis (45%)
- Python Programming: Advanced skills with Python, pandas, numpy, and scikit-learn (90%)
- Mathematics for ML: Solid understanding of linear algebra, calculus, and statistics (75%)
`}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      <details>
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Formatting Guide</summary>
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="mb-2">Suggested format for listing your knowledge areas:</p>
                          <pre className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-200 overflow-auto">
{`- Area: Brief description (proficiency %)
- Machine Learning: Proficient in regression algorithms (82%)
- Deep Learning: Experience with CNNs (65%)`}
                          </pre>
                        </div>
                      </details>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="bg-white py-2 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                {showPasswordForm ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="current" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current"
                        id="current"
                        value={passwordData.current}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="new" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="new"
                        id="new"
                        value={passwordData.new}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirm"
                        id="confirm"
                        value={passwordData.confirm}
                        onChange={handlePasswordChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    {passwordError && (
                      <div className="text-sm text-red-600">{passwordError}</div>
                    )}
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start border border-gray-200">
                      <div className="flex-shrink-0">
                        <LockClosedIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Password</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Update your password regularly to keep your account secure
                        </p>
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="mt-3 bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
          
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start border border-gray-200">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Add an extra layer of security to your account by requiring a verification code
                        </p>
                        <button
                          className="mt-3 bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enable 2FA
                        </button>
                      </div>
                    </div>
          
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start border border-gray-200">
                      <div className="flex-shrink-0">
                        <ComputerDesktopIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Manage your active sessions across different devices
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-gray-200">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Current Device</p>
                              <p className="text-xs text-gray-500">Windows • Chrome • Last activity: Just now</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-gray-200">
                            <div>
                              <p className="text-sm font-medium text-gray-900">iPhone 13</p>
                              <p className="text-xs text-gray-500">iOS • Safari • Last activity: 3 hours ago</p>
                            </div>
                            <button className="text-xs text-red-600 hover:text-red-800">
                              Sign out
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white shadow rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Accounts</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4285F4] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">G</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Google</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <button className="bg-white px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Connect
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">X</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Twitter</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <button className="bg-white px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Connect
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">Li</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">LinkedIn</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <button className="bg-white px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h2>
                <p className="text-sm text-red-600 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                
                <div className="space-y-4">
                  <button className="px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete All Learning Data
                  </button>
                  
                  <button className="px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Learning Preferences Tab */}
        {activeTab === "learning" && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Preferences</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Style
                    </label>
                    <select
                      id="learningStyle"
                      name="learningStyle"
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                      defaultValue="visual"
                    >
                      <option value="visual">Visual (learning through images, videos, diagrams)</option>
                      <option value="auditory">Auditory (learning by listening and discussing)</option>
                      <option value="reading">Reading/Writing (learning through text-based materials)</option>
                      <option value="kinesthetic">Kinesthetic (learning by doing and practicing)</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      This helps us customize how learning content is presented to you
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Difficulty Level
                    </label>
                    <div className="mt-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xs text-gray-500">Beginner</span>
                        <input
                          type="range"
                          id="difficulty"
                          name="difficulty"
                          min="1"
                          max="4"
                          defaultValue="2"
                          step="1"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-500">Expert</span>
                      </div>
                      <div className="grid grid-cols-4 text-xs text-gray-500">
                        <div>Beginner</div>
                        <div className="text-center">Intermediate</div>
                        <div className="text-center">Advanced</div>
                        <div className="text-right">Expert</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Content Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Show Code Examples</h4>
                          <p className="text-sm text-gray-500">Include practical code examples in learning materials</p>
                        </div>
                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="toggle-code"
                            name="toggle-code"
                            className="absolute w-10 h-6 transition duration-200 ease-in-out bg-gray-300 rounded-full outline-none appearance-none active:outline-none focus:outline-none cursor-pointer peer checked:bg-blue-500"
                            defaultChecked
                          />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 transition-transform duration-200 transform bg-white rounded-full peer-checked:translate-x-4"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Real-world Applications</h4>
                          <p className="text-sm text-gray-500">Focus on practical use cases and applications</p>
                        </div>
                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="toggle-realworld"
                            name="toggle-realworld"
                            className="absolute w-10 h-6 transition duration-200 ease-in-out bg-gray-300 rounded-full outline-none appearance-none active:outline-none focus:outline-none cursor-pointer peer checked:bg-blue-500"
                            defaultChecked
                          />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 transition-transform duration-200 transform bg-white rounded-full peer-checked:translate-x-4"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Theoretical Foundations</h4>
                          <p className="text-sm text-gray-500">Include mathematical and theoretical background</p>
                        </div>
                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="toggle-theory"
                            name="toggle-theory"
                            className="absolute w-10 h-6 transition duration-200 ease-in-out bg-gray-300 rounded-full outline-none appearance-none active:outline-none focus:outline-none cursor-pointer peer checked:bg-blue-500"
                          />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 transition-transform duration-200 transform bg-white rounded-full peer-checked:translate-x-4"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Interactive Exercises</h4>
                          <p className="text-sm text-gray-500">Add quizzes and interactive coding challenges</p>
                        </div>
                        <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="toggle-interactive"
                            name="toggle-interactive"
                            className="absolute w-10 h-6 transition duration-200 ease-in-out bg-gray-300 rounded-full outline-none appearance-none active:outline-none focus:outline-none cursor-pointer peer checked:bg-blue-500"
                            defaultChecked
                          />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 transition-transform duration-200 transform bg-white rounded-full peer-checked:translate-x-4"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="pacingStyle" className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Schedule
                    </label>
                    <select
                      id="pacingStyle"
                      name="pacingStyle"
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                      defaultValue="balanced"
                    >
                      <option value="intensive">Intensive (Daily sessions, faster progress)</option>
                      <option value="balanced">Balanced (3-4 times per week)</option>
                      <option value="relaxed">Relaxed (1-2 times per week, steady pace)</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Preferences
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Analytics</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Study Time Distribution</h3>
                    <div className="bg-gray-100 h-24 rounded-lg flex items-end">
                      {/* Mock chart bars */}
                      <div className="w-1/7 h-1/3 bg-blue-400 mx-1 rounded-t-sm"></div>
                      <div className="w-1/7 h-2/3 bg-blue-500 mx-1 rounded-t-sm"></div>
                      <div className="w-1/7 h-1/2 bg-blue-400 mx-1 rounded-t-sm"></div>
                      <div className="w-1/7 h-2/5 bg-blue-400 mx-1 rounded-t-sm"></div>
                      <div className="w-1/7 h-5/6 bg-blue-600 mx-1 rounded-t-sm"></div>
                      <div className="w-1/7 h-full bg-blue-700 mx-1 rounded-t-sm"></div>
                      <div className="w-1/7 h-3/5 bg-blue-500 mx-1 rounded-t-sm"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h4 className="text-xs font-medium text-blue-800 mb-1">Average Daily Study Time</h4>
                      <p className="text-xl font-semibold text-blue-900">1.4 hours</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="text-xs font-medium text-green-800 mb-1">Monthly Completed Topics</h4>
                      <p className="text-xl font-semibold text-green-900">18 topics</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <h4 className="text-xs font-medium text-purple-800 mb-1">Quiz Success Rate</h4>
                      <p className="text-xl font-semibold text-purple-900">82%</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Link 
                      href="/dashboard/analytics"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View detailed learning analytics →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}