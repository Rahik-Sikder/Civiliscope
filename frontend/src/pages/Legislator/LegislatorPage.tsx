import { useParams } from 'react-router-dom';
import { useSenators } from '../../hooks/useSenators';
import { useRepresentatives } from '../../hooks/useRepresentatives';
import MainLayout from '../../components/layout/MainLayout';
import type { Legislator } from '../../types/legislator';

export default function LegislatorPage() {
  const { bioguideId } = useParams<{ bioguideId: string }>();
  
  const { data: senators, isLoading: senatorsLoading } = useSenators();
  const { data: representatives, isLoading: repsLoading } = useRepresentatives();
  
  if (!bioguideId) {
    return (
      <MainLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Invalid Legislator ID</h1>
        </div>
      </MainLayout>
    );
  }
  
  if (senatorsLoading || repsLoading) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="loading loading-spinner loading-lg"></div>
          <p>Loading legislator information...</p>
        </div>
      </MainLayout>
    );
  }
  
  // Find legislator in both senators and representatives
  const allLegislators: Legislator[] = [
    ...(senators || []),
    ...(representatives || [])
  ];
  
  const legislator = allLegislators.find(leg => leg.bioguide_id === bioguideId);
  
  if (!legislator) {
    return (
      <MainLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Legislator Not Found</h1>
          <p>No legislator found with Bioguide ID: {bioguideId}</p>
        </div>
      </MainLayout>
    );
  }
  
  const isSenator = senators?.some(s => s.bioguide_id === bioguideId);
  
  return (
    <MainLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-start gap-6">
              {legislator.photo_url && (
                <div className="avatar">
                  <div className="w-32 rounded-xl">
                    <img 
                      src={legislator.photo_url} 
                      alt={legislator.name}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h1 className="card-title text-3xl mb-2">{legislator.name}</h1>
                <div className="flex flex-wrap gap-4 text-lg">
                  <div className="badge badge-primary badge-lg">
                    {isSenator ? 'Senator' : 'Representative'}
                  </div>
                  <div className="badge badge-secondary badge-lg">
                    {legislator.party}
                  </div>
                  <div className="badge badge-accent badge-lg">
                    {legislator.state}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p><strong>Bioguide ID:</strong> {legislator.bioguide_id}</p>
                  {legislator.term_start && (
                    <p><strong>Term Start:</strong> {legislator.term_start}</p>
                  )}
                  {legislator.term_end && (
                    <p><strong>Term End:</strong> {legislator.term_end}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}