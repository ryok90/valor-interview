import Table, { type TableData } from '../components/table/table';

const tableData: TableData[] = [
  {
    name: 'Nyjah Huston',
    age: 31,
    email: 'nyjah.huston@email.com',
  },
  {
    name: 'Sean Malto',
    age: 36,
    email: 'sean.alto@email.com',
  },
  {
    name: 'Mike Mo',
    age: 35,
    email: 'mike.mo@email.com',
  },
  {
    name: 'Torey Pudwill',
    age: 34,
    email: 'torey.pudwill@email.com',
  },
];

export function App() {
  return (
    <section className="max-w-7xl mx-auto py-6 px-4 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-2xl">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          This is a <strong>Zephyr Cloud</strong> example.{' '}
          <a
            href="https://github.com/ZephyrCloudIO/zephyr-examples"
            className="font-semibold text-rose-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            See more here <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="text-center mt-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to the{' '}
            <span className="text-rose-600">remote application</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            This is a template for a remote application you can get started by
            editing{' '}
            <code className="text-sm font-bold text-gray-900">
              pages/index.tsx
            </code>
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <a
              href="https://zephyr-cloud.io/"
              className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Zephyr Cloud
            </a>
            <a
              href="https://github.com/ZephyrCloudIO/zephyr-examples"
              className="text-sm font-semibold leading-6 text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <h3 className="mt-6">The component below comes from this app</h3>
      <div className="mt-4 border-4 border-dashed border-rose-500 p-8 rounded-lg w-full">
        <Table data={tableData} />
      </div>
    </section>
  );
}

export default App;
