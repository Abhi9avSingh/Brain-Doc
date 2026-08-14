export function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="depth-grid" />
      <span className="depth-star depth-star-one" />
      <span className="depth-star depth-star-two" />
      <span className="depth-star depth-star-three" />
      <div
        className="aurora-blob"
        style={{
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'var(--aurora-1)',
          animation: 'auroraDrift 20s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'var(--aurora-2)',
          animation: 'auroraDrift 25s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: '40%',
          left: '30%',
          width: '350px',
          height: '350px',
          background: 'var(--aurora-3)',
          animation: 'auroraDrift 30s ease-in-out infinite',
          animationDelay: '10s',
        }}
      />
    </div>
  );
}
