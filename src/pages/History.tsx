import React, { useState } from 'react';
import { Calendar, Search, Download, Trash2, Camera, Clock, Target, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ScanRecord {
  id: number;
  plateNumber: string;
  timestamp: Date;
  confidence: number;
  cameraSource: string;
  screenshotUrl?: string;
}

const History = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Mock data for demonstration
  const mockData: ScanRecord[] = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    plateNumber: `ABC${(123 + i).toString().padStart(3, '0')}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    confidence: Math.random() * 0.4 + 0.6, // 60-100%
    cameraSource: `Camera ${Math.floor(Math.random() * 3) + 1}`,
    screenshotUrl: Math.random() > 0.3 ? `/screenshots/img_${i + 1}.jpg` : undefined,
  }));

  // Filter data based on search and date range
  const filteredData = mockData.filter(record => {
    const matchesSearch = record.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateFrom = !dateFrom || record.timestamp >= new Date(dateFrom);
    const matchesDateTo = !dateTo || record.timestamp <= new Date(dateTo);
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800 border-green-200">{percentage}%</Badge>;
    if (percentage >= 75) return <Badge variant="secondary">{percentage}%</Badge>;
    return <Badge variant="outline">{percentage}%</Badge>;
  };

  const handleExportCSV = () => {
    const csvContent = [
      'Plate Number,Timestamp,Confidence,Camera Source',
      ...filteredData.map(record => 
        `${record.plateNumber},${record.timestamp.toISOString()},${Math.round(record.confidence * 100)}%,${record.cameraSource}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alpr_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful! 📊",
      description: `${filteredData.length} records exported to CSV file.`,
    });
  };

  const handleClearHistory = () => {
    toast({
      title: "Clear History",
      description: "History clearing feature would be implemented here.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to="/registry" className="hover:text-blue-600 transition-colors">Registry</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">History</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scan History
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all license plate detections from your ALPR system
          </p>
        </div>

        {/* Filters Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Filters
            </CardTitle>
            <CardDescription>Filter your scan history by date range or plate number</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Plate Number</label>
                <Input
                  placeholder="Search plates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Actions</label>
                <div className="flex gap-2">
                  <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>
                  <Button onClick={handleClearHistory} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {paginatedData.length} of {filteredData.length} records
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Data Table */}
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
                      <Clock className="h-4 w-4 text-blue-500" />
                      Timestamp
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Confidence</TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-blue-500" />
                      Camera Source
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Screenshot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow key={record.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {record.plateNumber}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatTimestamp(record.timestamp)}
                    </TableCell>
                    <TableCell>
                      {getConfidenceBadge(record.confidence)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {record.cameraSource}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.screenshotUrl ? (
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Camera className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center animate-fade-in">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
