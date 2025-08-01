import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Upload, Calendar, CheckCircle, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Kenyan counties (fixed duplicate Kericho)
const kenyanCounties = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", "Machakos", "Meru",
  "Thika", "Kitale", "Malindi", "Garissa", "Kakamega", "Embu", "Kericho", "Migori",
  "Siaya", "Naivasha", "Voi", "Bungoma", "Homa Bay", "Kitui", "Kapenguria", "Moyale",
  "Chuka", "Kiambu", "Murang'a", "Kirinyaga", "Nyandarua", "Nyandare", "Tharaka Nithi",
  "Laikipia", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi",
  "Baringo", "Bomet", "Kajiado", "Makueni", "Taita Taveta", "Lamu", "Tana River",
  "Kilifi", "Kwale", "Turkana", "West Pokot", "Marsabit", "Isiolo", "Mandera", "Wajir"
];

// Property types
const propertyTypes = [
  "Apartment", "House", "Townhouse", "Villa", "Bungalow", "Maisonette", 
  "Studio", "Penthouse", "Commercial", "Land", "Warehouse", "Office Space"
];

// Form validation schema
const sellHouseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^(\+254|0)[17]\d{8}$/, "Please enter a valid Kenyan phone number"),
  email: z.string().email("Please enter a valid email address"),
  propertyType: z.string().min(1, "Please select a property type"),
  propertyAddress: z.string().min(10, "Please provide a detailed property address"),
  county: z.string().min(1, "Please select a county"),
  subcounty: z.string().min(2, "Please enter the subcounty"),
  nationalIdFront: z.any().refine((file) => file?.length > 0, "National ID front is required"),
  nationalIdBack: z.any().refine((file) => file?.length > 0, "National ID back is required"),
  kraPin: z.any().refine((file) => file?.length > 0, "KRA PIN document is required"),
  inspectionDate: z.string().min(1, "Please select an inspection date"),
  inspectionTime: z.string().min(1, "Please select an inspection time"),
});

type SellHouseFormData = z.infer<typeof sellHouseSchema>;

export default function SellHouse() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SellHouseFormData>({
    resolver: zodResolver(sellHouseSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      propertyType: "",
      propertyAddress: "",
      county: "",
      subcounty: "",
      inspectionDate: "",
      inspectionTime: "",
    }
  });

  const onSubmit = async (data: SellHouseFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'nationalIdFront' || key === 'nationalIdBack' || key === 'kraPin') {
          if (value?.[0]) {
            formData.append(key, value[0]);
          }
        } else {
          formData.append(key, value as string);
        }
      });

      // Convert FormData to JSON for the API
      const jsonData: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'nationalIdFront' || key === 'nationalIdBack' || key === 'kraPin') {
          // For now, just indicate that files were uploaded
          // In a real app, you'd upload files to cloud storage first
          jsonData[key] = value?.[0] ? 'file-uploaded' : null;
        } else {
          jsonData[key] = value;
        }
      });

      // Submit to API
      const response = await fetch('/api/property-inspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inspection booking');
      }

      const result = await response.json();
      
      setSubmitted(true);
      toast({
        title: "Inspection Booked Successfully!",
        description: `Reference: ${result.referenceNumber}. We'll contact you within 24 hours to confirm your inspection details.`,
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your inspection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-grass-50 to-white">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <CheckCircle className="w-16 h-16 text-grass-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Inspection Booked Successfully!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for choosing Rent2Own Kenya. Our inspection team will contact you within 24 hours to confirm your appointment details.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Reference Number: R2O-{Date.now().toString().slice(-6)}
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-grass-600 hover:bg-grass-700 text-white"
              >
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-grass-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-grass-100 rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 text-grass-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sell Your House with 
              <span className="text-grass-600"> Rent2Own</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your property inspected and certified by our experts. Properties inspected by Rent2Own are trusted by our clients and will sell faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-grass-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Calendar className="w-6 h-6 mr-3" />
                Book a Property Inspection
              </CardTitle>
              <p className="text-grass-100 mt-2">
                Properties inspected by Rent2Own are trusted by our clients and will sell faster.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Pricing Alert */}
              <Alert className="mb-8 border-amber-200 bg-amber-50">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <AlertDescription className="text-amber-800 font-medium">
                  Property Inspection costs a minimum of KShs 5,000 depending on location
                </AlertDescription>
              </Alert>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Home className="w-4 h-4 mr-2" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+254 7XX XXX XXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Property Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Property Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              {propertyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyAddress"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Property Physical Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter the complete physical address of your property"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="county"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>County</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select county" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
                                {kenyanCounties.map((county) => (
                                  <SelectItem key={county} value={county}>
                                    {county}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subcounty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subcounty</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter subcounty" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Document Uploads */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Required Documents
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nationalIdFront"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem>
                            <FormLabel>National ID (Front)</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => onChange(e.target.files)}
                                {...rest}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nationalIdBack"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem>
                            <FormLabel>National ID (Back)</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => onChange(e.target.files)}
                                {...rest}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="kraPin"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem className="mt-6">
                          <FormLabel>KRA PIN Document</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => onChange(e.target.files)}
                              {...rest}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500 mt-1">
                            Upload as Word document or PDF
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Inspection Scheduling */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Inspection
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="inspectionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inspectionTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="12:00">12:00 PM</SelectItem>
                                <SelectItem value="13:00">1:00 PM</SelectItem>
                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-grass-600 hover:bg-grass-700 text-white text-lg py-3"
                    >
                      {isSubmitting ? "Booking Inspection..." : "Book Property Inspection"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}