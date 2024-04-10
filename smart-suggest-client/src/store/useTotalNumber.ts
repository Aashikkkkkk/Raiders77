import { create } from 'zustand';

interface BearState {
  totalNo: number;
  setTotalNo: (total: number) => void;
  clearAll: () => void;
}

// Create the Zustand store
const useTotalNumber = create<BearState>((set) => ({
  setTotalNo: (total: number) => set({ totalNo: total }),
  clearAll: () => {
    set({ totalNo: 0 });
    localStorage.removeItem('cart');
  },
  totalNo:
    (Number(
      JSON.parse(localStorage.getItem('cart') as string)?.length || 0
    ) as number) || 0,
}));

export default useTotalNumber;
