const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center mt-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-500"></div>
      <span className="ml-4 text-neutral-600">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
