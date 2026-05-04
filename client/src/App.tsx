function App() {
  return (
    <ErrorBoundary>
          {/* <Toaster /> was removed from here */}
          <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans">
            <GameManager />
          </div>
    </ErrorBoundary>
  );
}
