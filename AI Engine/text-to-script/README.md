# AI Engine - Video Generation Pipeline

This module provides an end-to-end AI video generation pipeline that converts text prompts into complete videos.

## Directory Structure

```
ai-engine/       - Main orchestrator
  └── index.js   - Entry point (createVideo function)

generateScript.js - Script generation from prompts

image-generation/
  ├── generateImages.js
  └── imageUtils.js

voice-generation/
  ├── generateVoice.js
  └── voiceUtils.js

subtitle-generator/
  ├── generateSubtitles.js
  └── srtGenerator.js

video-renderer/
  ├── renderVideo.js
  └── sceneComposer.js

ffmpeg-pipeline/
  ├── ffmpegService.js
  └── mergeAssets.js

text-to-script/
  └── promptTemplates.js
```

## Usage

```javascript
const { createVideo } = require('./ai-engine/index');

const video = await createVideo('Your story prompt here');
```

## Pipeline Flow

1. **Script Generation** - Converts text prompt into structured script with scenes
2. **Image Generation** - Creates images for each scene
3. **Voice Generation** - Generates narration audio
4. **Subtitle Generation** - Creates SRT subtitle files
5. **Video Merging** - Combines all assets into final video
6. **Rendering** - Applies composition and effects

## Installation

```bash
npm install
```

## Testing

```bash
npm test
```
