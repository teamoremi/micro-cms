import { useEffect, useState } from 'react';
import { Schema, PaginatedResponse } from '@micro-cms/types';
import { MockDataProvider } from '@micro-cms/mock-db';
import { AutoForm, AutoTable } from '@micro-cms/admin-ui';

function App() {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [data, setData] = useState<any[] | PaginatedResponse>([]);
  const [page, setPage] = useState(1);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [db] = useState(() => new MockDataProvider());

  useEffect(() => {
    // 1. Introspect: Get the schema from the DB
    db.introspect().then((s) => {
      setSchema(s);
      if (s.entities.length > 0) {
        setActiveEntity(s.entities[0].name);
      }
    });
  }, [db]);

  useEffect(() => {
    if (activeEntity) {
      setPage(1);
      loadData(1);
    }
  }, [activeEntity]);

  const loadData = (p: number = page) => {
    if (activeEntity) db.find(activeEntity, { page: p, limit: 5 }).then(setData);
  };

  const handleCreateOrUpdate = async (formData: any) => {
    if (activeEntity) {
      if (editingItem) {
        await db.update(activeEntity, editingItem.id, formData);
        alert('Record updated!');
      } else {
        await db.create(activeEntity, formData);
        alert('Record created!');
      }
      setEditingItem(null);
      loadData();
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
  };

  if (!schema) return <div className="p-10">Loading Schema...</div>;

  const currentEntityDef = schema.entities.find(e => e.name === activeEntity);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-4 font-bold text-xl border-b bg-gray-50">Micro-CMS</div>
        <nav className="p-4 space-y-2">
          {schema.entities.map(entity => (
            <button
              key={entity.name}
              onClick={() => setActiveEntity(entity.name)}
              className={`block w-full text-left px-4 py-2 rounded-md transition-all ${
                activeEntity === entity.name 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {entity.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {currentEntityDef ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 capitalize">{currentEntityDef.name}</h1>
              {!editingItem && (
                <div className="text-sm text-gray-500">Managing {currentEntityDef.name} database</div>
              )}
            </header>

            <section>
              <AutoTable 
                entity={currentEntityDef} 
                data={data} 
                onEdit={handleEdit}
                onDelete={(item: any) => alert(`Delete ${item.id}`)}
                onPageChange={(p) => {
                  setPage(p);
                  loadData(p);
                }}
              />
            </section>

            <section className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? `Edit ${currentEntityDef.name}` : `Add New ${currentEntityDef.name}`}
                </h2>
                {editingItem && (
                  <button 
                    onClick={() => setEditingItem(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <AutoForm 
                entity={currentEntityDef} 
                initialData={editingItem}
                onSubmit={handleCreateOrUpdate} 
              />
            </section>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">
            Select an entity from the sidebar to begin
          </div>
        )}
      </main>
    </div>
  );
}

export default App;