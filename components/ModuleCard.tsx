import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, subtitle, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white relative p-6 w-full cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 mb-4 group border border-pink-100 rounded-2xl"
    >
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-full bg-pink-50 text-[#FF0F9A]">
          {icon}
        </div>
        <div className="text-black opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={20} />
        </div>
      </div>
      <h3 className="mt-4 text-xl font-extrabold text-black">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>
    </div>
  );
};

export default ModuleCard;