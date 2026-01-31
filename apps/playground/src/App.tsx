import { useEffect, useState } from 'react';
import { Schema } from '@micro-cms/types';
import { MockDataProvider } from '@micro-cms/mock-db';
import { AutoForm, AutoTable } from '@micro-cms/admin-ui';

function App() {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
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
      loadData();
    }
  }, [activeEntity]);

  const loadData = () => {
    if (activeEntity) db.find(activeEntity).then(setData);
  };

  const handleCreate = async (formData: any) => {
    if (activeEntity) {
      await db.create(activeEntity, formData);
      loadData();
      alert('Record created!');
    }
  };

  if (!schema) return <div className="p-10">Loading Schema...</div>;

  const currentEntityDef = schema.entities.find(e => e.name === activeEntity);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-xl border-b">Micro-CMS</div>
        <nav className="p-4 space-y-2">
          {schema.entities.map(entity => (
            <button
              key={entity.name}
              onClick={() => setActiveEntity(entity.name)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeEntity === entity.name ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
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
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-4 capitalize">{currentEntityDef.name} List</h1>
              <AutoTable 
                entity={currentEntityDef} 
                data={data} 
                onDelete={(item: any) => alert(`Delete ${item.id}`)}
              />
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">Add New {currentEntityDef.name}</h2>
              {/* This is the core "Schema-Driven UI" in action */}
              <AutoForm 
                entity={currentEntityDef} 
                onSubmit={handleCreate} 
              />
            </div>
          </div>
        ) : (
          <div>Select an entity</div>
        )}
      </main>
    </div>
  );
}

export default App;