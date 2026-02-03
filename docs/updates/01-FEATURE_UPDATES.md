# Feature Updates

## [2026-02-03] Hashbang Routing & Off-canvas Editing

### **Overview**
This update introduces a specialized routing system using the **Hashbang (`#!`) paradigm** and a modern **Off-canvas (Drawer)** interface for creating and editing records. These changes transform the CMS from a single-page state-based tool into a fully linkable, history-aware application.

### **1. Hashbang Routing (`#!/`)**
We have implemented a custom lightweight router that uses the hash portion of the URL to manage application state.

*   **Utility:** 
    *   **Deep Linking:** You can now share URLs to specific entities or even specific records (e.g., `#!/entity/users/edit/1`).
    *   **History Support:** The browser's Back and Forward buttons now work as expected, allowing users to navigate between collections and toggle edit modes without losing their place.
    *   **Zero Server Config:** Since it uses the hash, it works perfectly on static hosting without needing complex redirect rules for SPAs.
*   **UX benefit:** Users feel a sense of "place" within the application. Refreshing the page no longer resets the UI to the default view.

### **2. Off-canvas (Drawer) Editing**
The add/edit form has been moved from the bottom of the page into a slide-in "Off-canvas" component.

*   **Utility:** 
    *   **Context Preservation:** The main data table remains partially visible in the background, providing context while editing.
    *   **Focus:** The drawer creates a dedicated focus area for data entry without the jarring transition of a full-page reload.
    *   **Expandable View:** A new "Maximize" button allows users to expand the side panel into a centered, full-featured modal view.
    *   **Responsive Design:** The Off-canvas naturally scales from a side-panel on desktops to a focused overlay on mobile devices.
*   **UX benefit:** It creates a "drill-into-detail" feel. The expandable view is perfect for complex entities with many fields, while the standard side-panel works great for quick edits.

#### **New UI Controls:**
*   **Maximize Button:** Expands the panel to a centered large layout (ideal for long forms).
*   **Minimize Button:** Returns the panel to the side-drawer position.
*   **Scroll Support:** Optimized for long forms with sticky headers and independent internal scrolling.

### **3. Data Provider Enhancements**
To support deep linking directly into an "Edit" view, the `DataProvider` interface was extended with `findById`.

*   **Utility:** Allows the CMS to fetch a single source of truth for a specific record ID immediately upon page load or direct navigation.
*   **UX benefit:** Faster load times for specific record editing and better error handling for missing records.

---

### **How to Use**
*   **Navigate to a collection:** `#!/entity/{entityName}`
*   **Create new record:** `#!/entity/{entityName}/new`
*   **Edit existing record:** `#!/entity/{entityName}/edit/{id}`
