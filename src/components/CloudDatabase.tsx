import React, { useState } from 'react';
import { Database, Table, Search, Plus, Trash2, Edit, Eye, Download } from 'lucide-react';

interface CloudDatabaseProps {
  labId: string;
  sessionId: string;
}

const CloudDatabase: React.FC<CloudDatabaseProps> = ({ labId, sessionId }) => {
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedTable, setSelectedTable] = useState('users');
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const tables = [
    { name: 'users', records: 1250, size: '2.3 MB' },
    { name: 'products', records: 3420, size: '5.1 MB' },
    { name: 'orders', records: 8900, size: '12.7 MB' },
    { name: 'categories', records: 45, size: '0.1 MB' }
  ];

  const sampleData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-01-16' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2024-01-17' }
    ],
    products: [
      { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
      { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics' },
      { id: 3, name: 'Keyboard', price: 89.99, category: 'Electronics' }
    ]
  };

  const handleExecuteQuery = () => {
    // Simulate query execution
    if (query.toLowerCase().includes('users')) {
      setQueryResult(sampleData.users);
    } else if (query.toLowerCase().includes('products')) {
      setQueryResult(sampleData.products);
    } else {
      setQueryResult([]);
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Database Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">skilltrack_lab</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">MySQL 8.0.35</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('tables')}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeTab === 'tables' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tables
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeTab === 'sql' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              SQL Editor
            </button>
          </div>
        </div>

        {activeTab === 'tables' && (
          <div className="px-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Tables</h4>
            <div className="space-y-1">
              {tables.map((table) => (
                <div
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    selectedTable === table.name ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4" />
                    <span className="text-sm">{table.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{table.records}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'tables' ? (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Table: {selectedTable}</h2>
                  <p className="text-sm text-gray-500">
                    {tables.find(t => t.name === selectedTable)?.records} records, 
                    {tables.find(t => t.name === selectedTable)?.size}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    <Eye className="w-4 h-4" />
                    <span>Browse</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    <span>Insert</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table Data */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {sampleData[selectedTable as keyof typeof sampleData]?.[0] && 
                        Object.keys(sampleData[selectedTable as keyof typeof sampleData][0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))
                      }
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleData[selectedTable as keyof typeof sampleData]?.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-3 text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* SQL Editor */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SQL Editor</h2>
              <div className="flex space-x-2">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter your SQL query..."
                />
                <button
                  onClick={handleExecuteQuery}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Execute
                </button>
              </div>
            </div>

            {/* Query Results */}
            <div className="flex-1 overflow-auto p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Results</h3>
              {queryResult.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(queryResult[0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {queryResult.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="px-4 py-3 text-sm text-gray-900">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No results to display</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CloudDatabase; 