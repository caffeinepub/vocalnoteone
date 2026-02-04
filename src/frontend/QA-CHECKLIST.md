# VocalNoteOne - QA Testing Checklist

This document provides a step-by-step manual testing checklist to validate all primary flows and edge cases for the VocalNoteOne application.

## Prerequisites

- **Browser**: Chrome, Edge, or Safari (Firefox has limited Web Speech API support)
- **Microphone**: Working microphone connected and accessible
- **Connection**: HTTPS or localhost (required for microphone access)
- **Language**: Test with French speech for best results

---

## Test Suite 1: Speech Recognition - Happy Path

### Test 1.1: Start Recording
**Steps:**
1. Open the application
2. Click "Record my notes" button

**Expected Results:**
- ✅ Button changes to red background with "Stop recording" text
- ✅ Browser prompts for microphone permission (first time only)
- ✅ After granting permission, recording starts
- ✅ Microphone indicator appears in browser tab/address bar

### Test 1.2: Live Transcription
**Steps:**
1. Start recording (Test 1.1)
2. Speak clearly in French: "Bonjour, ceci est un test"
3. Pause briefly
4. Continue speaking: "Deuxième phrase de test"

**Expected Results:**
- ✅ Text appears in the transcription area as you speak
- ✅ Interim results show immediately (may be slightly inaccurate)
- ✅ Final results replace interim text (more accurate)
- ✅ No duplicate text appears
- ✅ Each phrase is separated by spaces

### Test 1.3: Stop Recording and Auto-Save
**Steps:**
1. While recording, click "Stop recording" button
2. Wait 1-2 seconds

**Expected Results:**
- ✅ Button returns to blue background with "Record my notes" text
- ✅ Recording stops immediately
- ✅ Microphone indicator disappears from browser
- ✅ Transcript remains visible in textarea
- ✅ Note is automatically saved (verify in Test Suite 2)
- ✅ No auto-restart of recording

---

## Test Suite 2: Notes Management

### Test 2.1: View Saved Notes
**Steps:**
1. Complete Test 1.3 (record and save a note)
2. Click "View my notes" button

**Expected Results:**
- ✅ Modal overlay appears (400×500px)
- ✅ Modal shows "My Notes" title
- ✅ Previously saved note is visible
- ✅ Note displays correct content
- ✅ Note shows timestamp (formatted as "Jan 15, 2026 at 2:30 PM")
- ✅ Each note has a delete button (❌)

### Test 2.2: View Multiple Notes
**Steps:**
1. Record and save 3 different notes
2. Click "View my notes"

**Expected Results:**
- ✅ All 3 notes appear in the list
- ✅ Notes are ordered by creation time (newest first)
- ✅ Modal body is scrollable if content exceeds height
- ✅ Each note is visually separated

### Test 2.3: Delete Single Note
**Steps:**
1. Open notes modal with at least 2 notes
2. Click ❌ button on one note
3. Confirmation overlay appears on that note
4. Click "Delete" button

**Expected Results:**
- ✅ Confirmation overlay appears only on the selected note
- ✅ Overlay shows "Delete this note?" message
- ✅ Two buttons: "Cancel" (grey) and "Delete" (red)
- ✅ After clicking "Delete", note is removed immediately
- ✅ Other notes remain visible
- ✅ Modal stays open

### Test 2.4: Cancel Single Note Deletion
**Steps:**
1. Open notes modal
2. Click ❌ on a note
3. Click "Cancel" button in confirmation

**Expected Results:**
- ✅ Confirmation overlay disappears
- ✅ Note remains in the list
- ✅ No changes to notes

### Test 2.5: Close Notes Modal
**Steps:**
1. Open notes modal
2. Click "Close" button at bottom

**Expected Results:**
- ✅ Modal closes
- ✅ Returns to main app view
- ✅ Transcription area is cleared (ready for new recording)

---

## Test Suite 3: Delete All Notes

### Test 3.1: Delete All Confirmation
**Steps:**
1. Ensure at least 2 notes exist
2. Click "Delete my notes" button

**Expected Results:**
- ✅ Confirmation dialog appears (360px width)
- ✅ Dialog shows "Delete All Notes?" title
- ✅ Warning message: "This will permanently delete all your notes. This action cannot be undone."
- ✅ Two buttons: "Cancel" (grey) and "Delete All" (red)

### Test 3.2: Confirm Delete All
**Steps:**
1. Open delete all dialog (Test 3.1)
2. Click "Delete All" button

**Expected Results:**
- ✅ Dialog closes immediately
- ✅ Green success message appears: "All notes have been deleted"
- ✅ Success message auto-dismisses after 3 seconds
- ✅ Opening notes modal shows "No notes yet" empty state

### Test 3.3: Cancel Delete All
**Steps:**
1. Open delete all dialog
2. Click "Cancel" button

**Expected Results:**
- ✅ Dialog closes
- ✅ No notes are deleted
- ✅ No success message appears

---

## Test Suite 4: Edge Cases & Error Handling

### Test 4.1: Unsupported Browser
**Steps:**
1. Open app in Firefox (or browser without Web Speech API)

