// app/datasets/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { TronPayment } from '../components/TronPayment';
import { Card, CardContent } from "@/components/ui/card";
import { getDataset } from '@/utils/tronContract';
import { useTronWeb } from '@/hooks/useTronWeb';
import { FiDatabase, FiDollarSign, FiUser, FiHash, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

const DatasetDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { tronWeb } = useTronWeb();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dataset, isLoading, error } = useQuery(
    ['dataset', id],
    async () => {
      if (!tronWeb) throw new Error("TronWeb not available");
      return await getDataset(tronWeb, parseInt(id));
    },
    { 
      enabled: !!tronWeb,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  const { data: csvData, isLoading: isLoadingCsv, error: csvError } = useQuery(
    ['csvData', dataset?.btfsCID],
    async () => {
      if (!dataset?.btfsCID) return null;
      const response = await fetch(`/api/btfs/fetch-csv?cid=${dataset.btfsCID}`);
      if (!response.ok) throw new Error('Failed to fetch CSV data');
      return await response.json();
    },
    {
      enabled: !!dataset?.btfsCID,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <div className="container mx-auto p-4 text-center">Loading...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto p-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <h2 className="font-bold">Error loading dataset</h2>
        <p>{(error as Error).message}</p>
        <p>TronWeb available: {tronWeb ? 'Yes' : 'No'}</p>
        <p>Dataset ID: {id}</p>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="container mx-auto p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        <h2 className="font-bold">Dataset not found</h2>
        <p>TronWeb available: {tronWeb ? 'Yes' : 'No'}</p>
        <p>Dataset ID: {id}</p>
      </div>
    );
  }

  const totalPages = csvData ? Math.ceil(csvData.records.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = csvData ? csvData.records.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) : [];

  const renderPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} text-blue-600 hover:text-blue-800`}
        />
      </PaginationItem>
    );

    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
          className={`cursor-pointer ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className={`cursor-pointer ${currentPage === i ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // More than 5 pages
      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 3; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
                className={`cursor-pointer ${currentPage === i ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 2; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
                className={`cursor-pointer ${currentPage === i ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        // Middle pages
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
                className={`cursor-pointer ${currentPage === i ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Last page (if not already added and not in the last 3 pages)
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
              className={`cursor-pointer ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} text-blue-600 hover:text-blue-800`}
        />
      </PaginationItem>
    );

    return items;
  };


  return (
    <div className=" mx-auto p-4 py-4 pt-24 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">{dataset.title}</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Description</h2>
          <p className="text-gray-700">{dataset.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="flex items-center p-4">
              <FiDatabase className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-blue-700 font-semibold">Category</p>
                <p className="text-lg">{dataset.category}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center p-4">
              <FiDollarSign className="text-green-500 text-2xl mr-3 " />
              <div>
                <p className="text-sm text-green-700 font-semibold">Price</p>
                <p className="text-lg">{dataset.price} TRX</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="flex items-center p-4 ">
              <FiUser className="text-purple-500 text-2xl mr-3 sm:w-10" />
              <div  className=' overflow-auto truncate'>
                <p className="text-sm text-purple-700 font-semibold">Owner</p>
                <p className="text-lg truncate ">{dataset.owner}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-indigo-50 border-indigo-200 mb-8">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {dataset.isListed ? (
                <FiCheckCircle className="text-green-500 text-2xl mr-3" />
              ) : (
                <FiXCircle className="text-red-500 text-2xl mr-3" />
              )}
              <p className="text-lg font-semibold">
                {dataset.isListed ? 'Listed for Sale' : 'Not Listed'}
              </p>
            </div>
            {dataset.isListed && (
              <TronPayment 
                datasetId={dataset.id} 
                price={dataset.price} 
              />
            )}
          </CardContent>
        </Card>

        {isLoadingCsv && <p>Loading CSV data...</p>}
        {csvError && <p>Error loading CSV data: {(csvError as Error).message}</p>}
        {csvData && csvData.records && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Dataset Preview</h2>
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(csvData.records[0]).map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((cell: any, cellIndex: number) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {renderPaginationItems()}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default DatasetDetailsPage;