Create Avatar Video (V2)
post
https://api.heygen.com/v2/video/generate
This API now generates videos with our New AI Studio backend.

Log in to see full request history
time	status	user agent	
Make a request to see history.
0 Requests This Month

Request Body
Field	Type	Description
caption	bool (optional)	Whether to add a caption to the video. Default is False. Only text input supports caption
title	str (optional)	Title for the video.
callback_id	str (optional)	A custom ID for callback purposes.
video_inputs		List of video input settings (scenes). Must contain between 1 to 50 items.
dimension		The dimensions of the output video.
VideoInput
Field	Type	Description
character	AvatarSettings or TalkingPhotoSettings (optional)	Character settings.
voice	TextVoiceSettings or AudioVoiceSettings or SilenceVoiceSettings	Voice settings.
background	ColorBackground or ImageBackground or VideoBackground (optional)	Background settings.
Character Settings
AvatarSettings
Field	Type	Description
type	Literal["avatar"]	Indicates that this is an avatar character setting.
avatar_id	str	Avatar ID.
scale	float	Avatar scale, value between 0 and 2.0. Default is 1.0.
avatar_style	CharacterRenderType (optional)	Avatar style. Supported values are: circle, normal, closeUp.
offset	Offset	Avatar offset. Default is { "x": 0.0, "y": 0.0 }.
matting	bool (optional)	Whether to do matting
circle_background_color	str (optional)	background color in the circle when using circle style
TalkingPhotoSettings
Field	Type	Description
type	Literal["talking_photo"]	Indicates that this is a talking photo character setting.
talking_photo_id	str	Talking Photo ID.
scale	float	Talking Photo scale, value between 0 and 2.0. Default is 1.0.
talking_photo_style	TACropStyle (optional)	Talking Photo crop style. Supported values are: square, circle.
offset	Offset	Talking Photo offset.
Default is { "x": 0.0, "y": 0.0 }.
talking_style	TPExpression	Talking Photo talking style. Default is TPExpression.stable. Supported values are: stable, expressive.
expression	TPExpressionStyle	Talking Photo expression style. Default is TPExpressionStyle.default. Supported values are: default, happy.
super_resolution	bool (optional)	Whether to enhance this photar image.
matting	bool (optional)	Whether to do matting.
circle_background_color	str (optional)	background color in the circle/square when using circle/square style
Voice Settings
TextVoiceSettings
Field	Type	Description
type	Literal["text"]	Indicates that this is a text voice setting.
voice_id	str	Voice ID.
input_text	str	Input text.
speed	float (optional)	Voice speed, value between 0.5 and 1.5. Default is 1.
pitch	int (optional)	Voice pitch, value between -50 and 50. Default is 0.
emotion	str (optional)	Voice emotion, if voice support emotion. value are ['Excited','Friendly','Serious','Soothing','Broadcaster']
AudioVoiceSettings
Field	Type	Description
type	Literal["audio"]	Indicates that this is an audio voice setting.
audio_url	str (optional)	Audio URL.
audio_asset_id	str (optional)	Audio asset ID. Either audio_url or audio_asset_id must be provided.
SilenceVoiceSettings
Field	Type	Description
type	Literal["silence"]	Indicates that this is a silence voice setting.
duration	float	Duration of silence, value between 1.0 and 100.0. Default is 1.0.
Background Settings
ColorBackground
Field	Type	Description
type	Literal["color"]	Indicates that this is a color background setting. Default is color.
value	str	Color value in hex format. Default is #f6f6fc.
ImageBackground
Field	Type	Description
type	Literal["image"]	Indicates that this is an image background setting.
url	str (optional)	Image URL.
image_asset_id	str (optional)	Image asset ID. Either url or image_asset_id must be provided.
fit	str (optional)	Background image fit to the screen. Choose among cover , crop, contain and none. Default is cover
VideoBackground
Field	Type	Description
type	Literal["video"]	Indicates that this is a video background setting.
url	str (optional)	Video URL.
video_asset_id	str (optional)	Video asset ID. Either url or video_asset_id must be provided.
play_style	VideoPlayback	Video play style. Supported values are: fit_to_scene, freeze, loop, once. More Info
fit	str (optional)	Background video fit to the screen. Choose among cover , crop, contain and none. Default is cover
Response
Field	Type	Description
video_id	str	ID of the generated video.
Body Params
caption
boolean
Defaults to false
Whether to add a caption to the video.