**Expected Results:**
- ✅ App loads normally
- ✅ Red error message appears: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
- ✅ "Record my notes" button is disabled (greyed out)
- ✅ Cannot start recording
- ✅ Other features (view notes, delete notes) still work

### Test 4.2: Microphone Permission Denied
**Steps:**
1. Open app in supported browser
2. Click "Record my notes"
3. In browser permission prompt, click "Block" or "Deny"

**Expected Results:**
- ✅ Recording does not start
- ✅ Red error message appears: "Microphone permission denied. Please allow microphone access and try again."
- ✅ Button returns to "Record my notes" state
- ✅ User can try again after granting permission in browser settings

### Test 4.3: No Speech Detected
**Steps:**
1. Start recording
2. Stay silent for 10-15 seconds
3. Stop recording

**Expected Results:**
- ✅ Recording continues (no auto-stop)
- ✅ No error message
- ✅ Transcription area remains empty
- ✅ No note is saved (empty transcript)

### Test 4.4: Rapid Start/Stop Clicks
**Steps:**
1. Click "Record my notes" button
2. Immediately click "Stop recording" (within 0.5 seconds)
3. Repeat 3-4 times rapidly

**Expected Results:**
- ✅ No console errors
- ✅ Button state remains consistent
- ✅ No stuck "recording" state
- ✅ Microphone indicator behaves correctly

### Test 4.5: Network Error (Chrome/Edge)
**Steps:**
1. Disconnect internet (if using Chrome/Edge which may require network)
2. Try to start recording

**Expected Results:**
- ✅ May show error: "Network error. Speech recognition may require an internet connection."
- ✅ Recording stops if it was running
- ✅ User can retry after reconnecting

### Test 4.6: Empty Note (No Content)
**Steps:**
1. Start recording
2. Immediately stop without speaking

**Expected Results:**
- ✅ No note is saved
- ✅ Notes list does not show empty note
- ✅ No error message

---

## Test Suite 5: Persistence & Refresh

### Test 5.1: Data Persistence
**Steps:**
1. Record and save 2 notes
2. Close browser tab
3. Reopen application in new tab (same browser)

**Expected Results:**
- ✅ Notes are still present
- ✅ Click "View my notes" shows both saved notes
- ✅ Content and timestamps are preserved

### Test 5.2: Browser Data Clear
**Steps:**
1. Save notes
2. Clear browser data (localStorage)
3. Reload app

**Expected Results:**
- ✅ All notes are deleted
- ✅ "View my notes" shows empty state
- ✅ App functions normally for new recordings

---

## Test Suite 6: UI/UX Validation

### Test 6.1: Layout & Dimensions
**Steps:**
1. Open app on desktop browser
2. Measure/inspect main frame

**Expected Results:**
- ✅ App frame is 500px × 700px
- ✅ Transcription area is 40% of height
- ✅ Three action buttons are centered and evenly spaced
- ✅ Footer with orange mic circle is visible at bottom

### Test 6.2: Responsive Behavior
**Steps:**
1. Resize browser window to < 540px width
2. Test on mobile device

**Expected Results:**
- ✅ App frame fills viewport (100% width, 100vh height)
- ✅ All buttons remain accessible
- ✅ Modals scale appropriately (90% width)

### Test 6.3: Accessibility
**Steps:**
1. Use keyboard navigation (Tab key)
2. Use screen reader (optional)

**Expected Results:**
- ✅ All buttons are keyboard accessible
- ✅ Buttons have proper aria-labels
- ✅ Focus indicators are visible

---

## Test Suite 7: Cleanup & Unmount

### Test 7.1: Navigate Away During Recording
**Steps:**
1. Start recording
2. Close browser tab immediately

**Expected Results:**
- ✅ No console errors
- ✅ Microphone indicator disappears
- ✅ No lingering microphone access

### Test 7.2: Multiple Sessions
**Steps:**
1. Record note in Tab 1
2. Open app in Tab 2
3. Record note in Tab 2
4. Return to Tab 1, click "View my notes"

**Expected Results:**
- ✅ Both tabs show the same notes (shared localStorage)
- ✅ Notes from Tab 2 appear in Tab 1 after refresh/reopen modal

---

## Regression Testing

Run this checklist after any code changes to ensure no regressions:

- [ ] Test Suite 1: Speech Recognition - Happy Path
- [ ] Test Suite 2: Notes Management
- [ ] Test Suite 3: Delete All Notes
- [ ] Test Suite 4: Edge Cases & Error Handling
- [ ] Test Suite 5: Persistence & Refresh
- [ ] Test Suite 6: UI/UX Validation
- [ ] Test Suite 7: Cleanup & Unmount

---

## Known Limitations

1. **Browser Support**: Web Speech API is not available in Firefox
2. **Network Dependency**: Chrome/Edge may require internet for speech processing
3. **Language**: Optimized for French (fr-FR); other languages may have reduced accuracy
4. **Storage**: Limited by browser localStorage quota (~5-10MB)
5. **Privacy**: Speech processing may be handled by browser vendor's servers

---

## Bug Reporting Template

When reporting bugs, include:

