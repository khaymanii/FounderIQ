import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

const techSectors = [
  "E-commerce",
  "Fintech",
  "Healthtech",
  "Edtech",
  "Greentech",
  "Proptech",
  "Supply Chain & Logistics Tech",
  //"Agtech",
  //"Biotech",
  // "LegalTech",
  // "InsurTech",
  // "HRTech",
  // "GovTech",
  // "CleanTech",
  // "TravelTech",
  // "MarTech (Marketing Technology)",
  // "AdTech",
  // "FoodTech",
  // "SpaceTech",
  // "MedTech",
  // "Wearable Tech",
  // "RetailTech",
  // "EnergyTech",
  // "SportsTech",
  // "Blockchain & Web3",
  // "Gaming",
  // "Autonomous Vehicles",
  // "Cybersecurity",
  // "IoT (Internet of Things)",
  // "AI & Machine Learning",
  // "AR/VR & Metaverse",
  // "Robotics",
];

export default function Dropdown({
  onChange,
  currentSessionId,
}: {
  onChange: (value: string) => void;
  currentSessionId: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch the saved sector from Supabase
  useEffect(() => {
    const fetchSelectedSector = async () => {
      if (!currentSessionId) return;
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("selected_sector")
        .eq("id", currentSessionId)
        .single();

      if (!error && data?.selected_sector) {
        setSelected(data.selected_sector);
      }
    };

    fetchSelectedSector();
  }, [currentSessionId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = async (sector: string) => {
    setSelected(sector);
    onChange(sector);
    setIsOpen(false);

    if (currentSessionId) {
      const { error } = await supabase
        .from("chat_sessions")
        .update({ selected_sector: sector })
        .eq("id", currentSessionId);

      if (error) {
        console.error("Error updating selected sector:", error.message);
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block w-48 text-sm">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2 mt-2 border border-gray-500 rounded-md bg-white text-left hover:border-purple-700 transition-colors cursor-pointer"
      >
        {selected || "General Tech"}
      </button>

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
