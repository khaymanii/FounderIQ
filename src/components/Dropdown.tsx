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
  const [selected, setSelected] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onChange(value);
  };

  return (
    <div className="w-60 max-w-sm">
      <div className="w-full">
        <label
          htmlFor="sector"
          className="block mb-2 mt-2 text-sm font-medium text-center"
        >
          Select a Tech Sector
        </label>
        <select
          id="sector"
          value={selected}
          onChange={handleChange}
          className="w-full px-4 py-2 text-xs border border-gray-500 rounded-t-md focus:outline-none "
        >
          <option value="" disabled>
            -- Choose a sector --
          </option>
          {techSectors.map((sector) => (
            <div className="mt-4 ">
              <option key={sector} value={sector}>
                {sector}
              </option>
            </div>
          ))}
        </select>
      </div>
    </div>
  );
}
