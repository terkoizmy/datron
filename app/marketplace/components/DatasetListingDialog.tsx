import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload } from 'lucide-react';
import { z } from 'zod';
import { useTronWeb } from '@/hooks/useTronWeb';
import { listDataset } from '@/utils/tronContract';
import axios from 'axios';

const datasetSchema = z.object({
  title: z.string().min(1, "Title is required").max(256, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  category: z.enum(['NLP', 'Computer Vision', 'Time Series', 'Tabular']),
  size: z.string().min(1, "Size is required"),
  price: z.number().positive("Price must be positive"),
  dataUrl: z.string().url("Invalid URL"),
});

type DatasetFormValues = z.infer<typeof datasetSchema>;

export function DatasetListingDialog() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const { tronWeb, address } = useTronWeb();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const form = useForm<DatasetFormValues>({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'NLP',
      size: '',
      price: 0,
      dataUrl: '',
    },
  });

  useEffect(() => {
    setIsConnected(!!tronWeb && !!address);
  }, [tronWeb, address]);

  const onSubmit = async (values: DatasetFormValues) => {
    if (!isConnected) {
      toast({
        title: "Error",
        description: "Please connect your TronLink wallet before listing a dataset.",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a dataset file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Upload file to BTFS
      const response = await axios.post('/api/btfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      // Convert price to SUN (1 TRX = 1,000,000 SUN)
      const priceInSun = tronWeb!.toSun(values.price);

      // Call the smart contract function
      const transaction = await listDataset(tronWeb!, {
        title: values.title,
        description: values.description || '',
        category: values.category,
        size: values.size,
        price: values.price,
        btfsCID: response.data.cid
      });

      // Wait for the transaction to be confirmed
      await tronWeb!.trx.getTransaction(transaction);

      toast({
        title: "Listing Created",
        description: "Your dataset has been successfully uploaded to BTFS and listed for sale on the blockchain.",
      });
      form.reset();
      setFile(null);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel', 'application/json'];
      if (validTypes.includes(fileType) || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload an xlsx, csv, xls, or json file.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">List New Dataset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-b from-blue-50 to-white border border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800">List a New Dataset</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Dataset Title" {...field} className="border-blue-300 focus:border-blue-500 focus:ring-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NLP">NLP</SelectItem>
                          <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                          <SelectItem value="Time Series">Time Series</SelectItem>
                          <SelectItem value="Tabular">Tabular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500MB, 2GB" {...field} className="border-blue-300 focus:border-blue-500 focus:ring-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Price (TRX)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="border-blue-300 focus:border-blue-500 focus:ring-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-32" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Data URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/data" {...field} className="border-blue-300 focus:border-blue-500 focus:ring-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel className="text-blue-700">Upload Dataset File (xlsx, csv, xls, or json)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".xlsx,.csv,.xls,.json"
                        onChange={handleFileChange}
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Upload className="text-blue-500" />
                    </div>
                  </FormControl>
                  {file && (
                    <p className="text-sm text-blue-600 mt-1">File selected: {file.name}</p>
                  )}
                </FormItem>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? 'Listing Dataset...' : isConnected ? 'List Dataset' : 'Connect TronLink to List'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}