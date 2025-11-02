import Pass from './assets/bantho.png';
import Nhang from './assets/nhang.png';
import SmokeImg from './assets/image.png';
import PrayHandImg from './assets/image2.png';
import soundFile from './assets/sound.mp3';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import video from './assets/video.mp4';
import { useEffect, useState, type CSSProperties } from 'react';

function App() {
  const [animKey, setAnimKey] = useState(0);
  const [smokeParticles, setSmokeParticles] = useState<
    Array<{
      id: string;
      delay: string;
      duration: string;
      driftX: string;
      rotate: string;
      top: string;
    }>
  >([]);
  const [email, setEmail] = useState('');
  const [wish, setWish] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isPraying, setIsPraying] = useState(false); // Track if user has started praying
  const [bowCount, setBowCount] = useState(0); // Track number of bows

  // Email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid
  const isFormValid = isValidEmail(email) && wish.trim().length > 0;

  // Show email error if user has touched the field and email is invalid
  const showEmailError =
    emailTouched && email.length > 0 && !isValidEmail(email);

  const handlePray = () => {
    if (!isFormValid) return;

    // Play sound
    const audio = new Audio(soundFile);
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });

    // Bump key to restart animation each click
    setAnimKey((k) => k + 1);

    // Switch to praying mode
    setIsPraying(true);
  };

  const handleBow = () => {
    // Increment bow count to trigger rotation animation
    setBowCount((count) => count + 1);
  };

  // Continuously generate smoke particles while incense is active
  useEffect(() => {
    if (animKey === 0) {
      setSmokeParticles([]);
      return;
    }

    let particleCounter = 0;
    let interval: number | null = null;

    // Generate initial batch
    const generateParticle = () => {
      const delay = '0s';
      const duration = (3 + Math.random() * 2).toFixed(2) + 's';
      const driftX = (Math.random() * 60 - 30).toFixed(0) + 'px';
      const rotate = (Math.random() * 30 - 15).toFixed(0) + 'deg';
      const top = 'calc(50vh - 130px)';

      return {
        id: `smoke-${animKey}-${particleCounter++}`,
        delay,
        duration,
        driftX,
        rotate,
        top,
      };
    };

    // Wait 3 seconds before starting smoke (after incense lands)
    const startTimeout = setTimeout(() => {
      // Add new smoke particle every 400ms
      interval = window.setInterval(() => {
        setSmokeParticles((prev) => {
          // Keep only recent particles (cleanup old ones)
          const recentParticles = prev.slice(-20);
          return [...recentParticles, generateParticle()];
        });
      }, 400);
    }, 3000);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [animKey]);

  return (
    <main className="relative h-screen w-screen">
      {/* Background gradient to blend with video (black becomes transparent with screen blend) */}

      <div className="absolute overflow-hidden w-screen h-screen bg-white">
        <video
          className="w-screen h-screen object-cover mix-blend-lighten"
          src={video}
          autoPlay
          muted
          playsInline
          loop
        />
      </div>

      <div className="fixed top-0 flex flex-col max-h-screen w-screen h-screen">
        {/* Phần ảnh - 1/2 màn hình trên */}

        <div className="h-1/2 w-full overflow-hidden flex items-end justify-center">
          <img
            className="object-contain max-w-full max-h-full"
            width={700}
            height={500}
            src={Pass}
            alt="Bàn thờ"
          />
        </div>

        <div className="h-1/2 w-full flex flex-col justify-center items-center px-4 md:px-8">
          <div className="w-full max-w-md space-y-6">
            {!isPraying ? (
              // Form input - shown before praying
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    className={`h-12 text-base border-amber-200 focus:ring-amber-400 focus:border-amber-400 ${
                      showEmailError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
                        : ''
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                  />
                  {showEmailError && (
                    <p className="text-red-500 text-sm mt-1 ml-1">
                      ⚠️ Email không đúng định dạng
                    </p>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Nhập ước nguyện của bạn..."
                  className="h-12 text-base border-amber-200 focus:ring-amber-400 focus:border-amber-400"
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                />
                <Button
                  onClick={handlePray}
                  disabled={!isFormValid}
                  className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🙏 Thắp hương
                </Button>
              </div>
            ) : (
              // Prayer view - shown after clicking "Thắp hương"
              <div className="space-y-6">
                {/* Display wish text */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 shadow-md">
                  <h3 className="text-amber-800 font-semibold text-lg mb-2">
                    Ước nguyện của bạn:{' '}
                    <span className="text-xs text-gray-500">
                      (Nhấn vào bàn tay để lạy)
                    </span>
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {wish}
                  </p>
                </div>

                {/* Prayer hand image with rotation animation */}
                <div className="flex flex-col items-center space-y-4">
                  <img
                    key={bowCount}
                    src={PrayHandImg}
                    onClick={handleBow}
                    alt="Bàn tay cầu nguyện"
                    className="w-48 h-48 object-contain animate-bow"
                    style={{
                      animation: bowCount > 0 ? 'bow 0.6s ease-in-out' : 'none',
                    }}
                  />

                  <Button
                    onClick={handleBow}
                    className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    🙏 Lạy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Incense animation overlay */}
        <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
          {animKey > 0 && (
            <img
              key={animKey}
              src={Nhang}
              alt="Nhang"
              className="incense-animate max-h-20 sm:max-h-40"
            />
          )}
        </div>

        {/* Smoke particles rising from incense */}
        {animKey > 0 && (
          <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
            {smokeParticles.map((particle) => (
              <img
                key={particle.id}
                src={SmokeImg}
                alt="smoke"
                className="smoke-particle"
                style={
                  {
                    top: particle.top,
                    animationDelay: particle.delay,
                    animationDuration: particle.duration,
                    ['--drift-x']: particle.driftX,
                    ['--rotate']: particle.rotate,
                  } as CSSProperties & {
                    ['--drift-x']: string;
                    ['--rotate']: string;
                  }
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 z-10 w-full py-3 text-center">
        <p className="text-amber-700 text-sm font-medium">
          From XunFu with love ❤️
        </p>
      </div>
    </main>
  );
}

export default App;
