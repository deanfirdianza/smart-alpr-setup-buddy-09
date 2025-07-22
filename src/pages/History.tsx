import React, { useState, useEffect } from 'react';
import { Calendar, Search, Download, RotateCcw, Clock, Target, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'react-router-dom';
import api from '@/lib/axios';
import { getScanHistory, HistoryRecord } from '@/api/history';

const History = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [scanData, setScanData] = useState<HistoryRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Check for plate param in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const plateParam = urlParams.get('plate');
    if (plateParam) setSearchTerm(plateParam);
  }, [location]);

  // Fetch scan history data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getScanHistory({
          plate: searchTerm,
          date_from: dateFrom,
          date_to: dateTo,
          page: currentPage,
          per_page: recordsPerPage,
        });

        console.log('Scan History Response:', res); // 👈 log to inspect

        setScanData(res.items);
        setTotalRecords(res.total);
      } catch (err: any) {
        console.error('Fetch failed:', err); // 👈 log the full error
        toast({ title: 'Failed to load data', description: 'Please try again later.' });
      }
    };

    fetchData();
  }, [searchTerm, dateFrom, dateTo, currentPage]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
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
      'Nomor Polisi,Timestamp,Confidence',
      ...scanData.map(record =>
        `${record.plate_number},${record.timestamp},${Math.round(record.confidence * 100)}%`
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
      description: `${scanData.length} records exported to CSV file.`,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);

    toast({
      title: "Filters Reset! 🔄",
      description: "All filters have been cleared and data is now showing all records.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-right mb-4 text-sm text-gray-500">
          Current Date: {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to="/registry" className="hover:text-blue-600 transition-colors">Registry</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Riwayat</span>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Riwayat Scan
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all license plate detections from your ALPR system
          </p>
        </div>

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
                <label className="text-sm font-medium text-gray-700">Nomor Polisi</label>
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
                  <Button onClick={handleResetFilters} variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {scanData.length} of {totalRecords} records
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Nomor Polisi
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Timestamp
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Confidence</TableHead>
                  <TableHead className="font-semibold">Screenshot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanData.map((record) => (
                  <TableRow key={record.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {record.plate_number}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(record.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getConfidenceBadge(record.confidence)}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 text-sm">N/A</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((pageNum) => (
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
                ))}
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
