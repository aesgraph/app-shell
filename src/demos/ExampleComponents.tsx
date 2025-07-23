import React from "react";

// Example React components that could maintain state/refs
export const PersistentEditor: React.FC = () => {
  const [content, setContent] = React.useState(
    "// Some persistent code here..."
  );
  return (
    <div style={{ padding: "16px" }}>
      <h4>Persistent Editor Component</h4>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: "200px", fontFamily: "monospace" }}
      />
    </div>
  );
};

export const StatefulCounter: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: "16px" }}>
      <h4>Stateful Counter Component</h4>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button
        onClick={() => setCount((c) => c - 1)}
        style={{ marginLeft: "8px" }}
      >
        Decrement
      </button>
    </div>
  );
};
