
import React, { useState } from 'react';
import { Search, RefreshCw, Database, Shield, User, Calendar, Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

interface RegistryRecord {
  id: number;
  plateNumber: string;
  registeredOwner?: string;
  taxStatus: 'Paid' | 'Unpaid' | 'Unknown';
  lastChecked: Date;
}

const Registry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Paid' | 'Unpaid' | 'Unknown' | ''>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for demonstration
  const mockData: RegistryRecord[] = [
    {
      id: 1,
      plateNumber: 'ABC123',
      registeredOwner: 'John Smith',
      taxStatus: 'Paid',
      lastChecked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      plateNumber: 'XYZ789',
      registeredOwner: 'Sarah Johnson',
      taxStatus: 'Unpaid',
      lastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      plateNumber: 'DEF456',
      taxStatus: 'Unknown',
      lastChecked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      plateNumber: 'GHI012',
      registeredOwner: 'Michael Brown',
      taxStatus: 'Paid',
      lastChecked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 5,
      plateNumber: 'JKL345',
      registeredOwner: 'Emily Davis',
      taxStatus: 'Unpaid',
      lastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  // Filter data based on search and status
  const filteredData = mockData.filter(record => {
    const matchesSearch = record.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.registeredOwner && record.registeredOwner.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || record.taxStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTaxStatusBadge = (status: 'Paid' | 'Unpaid' | 'Unknown') => {
    const handleStatusClick = () => {
      setStatusFilter(statusFilter === status ? '' : status);
    };

    switch (status) {
      case 'Paid':
        return (
          <Badge 
            className="bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200 transition-colors"
            onClick={handleStatusClick}
          >
            Paid
          </Badge>
        );
      case 'Unpaid':
        return (
          <Badge 
            variant="destructive" 
            className="cursor-pointer hover:bg-red-600 transition-colors"
            onClick={handleStatusClick}
          >
            Unpaid
          </Badge>
        );
      case 'Unknown':
        return (
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={handleStatusClick}
          >
            Unknown
          </Badge>
        );
    }
  };

  const handleRefreshDatabase = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to government database
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRefreshing(false);
    toast({
      title: "Database Refreshed! 🔄",
      description: "License plate registry updated with latest government data.",
    });
  };

  const handleViewHistory = (plateNumber: string) => {
    navigate(`/history?plate=${encodeURIComponent(plateNumber)}`);
  };

  const getStatusCounts = () => {
    const counts = filteredData.reduce((acc, record) => {
      acc[record.taxStatus] = (acc[record.taxStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      paid: counts.Paid || 0,
      unpaid: counts.Unpaid || 0,
      unknown: counts.Unknown || 0,
    };
  };

  const statusCounts = getStatusCounts();

  const handleStatusCardClick = (status: 'Paid' | 'Unpaid' | 'Unknown') => {
    setStatusFilter(statusFilter === status ? '' : status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Current Date Display */}
        <div className="text-right mb-4 text-sm text-gray-500">
          Current Date: {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Registry</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              License Plate Registry
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track license plates and their tax payment status from government databases
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
          <Card 
            className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
              statusFilter === 'Paid' ? 'ring-2 ring-green-500 bg-green-50/80' : ''
            }`}
            onClick={() => handleStatusCardClick('Paid')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tax Paid</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.paid}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
              statusFilter === 'Unpaid' ? 'ring-2 ring-red-500 bg-red-50/80' : ''
            }`}
            onClick={() => handleStatusCardClick('Unpaid')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tax Unpaid</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.unpaid}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
              statusFilter === 'Unknown' ? 'ring-2 ring-gray-500 bg-gray-50/80' : ''
            }`}
            onClick={() => handleStatusCardClick('Unknown')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unknown Status</p>
                  <p className="text-2xl font-bold text-gray-600">{statusCounts.unknown}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Refresh Controls */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Search & Controls
            </CardTitle>
            <CardDescription>Search license plates or refresh data from government sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by plate number or owner name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </div>
              {statusFilter && (
                <Button
                  onClick={() => setStatusFilter('')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  Clear Filter: {statusFilter}
                </Button>
              )}
              <Button
                onClick={handleRefreshDatabase}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh from Gov Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredData.length} of {mockData.length} registry records
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter && ` with ${statusFilter} tax status`}
          </p>
        </div>

        {/* Registry Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Plate Number
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Registered Owner
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Tax Status
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Last Checked
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record) => (
                  <TableRow key={record.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {record.plateNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.registeredOwner ? (
                        <span className="text-gray-900">{record.registeredOwner}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not Available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getTaxStatusBadge(record.taxStatus)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(record.lastChecked)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewHistory(record.plateNumber)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">← Back to Setup</Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">View Dashboard</Link>
            <Link to="/history" className="hover:text-blue-600 transition-colors">Scan History</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registry;
