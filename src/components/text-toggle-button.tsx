"use client";
import { useState } from "react";
import { Button } from './ui/button'

export default function TextToggleButton() {
    const[isExpanded, setIsExpanded] = useState(false);
    const handleChange = () => {
      setIsExpanded((prev) => !prev);    
    };
  return (
    <Button onClick={handleChange}>{isExpanded ? "表示を戻す" : "全て表示"}</Button>
  )
}
