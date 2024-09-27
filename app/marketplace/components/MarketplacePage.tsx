"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Search, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DatasetListingDialog } from './DatasetListingDialog';
import { useTronWeb } from '@/hooks/useTronWeb';
import { getAllDatasets } from '@/utils/tronContract';
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link';

const ITEMS_PER_PAGE = 6;

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { tronWeb } = useTronWeb();

  const { data: datasets, isLoading, error } = useQuery(
    'datasets',
    () => tronWeb ? getAllDatasets(tronWeb) : null,
    { enabled: !!tronWeb }
  );

  // Filter datasets based on search term and category
  const filteredDatasets = useMemo(() => {
    if (!datasets) return [];
    // @ts-ignore
    return datasets.filter(dataset => 
      dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || dataset.category === selectedCategory)
    );
  }, [datasets, searchTerm, selectedCategory]);

  // Calculate pagination
  const pageCount = Math.ceil(filteredDatasets.length / ITEMS_PER_PAGE);
  const currentDatasets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDatasets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDatasets, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // if (isLoading) return <div className="text-center mt-8">Loading datasets...</div>;
  // // @ts-ignore
  // if (error) return <div className="text-center mt-8 text-red-500">Error loading datasets: {error.message}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">AI Training Datasets Marketplace</h1>
        {/* <BTFSTest /> */}
        {/* <BTFSOperations /> */}
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="NLP">NLP</SelectItem>
                <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                <SelectItem value="Time Series">Time Series</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('grid')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Grid size={20} />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('list')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <List size={20} />
              </Button>
            </div>
          </div>
          <DatasetListingDialog />
        </div>

        {/* Dataset Grid/List */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          
          {!isLoading ? // @ts-ignore
          currentDatasets.map(dataset => (
            <Link key={dataset.id} href={`http://localhost:3000/marketplace/${dataset.id}`}>
              <Card key={dataset.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-900">{dataset.title}</CardTitle>
                  <CardDescription className="text-blue-600">{dataset.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700">Size: {dataset.size}</p>
                  <p className="text-sm text-blue-700">Owner: {dataset.owner.slice(0, 6)}...{dataset.owner.slice(-4)}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-900">{dataset.price} TRX</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white z-50">Purchase</Button>
                </CardFooter>
              </Card>
            </Link>
          ))
        : 
        <div>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
        }
        </div>
        {filteredDatasets.length === 0 && !isLoading && (
          <p className="text-center text-blue-500 mt-8">No datasets found matching your criteria.</p>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} text-blue-600 hover:text-blue-800`}
                  />
                </PaginationItem>
                {[...Array(pageCount)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className={`cursor-pointer ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    className={`cursor-pointer ${currentPage === pageCount ? 'pointer-events-none opacity-50' : ''} text-blue-600 hover:text-blue-800`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketplacePage;