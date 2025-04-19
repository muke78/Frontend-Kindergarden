import { useSidebar } from "@/hooks/useSidebar";

// import { useAuthStore } from "@/store/authStore";

export const Home = () => {
  // const { user } = useAuthStore();
  const { isMobile, sidebarOpen } = useSidebar();

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"} animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-9 grid-rows-9 gap-4 w-full h-screen p-2">
        <div className="flex justify-start items-end col-span-9">
          <span className="text-2xl font-bold">Inicio</span>
        </div>
        <div className="col-span-2 row-start-2 bg-base-200">1</div>
        <div className="col-span-2 col-start-1 row-start-3 bg-base-200">3</div>
        <div className="col-span-2 col-start-1 row-start-4 bg-base-200">4</div>
        <div className="col-span-2 col-start-1 row-start-5 bg-base-200">5</div>
        <div className="col-span-4 row-span-4 col-start-3 row-start-2 bg-base-200">
          6
        </div>
        <div className="col-span-3 row-span-2 col-start-7 row-start-2 bg-base-200">
          7
        </div>
        <div className="col-span-3 row-span-2 col-start-7 row-start-4 bg-base-200">
          8
        </div>
        <div className="col-span-3 row-span-4 row-start-6 bg-base-200">9</div>
        <div className="col-span-3 row-span-4 col-start-4 row-start-6 bg-base-200">
          10
        </div>
        <div className="col-span-3 row-span-4 col-start-7 row-start-6 bg-base-200">
          11
        </div>
      </div>
    </main>
  );
};
