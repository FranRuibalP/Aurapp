import { FaCrown } from 'react-icons/fa';

const crownColors = ['text-yellow-400 dark:text-yellow-400', 'text-gray-300 dark:text-gray-300', 'text-amber-700 dark:text-amber-700'];

export default function UserRanking({ users , aura }) {
    const color = getAuraColor(aura);
    return (
        <div className={`w-full max-w-md mx-auto bg-transparent dark:transparent border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-lg ${color[0]} ${color[3]}`}>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Ranking de Auras</h2>
        <ul>
            {users.map((user, index) => (
            <li
                key={user.name}
                className="flex justify-between items-center py-2 px-3 border-b border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center space-x-2">
                {index < 3 && (
                    <FaCrown className={`w-5 h-5 ${crownColors[index]}`} />
                )}
                <span className="text-gray-800 dark:text-white font-medium">{user.name}</span>
                </div>
                <span className={`${color[1]} ${color[2]} font-bold text-lg`}>{user.aura}</span>
            </li>
            ))}
        </ul>
        </div>
    );
    function getAuraColor(aura) {
    if (aura < 500) return ['shadow-red-500', 'text-red-500', 'dark:text-red-500', 'dark:shadow-red-500'];
    if (aura < 1500) return ['shadow-indigo-600', 'text-indigo-600', 'dark:text-indigo-600', 'dark:shadow-indigo-600'];
    if (aura < 2000) return ['shadow-cyan-400', 'text-cyan-400', 'dark:text-cyan-400', 'dark:shadow-cyan-400'];
    return ['shadow-yellow-400', 'text-yellow-400', 'dark:text-yellow-400', 'dark:shadow-yellow-400']; // dorado
    }
}
