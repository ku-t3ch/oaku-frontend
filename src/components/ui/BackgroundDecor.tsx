const BackgroundDecor = () => (
  <div className="absolute inset-0">
    <svg
      className="absolute bottom-0 left-0 w-full h-1/2"
      viewBox="0 0 1440 720"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0,360L48,380.7C96,401,192,443,288,437.3C384,432,480,380,576,359.3C672,339,768,349,864,380.7C960,412,1056,464,1152,458.7C1248,453,1344,391,1392,359.3L1440,328L1440,720L1392,720C1344,720,1248,720,1152,720C1056,720,960,720,864,720C768,720,672,720,576,720C480,720,384,720,288,720C192,720,96,720,48,720L0,720Z"
        fill="rgba(16, 185, 129, 0.15)"
      />
      <path
        d="M0,500L48,520.7C96,541,192,583,288,577.3C384,572,480,520,576,499.3C672,479,768,489,864,520.7C960,552,1056,604,1152,598.7C1248,593,1344,531,1392,499.3L1440,468L1440,720L1392,720C1344,720,1248,720,1152,720C1056,720,960,720,864,720C768,720,672,720,576,720C480,720,384,720,288,720C192,720,96,720,48,720L0,720Z"
        fill="rgba(16, 185, 129, 0.1)"
      />
    </svg>

    <svg
      className="absolute top-0 left-0 w-full h-1/2"
      viewBox="0 0 1440 720"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0L48,21.3C96,43,192,85,288,74.7C384,64,480,0,576,21.3C672,43,768,149,864,192C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        fill="rgba(34, 197, 94, 0.15)"
      />
      <path
        d="M0,150L48,171.3C96,193,192,235,288,224.7C384,214,480,150,576,171.3C672,193,768,299,864,342C960,385,1056,363,1152,342C1248,321,1344,299,1392,288.7L1440,278L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        fill="rgba(34, 197, 94, 0.1)"
      />
    </svg>

    <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
    <div className="absolute top-40 right-32 w-2 h-2 bg-green-300 rounded-full opacity-50 animate-pulse"></div>
    <div className="absolute bottom-32 left-40 w-4 h-4 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>

    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 1000 1000"
    >
      <circle cx="200" cy="200" r="3" fill="#22c55e" />
      <circle cx="800" cy="300" r="2" fill="#facc15" />
      <circle cx="600" cy="700" r="3" fill="#22c55e" />
      <line
        x1="200"
        y1="200"
        x2="800"
        y2="300"
        stroke="#22c55e"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="800"
        y1="300"
        x2="600"
        y2="700"
        stroke="#facc15"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  </div>
);

export default BackgroundDecor;