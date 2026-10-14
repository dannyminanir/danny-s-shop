const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p>© {currentYear} Danny's Shop. All rights reserved.</p>
        <p>Quality products, delivered to your door.</p>
      </div>
    </footer>
  );
}