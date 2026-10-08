import React from 'react';
import { BookOpen, Users, ChevronRight } from 'lucide-react';
import { Author } from '../../types';

interface AuthorCardProps {
  author: Author;
  onSelect: (authorId: string) => void;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, onSelect }) => {
  return (
    <article 
      onClick={() => onSelect(author.id)}
      className="group bg-white rounded-lg border border-[#173F35]/15 p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#EEE8D8] border-2 border-[#C8A45D]/40 shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={author.photoUrl}
              alt={author.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-serif-display text-base font-bold text-[#173F35] group-hover:text-[#C8A45D] transition-colors truncate">
              {author.name}
            </h3>
            <p className="font-urdu text-sm text-[#4A3025] font-semibold mt-0.5">
              {author.urduName}
            </p>
            {/* Unboxed metadata */}
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mt-1">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#173F35]" />
                <span className="tabular-nums">{author.novelsCount} Novels</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#4A3025]" />
                <span className="tabular-nums">{(author.followersCount / 1000).toFixed(0)}k Readers</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#6B6B6B] mt-4 line-clamp-2 leading-relaxed">
          {author.bio}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EEE8D8] flex items-center justify-between text-xs font-semibold text-[#173F35] group-hover:text-[#C8A45D] transition-colors">
        <span>View Full Bibliography</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </article>
  );
};
