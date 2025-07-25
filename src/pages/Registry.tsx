import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Database, Shield, User, Calendar, Target, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PlateRecord, fetchPlates } from '@/api/registry';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas': return 'green';
      case 'Belum Lunas': return 'red';
      default: return 'gray';
    }
  };


  const Registry = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'Lunas' | 'Belum Lunas' | 'Tidak Teridentifikasi' | ''>('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const [data, setData] = useState<PlateRecord[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    // const totalPages = Math.ceil(totalRecords / recordsPerPage);

      const filteredData = data.filter(record => {
    const matchesSearch =
      record.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.registered_owner && record.registered_owner.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || record.tax_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);


  const getTaxStatusBadge = (status: 'Lunas' | 'Belum Lunas' | 'Tidak Teridentifikasi') => {
    const handleStatusClick = () => {
      setStatusFilter(statusFilter === status ? '' : status);
    };

    switch (status) {
      case 'Lunas':
        return (
          <Badge 
            className="bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200 transition-colors"
            onClick={handleStatusClick}
          >
            Paid
          </Badge>
        );
      case 'Belum Lunas':
        return (
          <Badge 
            variant="destructive" 
            className="cursor-pointer hover:bg-red-600 transition-colors"
            onClick={handleStatusClick}
          >
            Unpaid
          </Badge>
        );
      case 'Tidak Teridentifikasi':
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
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchPlates(searchTerm, statusFilter, currentPage, recordsPerPage);
        setData(res.items);
        setTotalRecords(res.total);
      } catch (err) {
        console.error(err);
        toast({ title: 'Failed to load registry data', variant: 'destructive' });
      }
    };
    load();
  }, [searchTerm, statusFilter, currentPage]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const handleStatusCardClick = (status: 'Lunas' | 'Belum Lunas' | 'Tidak Teridentifikasi') =>
    setStatusFilter(statusFilter === status ? '' : status);

  const statusCounts = {
    paid: data.filter(r => r.tax_status === 'Lunas').length,
    unpaid: data.filter(r => r.tax_status === 'Belum Lunas').length,
    unknown: data.filter(r => r.tax_status === 'Tidak Teridentifikasi').length,
  };

  const handleRefreshDatabase = async () => {
    setIsRefreshing(true);
    try {
      await fetchPlates(searchTerm, statusFilter, currentPage, recordsPerPage); // or call another endpoint if exists
      toast({ title: 'Database Refreshed! 🔄' });
    } catch {
      toast({ title: 'Failed to refresh', variant: 'destructive' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewHistory = (plateNumber: string) => {
    navigate(`/history?plate=${encodeURIComponent(plateNumber)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-right mb-4 text-sm text-gray-500">
          Current Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link><span>/</span>
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link><span>/</span>
          <span className="text-gray-900 font-medium">Data Plat Nomor</span>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Plat Nomor
            </h1>
          </div>
          <p className="text-xl text-gray-600">Data Plat Nomor dan Kepatuhan Pembayaran PKB/SW</p>
        </div>

        {/* Pie Chart Section */}
        <Card className="mb-8 shadow-lg bg-white/80 animate-scale-in">
          <CardContent className="p-6">
            <div className="h-80">
              <ChartContainer
                config={{
                  paid: {
                    label: "PKB/SW Lunas",
                    color: "hsl(142, 76%, 36%)",
                  },
                  unpaid: {
                    label: "PKB/SW Belum Lunas", 
                    color: "hsl(0, 84%, 60%)",
                  },
                  unknown: {
                    label: "PKB/SW Tidak Teridentifikasi",
                    color: "hsl(215, 20%, 65%)",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'PKB/SW Lunas', value: statusCounts.paid, fill: 'hsl(142, 76%, 36%)' },
                        { name: 'PKB/SW Belum Lunas', value: statusCounts.unpaid, fill: 'hsl(0, 84%, 60%)' },
                        { name: 'PKB/SW Tidak Teridentifikasi', value: statusCounts.unknown, fill: 'hsl(215, 20%, 65%)' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'PKB/SW Lunas', value: statusCounts.paid, fill: 'hsl(142, 76%, 36%)' },
                        { name: 'PKB/SW Belum Lunas', value: statusCounts.unpaid, fill: 'hsl(0, 84%, 60%)' },
                        { name: 'PKB/SW Tidak Teridentifikasi', value: statusCounts.unknown, fill: 'hsl(215, 20%, 65%)' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
          {(['Lunas','Belum Lunas','Tidak Teridentifikasi'] as const).map(status => {
          const color = getStatusColor(status);
          const count = statusCounts[status.toLowerCase() as keyof typeof statusCounts];

          return (
            <Card key={status} className={`shadow-lg bg-white/80 cursor-pointer ${statusFilter === status ? 'ring-2 ring-' + color + '-500' : ''}`} onClick={() => handleStatusCardClick(status)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium text-${color}-600`}>PKB/SW {status}</p>
                    <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
                  </div>
                  <div className={`p-3 bg-${color}-100 rounded-full`}>
                    <Shield className={`h-6 w-6 text-${color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" /> Pencarian
            </CardTitle>
            <CardDescription>Search license plates or refresh data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder="Search plate or owner..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="flex-1 bg-white" />
              {statusFilter && <Button variant="outline" size="sm" onClick={()=>setStatusFilter('')}>Clear Filter: {statusFilter}</Button>}
              <Button onClick={handleRefreshDatabase} disabled={isRefreshing} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing?'animate-spin':''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/80">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><div className="flex items-center gap-2"><Target className="h-4 w-4"/><span>Nomor Polisi</span></div></TableHead>
                  <TableHead><div className="flex items-center gap-2"><User className="h-4 w-4"/><span>Pemilik</span></div></TableHead>
                  <TableHead><div className="flex items-center gap-2"><Shield className="h-4 w-4"/><span>Status</span></div></TableHead>
                  <TableHead><div className="flex items-center gap-2"><Calendar className="h-4 w-4"/><span>Pengecekan Terakhir</span></div></TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(r => (
                  <TableRow key={r.id} className="hover:bg-blue-50/50">
                    <TableCell className="font-mono">{r.plate_number}</TableCell>
                    <TableCell>{r.registered_owner ?? <i>Not available</i>}</TableCell>
                    <TableCell>{r.tax_status}</TableCell>
                    <TableCell>{formatDate(r.last_checked)}</TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={()=>handleViewHistory(r.plate_number)}>
                      <Eye className="h-4 w-4 mr-1"/> Detail Riwayat
                    </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious href="#" onClick={e=>{e.preventDefault(); currentPage>1 && setCurrentPage(currentPage-1);}} className={currentPage===1?'opacity-50':''}/>
              {Array(Math.min(totalPages,5)).fill(0).map((_,i)=>(
                <PaginationItem key={i+1}><PaginationLink href="#" onClick={e=>{e.preventDefault();setCurrentPage(i+1)}} isActive={currentPage===i+1}>{i+1}</PaginationLink></PaginationItem>
              ))}
              <PaginationNext href="#" onClick={e=>{e.preventDefault(); currentPage<totalPages && setCurrentPage(currentPage+1);}} className={currentPage===totalPages?'opacity-50':''}/>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">
          <Link to="/" className="mr-4 hover:text-blue-600">← Setup</Link>
          <Link to="/dashboard" className="mr-4 hover:text-blue-600">Dashboard</Link>
          <Link to="/history" className="hover:text-blue-600">History</Link>
        </div>
      </div>
    </div>
  );
};

export default Registry;
