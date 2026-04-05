import { SuitBuilder } from '@/components/workshop/SuitBuilder';
import { Navigation } from '@/components/navigation';

export default function WorkshopPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation transparent />
      <SuitBuilder />
    </main>
  );
}
