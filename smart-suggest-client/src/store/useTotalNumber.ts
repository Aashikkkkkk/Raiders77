import { create } from 'zustand';

interface BearState {
  totalNo: number;
  setTotalNo: (total: number) => void;
}

// Create the Zustand store
const useTotalNumber = create<BearState>((set) => ({
  setTotalNo: (total: number) => set({ totalNo: total }),
  totalNo:
    (Number(
      JSON.parse(localStorage.getItem('cart') as string)?.length || 0
    ) as number) || 0,
}));

export default useTotalNumber;
