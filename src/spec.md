# Specification

## Summary
**Goal:** Replace the transcription textarea placeholder in the desktop UI with an accessible, simple French sentence.

**Planned changes:**
- Update the transcription textarea placeholder in `frontend/src/App.tsx` from "Your transcription will appear here..." to the exact French string: "Votre transcription apparaîtra ici…".
- Keep the textarea read-only and ensure it still clearly indicates transcription text will appear in that area.

**User-visible outcome:** The transcription area shows a French placeholder ("Votre transcription apparaîtra ici…") instead of the current English text, while behaving the same otherwise.
