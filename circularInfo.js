document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("infographicCanvas");
  const ctx = canvas.getContext("2d");
  let hoveredIndex = -1;

  // Set canvas dimensions
  const containerWidth = canvas.parentElement.clientWidth;
  const containerHeight = canvas.parentElement.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = containerWidth * dpr;
  canvas.height = containerHeight * dpr;
  canvas.style.width = `${containerWidth}px`;
  canvas.style.height = `${containerHeight}px`;

  ctx.scale(dpr, dpr);

  // Center coordinates
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Radius calculations
  const outerRadius = Math.min(centerX, centerY) * 0.95;
  const innerRadius = outerRadius * 0.35;

  // Segment data
  const segments = [
    {
      title: "2,250+",
      subtitle: "Students Enrolled",
      icon: "📈",
      color: "#2e74b5",
    },
    {
      title: "78%",
      subtitle: " National Exam Pass Rate",
      icon: "🎓",
      color: "#195fa1",
    },
    {
      title: "Top 3 Schools",
      subtitle: "Ranked Among the Top 3 Schools in Hawassa ",
      icon: "🏆",
      color: "#2e74b5",
    },
    {
      title: "Digitalization",
      subtitle: "Digital Learning Transformation",
      icon: "💡",
      color: "#195fa1",
    },
    {
      title: "Reading Culture",
      subtitle: "Strong Reading Culture Initiative",
      icon: "📚",
      color: "#2e74b5",
    },
    {
      title: "Trained Teachers",
      subtitle: "Teacher Training & Leadership Development",
      icon: "👩‍🏫",
      color: "#195fa1",
    },
    {
      title: "Partnerships",
      subtitle: "Expanding Community & Business Partnerships",
      icon: "🤝",
      color: "#2e74b5",
    },
    {
      title: "Infrastructure",
      subtitle: "Modern infrastracture & facility development",
      icon: "🏗️",
      color: "#195fa1",
    },
  ];

  const numSegments = segments.length;
  const anglePerSegment = (2 * Math.PI) / numSegments;
  const gapAngle = 0.03;

  // Event listeners
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width)) / dpr;
    const y = ((e.clientY - rect.top) * (canvas.height / rect.height)) / dpr;
    const newHoveredIndex = getSegmentAtPosition(x, y);

    if (newHoveredIndex !== hoveredIndex) {
      hoveredIndex = newHoveredIndex;
      drawCanvas();
    }
  }

  function handleMouseLeave() {
    hoveredIndex = -1;
    drawCanvas();
  }

  function getSegmentAtPosition(x, y) {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < innerRadius || distance > outerRadius) return -1;

    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    for (let i = 0; i < numSegments; i++) {
      const start = i * anglePerSegment + gapAngle / 2;
      const end = (i + 1) * anglePerSegment - gapAngle / 2;
      if (angle >= start && angle <= end) return i;
    }
    return -1;
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
      const isHovered = i === hoveredIndex;
      const startAngle = i * anglePerSegment + gapAngle / 2;
      const endAngle = (i + 1) * anglePerSegment - gapAngle / 2;
      const currentOuterRadius = isHovered ? outerRadius * 1.05 : outerRadius;

      // Draw segment with hover effect
      ctx.beginPath();
      ctx.moveTo(
        centerX + innerRadius * Math.cos(startAngle),
        centerY + innerRadius * Math.sin(startAngle)
      );
      ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, currentOuterRadius, endAngle, startAngle, true);
      ctx.closePath();

      if (isHovered) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.fillStyle = segments[i].color;
      ctx.fill();

      // Reset shadow for text
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw text
      const midAngle = (startAngle + endAngle) / 2;
      const textRadius = (innerRadius + outerRadius) / 2;
      const textX = centerX + textRadius * Math.cos(midAngle);
      const textY = centerY + textRadius * Math.sin(midAngle);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";

      // Icon
      ctx.font = "20px Arial";
      ctx.fillText(segments[i].icon, 0, -30);

      // Title
      ctx.font = "bold 24px Arial";
      ctx.fillText(segments[i].title, 0, 0);

      // Subtitle
      ctx.font = "12px Arial";
      const maxWidth = 100;
      const lineHeight = 15;
      const lines = [];
      let currentLine = "";

      segments[i].subtitle.split(" ").forEach((word) => {
        const testLine = currentLine + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine);
          currentLine = word + " ";
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), 0, 20 + index * lineHeight);
      });

      ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  // Initial draw
  drawCanvas();
});
