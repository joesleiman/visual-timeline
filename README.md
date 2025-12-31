# Work Order Timeline

This Angular application provides a visual timeline for managing and viewing work orders across different work centers. The timeline displays work orders as bars on a horizontal timeline, allowing users to see the status, duration, and scheduling of orders for each work center.

## Approach

### Architecture
The application is built using Angular 21 with standalone components for better modularity and tree-shaking. The architecture follows a clean separation of concerns:

- **Component-based UI**: Modular, reusable components for timeline rendering, work order bars, and controls
- **Type-safe models**: Strongly-typed interfaces for Work Centers and Work Orders
- **Service layer**: Utility services for date calculations and timeline positioning
- **Signal-based state**: Reactive state management using Angular signals for zoom levels and date ranges

### Timeline Rendering
The timeline view uses a CSS Grid-based layout where:
- Each **row** represents a work center
- Each **column** represents a time unit (day/week/month)
- Work orders are rendered as **absolutely positioned bars** overlaying the grid cells

### Multi-Scale Timeline Support
The application supports three zoom levels with dynamic date range calculations:

1. **Day View**: Shows individual days (today -14 to +28 days)
   - Each cell represents one day
   - Precise pixel positioning based on exact dates

2. **Week View**: Shows weekly intervals (today -56 to +56 days)
   - Each cell represents one week
   - Fractional positioning for orders starting/ending mid-week

3. **Month View**: Shows monthly intervals (today -180 to +180 days)
   - Each cell represents one month
   - Fractional positioning for orders starting/ending mid-month
   - Date ranges normalized to month boundaries (1st to last day)

### Positioning Algorithm
Work order bars are positioned using a fractional unit calculation system:
```typescript
// For each zoom level, calculate:
offsetUnits = unitsBetween(timelineStart, orderStart, zoomLevel)
durationUnits = unitsBetween(orderStart, orderEnd, zoomLevel)

// Convert to pixels (100px per cell)
left = offsetUnits × cellWidth
width = durationUnits × cellWidth
```

**Key features:**
- **Proportional positioning**: Orders starting mid-month/week are positioned proportionally within cells
- **Date clamping**: Orders extending beyond visible range are clipped to timeline boundaries
- **Visibility filtering**: Orders completely outside the visible range are not rendered

### Date Handling
- All dates are stored in ISO format (YYYY-MM-DD)
- Date calculations account for variable month lengths (28-31 days)
- Fractional month calculations use actual days in each month for precision
- Timeline ranges are normalized to period boundaries (month view uses 1st/last day of month)

### Status Management
Work orders have four status types, each with distinct visual styling:
- **Complete**: Green (completed work)
- **In Progress**: Blue (active work)
- **Blocked**: Red (work stopped due to issues)
- **Open**: Gray (scheduled but not started)

### Sample Data Strategy
The application includes 14+ hardcoded work orders designed to test:
- All four status types across different work centers
- Multiple non-overlapping orders on the same work center
- Orders visible/invisible in different zoom levels
- Edge cases (orders spanning timeline boundaries, very short/long durations)
- Orders positioned near today's date for immediate visual feedback

### User Interactions
- **Zoom level switching**: Toggle between day/week/month views with automatic recalculation
- **Cell clicking**: Click empty timeline cells to create new work orders
- **Work order menu**: Three-dot menu on each bar for edit/delete actions (with elevated z-index for proper interaction)
- **Visual feedback**: Hover effects, today indicator column, and status-based coloring

### Performance Considerations
- **Lazy rendering**: Only visible work orders are rendered (filtered by date range)
- **Efficient calculations**: Position calculations are memoized per work order
- **Standalone components**: Tree-shakable architecture reduces bundle size
- **CSS-based positioning**: Hardware-accelerated transforms for smooth rendering

## Setup Steps

1. Ensure you have Node.js and npm installed.
2. Clone the repository.
3. Navigate to the project directory.
4. Install dependencies:
   ```bash
   npm install
   ```

## How to Run the Application

To start the development server, run:
```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Libraries Used

- **Angular**: The core framework for building the application, providing components, services, and routing.
- **Bootstrap**: Initially, the project started with only SCSS for styling. However, Bootstrap was later installed and used for some utility classes to speed up development, though this was a deviation from the original plan to keep dependencies minimal.
- **ng-bootstrap**: Angular-specific Bootstrap components, used for UI elements like modals or buttons where needed.
- **ng-select**: A select component library for Angular, used for dropdowns in the application.
- **RxJS**: For reactive programming, handling asynchronous data streams.
- **@angular/localize** is actually required by @ng-bootstrap/ng-bootstrap for internationalization (i18n) features, including the datepicker's month/year headers!

The libraries were chosen to meet only the requirements of the assessment, keeping the project lightweight. Note that Bootstrap was added mid-development as a convenience for utility classes, despite starting with pure SCSS.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
