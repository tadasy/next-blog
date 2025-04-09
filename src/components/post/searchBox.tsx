'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

export default function SearchBox() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/?search=${debouncedSearch.trim()}`);
    } else {
      router.push('/');
    }
  }, [debouncedSearch, router]);

  return (
    <>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white x-[200px] lg:w-[300px]"
      />
    </>
  )
}
