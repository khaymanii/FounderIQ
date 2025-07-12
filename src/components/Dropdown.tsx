import { useState } from "react";

const techSectors = [
  "DevOps",
  "Robotics",
  "Software Engineering",
  "E-commerce",
  "SaaS",
  "Fintech",
  "Healthtech",
  "Edtech",
  "Greentech",
  "Gaming",
  "Autonomous Vehicles",
  "Quantum Computing",
  "5G & Telecom",
  "UI/UX Design",
];

export default function Dropdown({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [selected, setSelected] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onChange(value);
  };

  return (
    <div className="w-72 max-w-sm">
      <div className="w-full">
        <label
          htmlFor="sector"
          className="block mb-2 mt-4 text-sm font-medium text-gray-700 text-center"
        >
          Select a Tech Sector
        </label>
        <select
          id="sector"
          value={selected}
          onChange={handleChange}
          className="w-full px-4 py-2 border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800"
        >
          <option value="" disabled>
            -- Choose a sector --
          </option>
          {techSectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
