import React from "react";

interface TestComponentWithPropsProps {
  testData?: string;
  message?: string;
  count?: number;
  [key: string]: unknown;
}

export const TestComponentWithProps: React.FC<TestComponentWithPropsProps> = (
  props
) => {
  return (
    <div style={{ padding: "20px" }}>
      <h3>Test Component with Props</h3>
      <p>This component displays the props it receives:</p>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "12px",
          borderRadius: "4px",
          margin: "12px 0",
          fontFamily: "monospace",
          fontSize: "12px",
        }}
      >
        <h4>Received Props:</h4>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>

      <div
        style={{
          backgroundColor: "#e8f4fd",
          padding: "12px",
          borderRadius: "4px",
          margin: "12px 0",
        }}
      >
        <h4>Specific Props:</h4>
        <p>
          <strong>testData:</strong> {props.testData || "Not provided"}
        </p>
        <p>
          <strong>message:</strong> {props.message || "Not provided"}
        </p>
        <p>
          <strong>count:</strong> {props.count || "Not provided"}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "12px",
          borderRadius: "4px",
          margin: "12px 0",
        }}
      >
        <p>
          ✅ If you can see the props above, they are being passed correctly!
        </p>
        <p>Created at: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default TestComponentWithProps;
