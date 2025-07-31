import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatKES } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus,
  Edit,
  Building,
  MapPin,
  Bed,
  Bath,
  Star,
  Eye
} from "lucide-react";
import type { Property } from "@shared/schema";

export default function AdminProperties() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/admin/properties"],
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      return await apiRequest(`/api/admin/properties/${id}`, {
        method: "PATCH",
        body: { featured },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update property",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="properties" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation currentPage="properties" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
            <p className="text-gray-600 mt-2">Manage property listings and details</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-grass-600 hover:bg-grass-700"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </DialogTitle>
                <DialogDescription>
                  {editingProperty ? "Update property details" : "Add a new property to the listings"}
                </DialogDescription>
              </DialogHeader>
              <PropertyForm 
                property={editingProperty}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-grass-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.filter(p => p.featured).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(properties.map(p => p.city)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatKES(Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length || 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={property.mainImage} 
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                {property.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}, {property.city}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {property.floorArea}m²
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-grass-600">
                    {formatKES(property.price)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatKES(property.monthlyRent)}/mo
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(property)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={property.featured ? "default" : "outline"}
                    onClick={() => toggleFeaturedMutation.mutate({ 
                      id: property.id, 
                      featured: !property.featured 
                    })}
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {property.featured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first property</p>
            <Button 
              className="bg-grass-600 hover:bg-grass-700"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Property Form Component
function PropertyForm({ property, onClose }: { property: Property | null; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    propertyType: property?.propertyType || "apartment",
    location: property?.location || "",
    city: property?.city || "Nairobi",
    county: property?.county || "Nairobi",
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    floorArea: property?.floorArea || 50,
    parkingSpaces: property?.parkingSpaces || 0,
    hasGarden: property?.hasGarden || false,
    mainImage: property?.mainImage || "",
    monthlyRent: property?.monthlyRent || 0,
    downPaymentPercent: property?.downPaymentPercent || 10,
    ownershipPeriod: property?.ownershipPeriod || 15,
    interestRate: property?.interestRate || "12.5",
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (property) {
        return await apiRequest(`/api/admin/properties/${property.id}`, {
          method: "PATCH",
          body: data,
        });
      } else {
        return await apiRequest("/api/admin/properties", {
          method: "POST", 
          body: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({
        title: "Success",
        description: `Property ${property ? "updated" : "created"} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${property ? "update" : "create"} property`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <select
            id="propertyType"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.propertyType}
            onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="county">County</Label>
          <Input
            id="county"
            value={formData.county}
            onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="1"
            value={formData.bedrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            min="1"
            value={formData.bathrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="floorArea">Floor Area (m²)</Label>
          <Input
            id="floorArea"
            type="number"
            min="1"
            value={formData.floorArea}
            onChange={(e) => setFormData(prev => ({ ...prev, floorArea: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="parkingSpaces">Parking Spaces</Label>
          <Input
            id="parkingSpaces"
            type="number"
            min="0"
            value={formData.parkingSpaces}
            onChange={(e) => setFormData(prev => ({ ...prev, parkingSpaces: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (KES)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="monthlyRent">Monthly Rent (KES)</Label>
          <Input
            id="monthlyRent"
            type="number"
            min="0"
            value={formData.monthlyRent}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="mainImage">Main Image URL</Label>
        <Input
          id="mainImage"
          type="url"
          value={formData.mainImage}
          onChange={(e) => setFormData(prev => ({ ...prev, mainImage: e.target.value }))}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-grass-600 hover:bg-grass-700"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : (property ? "Update" : "Create")}
        </Button>
      </div>
    </form>
  );
}