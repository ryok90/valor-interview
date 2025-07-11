export type TableData = {
  name: string;
  age: number;
  email: string;
};

export interface TableProps {
  data: TableData[];
}

export function Table({ data }: TableProps) {
  return (
    <>
      <table className={`min-w-full bg-white p-4 shadow-md rounded-lg mt-6`}>
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              className="border-b border-gray-200 even:bg-gray-50"
              key={row.email}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm leading-5">
                {row.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm leading-5">
                {row.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="min-w-full bg-white p-4 shadow-md rounded-lg mt-6">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Letter counters in all the names - [letter:total]
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Average Age
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 even:bg-gray-50" key="totals">
            <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900">
              {totalLetterNumbers(data)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm leading-5">
              {averageAge(data)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

const totalLetterNumbers = (data: TableData[]): string => {
  const letterMap: Record<string, number> = {};

  data.forEach((person) => {
    const letters = person.name.toUpperCase().split('');
    letters.forEach((letter) => {
      if (letter === ' ') return;
      letterMap[letter]++;
    });
  });

  return Object.entries(letterMap).reduce(
    (prev, [letter, total]) => `${prev} [${letter}:${total}]`,
    '',
  );
};

const averageAge = (data: TableData[]): number => {
  const totalAge = data.reduce((acc, person) => {
    return acc + person.age;
  }, '');

  return +totalAge / data.length;
};

export default Table;
