import { create } from "zustand";
import { persist } from "zustand/middleware";

type News = {
  id: number;
  title: string;
  content: string;
};

type NewsStore = {
  news: News[];
  setNews: (newNews: News[]) => void;
  timestamp: any;
  setTimestamp: (newTimestamp: any) => void;
};

const useNewsStore = create<NewsStore>(
  persist(
    (set) => ({
      news: [],
      setNews: (newNews) => set({ news: newNews }),
      timestamp: null,  
      setTimestamp: (newTimestamp) => set({ timestamp: newTimestamp }),
    }),
    {
      name: "news-storage",
    }
  )
);

export default useNewsStore;
