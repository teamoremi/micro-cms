import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  entity?: string;
  action?: 'new' | 'edit';
  id?: string;
}

export function useRouter() {
  const getRouteState = (): RouteState => {
    // Expected format: #!/entity/:name or #!/entity/:name/new or #!/entity/:name/edit/:id
    const hash = window.location.hash;
    if (!hash.startsWith('#!/')) {
      return { path: '/' };
    }

    const pathParts = hash.substring(3).split('/');
    // pathParts[0] should be 'entity'
    if (pathParts[0] === 'entity' && pathParts[1]) {
      const state: RouteState = {
        path: hash,
        entity: pathParts[1]
      };

      if (pathParts[2] === 'new') {
        state.action = 'new';
      } else if (pathParts[2] === 'edit' && pathParts[3]) {
        state.action = 'edit';
        state.id = pathParts[3];
      }

      return state;
    }

    return { path: '/' };
  };

  const [route, setRoute] = useState<RouteState>(getRouteState());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteState());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = `!${path}`;
  };

  const navigateToEntity = (entity: string, action?: 'new' | 'edit', id?: string) => {
    let path = `/entity/${entity}`;
    if (action === 'new') {
      path += '/new';
    } else if (action === 'edit' && id) {
      path += `/edit/${id}`;
    }
    navigate(path);
  };

  return { route, navigate, navigateToEntity };
}
