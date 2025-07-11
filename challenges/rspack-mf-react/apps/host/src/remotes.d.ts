declare module 'remote/Module' {
  export type TableData = {
    name: string;
    age: number;
    email: string;
  };

  export interface TableProps {
    data: TableData[];
  }

  const Table: React.ComponentType<TableProps>;
  export default Table;
}
