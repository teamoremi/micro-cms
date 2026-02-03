import { useEffect, useState, useMemo } from 'react';
import { Schema, PaginatedResponse } from '@micro-cms/types';
import { MockDataProvider } from '@micro-cms/mock-db';
import { AutoForm, AutoTable, OffCanvas } from '@micro-cms/admin-ui';
import { useRouter } from './router';

function App() {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [data, setData] = useState<any[] | PaginatedResponse>([]);
  const [page, setPage] = useState(1);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [db] = useState(() => new MockDataProvider());
  
  const { route, navigateToEntity } = useRouter();

  useEffect(() => {
    // 1. Introspect: Get the schema from the DB
    db.introspect().then((s) => {
      setSchema(s);
      // Default route if none set
      if (window.location.hash === '' && s.entities.length > 0) {
        navigateToEntity(s.entities[0].name);
      }
    });
  }, [db]);

  const activeEntity = route.entity || null;

  useEffect(() => {
    if (activeEntity) {
      setPage(1);
      loadData(1);
    }
  }, [activeEntity]);

  // Load editing item if route says so
  useEffect(() => {
    if (activeEntity && route.action === 'edit' && route.id) {
      db.findById(activeEntity, route.id).then(setEditingItem);
    } else if (route.action === 'new') {
      setEditingItem({}); // Empty object for new item
    } else {
      setEditingItem(null);
    }
  }, [activeEntity, route.action, route.id, db]);

  const loadData = (p: number = page) => {
    if (activeEntity) db.find(activeEntity, { page: p, limit: 5 }).then(setData);
  };

  const handleCreateOrUpdate = async (formData: any) => {
    if (activeEntity) {
      if (route.action === 'edit' && route.id) {
        await db.update(activeEntity, route.id, formData);
        alert('Record updated!');
      } else {
        await db.create(activeEntity, formData);
        alert('Record created!');
      }
      handleCloseOffCanvas();
      loadData();
    }
  };

  const handleEdit = (item: any) => {
    navigateToEntity(activeEntity!, 'edit', item.id);
  };

  const handleAddNew = () => {
    if (activeEntity) {
      navigateToEntity(activeEntity, 'new');
    }
  };

  const handleCloseOffCanvas = () => {
    if (activeEntity) {
      navigateToEntity(activeEntity);
    }
  };

  if (!schema) return <div className="p-10 text-center animate-pulse">Loading Schema...</div>;

  const currentEntityDef = schema.entities.find(e => e.name === activeEntity);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex-shrink-0">
        <div className="p-6 font-black text-2xl tracking-tighter border-b border-slate-800">MICRO-CMS</div>
        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">Collections</div>
          {schema.entities.map(entity => (
            <button
              key={entity.name}
              onClick={() => navigateToEntity(entity.name)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activeEntity === entity.name 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="capitalize">{entity.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {currentEntityDef ? (
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end border-b pb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 capitalize tracking-tight">{currentEntityDef.name}</h1>
                <p className="text-gray-500 mt-2">Manage your {currentEntityDef.name} records and schema.</p>
              </div>
              <button 
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New
              </button>
            </header>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            <OffCanvas 
              isOpen={!!route.action} 
              onClose={handleCloseOffCanvas}
              title={route.action === 'edit' ? `Edit ${currentEntityDef.name}` : `Add New ${currentEntityDef.name}`}
            >
              <AutoForm 
                entity={currentEntityDef} 
                initialData={editingItem}
                onSubmit={handleCreateOrUpdate} 
              />
            </OffCanvas>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Welcome to Micro-CMS</h2>
            <p className="mt-2">Select an entity from the sidebar to begin managing data.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
