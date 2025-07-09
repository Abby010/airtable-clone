interface BaseCardProps {
  name: string;
  createdAt: Date;
}

export const BaseCard = ({ name, createdAt }: BaseCardProps) => {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
};
