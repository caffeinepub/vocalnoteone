# VocalNoteOne - Web Application

A minimalist voice note-taking application built for the Internet Computer.

## Important Notice

This is a **web application** implementation using React + TypeScript on the Internet Computer platform, not the desktop Tauri + Vue.js + Rust application described in the original specification.

### Key Differences from Desktop Specification

- **Platform**: Web app (Internet Computer) instead of desktop (Tauri)
- **Stack**: React + TypeScript instead of Vue.js 3 + Rust
- **Speech Recognition**: Browser Web Speech API instead of SAPI/Vosk
- **Storage**: Browser localStorage instead of SQLite
- **Deployment**: Runs in browser, not as native desktop application

## Features

✅ **Voice Recording**: Click to start/stop voice recording with live transcription
✅ **Real-time Transcription**: See your words appear as you speak (French language)
✅ **Local Storage**: Notes persist in browser localStorage (no account required)
✅ **View Notes**: Browse your saved notes in a modal overlay
✅ **Delete Notes**: Remove individual notes or delete all notes at once
✅ **Privacy-First**: No tracking, no analytics, no cloud sync, no ads

## Browser Requirements

### Speech Recognition Support

The app uses the Web Speech API for voice transcription. This requires:

- **Chrome/Edge**: Full support (recommended)
- **Safari**: Supported on macOS and iOS
- **Firefox**: Limited/no support for Web Speech API

**Important**: Speech recognition requires:
- A working microphone
- HTTPS connection (or localhost for development)
- Browser permission to access microphone
- Internet connection for speech processing (browser-dependent)

### Offline Capabilities

- ✅ **Notes storage**: Fully offline (localStorage)
- ⚠️ **Speech recognition**: Depends on browser implementation
  - Chrome/Edge may require internet for speech processing
  - Safari has better offline support on Apple devices

## Usage

1. **Record a Note**:
   - Click "🎤 Record my notes"
   - Grant microphone permission when prompted
   - Speak in French
   - Click "⏹️ Stop recording" when done
   - Note is automatically saved

2. **View Notes**:
   - Click "📄 View my notes"
   - Browse your saved notes
   - Click ❌ on any note to delete it (with confirmation)
   - Click "Close" to return

3. **Delete All Notes**:
   - Click "🗑️ Delete my notes"
   - Confirm the action
   - All notes are permanently removed

## Technical Details

### Storage Location

Notes are stored in browser localStorage under the key `vocalnote_notes`. Data persists across sessions but is specific to:
- The browser you're using
- The domain/origin of the app
- Your browser profile

**Note**: Clearing browser data will delete all notes.

### Data Format

Notes are stored as JSON with the following structure:
