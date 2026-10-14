import Spinner from "./Spinner";

// Shown while a whole page is waiting for data
export default function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-indigo-600">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