title
string
Title of this video

callback_id
string
A custom ID for callback purposes.

dimension
object

dimension object
video_inputs
array of objects

ADD object




Credentials
Header
OWYwMjBjOWQzODVkNGM3YWIyMjJlNDNmZDZlMWE4NTEtMTcyOTM3NDg3Ng==

Request
1
curl -X POST https://api.heygen.com/v2/video/generate \
2
-H 'X-Api-Key: <your api key>' \
3
-H 'Content-Type: application/json' \
4
-d '{
5
  "video_inputs": [
6
    {
7
      "character": {
8
        "type": "avatar",
9
        "avatar_id": "Brent_sitting_office_front",
10
        "avatar_style": "normal"
11
      },
12
      "voice": {
13
        "type": "text",
14
        "input_text": "Welcome to HeyGen API",
15
        "voice_id": "ff2ecc8fbdef4273a28bed7b5e35bb57"
16
      }
17
    }
18
  ],
19
  "caption": false,
20
  "dimension": {
21
    "width": 1920,
22
    "height": 1080
23
  }
24
}'

# Create Video (V2)

POST https://api.heygen.com/v2/video/generate

Create a video using an avatar or talking photo with custom settings.

## Request Headers

| Header       | Value              | Description                    |
|--------------|-------------------|--------------------------------|
| content-type | application/json  | The request content type       |
| x-api-key    | string           | Your HeyGen API key            |

## Request Body

```json
{
  "title": "string",         // Title of the video
  "character": {
    "type": "string",        // Either "avatar" or "talking_photo"
    "avatar_id": "string",   // The ID of the avatar or talking photo
    "settings": {
      // Avatar-specific settings
    }
  },
  "voice": {
    "type": "string",        // Voice ID (e.g., "en-US-1")
    "settings": {
      // Voice-specific settings like speed, pitch
    }
  },
  "dimensions": {
    "width": number,         // Video width in pixels
    "height": number         // Video height in pixels
  },
  "script": {
    "text": "string"        // The text to be spoken by the avatar
  }
}
```

### Field Descriptions

#### Character Object
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| type       | string | The type of character ("avatar" or "talking_photo")   |
| avatar_id  | string | The unique identifier of the avatar or talking photo  |
| settings   | object | Additional character-specific settings                |

#### Voice Object
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| type       | string | The voice type to use for the speech                 |
| settings   | object | Voice settings like speed and pitch                  |

#### Dimensions Object
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| width      | number | Width of the video in pixels                         |
| height     | number | Height of the video in pixels                        |

### Available Voice Types
| Voice ID   | Description           |
|------------|-----------------------|
| en-US-1    | English (US) - Male   |
| en-US-2    | English (US) - Female |
| en-GB-1    | English (UK) - Male   |
| en-GB-2    | English (UK) - Female |

### Standard Video Dimensions
| Resolution | Width | Height | Description     |
|------------|-------|---------|----------------|
| 16:9 HD    | 1920  | 1080    | Full HD        |
| 16:9       | 1280  | 720     | HD             |
| 1:1        | 1080  | 1080    | Square         |
| 9:16       | 1080  | 1920    | Mobile/Stories |

## Response

### Success Response (200)
```json
{
  "success": true,
  "video_id": "string",      // Unique identifier for the created video
  "status": "processing"     // Current status of the video
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "message": "string"        // Error message describing what went wrong
}
```

## Example Request

```bash
curl -X POST https://api.heygen.com/v2/video/generate \
  -H "content-type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "title": "Welcome Video",
    "character": {
      "type": "avatar",
      "avatar_id": "abc123",
      "settings": {}
    },
    "voice": {
      "type": "en-US-1",
      "settings": {}
    },
    "dimensions": {
      "width": 1920,
      "height": 1080
    },
    "script": {
      "text": "Hello, welcome to my video!"
    }
  }'
```

## Notes

1. The video creation process is asynchronous. When successful, the API returns a video_id that can be used to check the video's status.
2. The maximum length of the script text is typically limited. Check HeyGen's documentation for current limits.
3. Processing time varies based on the length of the script and current system load.
4. Make sure to handle rate limits and implement appropriate retry mechanisms in production environments.
