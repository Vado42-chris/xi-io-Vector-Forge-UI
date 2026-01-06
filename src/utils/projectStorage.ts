// Emergency save/load using localStorage
const PROJECT_KEY = 'vectorforge:project';

export function saveProject(state: any) {
  try {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

export function loadProject() {
  try {
    const data = localStorage.getItem(PROJECT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

