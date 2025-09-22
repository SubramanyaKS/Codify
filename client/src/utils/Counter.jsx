import { useEffect, useState } from "react";

function Counter({ end, duration = 5000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = end / (duration / 13); // ~60fps
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(interval);
        setCount(end);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [end, duration]);

  return <>{count}+</>;
}

export default Counter;
