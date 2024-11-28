import VideoStatusClient from './VideoStatusClient';

interface Props {
  params: {
    videoId: string;
  };
}

export default function VideoStatusPage({ params }: Props) {
  return <VideoStatusClient videoId={params.videoId} />;
}
