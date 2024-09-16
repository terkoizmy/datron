// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Datron. All rights reserved.</p>
      </div>
    </footer>
  );
}