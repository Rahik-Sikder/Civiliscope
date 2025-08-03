import { useParams, Link } from 'react-router-dom';
import { useMemberDetails } from '../../hooks/useMemberDetails';
import MainLayout from '../../components/layout/MainLayout';
import MemberHeader from '../../components/member/MemberHeader';
import ServiceHistory from '../../components/member/ServiceHistory';
import LeadershipRoles from '../../components/member/LeadershipRoles';
import LegislativeStats from '../../components/member/LegislativeStats';
import InfoCard from '../../components/shared/InfoCard';
import Breadcrumb from '../../components/shared/Breadcrumb';
import LoadingDots from '../../components/shared/LoadingDots';

export default function LegislatorPage() {
  const { bioguideId } = useParams<{ bioguideId: string }>();
  const { data: memberResponse, isLoading, error } = useMemberDetails(bioguideId);
  
  if (!bioguideId) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Invalid Legislator ID</h1>
            <Link to="/" className="btn btn-primary">Return Home</Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <LoadingDots size="large" dotColor="#ff1744" glowColor="rgba(255,23,68,0.3)" speed="normal" />
            <p className="text-white mt-6">Loading member information...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !memberResponse) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Member Not Found</h1>
            <p className="text-gray-400 mb-6">
              Could not find member with Bioguide ID: {bioguideId}
            </p>
            <div className="space-x-4">
              <Link to="/senate" className="btn btn-primary">Browse Senate</Link>
              <Link to="/house" className="btn btn-secondary">Browse House</Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { member } = memberResponse;
  
  // Create breadcrumb items
  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { 
      title: member.terms[0]?.chamber || 'Congress', 
      href: member.terms[0]?.chamber === 'Senate' ? '/senate' : '/house' 
    },
    { title: member.lastName, isActive: true }
  ];
  
  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="container mx-auto px-6 py-8">
          {/* Navigation Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          {/* Member Header */}
          <MemberHeader member={member} />
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service & Leadership */}
            <div className="lg:col-span-2 space-y-8">
              <ServiceHistory member={member} />
              <LeadershipRoles member={member} />
              
              {/* Placeholder for future lobbying information */}
              <InfoCard title="Lobbying Information" variant="dark" padding="lg" minHeight="400px">
                <div className="text-gray-400 text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <p className="text-lg">Coming Soon</p>
                  <p className="text-sm">Lobbying data and influence tracking will be displayed here</p>
                </div>
              </InfoCard>
            </div>

            {/* Right Column - Stats & Quick Info */}
            <div className="space-y-8">
              <LegislativeStats member={member} />
              
              {/* Additional Info Card */}
              <InfoCard title="Quick Facts" variant="dark" padding="md" minHeight="200px">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-3 glass-patriot rounded-lg border border-gray-600/30">
                    <span className="text-gray-300 font-medium">Birth Year</span>
                    <span className="text-white font-semibold">{member.birthYear}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-patriot rounded-lg border border-gray-600/30">
                    <span className="text-gray-300 font-medium">Bioguide ID</span>
                    <span className="text-white font-mono font-semibold">{member.bioguideId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-patriot rounded-lg border border-gray-600/30">
                    <span className="text-gray-300 font-medium">Last Updated</span>
                    <span className="text-white font-semibold">
                      {new Date(member.updateDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}