import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="space-y-6">
      <PageHeader title={title} description="This area is reserved for a future approved stage." />
      <Card className="p-8 text-sm text-slate-400">No functionality has been implemented for this section yet.</Card>
    </section>
  );
}

