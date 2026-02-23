# Specification

## Summary
**Goal:** Fix the speech recognition state management to allow consecutive note recordings without page refresh.

**Planned changes:**
- Reset speech recognition state after each note save
- Clear the transcript input field after successful save
- Ensure the speech recognition listener remains active after note operations
- Prevent duplicate or concatenated content from previous recordings

**User-visible outcome:** Users can record and save multiple notes consecutively in the same session without any manual intervention or page refresh required.
