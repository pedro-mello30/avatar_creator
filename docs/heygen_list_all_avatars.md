List All Avatars (V2)
get
https://api.heygen.com/v2/avatars
You can get your Avatars and Talking Photos(Photo Avatars) with this endpoint.

Log in to see full request history
time	status	user agent	
Make a request to see history.
0 Requests This Month

Response
Avatars
Field	Type	Description
avatars		List of avatar objects.
avatars[].avatar_id	string	Unique identifier for the avatar.
avatars[].avatar_name	string	Name of the avatar.
avatars[].gender	string	Gender associated with the avatar.
avatars[].preview_image_url	string	URL for the preview image of the avatar.
avatars[].preview_video_url	string	URL for the preview video of the avatar.
TalkingPhotos
Field	Type	Description
talking_photos		List of talking photo objects.
talking_photos[].talking_photo_id	string	Unique identifier for the talking photo.
talking_photos[].talking_photo_name	string	Name of the talking photo.
talking_photos[].preview_image_url	string	URL for the preview image of the talking photo.
Responses

200
200

Response body
object

