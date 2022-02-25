import create from 'zustand';

type State = {
  profile: any;
  setProfile: (profile: any) => void;
};

export const useProfileStore = create<State>((set) => ({
  profile: null,
  setProfile: (profile) => set((state) => ({ ...state, profile })),
}));
