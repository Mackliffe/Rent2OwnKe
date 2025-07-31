import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  TrendingUp, TrendingDown, MapPin, Calendar, BarChart3, 
  Home, Building, DollarSign, Activity, RefreshCw 
} from "lucide-react";
import { formatKES } from "@/lib/currency";

interface MarketData {
  month: string;
  nairobi: number;
  mombasa: number;
  kisumu: number;
  nakuru: number;
  eldoret: number;
  avgPrice: number;
  transactions: number;
  inventory: number;
}

interface CityStats {
  city: string;
  currentPrice: number;
  monthlyChange: number;
  yearlyChange: number;
  marketShare: number;
  activeListings: number;
  averageDaysOnMarket: number;
  pricePerSqft: number;
}

interface PropertyTypeData {
  type: string;
  avgPrice: number;
  marketShare: number;
  growth: number;
  color: string;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function MarketTrends() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("12m");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Sample market data - in production, this would come from real estate APIs
  const marketData: MarketData[] = [
    { month: "Jan 2024", nairobi: 12500000, mombasa: 8500000, kisumu: 6200000, nakuru: 5800000, eldoret: 5200000, avgPrice: 7640000, transactions: 245, inventory: 1250 },
    { month: "Feb 2024", nairobi: 12650000, mombasa: 8620000, kisumu: 6280000, nakuru: 5850000, eldoret: 5250000, avgPrice: 7730000, transactions: 267, inventory: 1180 },
    { month: "Mar 2024", nairobi: 12800000, mombasa: 8750000, kisumu: 6350000, nakuru: 5900000, eldoret: 5300000, avgPrice: 7820000, transactions: 289, inventory: 1120 },
    { month: "Apr 2024", nairobi: 12950000, mombasa: 8850000, kisumu: 6420000, nakuru: 5950000, eldoret: 5350000, avgPrice: 7904000, transactions: 312, inventory: 1080 },
    { month: "May 2024", nairobi: 13100000, mombasa: 8950000, kisumu: 6480000, nakuru: 6000000, eldoret: 5400000, avgPrice: 7986000, transactions: 298, inventory: 1150 },
    { month: "Jun 2024", nairobi: 13200000, mombasa: 9020000, kisumu: 6540000, nakuru: 6050000, eldoret: 5450000, avgPrice: 8052000, transactions: 276, inventory: 1220 },
    { month: "Jul 2024", nairobi: 13350000, mombasa: 9100000, kisumu: 6600000, nakuru: 6100000, eldoret: 5500000, avgPrice: 8130000, transactions: 301, inventory: 1190 },
    { month: "Aug 2024", nairobi: 13450000, mombasa: 9180000, kisumu: 6650000, nakuru: 6150000, eldoret: 5550000, avgPrice: 8196000, transactions: 324, inventory: 1160 },
    { month: "Sep 2024", nairobi: 13580000, mombasa: 9250000, kisumu: 6700000, nakuru: 6200000, eldoret: 5600000, avgPrice: 8266000, transactions: 289, inventory: 1240 },
    { month: "Oct 2024", nairobi: 13650000, mombasa: 9320000, kisumu: 6750000, nakuru: 6250000, eldoret: 5650000, avgPrice: 8324000, transactions: 267, inventory: 1290 },
    { month: "Nov 2024", nairobi: 13750000, mombasa: 9380000, kisumu: 6800000, nakuru: 6300000, eldoret: 5700000, avgPrice: 8386000, transactions: 312, inventory: 1220 },
    { month: "Dec 2024", nairobi: 13850000, mombasa: 9450000, kisumu: 6850000, nakuru: 6350000, eldoret: 5750000, avgPrice: 8450000, transactions: 334, inventory: 1180 }
  ];

  const cityStats: CityStats[] = [
    {
      city: "Nairobi",
      currentPrice: 13850000,
      monthlyChange: 0.7,
      yearlyChange: 10.8,
      marketShare: 42.5,
      activeListings: 2340,
      averageDaysOnMarket: 45,
      pricePerSqft: 18500
    },
    {
      city: "Mombasa",
      currentPrice: 9450000,
      monthlyChange: 0.7,
      yearlyChange: 11.2,
      marketShare: 23.1,
      activeListings: 1280,
      averageDaysOnMarket: 52,
      pricePerSqft: 14200
    },
    {
      city: "Kisumu",
      currentPrice: 6850000,
      monthlyChange: 0.7,
      yearlyChange: 10.5,
      marketShare: 16.7,
      activeListings: 890,
      averageDaysOnMarket: 38,
      pricePerSqft: 11800
    },
    {
      city: "Nakuru",
      currentPrice: 6350000,
      monthlyChange: 0.8,
      yearlyChange: 9.5,
      marketShare: 11.2,
      activeListings: 670,
      averageDaysOnMarket: 35,
      pricePerSqft: 10200
    },
    {
      city: "Eldoret",
      currentPrice: 5750000,
      monthlyChange: 0.9,
      yearlyChange: 10.6,
      marketShare: 6.5,
      activeListings: 420,
      averageDaysOnMarket: 29,
      pricePerSqft: 9800
    }
  ];

