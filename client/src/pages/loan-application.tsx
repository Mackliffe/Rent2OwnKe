import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { FileText, User, Briefcase, CreditCard, Shield, CheckCircle } from "lucide-react";

export default function LoanApplication() {
  const [, params] = useRoute("/loan-application/:propertyId");
  const propertyId = params?.propertyId;
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    idNumber: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    maritalStatus: "",
    numberOfDependents: "",
    county: "",
    city: "",
    residentialAddress: "",
    postalAddress: "",
    
    // About Me
    educationLevel: "",
    languagesSpoken: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelationship: "",
    
    // Professional Information
    employmentStatus: "",
    employerName: "",
    employerAddress: "",
    jobTitle: "",
    workExperience: "",
    monthlyIncome: "",
    otherIncomeSource: "",
    otherIncomeAmount: "",
    bankName: "",
    accountNumber: "",
    
    // Loan Preferences
    loanAmount: "",
    repaymentPeriod: "",
    preferredStartDate: "",
    
    // Required Documents
    idCopyUploaded: false,
    payslipUploaded: false,
    bankStatementUploaded: false,
    kraPin: "",
    
    // Consent and Declarations
    creditBureauConsent: false,
    informationSharingConsent: false,
    creditReportingConsent: false,
    informationAccuracy: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.idNumber && formData.phoneNumber && formData.email;
      case 2:
        return formData.educationLevel && formData.nextOfKinName && formData.nextOfKinPhone;
      case 3:
        return formData.employmentStatus && formData.monthlyIncome && formData.bankName;
      case 4:
        return formData.creditBureauConsent && formData.informationSharingConsent && 
               formData.creditReportingConsent && formData.informationAccuracy;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Application Incomplete",
        description: "Please complete all sections and provide consent.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use auto-authentication endpoint
      const response = await fetch("/api/applications/auto-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          applicationData: formData,
        }),
      });

      const result = await response.json();

      // Handle successful submission (201) or existing user application (201 with login required)
      if (response.status === 201) {
        if (result.hasAccount && result.requiresLogin) {
          toast({
            title: "Application Submitted!",
            description: "Your application was submitted successfully. Please sign in to track your application status.",
          });
          // Store success message and redirect to login
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 2000);
          return;
        } else {
          toast({
            title: "Application Submitted Successfully",
            description: result.message || "Your loan application has been received. We'll contact you within 2-3 business days.",
          });
          // Clear any pending application data
          sessionStorage.removeItem('pendingApplication');
          // Redirect to dashboard
          window.location.href = "/dashboard";
          return;
        }
      }

      // Handle new user requiring signup (202)
      if (response.status === 202) {
        if (result.requiresSignup) {
          toast({
            title: "Create Your Account",
            description: "Please sign in to create your account and complete your application.",
          });
          // Store application data for after signup
          sessionStorage.setItem('pendingApplication', JSON.stringify({ propertyId, applicationData: formData }));
          window.location.href = "/api/login";
          return;
        }
      }

      if (response.status === 400) {
        if (result.hasAccount && result.requiresLogin) {
          toast({
            title: "Already Applied",
            description: "You have already applied for this property. Please sign in to view your application status.",
            variant: "destructive",
          });
          window.location.href = "/api/login";
          return;
        } else {
          toast({
            title: "Already Applied",
            description: "You have already applied for this property.",
            variant: "destructive",
          });
          window.location.href = "/dashboard";
          return;
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const kenyanCounties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Machakos", "Meru", "Thika",
    "Kitale", "Garissa", "Nyeri", "Kakamega", "Malindi", "Lamu", "Kericho", "Kisii"
  ];

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold">Personal Information</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name (as on ID) *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full legal name"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idNumber">National ID Number *</Label>
          <Input
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => handleInputChange("idNumber", e.target.value)}
            placeholder="Enter your ID number"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="07XXXXXXXX"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="your.email@example.com"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select onValueChange={(value) => handleInputChange("maritalStatus", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numberOfDependents">Number of Dependents</Label>
          <Input
            id="numberOfDependents"
            type="number"
            value={formData.numberOfDependents}
            onChange={(e) => handleInputChange("numberOfDependents", e.target.value)}
            placeholder="0"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="county">County of Residence</Label>
          <Select onValueChange={(value) => handleInputChange("county", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select your county" />
            </SelectTrigger>
            <SelectContent>
              {kenyanCounties.map(county => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="residentialAddress">Residential Address</Label>
        <Textarea
          id="residentialAddress"
          value={formData.residentialAddress}
          onChange={(e) => handleInputChange("residentialAddress", e.target.value)}
          placeholder="Enter your complete residential address"
          className="focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );

  const renderAboutMe = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold">About Me</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="educationLevel">Education Level *</Label>
          <Select onValueChange={(value) => handleInputChange("educationLevel", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary School</SelectItem>
              <SelectItem value="secondary">Secondary School</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="degree">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="languagesSpoken">Languages Spoken</Label>
          <Input
            id="languagesSpoken"
            value={formData.languagesSpoken}
            onChange={(e) => handleInputChange("languagesSpoken", e.target.value)}
            placeholder="English, Swahili, etc."
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nextOfKinName">Next of Kin Name *</Label>
          <Input
            id="nextOfKinName"
            value={formData.nextOfKinName}
            onChange={(e) => handleInputChange("nextOfKinName", e.target.value)}
            placeholder="Enter next of kin full name"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nextOfKinPhone">Next of Kin Phone *</Label>
          <Input
            id="nextOfKinPhone"
            value={formData.nextOfKinPhone}
            onChange={(e) => handleInputChange("nextOfKinPhone", e.target.value)}
            placeholder="07XXXXXXXX"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nextOfKinRelationship">Relationship to Next of Kin</Label>
          <Select onValueChange={(value) => handleInputChange("nextOfKinRelationship", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="sibling">Sibling</SelectItem>
              <SelectItem value="child">Child</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="kraPin">KRA PIN Number</Label>
          <Input
            id="kraPin"
            value={formData.kraPin}
            onChange={(e) => handleInputChange("kraPin", e.target.value)}
            placeholder="Enter your KRA PIN"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold">Professional Information & Loan Preferences</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">Employment Status *</Label>
          <Select onValueChange={(value) => handleInputChange("employmentStatus", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed (Permanent)</SelectItem>
              <SelectItem value="contract">Contract Employee</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer Name</Label>
          <Input
            id="employerName"
            value={formData.employerName}
            onChange={(e) => handleInputChange("employerName", e.target.value)}
            placeholder="Enter employer name"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title/Position</Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            placeholder="Enter your job title"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workExperience">Years of Work Experience</Label>
          <Input
            id="workExperience"
            type="number"
            value={formData.workExperience}
            onChange={(e) => handleInputChange("workExperience", e.target.value)}
            placeholder="Years"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Gross Income (KES) *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={formData.monthlyIncome}
            onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
            placeholder="50000"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="otherIncomeAmount">Other Monthly Income (KES)</Label>
          <Input
            id="otherIncomeAmount"
            type="number"
            value={formData.otherIncomeAmount}
            onChange={(e) => handleInputChange("otherIncomeAmount", e.target.value)}
            placeholder="0"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bankName">Primary Bank *</Label>
          <Select onValueChange={(value) => handleInputChange("bankName", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kcb">KCB Bank</SelectItem>
              <SelectItem value="equity">Equity Bank</SelectItem>
              <SelectItem value="coop">Co-operative Bank</SelectItem>
              <SelectItem value="absa">Absa Bank Kenya</SelectItem>
              <SelectItem value="standard-chartered">Standard Chartered</SelectItem>
              <SelectItem value="dtb">Diamond Trust Bank</SelectItem>
              <SelectItem value="family">Family Bank</SelectItem>
              <SelectItem value="stanbic">Stanbic Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
            placeholder="Enter account number"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Requested Loan Amount (KES)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={(e) => handleInputChange("loanAmount", e.target.value)}
            placeholder="5000000"
            className="focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="repaymentPeriod">Preferred Repayment Period</Label>
          <Select onValueChange={(value) => handleInputChange("repaymentPeriod", value)}>
            <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
              <SelectValue placeholder="Select repayment period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
              <SelectItem value="15">15 Years</SelectItem>
              <SelectItem value="20">20 Years</SelectItem>
              <SelectItem value="25">25 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employerAddress">Employer Address</Label>
        <Textarea
          id="employerAddress"
          value={formData.employerAddress}
          onChange={(e) => handleInputChange("employerAddress", e.target.value)}
          placeholder="Enter employer's complete address"
          className="focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otherIncomeSource">Other Income Sources (if any)</Label>
        <Textarea
          id="otherIncomeSource"
          value={formData.otherIncomeSource}
          onChange={(e) => handleInputChange("otherIncomeSource", e.target.value)}
          placeholder="Describe any other sources of income"
          className="focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold">Consent & Declarations</h2>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Please read each consent statement carefully before proceeding. 
          Your consent is required to process your loan application in accordance with Kenyan law.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="creditBureauConsent"
            checked={formData.creditBureauConsent}
            onCheckedChange={(checked) => handleInputChange("creditBureauConsent", checked as boolean)}
            className="mt-1 border-green-500 data-[state=checked]:bg-green-600"
          />
          <div className="space-y-1">
            <Label htmlFor="creditBureauConsent" className="text-sm font-medium">
              Credit Bureau Consent *
            </Label>
            <p className="text-sm text-gray-600">
              I hereby consent that Rent2Own is allowed to make enquiries and access my credit information 
              regarding my credit history with any credit bureau. I also consent to sharing my credit information 
              with their banking partners as required by law in order to finalise or fulfil my loan agreement 
              as part of this application.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="informationSharingConsent"
            checked={formData.informationSharingConsent}
            onCheckedChange={(checked) => handleInputChange("informationSharingConsent", checked as boolean)}
            className="mt-1 border-green-500 data-[state=checked]:bg-green-600"
          />
          <div className="space-y-1">
            <Label htmlFor="informationSharingConsent" className="text-sm font-medium">
              Information Sharing Consent *
            </Label>
            <p className="text-sm text-gray-600">
              I consent that Rent2Own may share my personal and financial information with relevant parties 
              including but not limited to banking partners, credit reference bureaus, and regulatory bodies 
              as required by Kenyan law for the purpose of processing this loan application.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="creditReportingConsent"
            checked={formData.creditReportingConsent}
            onCheckedChange={(checked) => handleInputChange("creditReportingConsent", checked as boolean)}
            className="mt-1 border-green-500 data-[state=checked]:bg-green-600"
          />
          <div className="space-y-1">
            <Label htmlFor="creditReportingConsent" className="text-sm font-medium">
              Credit Reporting Consent *
            </Label>
            <p className="text-sm text-gray-600">
              I consent that Rent2Own reports the conclusion of any credit agreement with me to the 
              relevant credit reporting regulator as required by the Banking Act and other applicable 
              laws in Kenya.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="informationAccuracy"
            checked={formData.informationAccuracy}
            onCheckedChange={(checked) => handleInputChange("informationAccuracy", checked as boolean)}
            className="mt-1 border-green-500 data-[state=checked]:bg-green-600"
          />
          <div className="space-y-1">
            <Label htmlFor="informationAccuracy" className="text-sm font-medium">
              Information Accuracy Declaration *
            </Label>
            <p className="text-sm text-gray-600">
              I hereby declare that all information provided by me in this application is true, accurate, 
              and complete to the best of my knowledge. I understand that providing false information 
              may result in the rejection of my application or cancellation of any approved loan.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Your application will be reviewed within 2-3 business days</li>
              <li>• We'll verify your information and conduct credit checks</li>
              <li>• You'll be contacted with the loan decision and next steps</li>
              <li>• If approved, we'll guide you through the final documentation process</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInformation();
      case 2:
        return renderAboutMe();
      case 3:
        return renderProfessionalInfo();
      case 4:
        return renderConsent();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent-to-Own Loan Application</h1>
          <p className="text-gray-600">Complete your application to get pre-approved for property financing</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span>
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "About Me"}
                {currentStep === 3 && "Professional & Loan Details"}
                {currentStep === 4 && "Consent & Declarations"}
              </span>
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Provide your basic personal details for identity verification"}
              {currentStep === 2 && "Tell us more about yourself and your emergency contacts"}
              {currentStep === 3 && "Share your employment details and loan preferences"}
              {currentStep === 4 && "Review and provide required consents to complete your application"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getCurrentStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                disabled={currentStep === 1}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}