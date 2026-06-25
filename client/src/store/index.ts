import { create } from 'zustand';
import { AuthState, MapState, User } from '@/types';

interface AppStore {
  auth: AuthState;
  mapState: MapState;
  selectedTimeline: number;
  setAuth: (auth: Partial<AuthState>) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setMapLayer: (layer: MapState['activeLayer']) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  setTimeline: (year: number) => void;
  toggleBoundaries: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  mapState: {
    center: [20.5937, 78.9629],
    zoom: 5,
    activeLayer: 'rainfall',
    showBoundaries: true,
  },
  selectedTimeline: new Date().getFullYear(),
  
  setAuth: (auth) =>
    set((state) => ({
      auth: { ...state.auth, ...auth },
    })),
  
  setUser: (user) =>
    set((state) => ({
      auth: {
        ...state.auth,
        user,
        isAuthenticated: !!user,
      },
    })),
  
  logout: () =>
    set({
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
      },
    }),
  
  setMapLayer: (layer) =>
    set((state) => ({
      mapState: { ...state.mapState, activeLayer: layer },
    })),
  
  setMapCenter: (center, zoom) =>
    set((state) => ({
      mapState: {
        ...state.mapState,
        center,
        zoom: zoom ?? state.mapState.zoom,
      },
    })),
  
  setTimeline: (year) =>
    set({ selectedTimeline: year }),
  
  toggleBoundaries: () =>
    set((state) => ({
      mapState: {
        ...state.mapState,
        showBoundaries: !state.mapState.showBoundaries,
      },
    })),
}));
