"use client";

import type { FC } from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardItem, type CardData } from './card-item';
import { Button } from '@/components/ui/button';

const initialCardsData: CardData[] = [
  { id: '1', title: 'Serene Abstract', description: 'A calming blend of colors and textures.', imageUrl: 'https://placehold.co/600x400.png', hint: 'abstract serenity' },
  { id: '2', title: 'Urban Dreams', description: 'Dynamic cityscape at twilight.', imageUrl: 'https://placehold.co/600x400.png', hint: 'city twilight' },
  { id: '3', title: 'Nature\'s Whisper', description: 'Lush green landscapes beckon.', imageUrl: 'https://placehold.co/600x400.png', hint: 'forest path' },
];

export const SwipeableCardUI: FC = () => {
  const [cards] = useState<CardData[]>(initialCardsData);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);


  const numCards = cards.length;

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    setCurrentIndex((prevIndex) => {
      if (direction === 'left') { // Swiping content to the left (next card)
        return (prevIndex + 1) % numCards;
      } else { // Swiping content to the right (previous card)
        return (prevIndex - 1 + numCards) % numCards;
      }
    });
  }, [numCards]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Check if the event target is one of the cards or the container itself
    // This helps ensure drag only starts on interactable area.
    if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        dragStartX.current = e.clientX;
        isDragging.current = true;
        // Capture pointer on the element that pointerdown event is attached to
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || dragStartX.current === null) return;
    // Optional: Add visual feedback during drag if desired
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || dragStartX.current === null) return;
    
    const dragEndX = e.clientX;
    const dragDeltaX = dragEndX - dragStartX.current;
    const swipeThreshold = 50;

    if (Math.abs(dragDeltaX) > swipeThreshold) {
      if (dragDeltaX < 0) { 
        handleSwipe('left');
      } else { 
        handleSwipe('right');
      }
    }

    dragStartX.current = null;
    isDragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, [handleSwipe]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handleSwipe('right');
      } else if (event.key === 'ArrowRight') {
        handleSwipe('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSwipe]);

  const getCardPosition = useCallback((index: number): 'center' | 'left' | 'right' | 'hidden' => {
    if (index === currentIndex) return 'center';
    
    const leftIndex = (currentIndex - 1 + numCards) % numCards;
    const rightIndex = (currentIndex + 1) % numCards;

    if (index === leftIndex) return 'left';
    if (index === rightIndex) return 'right';
    
    return 'hidden'; // Only relevant if more than 3 cards and complex positioning
  }, [currentIndex, numCards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <h1 className="text-4xl font-headline font-bold text-primary mb-12 text-center">Card Swiper Showcase</h1>
      <div 
        ref={containerRef}
        className="relative w-full max-w-xs sm:max-w-md md:max-w-lg h-[450px] flex items-center justify-center perspective-1000"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp} 
        style={{ touchAction: 'pan-y' }} // Allow vertical scroll, capture horizontal for touch
        role="region"
        aria-roledescription="carousel"
        aria-label="Swipeable cards"
      >
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            data={card}
            position={getCardPosition(index)}
          />
        ))}
      </div>
      <div className="mt-12 flex space-x-6">
        <Button variant="outline" size="lg" onClick={() => handleSwipe('right')} aria-label="Previous Card">
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-2">Prev</span>
        </Button>
        <Button variant="outline" size="lg" onClick={() => handleSwipe('left')} aria-label="Next Card">
          <span className="mr-2">Next</span>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <p className="mt-6 text-muted-foreground text-center">
        Swipe cards, use the buttons, or navigate with arrow keys.
      </p>
    </div>
  );
};

// Basic CSS for perspective (optional, can enhance 3D effect of side cards)
// Add this to a global CSS or style tag if desired:
// .perspective-1000 { perspective: 1000px; }
// And then apply rotateY to side cards for a more 3D carousel effect:
// case 'left': return 'translateX(-60%) scale(0.8) rotateY(30deg)';
// case 'right': return 'translateX(60%) scale(0.8) rotateY(-30deg)';
// For simplicity, this example sticks to 2D translation and scaling.
