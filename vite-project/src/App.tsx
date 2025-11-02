import Pass from './assets/bantho.png';
import Nhang from './assets/nhang.png';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useState } from 'react';

function App() {
  const [animKey, setAnimKey] = useState(0);

  const handlePray = () => {
    // Bump key to restart animation each click
    setAnimKey((k) => k + 1);
  };
  return (
    <main className="flex flex-col max-h-screen w-screen h-screen gap-10">
      {/* Phần ảnh - 1/2 màn hình trên */}
      <div className="h-1/2 w-full overflow-hidden flex justify-center mt-20">
        <img
          className="object-cover"
          width={700}
          height={500}
          src={Pass}
          alt="Bàn thờ"
        />
      </div>

      <div className="w-full flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Nhập email của bạn..."
              className="h-12 text-base border-amber-200 focus:ring-amber-400 focus:border-amber-400"
            />
            <Input
              type="text"
              placeholder="Nhập ước nguyện của bạn..."
              className="h-12 text-base border-amber-200 focus:ring-amber-400 focus:border-amber-400"
            />
            <Button
              onClick={handlePray}
              className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
              🙏 Thắp hương
            </Button>
          </div>
        </div>
      </div>

      {/* Incense animation overlay */}
      <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
        {animKey > 0 && (
          <img
            key={animKey}
            src={Nhang}
            alt="Nhang"
            className="incense-animate max-h-40"
          />
        )}
      </div>
    </main>
  );
}

export default App;
