import React, { useEffect } from "react";

export const Debug: React.FC = () => {
  useEffect(() => {
    console.log("Debug component mounted");
    
    // Forza la rimozione della schermata di caricamento
    document.body.classList.add('loaded');
    
    // Nascondi esplicitamente il loader
    const loader = document.querySelector('.loading-container') as HTMLElement;
    if (loader) {
      loader.style.display = 'none';
      console.log("Loader nascosto forzatamente");
    }
    
    // Log all CSS variables
    const styles = getComputedStyle(document.documentElement);
    const vars = {
      "--primary": styles.getPropertyValue("--primary"),
      "--secondary": styles.getPropertyValue("--secondary"),
      "--background": styles.getPropertyValue("--background"),
      "--foreground": styles.getPropertyValue("--foreground"),
      "--card": styles.getPropertyValue("--card"),
      "--border": styles.getPropertyValue("--border"),
    };
    console.log("CSS Variables:", vars);
    
    // Check if body and root have styles
    const bodyStyles = getComputedStyle(document.body);
    console.log("Body background:", bodyStyles.backgroundColor);
    
    const rootStyles = getComputedStyle(document.documentElement);
    console.log("Root background:", rootStyles.backgroundColor);
    
    // Check for any error in console
    console.log("Check browser console for any errors");
  }, []);
  
  return (
    <div 
      style={{ 
        padding: "20px",
        margin: "20px",
        backgroundColor: "#ffffff", 
        border: "2px solid red",
        color: "#000000",
      }}
    >
      <h2 style={{ color: "#000000" }}>Debug Component</h2>
      <p style={{ color: "#000000" }}>If you can see this, React is rendering correctly.</p>
      <p style={{ color: "#000000" }}>Check console for debug information.</p>

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#000000" }}>Testing Basic Styling:</h3>
        <ul>
          <li style={{ color: "#ff0000" }}>Red text</li>
          <li style={{ color: "#00ff00" }}>Green text</li>
          <li style={{ color: "#0000ff" }}>Blue text</li>
        </ul>
      </div>
      
      <div style={{ marginTop: "20px", backgroundColor: "#f0f0f0", padding: "10px" }}>
        <h3 style={{ color: "#000000" }}>Testing Background Color</h3>
        <p style={{ color: "#000000" }}>This should have a light gray background (#f0f0f0).</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={() => alert("Button clicked!")}
          style={{ 
            padding: "8px 16px",
            backgroundColor: "#0C0C0D",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Click me (Test Interaction)
        </button>
      </div>
    </div>
  );
};

export default Debug;
