import Drawer from './drawer';
import Feedback from './feedback';

export default function App() {
  return (
    <div>
      <div className="flex h-[500px] w-full items-center justify-center">
        <Feedback />
      </div>
      <div className="flex h-[500px] w-full items-center justify-center bg-gray-200">
        <Drawer />
      </div>
    </div>
  );
}
