// utils/tronContract.ts
import TronWeb from 'tronweb';
import { abi } from './abi';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export async function getContract(tronWeb: TronWeb) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address is not defined');
  }

  try {
    return await tronWeb.contract().at(CONTRACT_ADDRESS);
  } catch (error) {
    console.error('Failed to load contract:', error);
    throw new Error('Failed to load contract');
  }
}

export async function listDataset(tronWeb: TronWeb, datasetInfo: {
  title: string;
  description: string;
  category: string;
  size: string;
  price: number;
  btfsCID: string;
}) {
  const contract = await getContract(tronWeb);
  try {
    const transaction = await contract.listDataset(
      datasetInfo.title,
      datasetInfo.description,
      datasetInfo.category,
      datasetInfo.size,
      tronWeb.toSun(datasetInfo.price),
      datasetInfo.btfsCID
    ).send();
    return transaction;
  } catch (error) {
    console.error('Failed to list dataset:', error);
    throw new Error('Failed to list dataset');
  }
}

export async function purchaseDataset(tronWeb: TronWeb, datasetId: number, price: number) {
  const contract = await getContract(tronWeb);
  try {
    const transaction = await contract.purchaseDataset(datasetId).send({
      callValue: tronWeb.toSun(price),
    });
    return transaction;
  } catch (error) {
    console.error('Failed to purchase dataset:', error);
    throw new Error('Failed to purchase dataset');
  }
}

export async function getDataset(tronWeb: any, datasetId: number) {
  let contract = await tronWeb.contract(abi, CONTRACT_ADDRESS); 
  try {
    const dataset = await contract.getDataset(datasetId).call();
    console.log('Raw dataset from contract:', JSON.stringify(dataset, null, 2));

    // Helper function to safely access potentially undefined properties
    const safeAccess = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Helper function to safely convert BigNumber-like values to number
    const safeToNumber = (value: any) => {
      if (typeof value === 'object' && value.toString) {
        // This handles BigNumber from ethers.js and similar libraries
        return Number(value.toString());
      }
      if (typeof value === 'bigint') {
        // This handles native BigInt
        return Number(value);
      }
      return typeof value === 'number' ? value : 0;
    };

    return {
      id: safeToNumber(safeAccess(dataset, 'id')),
      owner: safeAccess(dataset, 'owner') ? tronWeb.address.fromHex(dataset.owner) : 'Unknown',
      title: safeAccess(dataset, 'title') || 'Untitled',
      description: safeAccess(dataset, 'description') || 'No description',
      category: safeAccess(dataset, 'category') || 'Uncategorized',
      size: safeAccess(dataset, 'size') || 'Unknown',
      price: safeAccess(dataset, 'price') ? tronWeb.fromSun(safeToNumber(dataset.price)) : 0,
      btfsCID: safeAccess(dataset, 'btfsCID') || 'No hash',
      isListed: safeAccess(dataset, 'isListed') || false
    };
  } catch (error) {
    console.error('Failed to get dataset:', error);
    throw new Error('Failed to get dataset');
  }
}

export async function getAllDatasets(tronWeb: TronWeb) {
  // @ts-ignore
  let contract = await tronWeb.contract(abi, CONTRACT_ADDRESS); 
  try {
    // @ts-ignore
    const result = await contract.getAllDatasets().call();
    return result.map((dataset: any) => ({
      id: dataset.id.toNumber(),
      // @ts-ignore
      owner: tronWeb.address.fromHex(dataset.owner),
      title: dataset.title,
      description: dataset.description,
      category: dataset.category,
      size: dataset.size,
      price: tronWeb.fromSun(dataset.price),
      btfsHash: dataset.btfsHash,
      isListed: dataset.isListed
    }));
  } catch (error) {
    console.error('Failed to get all datasets:', error);
    throw new Error('Failed to get all datasets');
  }
}