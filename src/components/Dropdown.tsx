import { useState } from "react";

const techSectors = [
  "DevOps",
  "Robotics",
  "Software Engineering",
  "E-commerce",
  "Fintech",
  "Healthtech",
  "Edtech",
  "Greentech",
  "Gaming",
  "Autonomous Vehicles",
  "5G & Telecom",
  "UI/UX Design",
];

export default function Dropdown({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (sector: string) => {
    setSelected(sector);
    onChange(sector);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-48 text-sm">
      {/* Dropdown button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2 mt-2 border border-gray-500 rounded-md bg-white text-left hover:border-purple-700 transition-colors cursor-pointer"
      >
        {selected || "-- Choose a sector --"}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg z-50 custom-scrollbar">
          {techSectors.map((sector) => (
            <li
              key={sector}
              onClick={() => handleSelect(sector)}
              className="px-4 py-2 cursor-pointer hover:bg-purple-100 hover:text-purple-800 transition-colors"
            >
              {sector}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
