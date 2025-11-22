from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_about_page(page: Page):
    # 1. Arrange: Go to the Dashboard (root) then navigate to About
    page.goto("http://localhost:3000")

    # Wait for the app to load (simple check for sidebar)
    page.wait_for_selector(".sidebar-menu")

    # 2. Act: Click "About Project" link
    about_link = page.get_by_role("button", name="About Project")
    about_link.click()

    # 3. Assert: Check header and specific content
    expect(page.get_by_role("heading", name="About This Project")).to_be_visible()
    expect(page.get_by_text("Pricing Automation Engineer")).to_be_visible()
    expect(page.get_by_text("Tech Stack & Architecture")).to_be_visible()

    # Check that the "Features" section exists
    expect(page.get_by_role("heading", name="Key Features")).to_be_visible()

    # Check for the migration note
    expect(page.get_by_text("Architecture Decision: Database Migration")).to_be_visible()

    # 4. Screenshot
    page.screenshot(path="verification/about_page_verification.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        # Launch browser (headless=True is fine for this environment)
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_about_page(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()
