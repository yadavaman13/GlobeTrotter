# Carousel

An interactive slider component for displaying card decks, testimonials, and gallery items with touch-drag and navigation controls.

---

## 1. Import Path

```javascript
import Carousel from "@/components/Shared/DataDisplay/Carousel/Carousel";
```

---

## 2. Props Specification

| Prop Name  | Type               | Default | Required | Description                        |
| ---------- | ------------------ | ------- | -------- | ---------------------------------- |
| `items`    | `Array<ReactNode>` | `[]`    | Yes      | Slide elements to render.          |
| `autoPlay` | `boolean`          | `false` | No       | Automatically advances slides.     |
| `interval` | `number`           | `5000`  | No       | AutoPlay duration in milliseconds. |

---

## 3. Usage Example

```jsx
import Carousel from "@/components/Shared/DataDisplay/Carousel/Carousel";
import Card from "@/components/Shared/DataDisplay/Card/Card";

export default function FeatureCards() {
  const slides = [
    <Card key="1">
      <h4>AI Sales Copilot</h4>
    </Card>,
    <Card key="2">
      <h4>Real-Time Ingestion</h4>
    </Card>,
    <Card key="3">
      <h4>Drizzle ORM Schemas</h4>
    </Card>,
  ];

  return <Carousel items={slides} autoPlay />;
}
```
