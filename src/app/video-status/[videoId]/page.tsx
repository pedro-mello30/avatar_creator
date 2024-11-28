import VideoStatusClient from './VideoStatusClient';

export default function VideoStatusPage({ params }: { params: { videoId: string } }) {
  return <VideoStatusClient videoId={params.videoId} />;
}
