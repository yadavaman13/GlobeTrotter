# Chart Selection Guide for AI Agents

> A practical decision guide for automatically selecting the most suitable chart based on the structure and meaning of available data.

---

# Decision Flow

```text
Is there a time/date column?
│
├── YES
│   ├── One metric → Line Chart
│   ├── Multiple metrics → Multi-Line Chart
│   ├── Cumulative values → Area Chart
│   └── Events over time → Timeline
│
└── NO
    │
    ├── Comparing categories?
    │     ├── Few categories (<8) → Bar Chart
    │     ├── Many categories → Horizontal Bar Chart
    │     └── Ranking → Sorted Bar Chart
    │
    ├── Showing percentages of a whole?
    │     ├── ≤5 categories → Pie Chart
    │     ├── 6-15 categories → Donut Chart
    │     └── Many categories → Stacked Bar
    │
    ├── Relationship between two numbers?
    │     ├── Correlation → Scatter Plot
    │     ├── Bubble size available → Bubble Chart
    │     └── Trendline needed → Scatter + Regression
    │
    ├── Distribution?
    │     ├── Frequency → Histogram
    │     ├── Spread/Outliers → Box Plot
    │     └── Density → Violin Plot
    │
    ├── Hierarchy?
    │     ├── Parent-Child → Tree Diagram
    │     ├── Nested Values → Treemap
    │     └── Circular Hierarchy → Sunburst
    │
    ├── Geographic?
    │     ├── Coordinates → Map
    │     ├── Region values → Choropleth
    │     └── Routes → Flow Map
    │
    ├── Process?
    │     ├── Sequential → Flowchart
    │     ├── Decision Making → Decision Tree
    │     └── Workflow → BPMN Diagram
    │
    └── Network?
          ├── Connections → Network Graph
          └── Dependencies → Sankey Diagram
```

---

# Chart Selection Table

| Data Pattern          | Best Chart    | Alternative    | Avoid                 |
| --------------------- | ------------- | -------------- | --------------------- |
| Time Series           | Line          | Area           | Pie                   |
| Monthly Sales         | Line          | Bar            | Scatter               |
| Category Comparison   | Bar           | Horizontal Bar | Pie (many categories) |
| Ranking               | Sorted Bar    | Lollipop       | Pie                   |
| Percentage of Total   | Pie           | Donut          | Line                  |
| Many Percentages      | Stacked Bar   | Treemap        | Pie                   |
| Correlation           | Scatter       | Bubble         | Bar                   |
| Distribution          | Histogram     | Box Plot       | Pie                   |
| Outliers              | Box Plot      | Scatter        | Pie                   |
| Hierarchical Data     | Treemap       | Sunburst       | Bar                   |
| Geographic Data       | Choropleth    | Bubble Map     | Pie                   |
| Workflow              | Flowchart     | BPMN           | Bar                   |
| Network Relationships | Network Graph | Sankey         | Pie                   |

---

# Chart Recommendations by Number of Variables

## 1 Variable

| Data Type    | Chart     |
| ------------ | --------- |
| Numeric      | Histogram |
| Categories   | Bar       |
| Percentage   | Pie       |
| Distribution | Box Plot  |

---

## 2 Variables

| Variable Types             | Chart       |
| -------------------------- | ----------- |
| Time + Value               | Line        |
| Category + Value           | Bar         |
| Number + Number            | Scatter     |
| Category + Percentage      | Pie/Donut   |
| Category + Multiple Values | Grouped Bar |

---

## 3 Variables

| Variable Types           | Chart       |
| ------------------------ | ----------- |
| X + Y + Size             | Bubble      |
| Time + Two Metrics       | Multi-Line  |
| Category + Value + Group | Grouped Bar |
| Location + Value + Size  | Bubble Map  |

---

## 4+ Variables

Prefer:

- Heatmap
- Parallel Coordinates
- Radar Chart
- Bubble Chart
- Treemap
- Dashboard with Multiple Charts

