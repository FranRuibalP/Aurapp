import { FaCrown } from 'react-icons/fa';

const crownColors = [
  'text-yellow-400 dark:text-yellow-400',
  'text-gray-300 dark:text-gray-300',
  'text-amber-700 dark:text-amber-700'
];

export default function UserRanking({ users, aura }) {
  const auraClass = getAuraClass(aura);
    console.log(users);
  return (
    <div className={`w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-lg bg-neutral-800 ${auraClass.shadow}`}>
      <h2 className="text-xl font-bold mb-4 text-center text-zinc-50">Ranking de Auras</h2>
      <ul>
        {users.map((user, index) => (
          <li
            key={user.name}
            className="flex justify-between items-center py-2 px-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              {index < 3 && <FaCrown className={`w-5 h-5 ${crownColors[index]}`} />}
              <img
                src={user.profileImage || "/default-profile.png"}
                alt={`${user.name}'s profile`}
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span className="text-zinc-50 font-medium">{user.name}</span>
            </div>
            <span className={`${auraClass.text} ${auraClass.textDark} font-bold text-lg`}>
              {user.aura}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  function getAuraClass(aura) {
    if (aura < 500) return {
      text: 'text-rose-600',
      textDark: 'dark:text-rose-600',
      shadow: 'shadow-rose-500'
    };
    if (aura < 1500) return {
      text: 'text-indigo-600',
      textDark: 'dark:text-indigo-600',
      shadow: 'shadow-indigo-600'
    };
    if (aura < 2000) return {
      text: 'text-emerald-400',
      textDark: 'dark:text-emerald-400',
      shadow: 'shadow-emerald-400'
    };
    return {
      text: 'text-yellow-400',
      textDark: 'dark:text-yellow-400',
      shadow: 'shadow-yellow-400'
    };
  }
}
