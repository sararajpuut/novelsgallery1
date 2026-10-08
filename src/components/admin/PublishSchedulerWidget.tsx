import React from 'react';
import { Calendar, Clock, CheckCircle2, FileEdit, EyeOff, Send, HelpCircle } from 'lucide-react';
import { PublishStatus } from '../../types';

interface PublishSchedulerWidgetProps {
  status: PublishStatus;
  onChangeStatus: (status: PublishStatus) => void;
  publicationDate: string;
  onChangeDate: (date: string) => void;
  publicationTime?: string;
  onChangeTime?: (time: string) => void;
}

export const PublishSchedulerWidget: React.FC<PublishSchedulerWidgetProps> = ({
  status,
  onChangeStatus,
  publicationDate,
  onChangeDate,
  publicationTime = '12:00',
  onChangeTime,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().slice(0, 5);

  const setHistoricalDateOct2025 = () => {
    onChangeDate('2025-10-08');
    if (onChangeTime) onChangeTime('12:00');
  };

  const setTodayNow = () => {
    onChangeDate(todayStr);
    if (onChangeTime) onChangeTime(nowTimeStr);
  };

  return (
    <div className="bg-[#FAF7F0] border border-[#E5DECE] rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5DECE]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C8A45D]" />
          <h4 className="text-sm font-bold text-[#173F35] tracking-wide uppercase">
            Publication Status & Date/Time Scheduling
          </h4>
        </div>
        <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Past dates supported (e.g., Oct 8, 2025)
        </span>
      </div>

      {/* Status Selection Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <button
          type="button"
          onClick={() => onChangeStatus('published')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
            status === 'published'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-[#252525] border-[#D1C7B7] hover:border-emerald-500'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Published</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStatus('draft')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
            status === 'draft'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-[#252525] border-[#D1C7B7] hover:border-amber-500'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Draft</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStatus('scheduled')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
            status === 'scheduled'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-[#252525] border-[#D1C7B7] hover:border-blue-500'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Scheduled</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStatus('unpublished')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
            status === 'unpublished'
              ? 'bg-neutral-600 text-white border-neutral-600 shadow-sm'
              : 'bg-white text-[#252525] border-[#D1C7B7] hover:border-neutral-500'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Unpublished</span>
        </button>
      </div>

      {/* Date & Time Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-lg border border-[#E5DECE]">
        {/* Date Field */}
        <div>
          <label className="block text-xs font-medium text-[#173F35] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" /> Publication Date
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={setTodayNow}
                className="text-[10px] text-[#173F35] underline hover:text-[#C8A45D]"
              >
                Today
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={setHistoricalDateOct2025}
                className="text-[10px] text-[#173F35] font-semibold underline hover:text-[#C8A45D]"
                title="Set to October 8, 2025"
              >
                Oct 8, 2025
              </button>
            </div>
          </label>
          <input
            type="date"
            value={publicationDate || todayStr}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-[#D1C7B7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#173F35]"
          />
        </div>

        {/* Time Field */}
        <div>
          <label className="block text-xs font-medium text-[#173F35] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C8A45D]" /> Publication Time
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onChangeTime && onChangeTime('09:00')}
                className="text-[10px] text-[#6B6B6B] hover:text-[#173F35]"
              >
                9 AM
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onChangeTime && onChangeTime('12:00')}
                className="text-[10px] text-[#6B6B6B] hover:text-[#173F35]"
              >
                12 PM
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onChangeTime && onChangeTime('18:00')}
                className="text-[10px] text-[#6B6B6B] hover:text-[#173F35]"
              >
                6 PM
              </button>
            </div>
          </label>
          <input
            type="time"
            value={publicationTime || '12:00'}
            onChange={(e) => onChangeTime && onChangeTime(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-[#D1C7B7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#173F35]"
          />
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="mt-3 text-[11px] text-[#4A4A4A] flex items-center justify-between">
        <div>
          {status === 'published' && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Immediately visible to all visitors with publication date: <strong>{publicationDate} {publicationTime}</strong>
            </span>
          )}
          {status === 'draft' && (
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <FileEdit className="w-3.5 h-3.5" /> Saved in production database as Draft (hidden from public website)
            </span>
          )}
          {status === 'scheduled' && (
            <span className="text-blue-700 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Scheduled for public release on: <strong>{publicationDate} at {publicationTime}</strong>
            </span>
          )}
          {status === 'unpublished' && (
            <span className="text-neutral-700 font-semibold flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5" /> Unpublished from public catalog (retained in admin database)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {status !== 'published' && (
            <button
              type="button"
              onClick={() => onChangeStatus('published')}
              className="text-[11px] font-bold text-emerald-700 hover:underline"
            >
              Publish Now
            </button>
          )}
          {status === 'published' && (
            <button
              type="button"
              onClick={() => onChangeStatus('unpublished')}
              className="text-[11px] font-bold text-neutral-600 hover:underline"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