---

# Chart Selection by Business Question

| Question                    | Best Chart    |
| --------------------------- | ------------- |
| How is something changing?  | Line          |
| Which category is biggest?  | Bar           |
| Which contributes most?     | Pie           |
| Are two metrics related?    | Scatter       |
| Where are values located?   | Map           |
| What's the distribution?    | Histogram     |
| Are there outliers?         | Box Plot      |
| How does a process work?    | Flowchart     |
| How are entities connected? | Network Graph |
| What causes what?           | Sankey        |

---

# Recommended Category Limits

| Chart          | Recommended Categories |
| -------------- | ---------------------- |
| Pie            | 2–5                    |
| Donut          | 2–8                    |
| Bar            | Up to 20               |
| Horizontal Bar | Up to 50               |
| Treemap        | 10–100                 |
| Heatmap        | Large datasets         |
| Scatter        | 20–10,000+             |
| Line           | 10–500 time points     |

---

# Color Guidelines

## Sequential Data

Use one color with varying intensity.

Examples:

- Revenue
- Temperature
- Population

---

## Categorical Data

Use distinct colors.

Examples:

- Departments
- Products
- Countries

---

## Diverging Data

Use two contrasting colors.

Examples:

- Profit/Loss
- Positive/Negative
- Growth/Decline

---

# Common Mistakes

❌ Pie chart with 20 categories

✅ Bar chart

---

❌ Line chart for unordered categories

✅ Bar chart

---

❌ Scatter chart with dates

✅ Line chart

---

❌ Pie chart for trends

✅ Line chart

---

❌ 3D charts

✅ Flat 2D charts

---

❌ Rainbow color palettes

✅ Consistent accessible colors

---

# AI Agent Rules

## Rule 1

If a **time column** exists, prefer a **Line Chart**.

---

## Rule 2

If comparing **categories**, use a **Bar Chart**.

---

## Rule 3

If showing **parts of a whole**, use:

- Pie (≤5 categories)
- Donut (≤8 categories)
- Stacked Bar (>8 categories)

---

## Rule 4

If comparing **two numeric variables**, use a **Scatter Plot**.

---

## Rule 5

If showing **distribution**, use:

- Histogram
- Box Plot
- Violin Plot

---

## Rule 6

If data contains **latitude/longitude** or **regions**, use a **Map**.

---

## Rule 7

If representing **processes**, use:

- Flowchart
- BPMN
- Decision Tree

---

## Rule 8

If data forms a **hierarchy**, use:

- Treemap
- Sunburst
- Tree Diagram

---

## Rule 9

If visualizing **relationships or dependencies**, use:

- Network Graph
- Sankey Diagram

---

## Rule 10

When uncertain:

1. Detect data types.
2. Infer the user's analytical goal (trend, comparison, composition, distribution, relationship, geography, process, hierarchy).
3. Choose the simplest chart that answers the question.
4. Avoid decorative or 3D charts.
5. Prioritize readability over complexity.

---

# Quick Reference

| Goal                       | Chart            |
| -------------------------- | ---------------- |
| Trend                      | Line             |
| Comparison                 | Bar              |
| Ranking                    | Sorted Bar       |
| Composition                | Pie / Donut      |
| Distribution               | Histogram        |
| Correlation                | Scatter          |
| Hierarchy                  | Treemap          |
| Process                    | Flowchart        |
| Geography                  | Map              |
| Relationships              | Network          |
| Flow Between Categories    | Sankey           |
| Multi-dimensional Analysis | Heatmap / Bubble |

---

# Final AI Selection Priority

1. Understand the analytical question.
2. Identify data types (time, numeric, categorical, geographic, hierarchical).
3. Detect the number of variables.
4. Select the chart using the decision flow.
5. Validate that the chosen chart is readable for the dataset size.
6. Prefer simple, accessible, and widely understood visualizations.
