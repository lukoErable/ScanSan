const SkeletonLoader = () => (
  <div className="animate-pulse flex-shrink-0 w-[300px] h-[175px] bg-gray-300 rounded-lg overflow-hidden">
    <div className="w-full h-full bg-gray-400"></div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-400 rounded w-1/2"></div>
    </div>
  </div>
);

export default SkeletonLoader;
