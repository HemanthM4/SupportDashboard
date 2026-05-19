interface AvatarProps {
  name: string;
  initials: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, initials }) => {
  return (
    <div title={name} className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold">
        {initials}
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
};
