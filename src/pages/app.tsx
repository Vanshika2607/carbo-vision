import React, { useState } from 'react';
import { User, Phone, Mail, Upload, MessageSquare, ShoppingBag, Globe, Smartphone, Settings, Shield, Check, FileText, MapPin } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  helpType: string;
  otherDescription: string;
  captcha: string;
  agreeToTerms: boolean;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    helpType: '',
    otherDescription: '',
    captcha: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedAddressProof, setUploadedAddressProof] = useState<File | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [websiteDescription, setWebsiteDescription] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  // Generate simple captcha with better logic
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let answer = '';
    
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      answer += chars[randomIndex];
    }
    
    return { display: answer, answer };
  };

  const [captchaQuestion, setCaptchaQuestion] = useState(() => generateCaptcha());

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaQuestion(newCaptcha);
    setCaptchaKey(prev => prev + 1);
    setFormData(prev => ({ ...prev, captcha: '' }));
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }));
    }
  };

  const helpOptions = [
    { value: 'buy-items', label: 'Want to buy items', icon: ShoppingBag },
    { value: 'make-websites', label: 'Want us to make your website', icon: Globe },
    { value: 'make-app', label: 'Want us to make an app for your company/shop/personal use', icon: Smartphone },
    { value: 'customize-things', label: 'Want us to customize your things', icon: Settings },
    { value: 'others', label: 'Others', icon: MessageSquare }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleAddressProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedAddressProof(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Remove all non-digit characters for validation
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      }
    }

    // Email validation (optional field)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!uploadedAddressProof) {
      newErrors.addressProof = 'Address proof document is required';
    }

    if (!formData.helpType) {
      newErrors.helpType = 'Please select what you need help with';
    }

    if (formData.helpType === 'others' && !formData.otherDescription.trim()) {
      newErrors.otherDescription = 'Please provide a description';
    }

    if (formData.helpType === 'make-websites' && !websiteDescription.trim()) {
      newErrors.websiteDescription = 'Please provide website requirements';
    }

    if (formData.helpType === 'customize-things') {
      if (!customDescription.trim()) {
        newErrors.customDescription = 'Please provide customization details';
      }
      if (!uploadedFile) {
        newErrors.uploadFile = 'Reference photo is required for customization';
      }
    }

    if (!formData.captcha.trim()) {
      newErrors.captcha = 'Please solve the captcha';
    } else if (formData.captcha.toUpperCase() !== captchaQuestion.answer.toUpperCase()) {
      newErrors.captcha = 'Incorrect answer, please try again';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const submissionData = {
      ...formData,
      uploadedFile: uploadedFile?.name || null,
      uploadedAddressProof: uploadedAddressProof?.name || null,
      customDescription: formData.helpType === 'customize-things' ? customDescription : null,
      websiteDescription: formData.helpType === 'make-websites' ? websiteDescription : null
    };
    
    console.log('Form submitted:', submissionData);
    alert('Registration submitted successfully!');
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Join Our Platform
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Register today and let us help you achieve your goals with our comprehensive services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Registration Form</h2>
            <p className="text-blue-100 mt-1">Please fill in all required information</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">⚠️ {errors.name}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number (10 digits) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d\s\-()]/g, '');
                        handleInputChange('phone', value);
                      }}
                      maxLength={15}
                      className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">⚠️ {errors.phone}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address (optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">⚠️ {errors.email}</p>}
                </div>

                {/* Address Field */}
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-800 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                        errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-white'
                      }`}
                      placeholder="Enter your permanent address"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-sm text-red-600">⚠️ {errors.address}</p>}
                </div>
              </div>

              {/* Address Proof Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Upload Proof of Address *
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    errors.addressProof 
                      ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                      : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                  }`}>
                    <div className="flex flex-col items-center justify-center py-2">
                      <FileText className={`w-6 h-6 mb-2 ${errors.addressProof ? 'text-red-500' : 'text-blue-500'}`} />
                      <p className="text-sm text-gray-700 font-medium">
                        {uploadedAddressProof ? (
                          <span className="font-bold text-blue-600">
                            📎 {uploadedAddressProof.name}
                          </span>
                        ) : (
                          <span>Click to upload address proof</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600">PDF, PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleAddressProofUpload}
                    />
                  </label>
                </div>
                {errors.addressProof && <p className="mt-1 text-sm text-red-600">⚠️ {errors.addressProof}</p>}
              </div>
            </div>

            {/* Help Type Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                How Can We Help You? *
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                {helpOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={option.value}>
                      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        formData.helpType === option.value 
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="helpType"
                          value={option.value}
                          checked={formData.helpType === option.value}
                          onChange={(e) => handleInputChange('helpType', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          formData.helpType === option.value ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            formData.helpType === option.value ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <span className={`font-semibold text-sm ${
                          formData.helpType === option.value ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
              {errors.helpType && <p className="text-sm text-red-600">⚠️ {errors.helpType}</p>}

              {/* Others Description */}
              {formData.helpType === 'others' && (
                <div className="animate-in slide-in-from-top-5 duration-300 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-2 border-gray-200">
                  <label htmlFor="otherDescription" className="block text-sm font-semibold text-gray-800 mb-2">
                    Please describe what you need help with *
                  </label>
                  <textarea
                    id="otherDescription"
                    value={formData.otherDescription}
                    onChange={(e) => handleInputChange('otherDescription', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                      errors.otherDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="Describe your specific needs in detail..."
                  />
                  {errors.otherDescription && <p className="mt-1 text-sm text-red-600">⚠️ {errors.otherDescription}</p>}
                </div>
              )}

              {/* Website Description */}
              {formData.helpType === 'make-websites' && (
                <div className="animate-in slide-in-from-top-5 duration-300 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border-2 border-green-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-green-600" />
                    Website Requirements
                  </h4>
                  <label htmlFor="websiteDescription" className="block text-sm font-semibold text-gray-800 mb-2">
                    Please describe your website requirements *
                  </label>
                  <textarea
                    id="websiteDescription"
                    value={websiteDescription}
                    onChange={(e) => {
                      setWebsiteDescription(e.target.value);
                      if (errors.websiteDescription) {
                        setErrors(prev => ({ ...prev, websiteDescription: '' }));
                      }
                    }}
                    rows={3}
                    className={`w-full px-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.websiteDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="Describe your website requirements (e.g., type of website, features needed, design preferences, etc.)..."
                  />
                  {errors.websiteDescription && <p className="mt-1 text-sm text-red-600">⚠️ {errors.websiteDescription}</p>}
                </div>
              )}

              {/* Customization Section */}
              {formData.helpType === 'customize-things' && (
                <div className="animate-in slide-in-from-top-5 duration-300 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 rounded-xl border-2 border-purple-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-600" />
                    Customization Details
                  </h4>
                  
                  {/* Photo Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Upload Reference Photo *
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        errors.uploadFile 
                          ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                          : 'border-purple-300 bg-white hover:bg-purple-50'
                      }`}>
                        <div className="flex flex-col items-center justify-center py-2">
                          <Upload className={`w-8 h-8 mb-2 ${errors.uploadFile ? 'text-red-500' : 'text-purple-500'}`} />
                          <p className="text-sm text-gray-700 font-medium">
                            {uploadedFile ? (
                              <span className="font-bold text-purple-600">
                                📎 {uploadedFile.name}
                              </span>
                            ) : (
                              <span>Click to upload photo</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-600">PNG, JPG or GIF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                    {errors.uploadFile && <p className="mt-1 text-sm text-red-600">⚠️ {errors.uploadFile}</p>}
                  </div>

                  {/* Customization Description */}
                  <div>
                    <label htmlFor="customDescription" className="block text-sm font-semibold text-gray-800 mb-2">
                      Customization Requirements *
                    </label>
                    <textarea
                      id="customDescription"
                      value={customDescription}
                      onChange={(e) => {
                        setCustomDescription(e.target.value);
                        if (errors.customDescription) {
                          setErrors(prev => ({ ...prev, customDescription: '' }));
                        }
                      }}
                      rows={3}
                      className={`w-full px-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                        errors.customDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                      placeholder="Describe your customization requirements in detail..."
                    />
                    {errors.customDescription && <p className="mt-1 text-sm text-red-600">⚠️ {errors.customDescription}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                Security Verification
              </h3>

              {/* Captcha */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <label htmlFor="captcha" className="block text-sm font-semibold text-gray-800 mb-2">
                  Please type the letters shown below *
                </label>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 px-6 py-4 rounded-xl border-2 border-green-300">
                    <div className="text-2xl font-bold text-gray-800 tracking-wider select-none font-mono">
                      {captchaQuestion.display}
                    </div>
                  </div>
                  <input
                    type="text"
                    id="captcha"
                    key={captchaKey}
                    value={formData.captcha}
                    onChange={(e) => handleInputChange('captcha', e.target.value)}
                    className={`w-32 px-3 py-3 border-2 rounded-xl text-center font-bold tracking-widest focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.captcha ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="Enter"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-300 transition-all transform hover:scale-105 shadow-md font-bold"
                    title="Refresh Captcha"
                  >
                    🔄
                  </button>
                </div>
                {errors.captcha && <p className="text-sm text-red-600">⚠️ {errors.captcha}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="agreeToTerms" className="text-sm font-semibold text-gray-900">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        Privacy Policy
                      </a>
                      *
                    </label>
                    <p className="text-xs text-gray-700 mt-1">
                      By checking this box, you consent to our data processing practices.
                    </p>
                  </div>
                </div>
                {errors.agreeToTerms && <p className="mt-2 text-sm text-red-600">⚠️ {errors.agreeToTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing Registration...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Check className="w-6 h-6 mr-3" />
                    Submit Registration
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-700">
            🔒 Your information is secure and will be processed according to our privacy policy.
          </p>
          <p className="text-xs text-gray-600">
            Need help? Contact our support team at support@example.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;