  const propertyTypeData: PropertyTypeData[] = [
    { type: "Apartments", avgPrice: 8200000, marketShare: 45, growth: 12.5, color: COLORS[0] },
    { type: "Houses", avgPrice: 12500000, marketShare: 35, growth: 9.8, color: COLORS[1] },
    { type: "Townhouses", avgPrice: 9800000, marketShare: 15, growth: 15.2, color: COLORS[2] },
    { type: "Commercial", avgPrice: 25000000, marketShare: 5, growth: 7.3, color: COLORS[3] }
  ];

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1500);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const filteredData = selectedCity === "all" ? marketData : 
    marketData.map(item => ({
      ...item,
      cityPrice: item[selectedCity as keyof MarketData] as number
    }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kenya Real Estate Market Trends</h2>
          <p className="text-gray-600 mt-2">Real-time insights into property market performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            onClick={refreshData} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-gray-900">{formatKES(8450000)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +10.5% YoY
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Transactions</p>
                <p className="text-2xl font-bold text-gray-900">334</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +7.0% MoM
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">5,600</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -3.4% MoM
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Days on Market</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -5.4% MoM
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="cities">City Analysis</TabsTrigger>
          <TabsTrigger value="types">Property Types</TabsTrigger>
          <TabsTrigger value="activity">Market Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Price Trends by Location</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="eldoret">Eldoret</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6m">6 Months</SelectItem>
                      <SelectItem value="12m">12 Months</SelectItem>
                      <SelectItem value="24m">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    formatter={(value: number) => [formatKES(value), ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  {selectedCity === "all" ? (
                    <>
                      <Line type="monotone" dataKey="nairobi" stroke={COLORS[0]} strokeWidth={2} name="Nairobi" />
                      <Line type="monotone" dataKey="mombasa" stroke={COLORS[1]} strokeWidth={2} name="Mombasa" />
                      <Line type="monotone" dataKey="kisumu" stroke={COLORS[2]} strokeWidth={2} name="Kisumu" />
                      <Line type="monotone" dataKey="nakuru" stroke={COLORS[3]} strokeWidth={2} name="Nakuru" />
                      <Line type="monotone" dataKey="eldoret" stroke={COLORS[4]} strokeWidth={2} name="Eldoret" />
                    </>
                  ) : (
                    <Line type="monotone" dataKey={selectedCity} stroke={COLORS[0]} strokeWidth={3} name={selectedCity} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>City Market Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cityStats.map((city, index) => (
                    <div key={city.city} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <div>
                          <p className="font-semibold">{city.city}</p>
                          <p className="text-sm text-gray-600">{formatKES(city.currentPrice)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center ${getChangeColor(city.monthlyChange)}`}>
                          {getChangeIcon(city.monthlyChange)}
                          <span className="ml-1 text-sm font-medium">
                            {formatPercentage(city.monthlyChange)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{formatPercentage(city.yearlyChange)} yearly</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Share Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cityStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ city, marketShare }) => `${city} ${marketShare}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                    >
                      {cityStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cityStats.map((city, index) => (
              <Card key={city.city}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: COLORS[index] }} />
                    {city.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Listings</span>
                    <span className="font-medium">{city.activeListings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Days on Market</span>
                    <span className="font-medium">{city.averageDaysOnMarket} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price per Sq Ft</span>
                    <span className="font-medium">{formatKES(city.pricePerSqft)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={propertyTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => [formatKES(value), "Average Price"]} />
                    <Bar dataKey="avgPrice" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Share by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, marketShare }) => `${type} ${marketShare}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyTypeData.map((type, index) => (
              <Card key={type.type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{type.type}</h3>
                    <Badge style={{ backgroundColor: type.color, color: 'white' }}>
                      {type.marketShare}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Average Price</p>
                      <p className="font-semibold">{formatKES(type.avgPrice)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Growth</span>
                      <span className={`font-medium ${getChangeColor(type.growth)}`}>
                        {formatPercentage(type.growth)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="transactions" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="inventory" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Source Attribution */}
      <Card className="mt-8 border-l-4 border-l-grass-500">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-grass-100 rounded-full flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-grass-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Data Sources & Methodology</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Current Status:</strong> This dashboard displays demonstration data to showcase market analysis capabilities.</p>
                <p><strong>Real Data Integration:</strong> In production, this system connects to:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Kenya Property Portal API for transaction data</li>
                  <li>BuyRentKenya for inventory and listing metrics</li>
                  <li>PropertyPoint Kenya for price trends and valuations</li>
                  <li>Central Bank of Kenya for economic indicators</li>
                </ul>
                <p><strong>Data Refresh:</strong> Real market data updates daily at 6:00 AM EAT</p>
                <p className="text-xs text-grass-600 mt-3">
                  <strong>Note:</strong> All price trends, growth rates, and market statistics shown are representative of typical Kenyan real estate patterns but are generated for demonstration purposes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}