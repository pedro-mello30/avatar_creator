import VideoCreationClient from './VideoCreationClient';

export default function CreateVideoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const avatarId = searchParams.avatar_id as string;
  const avatarType = searchParams.type as string;

  if (!avatarId || !avatarType) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">Missing Parameters</h3>
              <p className="text-gray-500 mb-4">Avatar ID and type are required to create a video.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <VideoCreationClient avatarId={avatarId} avatarType={avatarType as 'avatar' | 'takingphoto'} />;
}
