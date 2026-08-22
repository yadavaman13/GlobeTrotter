# SpeechInput (AI Element)

A microphone audio recording button integrated with the browser Web Speech API for voice-to-text prompt transcription.

---

## 1. Import Path

```javascript
import { SpeechInput } from '@/components/ai-elements/speech-input/speech-input';
```

---

## 2. Props Specification

| Prop Name      | Type       | Default | Required | Description                                                      |
| -------------- | ---------- | ------- | -------- | ---------------------------------------------------------------- |
| `onTranscript` | `function` | —       | Yes      | Callback receiving transcribed speech: `(text: string) => void`. |
| `disabled`     | `boolean`  | `false` | No       | Disables microphone input.                                       |

---

## 3. Usage Example

```jsx
import { SpeechInput } from '@/components/ai-elements/speech-input/speech-input';

export default function VoicePromptBar({ onAppendText }) {
    return <SpeechInput onTranscript={(text) => onAppendText(text)} />;
}
```
