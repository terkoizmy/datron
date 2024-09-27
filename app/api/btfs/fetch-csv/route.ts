// app/api/fetch-csv/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'csv-parse/sync';

const BTFS_GATEWAY = 'https://gateway.btfs.io/btfs/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cid = searchParams.get('cid');

  if (!cid) {
    return NextResponse.json({ error: 'CID is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${BTFS_GATEWAY}${cid}`, { responseType: 'text' });
    const csvContent = response.data;
    
    // Parse CSV content
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Limit to first 10 records
    const limitedRecords = records.slice(0, 100);

    return NextResponse.json({ 
      records: limitedRecords,
      totalRecords: records.length
    });
  } catch (error: any) {
    console.error('Error fetching CSV file:', error);
    return NextResponse.json({ 
      error: 'Error fetching CSV file', 
      details: error.message 
    }, { status: error.response?.status || 500 });
  }
}