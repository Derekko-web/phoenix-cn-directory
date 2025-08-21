import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
    </main>
  );
}