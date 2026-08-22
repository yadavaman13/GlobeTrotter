# Interactive Chart Features Guide for AI Agents

In addition to selecting the correct chart type, AI agents should automatically enable interactive features that improve data exploration and usability. The following guide describes when each feature should be available.

---

# General Rule

Every visualization should support as many of the following features as are applicable:

- Filtering
- Sorting
- Searching
- Grouping
- Drill Down
- Drill Up
- Zoom & Pan
- Legend Toggle
- Tooltips
- Export
- Full Screen
- Reset View
- Responsive Layout

---

# Feature Selection by Data Type

| Data Pattern        | Recommended Interactive Features                       |
| ------------------- | ------------------------------------------------------ |
| Time Series         | Date Range Filter, Zoom, Pan, Tooltip, Compare Periods |
| Category Comparison | Sort, Filter, Search, Highlight, Tooltip               |
| Ranking             | Sort Asc/Desc, Top N, Bottom N                         |
| Composition         | Filter Categories, Legend Toggle                       |
| Correlation         | Axis Filter, Zoom, Tooltip                             |
| Distribution        | Bin Size Adjustment, Zoom                              |
| Geographic          | Region Filter, Zoom, Search Location                   |
| Hierarchy           | Expand/Collapse, Drill Down                            |
| Process             | Step Highlight, Expand Nodes                           |
| Network             | Zoom, Search Node, Highlight Connections               |

---

# Filtering

Enable filters whenever the dataset contains multiple categories or dimensions.

## Types of Filters

### Date Filter

Examples:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- This Month
- Previous Month
- This Year
- Custom Date Range

---

### Category Filter

Examples:

- Department
- Product
- Region
- Customer
- Employee

Supports:

- Multi-select
- Select All
- Clear All

---

### Numeric Filter

Examples:

- Revenue > 10,000
- Age between 20–40
- Rating ≥ 4

Supports:

- Greater Than
- Less Than
- Between
- Equal To

---

### Status Filter

Examples:

- Active
- Completed
- Pending
- Cancelled

---

### Boolean Filter

Examples:

- Verified
- Paid
- Available

---

# Sorting

Whenever categorical data is displayed, provide sorting options.

Supported sorting:

- Ascending
- Descending
- Alphabetical
- Highest Value
- Lowest Value
- Most Recent
- Oldest

Example:

```
Revenue by Product

Sort By:
✓ Highest Revenue
```

---

# Search

Provide search when:

- More than 15 categories exist
- Long lists are displayed
- Maps contain many locations
- Tables accompany charts

Search examples:

- Customer Name
- Product Name
- City
- Country
- Employee

---

# Grouping

Allow grouping by dimensions.

Examples:

Sales grouped by

- Year
- Quarter
- Month
- Region
- Product
- Department

---

# Drill Down

Allow users to navigate from summary to detailed data.

Example:

```
Country
   ↓
State
   ↓
City
   ↓
Store
   ↓
Product
```

---

# Drill Up

Allow navigation back to higher summary levels.

---

# Legend Controls

Interactive legends should support:

- Show/Hide Series
- Highlight Series
- Compare Multiple Series

Example:

☑ Revenue

☑ Expenses

☐ Profit

---

# Zoom & Pan

Enable for:

- Time series
- Scatter plots
- Maps
- Large datasets

Capabilities:

- Mouse Wheel Zoom
- Drag Pan
- Pinch Zoom (Mobile)
- Reset Zoom

---

# Tooltips

Every chart should provide rich tooltips.

Include:

- Category Name
- Exact Value
- Percentage
- Date
- Additional Metadata
- Previous Value
- Growth Rate (if applicable)

Example:

```
Revenue

Product:
Laptop

Revenue:
₹250,000

Growth:
+18%

Previous Month:
₹212,000
```

---

# Highlighting

On hover or selection:

- Highlight selected element
- Fade remaining elements
- Show related records

---

# Cross Filtering

Selecting one visualization should filter others.

Example Dashboard:

```
Click:

Region = West

↓

Update:

✓ Revenue Chart
✓ Orders Chart
✓ Customer Chart
✓ Profit Chart
```

---

# Compare Mode

Allow comparison between:

- Current vs Previous
- Year over Year
- Month over Month
- Planned vs Actual
- Product A vs Product B

---

# Dynamic Aggregation

Allow users to change aggregation.

Examples:

- Sum
- Average
- Count
- Median
- Maximum
- Minimum

---

# Time Granularity

For time-based charts:

Allow switching between:

- Hour
- Day
- Week
- Month
- Quarter
- Year

---

# Top N Filter

Useful for rankings.

Examples:

- Top 5
- Top 10
- Top 20
- Bottom 10

---

# Axis Controls

Allow:

- Linear Scale
- Logarithmic Scale
- Swap X & Y (where applicable)
- Change Metrics

---

# Chart Type Switcher

If the data supports multiple visualizations, allow users to switch between compatible chart types.

Example:

Category + Value

Available Views:

- Bar
- Horizontal Bar
- Pie
- Donut
- Treemap

---

# Export Options

Support exporting as:

- PNG
- SVG
- PDF
- CSV
- Excel
- JSON

---

# Full Screen Mode

Provide:

- Expand Chart
- Exit Full Screen
- Responsive Resize

---

# Refresh Controls

Support:

- Manual Refresh
- Auto Refresh
- Live Updates (when applicable)

---

# Annotation Support

Allow users to:

- Add Notes
- Highlight Events
- Mark Peaks
- Bookmark Data Points

---

# Accessibility

Every chart should include:

- Keyboard Navigation
- Screen Reader Labels
- High Contrast Mode
- Color-Blind Friendly Palette
- Adjustable Font Size

---

# Mobile Optimization

On smaller screens:

- Collapse legends
- Horizontal scrolling for large charts
- Touch-friendly controls
- Pinch to zoom
- Responsive labels

---

# AI Agent Decision Rules

## Always Enable

- Tooltip
- Responsive Layout
- Export
- Reset View
- Full Screen

## Enable When Applicable

| Condition                      | Feature                 |
| ------------------------------ | ----------------------- |
| >10 categories                 | Search                  |
| Categorical data               | Sort                    |
| Multiple dimensions            | Filter                  |
| Time series                    | Date Range Picker       |
| Geographic data                | Region Filter + Zoom    |
| Hierarchical data              | Drill Down / Drill Up   |
| Dashboard with multiple charts | Cross Filtering         |
| Large datasets                 | Zoom & Pan              |
| Multiple metrics               | Legend Toggle           |
| Ranked data                    | Top N / Bottom N        |
| Time-based data                | Time Granularity Switch |
| Multi-level summaries          | Group By                |
| Comparative analysis           | Compare Mode            |

---

# Recommended Feature Priority

1. Tooltip
2. Filtering
3. Sorting
4. Search
5. Legend Toggle
6. Zoom & Pan
7. Drill Down
8. Compare Mode
9. Export
10. Full Screen
11. Cross Filtering
12. Dynamic Aggregation
13. Chart Type Switcher
14. Accessibility
15. Mobile Optimization

---

# Final Principle

An AI agent should not only choose the **best chart**, but also automatically recommend the **right interactive capabilities** based on the data structure, user goals, and dataset size. The objective is to make every visualization intuitive, exploratory, accessible, and actionable.
