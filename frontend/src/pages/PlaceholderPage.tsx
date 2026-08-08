import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="space-y-6">
      <PageHeader title={title} description="Esta area esta reservada para uma etapa futura aprovada." />
      <Card className="p-8 text-sm text-slate-400">Nenhuma funcionalidade foi implementada para esta secao ainda.</Card>
    </section>
  );
}
