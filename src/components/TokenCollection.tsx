import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { TokenCard } from './TokenCard';
import CardSwap, { Card } from './CardSwap';

interface TokenCollectionProps {
  currencySymbol?: string;
  currencyRate?: number;
}

export const TokenCollection: React.FC<TokenCollectionProps> = ({
  currencySymbol = '$',
  currencyRate = 1,
}) => {
  const { tokens, lessons } = useWalletStore();

  const isLessonCompleted = (lessonId: string) => {
    return lessons.find((l) => l.id === lessonId)?.completed || false;
  };

  const isTokenFoilUnlocked = (symbol: string) => {
    switch (symbol) {
      case 'pETH':
        return isLessonCompleted('lesson-01') || isLessonCompleted('lesson-04');
      case 'pUSDC':
        return isLessonCompleted('lesson-03');
      case 'pMATIC':
        return isLessonCompleted('lesson-04');
      case 'pARB':
        return isLessonCompleted('lesson-05');
      default:
        return false;
    }
  };

  return (
    <div className="w-full space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-graphite dark:text-paper flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
          <span>Token Card Collection</span>
        </h3>
        <span className="font-data text-[10px] text-[#A855F7] bg-[#A855F7]/15 border border-[#A855F7]/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Auto-Swapping Deck
        </span>
      </div>

      {/* CardSwap Deck Stack */}
      <div className="w-full flex justify-center relative">
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={2500}
          pauseOnHover={false}
        >
          {tokens.map((token, idx) => {
            const isCompleted = isTokenFoilUnlocked(token.symbol);
            return (
              <Card key={token.symbol}>
                <TokenCard
                  token={token}
                  currencySymbol={currencySymbol}
                  currencyRate={currencyRate}
                  isLessonCompleted={isCompleted}
                  delayIndex={idx}
                />
              </Card>
            );
          })}
        </CardSwap>
      </div>
    </div>
  );
};
