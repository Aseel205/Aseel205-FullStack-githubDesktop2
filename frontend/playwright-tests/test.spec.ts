// tests/notes.spec.ts
import { test, expect, Page } from '@playwright/test';

const APP_URL = 'http://localhost:5173';

// Helper: locate a note by its test ID
function locateNoteById(page: Page, id: string) {
  return page.locator(`.note[data-testid="${id}"]`);
}

// Helper: wait for the notification area to display specific texta
async function waitForNotification(page: Page, expectedText: string) {
  const notification = page.locator('.notification');
  await notification.waitFor({ state: 'visible', timeout: 10000 });
  await expect(notification).toHaveText(expectedText, { timeout: 10000 });
}

// Helper: wait until at least one note is present
async function waitForNotes(page: Page) {
  await page.waitForSelector('.note', { timeout: 10000 });
}

// Runs before each test: navigate and ensure UI is ready
test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);
  await waitForNotification(page, 'Notification area');
  await waitForNotes(page);
});

// 1) Read page: ensure existing notes are displayed
test('reads the page and shows existing notes', async ({ page }) => {
  const notes = page.locator('.note');
  await expect(notes).toHaveCount(10);
  await waitForNotification(page, 'Notification area');
});

// 2) Create a new note
test('creates a new note', async ({ page }) => {
  // open add-new UI
  await page.click('button[name="add_new_note"]');
  const input = page.locator('input[name="text_input_new_note"]');
  await expect(input).toBeVisible();
  await expect(page.locator('button[name="text_input_save_new_note"]')).toBeVisible();
  await expect(page.locator('button[name="text_input_cancel_new_note"]')).toBeVisible();

  // fill and save
  const newContent = 'Playwright test note';
  await input.fill(newContent);
  await page.click('button[name="text_input_save_new_note"]');

  // wait for notification
  await waitForNotification(page, 'Added a new note');

  // navigate to last page
  await page.click('button[name="last"]');
  await waitForNotes(page);

  // verify the last note on last page has the new content
  const lastNote = page.locator('.note').last();
  await expect(lastNote.locator('p.note-content')).toHaveText(newContent);
});

// 3) Edit an existing note
test('edits an existing note', async ({ page }) => {
  const first = page.locator('.note').first();
  const noteId = await first.getAttribute('data-testid');
  if (!noteId) return;

  await page.click(`button[data-testid="edit-${noteId}"]`);
  const textarea = page.locator(`textarea[name="text_input-${noteId}"]`);
  await expect(textarea).toBeVisible();
  await expect(page.locator(`button[name="text_input_save-${noteId}"]`)).toBeVisible();
  await expect(page.locator(`button[name="text_input_cancel-${noteId}"]`)).toBeVisible();

  const updated = 'Updated by Playwright';
  await textarea.fill(updated);
  await page.click(`button[name="text_input_save-${noteId}"]`);

  const updatedNote = locateNoteById(page, noteId).locator('p.note-content');
  await expect(updatedNote).toHaveText(updated);
  await waitForNotification(page, 'Note updated');
  
}); 

// 4) Delete a note
test('deletes a note', async ({ page }) => {
  const beforeCount = await page.locator('.note').count();
  const first = page.locator('.note').first();
  const noteId = await first.getAttribute('data-testid');
  if (!noteId) return;

  await page.click(`button[data-testid="delete-${noteId}"]`);
  await waitForNotification(page, 'Note deleted');
  await expect(page.locator('.note')).toHaveCount(beforeCount - 1);
});
