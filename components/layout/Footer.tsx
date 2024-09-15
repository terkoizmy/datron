// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 ">
      
        <div className=" border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Datron. All rights reserved.</p>
        </div>
    </footer>
  );
}