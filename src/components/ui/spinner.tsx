
export const Spinner = () => {
      return (
        <div className="flex justify-center items-center absolute inset-0 bg-white bg-opacity-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    };