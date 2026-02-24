# Specification

## Summary
**Goal:** Fix recording button state transitions and hover behavior to properly reflect recording status and maintain consistent opacity.

**Planned changes:**
- Update recording button to immediately return to blue inactive state when recording stops
- Remove transparency transitions on mouse hover/leave events to keep button fully opaque at all times
- Ensure button color accurately reflects the isRecording state from useSpeechRecognition hook

**User-visible outcome:** The recording button will correctly display blue when inactive and red when recording, with immediate state transitions and no transparency changes when moving the cursor on or off the button.
