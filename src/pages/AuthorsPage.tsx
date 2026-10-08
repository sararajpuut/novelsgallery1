import React from 'react';
import { Users, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AuthorCard } from '../components/common/AuthorCard';

interface AuthorsPageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
}

export const AuthorsPage: React.FC<AuthorsPageProps> = ({ navigate }) => {
  const { authors } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#173F35]/15 pb-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#C8A45D]">
          Literary Directory
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#173F35] mt-1">
          Authors & Urdu Novelists
        </h1>
        <p className="font-urdu text-base text-[#4A3025] font-semibold mt-1">
          اردو زبان و ادب کے نامور مصنفین، ادیب اور افسانہ نگار
        </p>
      </div>

      {/* Grid of Authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map(author => (
          <AuthorCard
            key={author.id}
            author={author}
            onSelect={(id) => navigate('author-detail', { id })}
          />
        ))}
      </div>
    </div>
  );
};
