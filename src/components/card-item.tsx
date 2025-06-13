import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  hint: string;
}

interface CardItemProps {
  data: CardData;
  position: 'center' | 'left' | 'right' | 'hidden';
}

export const CardItem: FC<CardItemProps> = ({ data, position }) => {
  const getTransformStyles = () => {
    switch (position) {
      case 'center':
        return 'translateX(0%) scale(1) rotateZ(0deg)';
      case 'left':
        return 'translateX(-60%) scale(0.8) rotateZ(-5deg)';
      case 'right':
        return 'translateX(60%) scale(0.8) rotateZ(5deg)';
      case 'hidden':
      default:
        return 'translateX(0%) scale(0.5) rotateZ(0deg)'; 
    }
  };

  const getOpacity = () => {
    switch (position) {
      case 'center':
        return 1;
      case 'left':
      case 'right':
        return 0.6;
      case 'hidden':
      default:
        return 0;
    }
  };

  const getZIndex = () => {
    switch (position) {
      case 'center':
        return 20;
      case 'left':
      case 'right':
        return 10;
      case 'hidden':
      default:
        return 0;
    }
  };

  return (
    <div
      className={cn(
        "absolute w-full h-full max-w-[300px] max-h-[400px] transition-all duration-500 ease-out cursor-grab active:cursor-grabbing",
      )}
      style={{
        transform: getTransformStyles(),
        opacity: getOpacity(),
        zIndex: getZIndex(),
      }}
      aria-hidden={position !== 'center'}
    >
      <Card className="w-full h-full flex flex-col shadow-xl overflow-hidden rounded-lg">
        <div className="relative w-full h-48 flex-shrink-0">
          <Image
            src={data.imageUrl}
            alt={data.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={data.hint}
            priority={position === 'center'}
          />
        </div>
        <CardHeader>
          <CardTitle className="font-headline">{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">
            Explore more details about {data.title}. This card offers unique insights and opportunities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
