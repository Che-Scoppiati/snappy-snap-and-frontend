export const Header = () => {
  return (
    <div className="navbar p-0 items-center">
      <div className="flex-1 gap-4">
        <img src="./images/circled.png" className="w-16 h-16" alt="logo" />
        <h1 className="text-6xl mt-2 font-['Reverie']">Snappy</h1>
      </div>
      <div className="flex-none">
        <w3m-button />
      </div>
    </div>
  );
};
