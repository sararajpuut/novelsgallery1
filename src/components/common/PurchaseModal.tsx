import React, { useState } from 'react';
import { X, CheckCircle2, Lock, ShieldCheck, Sparkles, CreditCard, Wallet } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PurchaseModal: React.FC = () => {
  const { 
    purchaseTarget, 
    closePurchaseModal, 
    purchaseItem, 
    currentUser, 
    setIsAuthModalOpen 
  } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!purchaseTarget) return null;

  const handlePurchase = async () => {
    if (!currentUser) {
      closePurchaseModal();
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);
    await new Promise(res => setTimeout(res, 600));
    await purchaseItem(purchaseTarget);
    setIsProcessing(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      closePurchaseModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#173F35] text-[#F8F4EA] w-full max-w-md rounded-xl shadow-2xl border border-[#C8A45D]/40 overflow-hidden">
        {/* Luxury Header */}
        <div className="p-6 border-b border-[#C8A45D]/30 flex items-center justify-between bg-gradient-to-r from-[#173F35] to-[#4A3025]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D] flex items-center justify-center text-[#C8A45D]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8A45D] font-bold block">
                Premium Edition
              </span>
              <h3 className="font-serif-display text-lg font-bold text-white">
                Unlock Full Access
              </h3>
            </div>
          </div>
          <button
            onClick={closePurchaseModal}
            className="p-1.5 hover:bg-white/10 rounded-md text-[#F8F4EA]/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-[#173F35]">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#C8A45D] mx-auto animate-bounce" />
              <h4 className="font-serif-display text-xl font-bold text-[#F8F4EA]">
                Access Granted!
              </h4>
              <p className="text-xs text-[#C8A45D]">
                The content is now permanently unlocked in your library.
              </p>
            </div>
          ) : (
            <>
              {/* Item summary */}
              <div className="p-4 bg-[#12322a] rounded-lg border border-[#C8A45D]/30 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-[#C8A45D] capitalize font-medium">
                      {purchaseTarget.type}
                    </span>
                    <h4 className="font-serif-display text-base font-bold text-white">
                      {purchaseTarget.title}
                    </h4>
                  </div>
                  <span className="text-lg font-bold text-[#C8A45D] tabular-nums">
                    PKR {purchaseTarget.price}
                  </span>
                </div>
                <p className="text-xs text-[#F8F4EA]/70">
                  Lifetime unlimited online reading, offline bookmarking, and VIP formatting.
                </p>
              </div>

              {/* User Balance */}
              <div className="flex items-center justify-between text-xs px-2 py-1 text-[#F8F4EA]/80">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-[#C8A45D]" />
                  Your Wallet Balance:
                </span>
                <span className="font-semibold text-[#C8A45D] tabular-nums">
                  PKR {currentUser?.walletBalance ?? 2500}
                </span>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#F8F4EA]/70">
                <div className="flex items-center gap-1.5 p-2 bg-[#12322a]/50 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Instant DRM Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-[#12322a]/50 rounded">
                  <CreditCard className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Verified Urdu Edition</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full py-3 bg-[#C8A45D] hover:bg-[#b5924a] text-[#173F35] font-bold text-sm rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Unlock for PKR {purchaseTarget.price}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
